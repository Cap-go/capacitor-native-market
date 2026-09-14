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

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginDir = process.cwd();
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".build",
  ".gradle",
  "Pods",
  "DerivedData",
  ".swiftpm",
  ".git",
  "example-app",
]);

const rules = JSON.parse(fs.readFileSync(path.join(__dirname, "cap9-deprecated-rules.json"), "utf8")).map(
  (rule) => ({
    ...rule,
    re: new RegExp(rule.pattern),
  }),
);

function isInsideRoot(rootDir, targetPath) {
  const rel = path.relative(rootDir, targetPath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function listSourceFiles(scanRoot, exts) {
  const out = [];
  const stack = [scanRoot];
  while (stack.length) {
    const dir = stack.pop();
    if (!isInsideRoot(pluginDir, dir)) continue;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (!isInsideRoot(pluginDir, full)) continue;
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (entry.name === "Tests" || entry.name === "androidTest" || entry.name === "test") continue;
        stack.push(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (exts.some((ext) => entry.name.endsWith(ext))) out.push(full);
    }
  }
  out.sort();
  return out;
}

function scanFile(filePath, rule) {
  if (!isInsideRoot(pluginDir, filePath)) return [];
  const rel = path.relative(pluginDir, filePath);
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
    if (!rule.re.test(line)) continue;
    if (rule.id === "android-startActivityForResult-int" && line.includes("@ActivityCallback")) continue;
    hits.push({
      rule: rule.id,
      file: rel,
      line: i + 1,
      hint: rule.hint,
      snippet: trimmed.slice(0, 160),
    });
  }
  return hits;
}

const pkgPath = path.join(pluginDir, "package.json");
if (!fs.existsSync(pkgPath)) {
  console.error(`[cap9-deprecated] ERROR: missing package.json in ${pluginDir}`);
  process.exit(2);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
} catch (e) {
  console.error(`[cap9-deprecated] ERROR: invalid package.json: ${e?.message || e}`);
  process.exit(2);
}

const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

const violations = [];

for (const rule of rules) {
  for (const rootName of rule.roots) {
    const rootPath = path.join(pluginDir, rootName);
    if (!fs.existsSync(rootPath)) continue;

    const scanRoot =
      rootName === "ios" && fs.existsSync(path.join(rootPath, "Sources"))
        ? path.join(rootPath, "Sources")
        : rootName === "android"
          ? path.join(rootPath, "src", "main")
          : rootPath;

    if (!fs.existsSync(scanRoot) || !isInsideRoot(pluginDir, scanRoot)) continue;

    for (const file of listSourceFiles(scanRoot, rule.exts)) {
      violations.push(...scanFile(file, rule));
    }
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
