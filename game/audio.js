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
