// NUSAMETRIK — hand-in program for the make.fun national statistics site.
// Node 22, standard library only. It copies app/ and screenshots/ from this
// repository into the output directory and writes dossier.json with
// buildDossier from vendor/makefun-frontend.ts (the kit's copy, unchanged).
// Output directory: MAKEFUN_OUTPUT_DIR, else MAKEFUN_OUTPUT, else /output.
// It never writes into the repository itself: the grader mounts the repo
// read-only, so every write below targets the output directory only.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));

function outputDir(): string {
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.MAKEFUN_OUTPUT || "";
  return resolve(fromEnv === "" ? "/output" : fromEnv);
}

function copyTree(source: string, target: string): void {
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

function cleanDir(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

// Dossier caps from this competition's gate: text 160 KiB, at most 4
// screenshots of at most 256 KiB each, app at most 993 files / 16 MiB.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
} as const;

// Hand in the entry: fresh output dir, app/ + screenshots/ copied verbatim,
// dossier.json built from exactly what was copied, so the dossier always
// matches the handed-in files byte for byte.
function handIn(): void {
  const out = outputDir();
  const appSource = join(REPO_ROOT, "app");
  const shotsSource = join(REPO_ROOT, "screenshots");
  if (!existsSync(appSource)) {
    throw new Error("hand-in: no app/ directory in " + REPO_ROOT);
  }
  if (!existsSync(shotsSource)) {
    throw new Error("hand-in: no screenshots/ directory in " + REPO_ROOT);
  }
  cleanDir(out);
  copyTree(appSource, join(out, "app"));
  copyTree(shotsSource, join(out, "screenshots"));
  const dossier = buildDossier(out, DOSSIER_CAPS);
  writeFileSync(join(out, "dossier.json"), dossier);
  console.log("nusametrik: wrote " + out + " (dossier.json " + dossier.length + " bytes)");
}

handIn();
