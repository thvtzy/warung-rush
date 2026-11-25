"use strict";
/* Warung Rush — hand-drawn pixel-art sprites.
   Every picture in the game is drawn here, pixel by pixel, as character maps
   and rendered to canvas at boot: no image files, no emoji, fully offline. */
const K = "#241631"; // shared outline colour

const SPRITE_DEFS = {
  /* ---------------- ingredients ---------------- */
  nasi: { pal: { K, W: "#fff6e8", D: "#2f5fd0", d: "#24489e" }, rows: [
    "....KKKK....",
    "..KWWWWWWK..",
    ".KWKWWKWWK..",
    "KWWWWWWWWWWK",
    ".KDDKKKKDDK.",
    "..KDDDDDDK..",
    "...KDDDDK...",
    "....KddK....",
    ".....KK.....",
  ]},
  mie: { pal: { K, Y: "#ffcf4d", o: "#e8a020", R: "#d8402f", r: "#a82a1e" }, rows: [
    "....KKKK....",
    "..KYYYYYYK..",
    ".KYoYYoYYoK.",
    "KYYYYYYYYYYK",
    ".KRrKKKKrRK.",
    "..KRRRRRRK..",
    "...KRRRRK...",
    "....KrrK....",
    ".....KK.....",
  ]},
  telur: { pal: { K, W: "#fff6e8", Y: "#ffb300", y: "#e89b00" }, rows: [
    "............",
    "...KKKKKK...",
    "..KWWWWWWK..",
    ".KWWKYYKWWK.",
    ".KWYYYYYYWK.",
    ".KWWKYYKWWK.",
    "..KWWWWWWK..",
    "...KKKKKK...",
  ]},
  ayam: { pal: { K, O: "#e8873a", o: "#c96a24", W: "#fff6e8" }, rows: [
    "....KKKK....",
    "..KOOOOOOK..",
    ".KOOOooOOOK.",
    ".KOOOOOOOOK.",
    "..KOOOOOOK..",
    "...KOOOK....",
    "....KWK.....",
    "...KWWWK....",
    "...KWWWK....",
    "...KWWWK....",
    "....KKK.....",
  ]},
  kecap: { pal: { K, R: "#e8483f", B: "#5a3a1a", W: "#fff6e8", w: "#e8dcc0" }, rows: [
    ".....KK.....",
    "....KRRK....",
    "....KRRK....",
    ".....KK.....",
    "....KBBK....",
    "...KBBBBK...",
    "...KBWWBK...",
    "...KBwwBK...",
    "...KBBBBK...",
    "...KBBBBK...",
    "....KKKK....",
  ]},
  cabai: { pal: { K, G: "#2f9e44", R: "#e03131", r: "#ff6b5e" }, rows: [
    ".....KKK....",
    "....KGGGK...",
    "....KGG.....",
    "...KRRK.....",
    "..KRrRRK....",
    "..KRRRRK....",
    ".KRRRRK.....",
    ".KRrRK......",
    ".KRRK.......",
    "..RK........",
    ".KK.........",
  ]},
  sayur: { pal: { K, G: "#37b24d", g: "#8ce99a", W: "#eef7d8" }, rows: [
    ".KgK.KgK.Kg.",
    ".KggKggKggK.",
    "..KggggggK..",
    "...KggggK...",
    "....KGGK....",
    "....KWWK....",
    "...KWWWWK...",
    "...KWWWWK...",
    "....KKKK....",
  ]},
  tusuk: { pal: { K, S: "#d8a860", M: "#a0522d", m: "#c97b4a" }, rows: [
    ".......KK...",
    "......KSK...",
    ".....KMMMK..",
    "....KMmMMK..",
    "....KMMMK...",
    ".....KSK....",
    "....KMMMK...",
    "...KMmMMK...",
    "...KMMMK....",
    "....KSK.....",
    "...KSK......",
    "..KSK.......",
  ]},
  kacang: { pal: { K, T: "#e8c07a", t: "#d8a860" }, rows: [
    "....KKKK....",
    "..KKTTTTKK..",
    ".KTtTTTTtTK.",
    ".KTTTTTTTTK.",
    "..KTTtTTTK..",
    "...KTTTTK...",
    "..KTTtTTTK..",
    ".KTTTTTTTTK.",
    ".KTtTTTTtTK.",
    "..KKTTTTKK..",
    "....KKKK....",
  ]},
  daging: { pal: { K, M: "#b3402f", m: "#8e2f23", W: "#ffd9d0" }, rows: [
    "............",
    "..KKKKKKKK..",
    ".KMMMMMMMMK.",
    "KMMMKWWKMMMK",
    "KMMMWWWWMMMK",
    ".KMMMMMMMMK.",
    ".KMmMMMMmMK.",
    "..KMMMMMMK..",
    "...KKKKKK...",
  ]},
  kuah: { pal: { K, O: "#f4a261", G: "#37b24d", T: "#2a9d8f", t: "#1f7a6e" }, rows: [
    "....KKKK....",
    "..KOOOOOOK..",
    ".KOGOOOGOK..",
    "KOOOOOOOOOOK",
    ".KTtKKKKtTK.",
    "..KTTTTTTK..",
    "...KTTTTK...",
    "....KtTK....",
    ".....KK.....",
  ]},
  kerupuk: { pal: { K, P: "#f2d5a0", p: "#e8bd7a" }, rows: [
    "....KKKK....",
    "..KPPPPPPK..",
    ".KPPpPPpPPK.",
    ".KPPPPPPPPK.",
    "KPPpPPpPPPPK",
    "KPPPPPPPPPPK",
    ".KPPPPPPPPK.",
    ".KPpPPPPpPK.",
    "..KPPPPPPK..",
    "....KKKK....",
  ]},
  teh: { pal: { K, A: "#e8a33d", a: "#c77f1f", W: "#fff3d6" }, rows: [
    "............",
    "..KKKKKKKK..",
    "..KAAAAAAK..",
    "..KAAWAAAK..",
    "..KAAAAAAK..",
    "..KAAAAAAK..",
    "..KAAaAAAK..",
    "...KAAAAK...",
    "...KAAAAK...",
    "....KKKK....",
  ]},
  es: { pal: { K, C: "#aee2ff", c: "#e3f5ff" }, rows: [
    "............",
    "....KKKKK...",
    "..KKCCcCCK..",
    ".KCCcCCCCC K".replace(" ", ""),
    ".KCCCCCCCCK.",
    "KCCCCKCCCCCK",
    "KCCCKCCCCCCK",
    ".KCCCCCCCCK.",
    "..KCCCCCCK..",
    "...KKKKKK...",
  ]},
  gula: { pal: { K, W: "#fff6e8", s: "#cfe8ff" }, rows: [
    "....KKKK....",
    "...KWWWWK...",
    "...KWWsWK...",
    "...KWWWWK...",
    "..KKKKKKKK..",
    ".KWWWWWWWWK.",
    ".KWWsWWsWWK.",
    ".KWWWWWWWWK.",
    "..KKKKKKKK..",
  ]},

  /* ---------------- faces ---------------- */
  face1: { pal: { K, H: "#2b2b2b", S: "#f2c894", M: "#b3543f", T: "#e8483f" }, rows: [] },
  face2: { pal: { K, H: "#7a4a21", S: "#c68850", M: "#9c4633", T: "#2f5fd0" }, rows: [] },
  face3: { pal: { K, H: "#e8c05a", S: "#ffe0b8", M: "#b3543f", T: "#37b24d" }, rows: [] },
  face4: { pal: { K, H: "#5b5b66", S: "#f2c894", M: "#b3543f", T: "#7a4a99" }, rows: [] },
  face5: { pal: { K, H: "#8e2f23", S: "#ffd9a8", M: "#b3543f", T: "#e8a33d" }, rows: [] },
  faceHijab: { pal: { K, H: "#7a4a99", S: "#f2c894", M: "#b3543f", T: "#2a9d8f" }, rows: [] },
  faceAngry: { pal: { K, H: "#2b2b2b", S: "#f2a08c", M: "#8e2f23", T: "#5b5b66" }, rows: [] },

  /* ---------------- props ---------------- */
  heart: { pal: { K, R: "#ff3b5c" }, rows: [
    ".KK...KK.",
    "KRRK.KRRK",
    "KRRRRRRRK",
    ".KRRRRRK.",
    "..KRRRK..",
    "...KRK...",
    "....K....",
  ]},
  heartOff: { pal: { K, R: "#57448f" }, rows: [
    ".KK...KK.",
    "KRRK.KRRK",
    "KRRRRRRRK",
    ".KRRRRRK.",
    "..KRRRK..",
    "...KRK...",
    "....K....",
  ]},
  star: { pal: { K, Y: "#ffd23f" }, rows: [
    "....K....",
    "...KYK...",
    "...KYK...",
    ".KKYYYK K.".replace(" ", ""),
    "KYYYYYYYK",
    ".KYYYYYK.",
    "..KYKYK..",
    "..K.K.K..",
  ]},
  wok: { pal: { K, D: "#4a4a55", d: "#8a8a99" }, rows: [
    "................",
    ".KK..........KK.",
    "..KKKKKKKKKKKK..",
    "...KDDDDDDDDK...",
    "....KDDDDDDK....",
    ".....KKKKKK.....",
  ]},
  flame1: { pal: { K, F: "#ff7b1c", Y: "#ffd23f" }, rows: [
    "....KK....",
    "...KFFK...",
    "..KFYYFK..",
    "..KFYYFK..",
    "...KFFK...",
    "....KK....",
  ]},
  flame2: { pal: { K, F: "#ff7b1c", Y: "#ffd23f" }, rows: [
    ".....KK...",
    "...KFFK...",
    "..KFFYFK..",
    "..KFYYFK..",
    "...KFFK...",
    "....KK....",
  ]},
};

const FACE_ROWS = [
  "...HHHHHHHH...",
  "..HHHHHHHHHH..",
  "..HHSSSSSSHH..",
  "..HSSSSSSSSH..",
  "..HSKSSSSKSH..",
  "..HSSSSSSSSH..",
  "..HSSSSSSSSH..",
  "..HSSMMMMSSH..",
  "...SSSSSSSS...",
  "....SSSSSS....",
  "..TTTTTTTTTT..",
  ".TTTTTTTTTTTT.",
  ".TTTTTTTTTTTT.",
];
const HIJAB_ROWS = [
  "...HHHHHHHH...",
  "..HHHHHHHHHH..",
  "..HHSSSSSSHH..",
  "..HHSSSSSSHH..",
  "..HHSKSSKSHH..",
  "..HHSSSSSSHH..",
  "..HHSSSSSSHH..",
  "..HHSMMMMSHH..",
  "...HSSSSSSH...",
  "...HHSSSSH....",
  "..HTTTTTTTTH..",
  ".HTTTTTTTTTTH.",
  ".HTTTTTTTTTTH.",
];
const ANGRY_ROWS = [
  "...HHHHHHHH...",
  "..HHHHHHHHHH..",
  "..HHSSSSSSHH..",
  "..HKSSSSSSKH..",
  "..HSKSSSSKSH..",
  "..HSSSSSSSSH..",
  "..HSSSSSSSSH..",
  "..HSSKKKKSSH..",
  "...SSSSSSSS...",
  "....SSSSSS....",
  "..TTTTTTTTTT..",
  ".TTTTTTTTTTTT.",
  ".TTTTTTTTTTTT.",
];
["face1", "face2", "face3", "face4", "face5"].forEach(n => { SPRITE_DEFS[n].rows = FACE_ROWS; });
SPRITE_DEFS.faceHijab.rows = HIJAB_ROWS;
SPRITE_DEFS.faceAngry.rows = ANGRY_ROWS;

const SPR = {};
function renderSprite(def) {
  const h = def.rows.length, w = def.rows[0].length;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  def.rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const c = def.pal[ch];
      if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
    });
  });
  return cv.toDataURL();
}
try {
  for (const name of Object.keys(SPRITE_DEFS)) SPR[name] = renderSprite(SPRITE_DEFS[name]);
} catch (e) { /* no canvas (logic tests): sprites stay blank, the game still runs */ }

function sprImg(name, cls) {
  return '<img class="spr ' + (cls || "") + '" src="' + (SPR[name] || "") + '" alt="">';
}
