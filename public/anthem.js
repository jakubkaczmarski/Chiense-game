// "Communist" ringtone: the opening phrase of The Internationale (Pierre De Geyter, 1888 — public domain),
// synthesised as a small brass band with a snare tap. No recording is used.
(function () {
  const N = { B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33 };
  // pitch, beats
  const TUNE = [["G4", .5], ["C5", .75], ["B4", .25], ["D5", .5], ["C5", .5], ["G4", .5], ["E4", .5], ["A4", 1], ["F4", 1],
    ["D4", .75], ["G4", .25], ["F4", .5], ["E4", .5], ["D4", .5], ["C4", .5], ["B3", .5], ["C4", 1.5]];
  const BEAT = 0.42;
  let ctx = null;
  function brass(c, out, f, t, d) {
    const o1 = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o1.type = "sawtooth"; o2.type = "square"; o1.frequency.value = f; o2.frequency.value = f / 2;
    lp.type = "lowpass"; lp.frequency.setValueAtTime(900, t); lp.frequency.linearRampToValueAtTime(2600, t + 0.06); lp.frequency.linearRampToValueAtTime(1400, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.03); g.gain.setValueAtTime(0.13, t + d * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    const g2 = c.createGain(); g2.gain.value = 0.35; o2.connect(g2); g2.connect(lp);
    o1.connect(lp); lp.connect(g); g.connect(out); o1.start(t); o2.start(t); o1.stop(t + d + 0.02); o2.stop(t + d + 0.02);
  }
  function snare(c, out, t) {
    const len = c.sampleRate * 0.12, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = c.createBufferSource(), g = c.createGain(), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1500;
    s.buffer = buf; g.gain.value = 0.12; s.connect(hp); hp.connect(g); g.connect(out); s.start(t);
  }
  // plays the phrase once; returns its length in seconds
  function play(volume = 1) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      const out = ctx.createGain(); out.gain.value = volume; out.connect(ctx.destination);
      let t = ctx.currentTime + 0.05;
      TUNE.forEach(([n, b], i) => { const d = b * BEAT; brass(ctx, out, N[n], t, d * 0.95); if (i % 2 === 0) snare(ctx, out, t); t += d; });
      return t - ctx.currentTime;
    } catch (e) { return 0; }
  }
  window.Anthem = { play, length: TUNE.reduce((a, [, b]) => a + b, 0) * BEAT };
})();
