import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const config = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8"));
const output = path.resolve(root, config.outputDirectory);
assert.equal(output, path.join(root, "frontend/dist"));
const html = readFileSync(path.join(output, "index.html"), "utf8");
assert.match(html, /<script\b[^>]*type="module"[^>]*src="\/assets\/[^" ]+\.js"/);
assert.doesNotMatch(html, /\/src\/main\.js|\/@vite\/client/);

function* outputFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* outputFiles(filename);
    else yield filename;
  }
}

let assets = 0;
for (const filename of outputFiles(output)) {
  const relative = path.relative(output, filename);
  assert.ok(!/(^|[\\/])\.env(?:\.|$)|\.map$/i.test(relative), `Unexpected private/debug file in build: ${relative}`);
  if (!/\.(html|js|css)$/.test(filename)) continue;
  const text = readFileSync(filename, "utf8");
  assert.doesNotMatch(text, /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\b/, `Local development endpoint in ${relative}`);
  for (const [, reference] of text.matchAll(/["'(](\/assets\/[^"'\s)]+|\.\/[^"'\s)]+\.(?:js|css))["')]/g)) {
    const asset = reference.startsWith("/")
      ? path.join(output, reference.slice(1))
      : path.resolve(path.dirname(filename), reference);
    assert.ok(statSync(asset).isFile(), `Missing built asset: ${reference}`);
    assets++;
  }
}
console.log(`Production output verified: index.html and ${assets} asset references; no localhost endpoints or source maps.`);
