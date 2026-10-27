// "Incoming call" guide for the projector: Master Lin (林师傅 Lín shīfu), an original character,
// phones in at each step and explains what to do. Subtitles always show; the browser's
// built-in speech voice reads them out (Chinese greeting in a zh-CN voice when one is installed).
(function () {
  const LINES = {
    lobby: { zh: "你好！", py: "Nǐ hǎo!", en: "I am Master Lin, your shīfu for today. Scan the code with your phone and pick a name. In Shanghai, nothing happens until you scan." },
    sim: { en: "First lesson: in China, a phone number is your identity. Choose how to get your SIM card — and watch what each choice costs you." },
    breakfast: { zh: "早上好！", py: "Zǎoshang hǎo!", en: "Breakfast starts with a scan. WeChat Pay, Alipay, or cash? Look at the chart — cash has almost disappeared." },
    metro: { en: "Rush hour. Choose how you ride to work. Every gate and every road camera keeps a little diary about you." },
    post: { en: "Something bad happened in your city. Do you post about it? Remember: on Weibo, everyone can see which province you are in." },
    doctor: { en: "You feel unwell. Choose how to see the doctor. Your health record travels further than you do." },
    healthcode: { en: "Travel back to 2022. The colour on your phone decided where you could go. Choose carefully — the code was watching." },
    train: { en: "Weekend! Time to take the train home. Your face is your ticket. Not everyone gets on." },
    night: { zh: "晚上好。", py: "Wǎnshang hǎo.", en: "Last stop: where do you sleep tonight? Every hotel tells the police you have arrived." },
    reveal: { en: "Now see what the room chose — who received your data, and how the same moment works in Europe and America." },
    file: { en: "The most important lesson. All your small choices, put together into one file. Look at your phone, and tap through it." },
    unique: { en: "You think you are just one face in the crowd? Let us see how few details it takes to find you." },
    meta: { en: "Shīfu must be honest with you: this game was collecting data on you too. Look at what your own phone gave away." },
    poll: { en: "Your turn to judge. Vote on your phone. There is no wrong answer — only your answer." },
    pollres: { en: "Here is what this room thinks. Now compare it with what people in China said." },
    end: { zh: "谢谢！", py: "Xièxie!", en: "Remember: privacy is not about hiding. It is about who holds the power. You can delete your data on your phone now. Zàijiàn!" }
  };

  // Original avatar: an older teacher with round glasses, short grey hair and goatee, blue Tang jacket, holding tea.
  const AVATAR = `<svg viewBox="0 0 200 200" class="gd-av" aria-hidden="true">
    <defs><radialGradient id="gdbg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#3a1a14"/><stop offset="1" stop-color="#140806"/></radialGradient></defs>
    <rect width="200" height="200" fill="url(#gdbg)"/>
    <g opacity=".25" fill="#ffd24a"><circle cx="24" cy="120" r="10"/><rect x="156" y="70" width="28" height="44" rx="4"/></g>
    <path d="M38 200 C42 150 70 136 100 136 C130 136 158 150 162 200Z" fill="#1d3a6b"/>
    <path d="M100 136 L100 200" stroke="#0f2448" stroke-width="3"/>
    <g fill="#ffd24a"><rect x="94" y="152" width="12" height="4" rx="2"/><rect x="94" y="168" width="12" height="4" rx="2"/><rect x="94" y="184" width="12" height="4" rx="2"/></g>
    <path d="M84 132 h32 v12 c0 6 -32 6 -32 0z" fill="#e2b48f"/>
    <ellipse cx="100" cy="92" rx="38" ry="44" fill="#eec29c"/>
    <ellipse cx="62" cy="96" rx="6" ry="10" fill="#e2b48f"/><ellipse cx="138" cy="96" rx="6" ry="10" fill="#e2b48f"/>
    <path d="M62 82 C60 52 80 44 100 44 C122 44 140 52 138 82 C134 66 122 60 100 60 C80 60 66 66 62 82Z" fill="#c9c9c9"/>
    <path d="M78 76 q10 -5 18 0" stroke="#9a9a9a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M104 76 q10 -5 18 0" stroke="#9a9a9a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g class="gd-eyes"><ellipse cx="87" cy="89" rx="3.4" ry="3.4" fill="#2a1a12"/><ellipse cx="113" cy="89" rx="3.4" ry="3.4" fill="#2a1a12"/></g>
    <g fill="none" stroke="#caa04a" stroke-width="2.4"><circle cx="87" cy="89" r="11"/><circle cx="113" cy="89" r="11"/><path d="M98 89 h4"/></g>
    <path d="M100 94 q-4 12 0 14" stroke="#c99a76" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M84 114 q16 -6 32 0" stroke="#bdbdbd" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse class="gd-mouth" cx="100" cy="121" rx="7" ry="2.2" fill="#6b2a20"/>
    <path d="M92 126 q8 20 16 0 q-8 6 -16 0z" fill="#d6d6d6"/>
    <g transform="translate(128 160)"><path d="M0 0 h26 l-3 22 h-20z" fill="#f4efe4"/><path d="M4 6 h18" stroke="#c8102e" stroke-width="2"/><path d="M8 -6 q3 -6 0 -10 M16 -6 q3 -6 0 -10" stroke="#ffffff" stroke-opacity=".5" fill="none" stroke-width="2" class="gd-steam"/></g>
  </svg>`;

  let el = null, enabled = true, ctx = null, ringT = null, endT = null, typeT = null, mouthT = null, seq = 0;
  const style = document.createElement("style");
  style.textContent = `
  #gd{position:fixed;right:24px;top:150px;width:390px;z-index:40;border-radius:26px;overflow:hidden;background:#0d0b0a;border:1px solid #5a3a16;
    box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 6px rgba(200,16,46,.18);font-family:"Public Sans",system-ui,sans-serif;color:#f6ead2;
    transform:translateX(130%);transition:transform .55s cubic-bezier(.2,.9,.2,1)}
  #gd.in{transform:none}
  #gd .gd-top{display:flex;align-items:center;gap:10px;padding:14px 18px;background:linear-gradient(90deg,#7d0a17,#c8102e);font:600 13px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase}
  #gd .gd-top .dot{width:9px;height:9px;border-radius:50%;background:#3ee08f;box-shadow:0 0 10px #3ee08f}
  #gd.ring .gd-top .dot{background:#ffd24a;animation:gdb .5s infinite alternate}
  #gd .gd-top .t{margin-left:auto;color:#ffe9b8}
  #gd .gd-vid{position:relative;aspect-ratio:1/1;background:#140806}
  #gd .gd-av{width:100%;height:100%;display:block}
  #gd.ring .gd-av{filter:blur(6px) brightness(.6)}
  #gd .gd-name{position:absolute;left:16px;top:12px;text-shadow:0 2px 8px #000}
  #gd .gd-name b{display:block;font-size:24px}
  #gd .gd-name span{font:600 13px ui-monospace,Menlo,monospace;color:#ffd24a;letter-spacing:.08em}
  #gd .gd-ringtxt{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;font:600 16px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#ffe9b8}
  #gd.ring .gd-ringtxt{display:flex}
  #gd .gd-ringtxt i{width:64px;height:64px;border-radius:50%;background:#2fbf71;display:grid;place-items:center;font-style:normal;font-size:30px;animation:gdp 1s infinite}
  #gd .gd-sub{padding:16px 18px 18px;min-height:120px;font-size:20px;line-height:1.4}
  #gd .gd-sub .zh{display:block;font:800 26px "PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif;color:#ffd24a}
  #gd .gd-sub .zh small{font:600 14px ui-monospace,Menlo,monospace;color:#e7d6bd;margin-left:8px}
  #gd .gd-sub .caret{display:inline-block;width:2px;height:1em;background:#ffd24a;vertical-align:-2px;animation:gdb .6s infinite alternate}
  #gd .gd-end{display:flex;justify-content:center;padding:0 0 16px}
  #gd .gd-end button{border:0;background:#e5484d;color:#fff;border-radius:99px;padding:10px 22px;font:700 14px ui-monospace,Menlo,monospace;cursor:pointer}
  #gd.talk .gd-mouth{animation:gdm .18s infinite alternate}
  #gd .gd-eyes{animation:gdeye 4s infinite;transform-origin:100px 89px}
  #gd .gd-steam{animation:gds 2.4s infinite}
  @keyframes gdb{to{opacity:.25}}
  @keyframes gdp{0%{box-shadow:0 0 0 0 rgba(47,191,113,.6)}100%{box-shadow:0 0 0 22px rgba(47,191,113,0)}}
  @keyframes gdm{from{transform:scaleY(.6)}to{transform:scaleY(2.6)}}
  @keyframes gdeye{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  @keyframes gds{0%{opacity:0;transform:translateY(4px)}50%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
  #gd .gd-mouth{transform-origin:100px 121px;transform-box:view-box}
  @media (prefers-reduced-motion: reduce){#gd,#gd *{animation:none!important;transition:none!important}}`;
  document.head.appendChild(style);

  function build() {
    el = document.createElement("div"); el.id = "gd";
    el.innerHTML = `<div class="gd-top"><span class="dot"></span><span class="lbl">Incoming call</span><span class="t">00:00</span></div>
      <div class="gd-vid">${AVATAR}<div class="gd-ringtxt"><i>✆</i>林师傅 is calling…</div>
      <div class="gd-name"><b>Master Lin</b><span>林师傅 · Lín shīfu · your guide</span></div></div>
      <div class="gd-sub"></div><div class="gd-end"><button type="button">End call</button></div>`;
    el.querySelector("button").onclick = () => hang();
    document.body.appendChild(el);
  }

  function ring() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      const t0 = ctx.currentTime + 0.02;
      [0, 0.45].forEach((off) => [880, 1175].forEach((f, k) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + off + k * 0.12;
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.22);
      }));
    } catch (e) {}
  }

  function voices() { return window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  function pick(lang) {
    const v = voices().filter((x) => x.lang && x.lang.toLowerCase().startsWith(lang));
    return v.find((x) => /google|natural|neural|premium/i.test(x.name)) || v[0] || null;
  }
  function say(text, lang, rate) {
    return new Promise((res) => {
      if (!window.speechSynthesis) return res();
      const u = new SpeechSynthesisUtterance(text), v = pick(lang);
      if (lang === "zh" && !v) return res(); // no Chinese voice: subtitles only for the greeting
      if (v) u.voice = v; u.lang = v ? v.lang : lang; u.rate = rate; u.pitch = 0.85;
      u.onend = u.onerror = () => res();
      speechSynthesis.speak(u);
      setTimeout(res, 20000);
    });
  }

  function typeOut(box, text, ms) {
    const span = document.createElement("span"), caret = document.createElement("span"); caret.className = "caret";
    box.appendChild(span); box.appendChild(caret);
    let i = 0; const step = Math.max(14, ms / Math.max(1, text.length));
    clearInterval(typeT);
    typeT = setInterval(() => { span.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(typeT); caret.remove(); } }, step);
  }

  function hang() {
    seq++; clearTimeout(ringT); clearTimeout(endT); clearInterval(typeT); clearInterval(mouthT);
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (el) { el.classList.remove("in", "talk", "ring"); }
  }

  function call(key) {
    const L = LINES[key]; if (!enabled || !L) return;
    if (!el) build();
    hang(); const my = ++seq;
    const sub = el.querySelector(".gd-sub"), lbl = el.querySelector(".lbl"), tEl = el.querySelector(".t");
    sub.innerHTML = ""; lbl.textContent = "Incoming call"; tEl.textContent = "";
    el.classList.add("ring"); requestAnimationFrame(() => el.classList.add("in"));
    ring(); const r2 = setTimeout(() => my === seq && ring(), 1100);
    ringT = setTimeout(async () => {
      clearTimeout(r2); if (my !== seq) return;
      el.classList.remove("ring"); el.classList.add("talk"); lbl.textContent = "On call · 林师傅";
      const start = Date.now(); const tick = setInterval(() => { if (my !== seq) return clearInterval(tick); const s = ((Date.now() - start) / 1000) | 0; tEl.textContent = "00:" + String(s).padStart(2, "0"); }, 250);
      if (window.Music && Music.isOn()) Music.duck(Math.min(20000, 1500 + L.en.length * 75));
      if (L.zh) { const z = document.createElement("span"); z.className = "zh"; z.innerHTML = `${L.zh}<small>${L.py}</small>`; sub.appendChild(z); await say(L.zh, "zh", 0.85); if (my !== seq) return; }
      const typeMs = L.en.length * 55;
      typeOut(sub, L.en, typeMs);
      // stay "on the call" at least as long as the subtitles take, even with no voice installed
      await Promise.all([say(L.en, "en", 0.95), new Promise((r) => setTimeout(r, typeMs + 600))]);
      if (my !== seq) return;
      el.classList.remove("talk"); lbl.textContent = "Call ended";
      endT = setTimeout(() => { if (my === seq) { clearInterval(tick); el.classList.remove("in"); } }, 4000);
    }, 2000);
  }

  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
  window.Guide = {
    call, hang,
    keyFor(step, scenes) {
      if (step.type === "scene") return scenes[step.i].id;
      return step.type;
    },
    toggle() { enabled = !enabled; if (!enabled) hang(); return enabled; },
    isOn: () => enabled
  };
})();
