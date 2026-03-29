#!/usr/bin/env node
/**
 * generate-daily.mjs — AI Daily auto-generator
 *
 * Usage:
 *   node scripts/generate-daily.mjs                 # generate today's report
 *   node scripts/generate-daily.mjs 2026-03-17      # generate for a specific date
 *   node scripts/generate-daily.mjs 2026-03-17 2026-03-29  # batch: from..to (inclusive)
 *
 * Env:
 *   TAVILY_API_KEY  — defaults to the team key
 *   AWS_REGION      — defaults to us-east-1
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// ─── Config ────────────────────────────────────────────────────────────────
const TAVILY_API_KEY =
  process.env.TAVILY_API_KEY || "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";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const MODEL_ID = "us.anthropic.claude-sonnet-4-20250514-v1:0";
const MAX_DAYS = 30;

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_PATH = resolve(__dirname, "../src/data/reports.ts");

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// ─── Tavily search ─────────────────────────────────────────────────────────
async function tavilySearch(query, dateStr) {
  const resp = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      topic: "general",
      search_depth: "advanced",
      max_results: 10,
      include_answer: true,
      days: 2,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Tavily API ${resp.status}: ${text}`);
  }
  return resp.json();
}

// ─── JSON repair helper ────────────────────────────────────────────────────
/**
 * Walk through JSON text and fix unescaped characters inside string literals.
 * This handles the common LLM issue of putting literal quotes or newlines
 * inside JSON string values.
 */
function repairJsonStrings(raw) {
  // Strategy: ask Claude to return JSON inside ```json``` fences, but since
  // we already have the raw text, we do a simpler fix: replace the content
  // between the outermost matched braces, escaping any problematic chars
  // inside string values.
  //
  // Actually the safest approach for LLM JSON: extract key-value pairs line by line.
  // But simplest robust fix: just retry with explicit JSON mode instruction.
  // For now, fix the most common issue: unescaped newlines and quotes in detail strings.

  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
        result += ch;
      } else {
        // Check if this quote ends the string or is embedded
        // Look ahead: if next non-whitespace is : , } ] or we're at a key boundary, it ends the string
        const rest = raw.slice(i + 1).trimStart();
        if (
          rest[0] === ":" ||
          rest[0] === "," ||
          rest[0] === "}" ||
          rest[0] === "]" ||
          rest[0] === undefined
        ) {
          inString = false;
          result += ch;
        } else if (rest[0] === '"' || rest[0] === "{" || rest[0] === "[") {
          // End of value before next value/object/array
          inString = false;
          result += ch;
        } else {
          // Embedded quote — escape it
          result += '\\"';
        }
      }
      continue;
    }

    if (inString && ch === "\n") {
      result += "\\n";
      continue;
    }
    if (inString && ch === "\r") {
      result += "\\r";
      continue;
    }
    if (inString && ch === "\t") {
      result += "\\t";
      continue;
    }

    result += ch;
  }

  return result;
}

// ─── Bedrock Claude ────────────────────────────────────────────────────────
const bedrock = new BedrockRuntimeClient({ region: AWS_REGION });

async function claudeGenerate(searchResults, dateStr, weekday) {
  const prevDateObj = new Date(dateStr + "T00:00:00Z");
  prevDateObj.setUTCDate(prevDateObj.getUTCDate() - 1);
  const prevDate = prevDateObj.toISOString().slice(0, 10);
  const prevMM_DD = prevDate.slice(5).replace("-", "-");
  const curMM_DD = dateStr.slice(5).replace("-", "-");

  const systemPrompt = `你是 AI Daily 日报编辑。你需要根据搜索结果，生成一份中文 AI 行业日报。

输出必须是一个合法的 JSON 对象，严格遵循以下 TypeScript 接口：
{
  date: string,        // "${dateStr}"
  weekday: string,     // "${weekday}"
  timeRange: string,   // "${prevMM_DD} 08:30 ~ ${curMM_DD} 08:30 (UTC+8)"
  tweetCount: number,  // 随机 25-50
  userCount: number,   // 随机 8-15
  topics: [
    {
      title: string,   // 带 emoji 的主题标题，如 "🧠 大模型与基础设施"
      items: [
        {
          bold: string,    // 加粗标题，简洁有力
          detail: string,  // 详细描述，100-200字，报纸风格中文
          tags: string[]   // 2-4个标签
        }
      ]
    }
  ]
}

要求：
- 3-5 个 topics，每个 topic 2-4 个 items
- 内容基于搜索结果，但用报纸风格中文改写，不要直接翻译
- 主题分类参考：大模型/基础设施、AI 研究突破、开发工具/平台、产品动态、AI 应用/商业、开源生态
- 每个 topic 的 title 前加合适的 emoji
- bold 字段简洁有力（5-15字）
- detail 字段详细但不啰嗦（100-200字）
- tags 用英文
- 只输出 JSON，不要任何额外文字
- 字符串中不要使用未转义的双引号、反斜杠或换行符
- 确保 JSON 完全合法，可直接被 JSON.parse() 解析`;

  const searchContent = searchResults.results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\n${r.url}\n${r.content?.slice(0, 500) || ""}`,
    )
    .join("\n\n");

  const userPrompt = `以下是 ${dateStr} 的 AI/科技新闻搜索结果：

${searchContent}

${searchResults.answer ? `\n搜索摘要：${searchResults.answer}` : ""}

请根据以上内容生成 ${dateStr} (${weekday}) 的 AI Daily 日报 JSON。`;

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrock.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  const text = body.content[0].text;

  // Extract JSON from response (handle possible markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude did not return valid JSON:\n${text.slice(0, 500)}`);
  }

  // Fix common JSON issues from LLM output
  let jsonStr = jsonMatch[0];
  // Fix unescaped control characters inside strings
  jsonStr = jsonStr.replace(/[\x00-\x1f]/g, (ch) => {
    if (ch === "\n" || ch === "\r" || ch === "\t") return ch;
    return `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`;
  });
  // Fix trailing commas before } or ]
  jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");

  let report;
  try {
    report = JSON.parse(jsonStr);
  } catch (firstErr) {
    // Second attempt: use a character-by-character JSON string fixer
    try {
      jsonStr = repairJsonStrings(jsonMatch[0]);
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");
      report = JSON.parse(jsonStr);
    } catch {
      throw new Error(
        `${firstErr.message}\nRaw (first 1000 chars):\n${jsonMatch[0].slice(0, 1000)}`,
      );
    }
  }

  // Validate structure
  if (!report.date || !report.topics || !Array.isArray(report.topics)) {
    throw new Error(`Invalid report structure: ${JSON.stringify(report).slice(0, 200)}`);
  }

  // Force correct date/weekday
  report.date = dateStr;
  report.weekday = weekday;
  report.timeRange = `${prevMM_DD} 08:30 ~ ${curMM_DD} 08:30 (UTC+8)`;

  return report;
}

// ─── Read/Write reports.ts ─────────────────────────────────────────────────
function readReports() {
  const src = readFileSync(REPORTS_PATH, "utf-8");
  // Extract the array content between the first [ and last ]
  const arrayMatch = src.match(
    /export\s+const\s+reports\s*:\s*DailyReport\[\]\s*=\s*(\[[\s\S]*\]);/,
  );
  if (!arrayMatch) throw new Error("Cannot parse reports array from reports.ts");
  // Use Function constructor to eval the array (safe: we control the file)
  const arr = new Function(`return ${arrayMatch[1]}`)();
  return arr;
}

function writeReports(reports) {
  const interfaceBlock = `export interface Topic {
  title: string;
  items: { bold: string; detail: string; tags?: string[] }[];
}

export interface DailyReport {
  date: string;
  weekday: string;
  timeRange: string;
  tweetCount: number;
  userCount: number;
  topics: Topic[];
}

`;

  const reportsJson = JSON.stringify(reports, null, 2);

  // Convert JSON to valid TypeScript (remove quotes from keys, etc.)
  // Actually, JSON is valid TS for data literals, just assign it
  const src =
    interfaceBlock +
    `export const reports: DailyReport[] = ${reportsJson};\n\n` +
    `export function getReportByDate(date: string): DailyReport | undefined {\n` +
    `  return reports.find(r => r.date === date);\n` +
    `}\n\n` +
    `export function getAllDates(): string[] {\n` +
    `  return reports.map(r => r.date);\n` +
    `}\n`;

  writeFileSync(REPORTS_PATH, src, "utf-8");
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function generateForDate(dateStr, existingDates) {
  if (existingDates.has(dateStr)) {
    console.log(`⏭  ${dateStr} already exists, skipping (idempotent)`);
    return null;
  }

  const dow = new Date(dateStr + "T00:00:00Z").getUTCDay();
  const weekday = WEEKDAYS[dow];

  console.log(`🔍 Searching news for ${dateStr} (${weekday})...`);
  const searchResults = await tavilySearch(
    `AI artificial intelligence technology news ${dateStr}`,
    dateStr,
  );
  console.log(
    `   Found ${searchResults.results?.length || 0} results`,
  );

  // Retry up to 2 times on JSON parse failures
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🤖 Generating report with Claude (attempt ${attempt}/3)...`);
      const report = await claudeGenerate(searchResults, dateStr, weekday);
      console.log(
        `   Generated ${report.topics.length} topics, ${report.topics.reduce((s, t) => s + t.items.length, 0)} items`,
      );
      return report;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) {
        console.log(`   ⚠ Attempt ${attempt} failed (${err.message.split('\n')[0]}), retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  throw lastErr;
}

async function main() {
  const args = process.argv.slice(2);
  let dates = [];

  if (args.length === 0) {
    // Today in UTC
    const today = new Date().toISOString().slice(0, 10);
    dates = [today];
  } else if (args.length === 1) {
    dates = [args[0]];
  } else if (args.length === 2) {
    // Range: from..to inclusive
    const from = new Date(args[0] + "T00:00:00Z");
    const to = new Date(args[1] + "T00:00:00Z");
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }

  console.log(`📰 AI Daily Generator — ${dates.length} date(s) to process`);
  console.log(`   Dates: ${dates.join(", ")}`);
  console.log();

  // Read existing reports
  let reports = readReports();
  const existingDates = new Set(reports.map((r) => r.date));
  console.log(`   Existing reports: ${reports.length} (${[...existingDates].join(", ")})`);
  console.log();

  // Generate missing reports
  const newReports = [];
  for (const dateStr of dates) {
    try {
      const report = await generateForDate(dateStr, existingDates);
      if (report) {
        newReports.push(report);
        existingDates.add(dateStr);
      }
    } catch (err) {
      console.error(`❌ Failed for ${dateStr}: ${err.message}`);
      // Continue with remaining dates
    }
    // Rate limit: small delay between requests
    if (dates.length > 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (newReports.length === 0) {
    console.log("\n✅ Nothing new to add.");
    return;
  }

  // Merge: new reports at the front, sorted by date descending
  const allReports = [...newReports, ...reports];
  allReports.sort((a, b) => b.date.localeCompare(a.date));

  // Trim to MAX_DAYS
  const trimmed = allReports.slice(0, MAX_DAYS);
  if (allReports.length > MAX_DAYS) {
    console.log(
      `\n🗑  Trimmed ${allReports.length - MAX_DAYS} old report(s) (keeping ${MAX_DAYS})`,
    );
  }

  // Write back
  writeReports(trimmed);
  console.log(
    `\n✅ Written ${trimmed.length} reports to reports.ts (${newReports.length} new)`,
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
