#!/usr/bin/env node
/**
 * Capacitor 9 removed native API guard for plugin packages.
 *
 * Fails CI when plugin native code still uses APIs removed in Capacitor 9.
 * See https://capacitorjs.com/docs/updating/plugins/9-0
 *
 * Package.swift Cordova SPM product lines are intentionally allowed (Cap-go policy).
 *
 * Usage: node scripts/check-cap9-deprecated.mjs
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "../package.json" with { type: "json" };
import rulesJson from "./cap9-deprecated-rules.json" with { type: "json" };

const pluginDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

const scanPaths = [];
if (cap.ios) scanPaths.push("ios/Sources");
if (cap.android) scanPaths.push("android/src/main");
if (!scanPaths.length) {
  process.exit(0);
}

/** @type {{ file: string; line: number; text: string }[]} */
function gitGrep(pattern) {
  const result = spawnSync(
    "git",
    ["grep", "-n", "-E", pattern, "--", ...scanPaths],
    { cwd: pluginDir, encoding: "utf8" },
  );
  if (result.status === 1 && !result.stdout.trim()) return [];
  if (result.status !== 0 && result.status !== 1) {
    console.error(`[cap9-deprecated] ERROR: git grep failed (${result.status}): ${result.stderr || result.stdout}`);
    process.exit(2);
  }
  const hits = [];
  for (const row of result.stdout.split(/\r?\n/)) {
    if (!row) continue;
    const sep = row.indexOf(":");
    if (sep <= 0) continue;
    const lineSep = row.indexOf(":", sep + 1);
    if (lineSep <= sep) continue;
    const file = row.slice(0, sep);
    const line = Number.parseInt(row.slice(sep + 1, lineSep), 10);
    const text = row.slice(lineSep + 1);
    if (!Number.isFinite(line)) continue;
    hits.push({ file, line, text });
  }
  return hits;
}

const violations = [];

for (const rule of rulesJson) {
  for (const hit of gitGrep(rule.pattern)) {
    const trimmed = hit.text.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
    if (rule.id === "android-startActivityForResult-int" && hit.text.includes("@ActivityCallback")) continue;
    violations.push({
      rule: rule.id,
      file: hit.file,
      line: hit.line,
      hint: rule.hint,
      snippet: trimmed.slice(0, 160),
    });
  }
}

if (violations.length) {
  console.error(`[cap9-deprecated] FAIL (${violations.length} hit(s))`);
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} [${v.rule}] ${v.hint}`);
    console.error(`  ${v.snippet}`);
  }
  process.exit(1);
}

process.exit(0);
