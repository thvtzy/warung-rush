"use strict";
/* Warung Rush — sound effects, generated live with WebAudio.
   No audio files: every sound is synthesized, so the game works offline. */
let audioCtx = null, muted = false;

function beep(freq, dur, type, vol, when) {
  if (muted) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime + (when || 0);
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  } catch (e) { /* sound is optional */ }
}
const sndClick = () => beep(660, 0.06, "triangle", 0.08);
const sndServe = () => { beep(523, .1, "sine", .12); beep(659, .1, "sine", .12, .08); beep(784, .16, "sine", .12, .16); };
const sndBad   = () => beep(160, 0.2, "sawtooth", 0.07);
const sndPop   = () => beep(880, 0.07, "sine", 0.06);
const sndOut   = () => { beep(392, .14, "sine", .1); beep(311, .14, "sine", .1, .12); beep(262, .22, "sine", .1, .24); };

/* ---------- 8-bit background music (original chiptune loop) ---------- */
let musicTimer = null, musicStep = 0;
const STEP_MS = 205; // ~146 BPM eighth notes
// Lead melody (MIDI notes, 0 = rest), 32 steps = 4 bars, C major pentatonic.
const LEAD = [76,0,79,0, 81,0,79,0, 76,0,79,0, 84,0,81,0,
              74,0,77,0, 81,0,79,0, 76,0,74,0, 72,0,0,0];
// Bass line, one note every 2 steps.
const BASS = [48,43,45,43, 41,43,48,43, 48,43,45,43, 41,43,43,43];
function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function musicTick() {
  if (!muted) {
    try {
      const lead = LEAD[musicStep % 32];
      if (lead) beep(midiHz(lead), .16, "square", .03);
      if (musicStep % 2 === 0) {
        const bass = BASS[Math.floor(musicStep / 2) % 16];
        if (bass) beep(midiHz(bass), .3, "triangle", .06);
      }
      if (musicStep % 2 === 1) beep(6200, .02, "square", .008); // hat tick
    } catch (e) { /* audio unavailable */ }
  }
  musicStep++;
}
function startMusic() {
  if (musicTimer) return;
  musicStep = 0;
  musicTimer = setInterval(musicTick, STEP_MS);
}
function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}
