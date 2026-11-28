// SELAT ATLAS — build entry (Node 22+, standard library only).
// Copies app/ and screenshots/ from beside this file into the output
// directory and writes dossier.json via the vendored make.fun library.
// Writes ONLY to MAKEFUN_OUTPUT_DIR ?? MAKEFUN_OUTPUT ?? "/output";
// never to the working directory, never with Deno APIs, and it never
// deletes the output directory itself.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Verify what was written: the dossier must parse, its text must fit the
// cap, and the entry point must exist. Log a one-line summary for the build.
const dossier = JSON.parse(readFileSync(join(out, "dossier.json"), "utf8"));
if (typeof dossier.text !== "string" || dossier.text.length > 163840) {
  throw new Error("dossier text missing or over the 160 KiB cap");
}
if (!existsSync(join(out, "app", "index.html"))) {
  throw new Error("app/index.html missing from output");
}
console.log(
  "SELAT ATLAS built: app=" + readdirSync(join(out, "app")).length + " files, " +
  "screenshots=" + readdirSync(join(out, "screenshots")).length + ", " +
  "dossier=" + statSync(join(out, "dossier.json")).size + " bytes, " +
  "dossier-text=" + dossier.text.length + " chars",
);
