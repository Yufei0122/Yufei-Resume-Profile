import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = path.join(root, "frontend/src");
const failures = [];
let referenceCount = 0;

function* sourceFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(filename);
    else if (/\.(js|css)$/.test(filename)) yield filename;
  }
}

// Check actual directory entries, including on case-insensitive Windows disks.
function resolveExactFile(filename) {
  const relative = path.relative(root, filename);
  if (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
  let current = root;
  for (const part of relative.split(path.sep)) {
    try {
      if (!readdirSync(current).includes(part)) return null;
      current = path.join(current, part);
    } catch {
      return null;
    }
  }
  return statSync(current).isFile() ? current : null;
}

for (const filename of sourceFiles(sourceRoot)) {
  const source = readFileSync(filename, "utf8");
  const references = [
    ...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\bnew\s+URL\(\s*)["']([^"']+)["']/g),
    ...source.matchAll(/\burl\(\s*["']?([^\s"')]+)["']?\s*\)/g),
  ];
  for (const [, reference] of references) {
    if (!reference.startsWith(".")) continue;
    referenceCount++;
    const target = path.resolve(path.dirname(filename), reference.split(/[?#]/)[0]);
    const candidates = path.extname(target) ? [target] : [target, `${target}.js`, path.join(target, "index.js")];
    if (!candidates.some(resolveExactFile)) {
      failures.push(`${path.relative(root, filename)}: ${reference}`);
    }
  }
}

assert.equal(failures.length, 0, `Missing or incorrectly capitalized imports (Linux requires exact names):\n${failures.join("\n")}`);
console.log(`Checked ${referenceCount} local imports and asset references for Linux-compatible paths.`);
