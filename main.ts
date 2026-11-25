// Warung Rush — hand-in program (Node 22, standard library only).
//
// The game itself is the game/ folder beside this file: plain static files a
// desktop browser plays offline. This program delivers it the way the bounty
// asks: it copies game/ and screenshots/ into the output directory and writes
// dossier.json there with buildDossier from the vendored make.fun library —
// the summary of the game (screenshots plus a source outline) that the judge
// reads.
//
// In the grader the output directory is /output; anywhere else,
// MAKEFUN_OUTPUT_DIR stands in for it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The game, exactly as it sits in this repository.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });

// The screenshots of it, if they are here.
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The dossier, under the scorer's own caps: the dossier text is limited to
// 160 KiB, at most 4 screenshots of at most 256 KiB each, at most 993 files
// and 48 MiB under game/, and no path under game/ longer than 1,000 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
