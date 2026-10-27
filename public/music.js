// Background music for the projector: original generative music in the Chinese pentatonic scale
// (宫商角徵羽 gong-shang-jue-zhi-yu), with plucked guzheng-like strings (Karplus–Strong synthesis),
// a soft drone and a simple reverb. No recordings are used.
// If public/music.mp3 exists (a track you have the right to play), that file is used instead.
(function () {
  let ctx = null, master = null, verb = null, timer = null, mood = "welcome", pulseT = null, on = false, audioEl = null;
  // Each "track" is a different pentatonic mode, tempo and texture; the projector switches between them per scene.
  const TRACKS = {
    welcome: { name: "Welcome · 宫 gong",   scale: [146.83, 164.81, 185.0, 220.0, 246.94], beat: 560, gliss: 0.14, tone: 3200 },
    morning: { name: "Morning market · 徵 zhi", scale: [196.0, 220.0, 246.94, 293.66, 329.63], beat: 420, gliss: 0.16, tone: 3800 },
    commute: { name: "Rush hour · 商 shang", scale: [164.81, 185.0, 220.0, 246.94, 277.18], beat: 330, gliss: 0.05, tone: 3000, pulse: true },
    street:  { name: "Street · 角 jue",     scale: [185.0, 207.65, 246.94, 277.18, 311.13], beat: 480, gliss: 0.1, tone: 3400 },
    clinic:  { name: "Waiting room",        scale: [130.81, 146.83, 164.81, 196.0, 220.0], beat: 1100, gliss: 0.02, tone: 2200 },
    tense:   { name: "Under watch · 羽 yu", scale: [110.0, 130.81, 146.83, 164.81, 196.0], beat: 900, gliss: 0.04, tone: 1800, pulse: true },
    night:   { name: "Night · 羽 yu",       scale: [123.47, 146.83, 164.81, 185.0, 220.0], beat: 1250, gliss: 0.06, tone: 2000 },
    reflect: { name: "Reflection · 宫 gong", scale: [130.81, 146.83, 164.81, 196.0, 220.0], beat: 760, gliss: 0.1, tone: 2600 }
  };
  const ORDER = Object.keys(TRACKS);
  const SCALES = new Proxy({}, { get: (_, k) => TRACKS[k] && TRACKS[k].scale });

  function impulse(c, secs = 2.8) {
    const len = c.sampleRate * secs, buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    return buf;
  }
  function pluck(freq, when, gain = 0.25, decay = 0.996) {
    // Karplus–Strong: a burst of noise through a short feedback delay line.
    const sr = ctx.sampleRate, n = Math.round(sr / freq), dur = 2.6, len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0), ring = new Float32Array(n);
    for (let i = 0; i < n; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for (let i = 0; i < len; i++) { const a = ring[idx], b = ring[(idx + 1) % n]; const v = (a + b) * 0.5 * decay; ring[idx] = v; d[i] = a; idx = (idx + 1) % n; }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = gain;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = TRACKS[mood].tone;
    src.connect(f); f.connect(g); g.connect(master); g.connect(verb);
    src.start(when);
  }
  let drone = null;
  function startDrone(root) {
    stopDrone();
    const g = ctx.createGain(); g.gain.value = 0; g.connect(master); g.connect(verb);
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = "sine"; o2.type = "triangle"; o1.frequency.value = root / 2; o2.frequency.value = (root * 3) / 4;
    const g2 = ctx.createGain(); g2.gain.value = 0.35; o2.connect(g2); g2.connect(g); o1.connect(g);
    o1.start(); o2.start(); g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
    drone = { g, o1, o2 };
  }
  function stopDrone() { if (!drone) return; const { g, o1, o2 } = drone; g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); o1.stop(ctx.currentTime + 1.6); o2.stop(ctx.currentTime + 1.6); drone = null; }

  // phrase generator: short melodic cells, occasional glissando run, rests
  let step = 0, last = 2;
  function schedule() {
    if (!on) return;
    const sc = SCALES[mood], t = ctx.currentTime + 0.05;
    const r = Math.random();
    if (r < TRACKS[mood].gliss) {
      // glissando sweep up the scale over two octaves (a guzheng signature)
      for (let i = 0; i < 9; i++) pluck(sc[i % 5] * (i >= 5 ? 2 : 1), t + i * 0.06, 0.1);
      timer = setTimeout(schedule, 1800 + Math.random() * 800); return;
    }
    last = Math.max(0, Math.min(9, last + [-2, -1, -1, 1, 1, 2, 0][(Math.random() * 7) | 0]));
    const note = sc[last % 5] * (last >= 5 ? 2 : 1);
    pluck(note, t, 0.22 + Math.random() * 0.08);
    if (Math.random() < 0.3) pluck(note / 2, t, 0.12); // low octave support
    step++;
    const beat = TRACKS[mood].beat;
    timer = setTimeout(schedule, beat * (Math.random() < 0.25 ? 2 : 1) + Math.random() * 120);
  }

  // soft low heartbeat-like pulse for the commute / surveillance tracks
  function pulse() {
    clearTimeout(pulseT);
    if (!on || !ctx || !TRACKS[mood].pulse) return;
    const t = ctx.currentTime + 0.02, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(TRACKS[mood].scale[0] / 2, t); o.frequency.exponentialRampToValueAtTime(TRACKS[mood].scale[0] / 4, t + 0.25);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.45);
    pulseT = setTimeout(pulse, TRACKS[mood].beat * 2);
  }
  function transition() {
    // a quick glissando into the new mode so the change is audible
    const sc = TRACKS[mood].scale, t = ctx.currentTime + 0.05;
    for (let i = 0; i < 7; i++) pluck(sc[i % 5] * (i >= 5 ? 2 : 1), t + i * 0.07, 0.09);
  }

  async function start() {
    if (on) return;
    try {
      const r = await fetch("music.mp3", { method: "HEAD" });
      if (r.ok) { audioEl = audioEl || Object.assign(new Audio("music.mp3"), { loop: true, volume: 0.5 }); await audioEl.play(); on = true; return true; }
    } catch (e) {}
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
    if (!master) { master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination); verb = ctx.createConvolver(); verb.buffer = impulse(ctx); const vg = ctx.createGain(); vg.gain.value = 0.35; verb.connect(vg); vg.connect(ctx.destination); }
    on = true; startDrone(SCALES[mood][0]); schedule(); pulse(); return true;
  }
  function stop() {
    on = false; clearTimeout(timer); clearTimeout(pulseT);
    if (audioEl) audioEl.pause();
    if (ctx) stopDrone();
  }
  let onChange = null;
  function setMood(m) {
    if (m === "calm") m = "welcome";
    if (!TRACKS[m] || m === mood) return; mood = m; last = 2;
    if (on && ctx && !audioEl) { startDrone(SCALES[mood][0]); transition(); pulse(); }
    if (onChange) onChange(TRACKS[mood].name);
  }
  const next = () => setMood(ORDER[(ORDER.indexOf(mood) + 1) % ORDER.length]);
  window.Music = { start, stop, toggle: () => (on ? (stop(), false) : start()), setMood, next, isOn: () => on,
    track: () => TRACKS[mood].name, onChange: (fn) => (onChange = fn) };
})();
