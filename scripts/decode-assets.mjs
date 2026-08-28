#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const encoded = join(root, "encoded");

async function walk(rel = "") {
  const dir = join(encoded, rel);
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const next = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await walk(next);
      continue;
    }
    if (!entry.name.endsWith(".b64")) continue;
    const outRel = next.slice(0, -4);
    const outPath = join(root, outRel);
    await mkdir(dirname(outPath), { recursive: true });
    const b64 = (await readFile(join(encoded, next), "utf8")).replace(/\s+/g, "");
    await writeFile(outPath, Buffer.from(b64, "base64"));
    console.log("[decode-assets]", outRel);
  }
}

await walk();
