#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const encoded = join(root, "encoded");

async function walk(dir, rel = "") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walk(join(dir, entry.name), nextRel)));
    } else {
      files.push(nextRel);
    }
  }
  return files;
}

const files = await walk(encoded);
const groups = new Map();

for (const rel of files) {
  const match = rel.match(/^(.*)\.b64(?:\.(\d{2}))?$/);
  if (!match) continue;
  const outRel = match[1];
  const idx = match[2] == null ? 0 : Number(match[2]);
  const parts = groups.get(outRel) ?? [];
  parts.push({ idx, rel });
  groups.set(outRel, parts);
}

for (const [outRel, parts] of groups) {
  parts.sort((a, b) => a.idx - b.idx);
  const b64 = (
    await Promise.all(parts.map((part) => readFile(join(encoded, part.rel), "utf8")))
  )
    .join("")
    .replace(/\s+/g, "");
  const outPath = join(root, outRel);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, Buffer.from(b64, "base64"));
  console.log("[decode-assets]", outRel);
}
