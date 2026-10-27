// Background music for the projector: original generative music in the Chinese pentatonic scale
// (宫商角徵羽 gong-shang-jue-zhi-yu), with plucked guzheng-like strings (Karplus–Strong synthesis),
// a soft drone and a simple reverb. No recordings are used.
// If public/music.mp3 exists (a track you have the right to play), that file is used instead.
(function () {
  let ctx = null, master = null, verb = null, timer = null, mood = "calm", on = false, audioEl = null;
  const SCALES = {
    calm: [146.83, 164.81, 185.0, 220.0, 246.94],   // D gong mode: D E F# A B
    tense: [110.0, 130.81, 146.83, 164.81, 196.0]   // A yu mode: A C D E G (darker)
  };

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
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 3200;
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
    if (r < 0.12) {
      // glissando sweep up the scale over two octaves (a guzheng signature)
      for (let i = 0; i < 9; i++) pluck(sc[i % 5] * (i >= 5 ? 2 : 1), t + i * 0.06, 0.1);
      timer = setTimeout(schedule, 1800 + Math.random() * 800); return;
    }
    last = Math.max(0, Math.min(9, last + [-2, -1, -1, 1, 1, 2, 0][(Math.random() * 7) | 0]));
    const note = sc[last % 5] * (last >= 5 ? 2 : 1);
    pluck(note, t, 0.22 + Math.random() * 0.08);
    if (Math.random() < 0.3) pluck(note / 2, t, 0.12); // low octave support
    step++;
    const beat = mood === "tense" ? 900 : 520;
    timer = setTimeout(schedule, beat * (Math.random() < 0.25 ? 2 : 1) + Math.random() * 120);
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
    on = true; startDrone(SCALES[mood][0]); schedule(); return true;
  }
  function stop() {
    on = false; clearTimeout(timer);
    if (audioEl) audioEl.pause();
    if (ctx) stopDrone();
  }
  function setMood(m) {
    if (!SCALES[m] || m === mood) return; mood = m;
    if (on && ctx && !audioEl) { startDrone(SCALES[mood][0]); }
  }
  window.Music = { start, stop, toggle: () => (on ? (stop(), false) : start()), setMood, isOn: () => on };
})();
