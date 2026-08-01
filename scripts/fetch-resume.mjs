#!/usr/bin/env node
/**
 * Fetch the latest resume PDF from RxResume into src/resume/jesus.pdf
 * before the Eleventy build (runs as the `prebuild` npm hook).
 *
 * - Selects the resume by slug `jesus-11ty-site` (configurable via SLUG).
 * - Auth: RXRESUME_API_KEY env var, or a gitignored `.env` in the repo root.
 * - Failure policy: on ANY error, print a warning and exit 0 so the build
 *   keeps the committed src/resume/jesus.pdf as fallback (never hard-fails).
 * - Atomic write: download to .tmp then rename, so a partial fetch can never
 *   corrupt the committed fallback.
 *
 * Local run:  export RXRESUME_API_KEY=... && npm run build
 * Docker run: key injected via BuildKit secret mount (see Dockerfile).
 */
import { readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = join(ROOT, 'src', 'resume', 'jesus.pdf');
const API_BASE = 'https://rxresu.me/api/openapi'; // rxresume.me domain is dead (410); API lives at rxresu.me
const SLUG = 'jesus-11ty-site';
const MIN_PDF_BYTES = 1000;

/** Load a gitignored .env from the repo root, without overriding real env. */
function loadDotEnv() {
  try {
    const lines = readFileSync(join(ROOT, '.env'), 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* no .env present — fine */
  }
}

async function main() {
  loadDotEnv();
  const key = process.env.RXRESUME_API_KEY;
  if (!key) {
    console.warn('[fetch-resume] RXRESUME_API_KEY not set — keeping committed src/resume/jesus.pdf');
    return;
  }

  const tmp = `${TARGET}.tmp`;
  try {
    const headers = { 'x-api-key': key, accept: 'application/json' };

    const listRes = await fetch(`${API_BASE}/resumes`, { headers });
    if (!listRes.ok) throw new Error(`list resumes HTTP ${listRes.status}`);
    const resumes = await listRes.json();
    const resume = (Array.isArray(resumes) ? resumes : []).find((r) => r.slug === SLUG);
    if (!resume?.id) throw new Error(`resume slug "${SLUG}" not found`);

    const pdfRes = await fetch(`${API_BASE}/resumes/${resume.id}/pdf`, {
      headers: { 'x-api-key': key, accept: 'application/pdf' },
    });
    if (!pdfRes.ok) throw new Error(`download PDF HTTP ${pdfRes.status}`);
    const buf = Buffer.from(await pdfRes.arrayBuffer());

    if (buf.length < MIN_PDF_BYTES || buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
      throw new Error(`downloaded data is not a valid PDF (${buf.length} bytes)`);
    }

    writeFileSync(tmp, buf);
    renameSync(tmp, TARGET);
    console.log(`[fetch-resume] OK: ${SLUG} -> src/resume/jesus.pdf (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    try { unlinkSync(tmp); } catch { /* nothing to clean */ }
    console.warn(`[fetch-resume] WARN: ${err.message} — keeping committed src/resume/jesus.pdf`);
  }
}

main();
