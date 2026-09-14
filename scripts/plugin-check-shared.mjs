import fs from "node:fs";
import path from "node:path";

export const SKIP_DIRS = new Set([
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

export function readText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function isPathInsideRoot(rootDir, targetPath) {
  const rel = path.relative(rootDir, targetPath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function resolvePluginDirFromCwd(requested) {
  const root = process.cwd();
  const dir = path.resolve(root, requested || ".");
  if (!isPathInsideRoot(root, dir)) {
    return null;
  }
  return dir;
}

export function walkFiles(rootDir, exts, { skipTestTrees = true } = {}) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!isPathInsideRoot(rootDir, dir)) continue;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (!isPathInsideRoot(rootDir, full)) continue;
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        if (skipTestTrees && (e.name === "Tests" || e.name === "androidTest" || e.name === "test")) {
          continue;
        }
        stack.push(full);
        continue;
      }
      if (!e.isFile()) continue;
      for (const ext of exts) {
        if (e.name.endsWith(ext)) {
          out.push(full);
          break;
        }
      }
    }
  }
  out.sort();
  return out;
}
