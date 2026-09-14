#!/usr/bin/env node
/**
 * Capacitor 9 removed / deprecated native API guard for plugin packages.
 *
 * Fails CI when plugin native code still uses APIs removed in Capacitor 9.
 * See https://capacitorjs.com/docs/updating/plugins/9-0
 *
 * Package.swift Cordova SPM product lines are intentionally allowed (Cap-go policy).
 *
 * Usage:
 *   node scripts/check-cap9-deprecated.mjs
 *   node scripts/check-cap9-deprecated.mjs --dir path
 */

import fs from "node:fs";
import path from "node:path";

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

/** @type {{ id: string; exts: string[]; roots: string[]; re: RegExp; hint: string }[]} */
const RULES = [
  {
    id: "ios-hasOption",
    exts: [".swift", ".m", ".mm"],
    roots: ["ios"],
    re: /\.hasOption\s*\(/,
    hint: "Use typed CAPPluginCall accessors (getString, getInt, …) instead of hasOption(_:).",
  },
  {
    id: "ios-cap-bridge-shim",
    exts: [".swift", ".m", ".mm"],
    roots: ["ios"],
    re: /\bCAPBridge\./,
    hint: "CAPBridge compatibility shim removed in Capacitor 9; use ApplicationDelegateProxy / Notification.Name.capacitor*.",
  },
  {
    id: "ios-cap-notifications",
    exts: [".swift", ".m", ".mm"],
    roots: ["ios"],
    re: /\bCAPNotifications\b/,
    hint: "CAPNotifications removed; use Notification.Name.capacitor* constants.",
  },
  {
    id: "ios-getConfigValue",
    exts: [".swift", ".m", ".mm"],
    roots: ["ios"],
    re: /\bgetConfigValue\s*\(/,
    hint: "getConfigValue(_:) removed; use getConfig() and PluginConfig typed accessors.",
  },
  {
    id: "ios-legacy-bridge-methods",
    exts: [".swift"],
    roots: ["ios"],
    re: /\b(getWebView\s*\(|isSimulator\s*\(|isDevMode\s*\(|getStatusBarVisible\s*\(|setStatusBarVisible\s*\(|getLocalUrl\s*\()/,
    hint: "Legacy CAPBridgeProtocol methods removed; use properties on the bridge (webView, isSimEnvironment, …).",
  },
  {
    id: "ios-legacy-typealiases",
    exts: [".swift"],
    roots: ["ios"],
    re: /\b(PluginCallErrorData|PluginResultData|JSResultBody)\b/,
    hint: "Legacy result typealiases removed; use PluginCallResultData.",
  },
  {
    id: "ios-https-interceptor-id",
    exts: [".swift"],
    roots: ["ios"],
    re: /\bhttpsInterceptorStartIdentifier\b/,
    hint: "Renamed to httpInterceptorStartIdentifier in Capacitor 9.",
  },
  {
    id: "android-native-plugin-annotation",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /@NativePlugin\b/,
    hint: "@NativePlugin removed; use @CapacitorPlugin.",
  },
  {
    id: "android-call-hasOption",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\.hasOption\s*\(/,
    hint: "PluginCall.hasOption(String) removed; use typed accessors (getString, getInt, …).",
  },
  {
    id: "android-call-save",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bcall\.save\s*\(\s*\)/,
    hint: "PluginCall.save() removed; use setKeepAlive(true).",
  },
  {
    id: "android-call-isSaved",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bcall\.isSaved\s*\(\s*\)/,
    hint: "PluginCall.isSaved() removed; use isKeptAlive().",
  },
  {
    id: "android-call-isReleased",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bcall\.isReleased\s*\(\s*\)/,
    hint: "PluginCall.isReleased() removed; bridge manages released calls.",
  },
  {
    id: "android-getConfigValue",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bgetConfigValue\s*\(/,
    hint: "Plugin.getConfigValue(String) removed; use getConfig() and PluginConfig accessors.",
  },
  {
    id: "android-https-interceptor",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bCAPACITOR_HTTPS_INTERCEPTOR_START\b/,
    hint: "Renamed to CAPACITOR_HTTP_INTERCEPTOR_START in Capacitor 9.",
  },
  {
    id: "android-plugin-saveCall",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bsaveCall\s*\(\s*call\s*\)/,
    hint: "Plugin.saveCall(PluginCall) removed; use Bridge.saveCall or call.setKeepAlive(true).",
  },
  {
    id: "android-getSavedCall-no-arg",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bgetSavedCall\s*\(\s*\)/,
    hint: "Plugin.getSavedCall() removed; use Bridge.getSavedCall(String).",
  },
  {
    id: "android-freeSavedCall",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bfreeSavedCall\s*\(\s*\)/,
    hint: "Plugin.freeSavedCall() removed; use PluginCall.release(Bridge).",
  },
  {
    id: "android-pluginRequestPermission",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bpluginRequest(Permission|Permissions|AllPermissions)\s*\(/,
    hint: "pluginRequest* permission helpers removed; use requestPermissionForAlias(s) / requestAllPermissions with callbacks.",
  },
  {
    id: "android-startActivityForResult-int",
    exts: [".java", ".kt"],
    roots: ["android"],
    re: /\bstartActivityForResult\s*\([^)]*,\s*[^)]*,\s*\d+\s*\)/,
    hint: "startActivityForResult(..., int) removed; use String callback id with @ActivityCallback.",
  },
];

function readText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function walkFiles(rootDir, exts) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        if (e.name === "Tests" || e.name === "androidTest" || e.name === "test") continue;
        stack.push(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      for (const ext of exts) {
        if (e.name.endsWith(ext)) {
          out.push(path.join(dir, e.name));
          break;
        }
      }
    }
  }
  out.sort();
  return out;
}

function parseArgs(argv) {
  const out = { dir: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" || a === "--pluginDir") {
      out.dir = path.resolve(argv[++i] || ".");
      continue;
    }
  }
  return out;
}

function lineMatchesRule(line, rule) {
  if (rule.id === "android-startActivityForResult-int") {
    return rule.re.test(line) && !line.includes("@ActivityCallback");
  }
  return rule.re.test(line);
}

const args = parseArgs(process.argv);
const pluginDir = args.dir;
const pkgPath = path.join(pluginDir, "package.json");

if (!exists(pkgPath)) {
  console.error(`[cap9-deprecated] ERROR: missing package.json in ${pluginDir}`);
  process.exit(2);
}

let pkg;
try {
  pkg = JSON.parse(readText(pkgPath));
} catch (e) {
  console.error(`[cap9-deprecated] ERROR: invalid package.json (${pkgPath}): ${e?.message || e}`);
  process.exit(2);
}

const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

const violations = [];

for (const rule of RULES) {
  for (const rootName of rule.roots) {
    const rootPath = path.join(pluginDir, rootName);
    if (!exists(rootPath)) continue;

    const scanRoot =
      rootName === "ios" && exists(path.join(rootPath, "Sources"))
        ? path.join(rootPath, "Sources")
        : rootName === "android"
          ? path.join(rootPath, "src", "main")
          : rootPath;

    if (!exists(scanRoot)) continue;

    const files = walkFiles(scanRoot, rule.exts);
    for (const file of files) {
      const rel = path.relative(pluginDir, file);
      const lines = readText(file).split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
        if (!lineMatchesRule(line, rule)) continue;
        violations.push({
          rule: rule.id,
          file: rel,
          line: i + 1,
          hint: rule.hint,
          snippet: trimmed.slice(0, 160),
        });
      }
    }
  }
}

if (violations.length) {
  const relDir = path.relative(process.cwd(), pluginDir) || ".";
  console.error(`[cap9-deprecated] FAIL in ${relDir} (${violations.length} hit(s))`);
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} [${v.rule}] ${v.hint}`);
    console.error(`  ${v.snippet}`);
  }
  process.exit(1);
}

process.exit(0);
