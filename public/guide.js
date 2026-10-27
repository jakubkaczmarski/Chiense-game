// "Incoming call" on the projector: Secretary Lin (林书记 Lín shūjì), the local Communist Party secretary of the
// community Communist Party committee (中共社区委员会书记), an original character. He phones in only when players do something against the rules,
// names them, and speaks Mandarin; the captions on screen are in English.
// Voice: ElevenLabs through the server's /api/tts (set ELEVENLABS_API_KEY), otherwise the browser's Chinese voice.
(function () {
  const KEY = new URLSearchParams(location.search).get("key");
  const one = (n) => n.length === 1;
  const WARN = {
    "sim:refuse": {
      en: "you asked to skip the face scan. The real-name system is not optional. Your request has been noted.",
      zh: (n) => `${one(n) ? "你" : "你们"}要求跳过人脸识别。实名制不是可以选择的。你的要求已经记录在案。` },
    "post:sensitive": {
      en: "you reposted a video of a protest. It has been removed. You will be invited to drink tea.",
      zh: (n) => `${one(n) ? "你" : "你们"}转发了抗议视频。视频已经删除了。过两天，请${one(n) ? "你" : "你们"}来喝茶。` },
    "healthcode:noscan": {
      en: "you tried to walk in without scanning your code. No code, no entry. The attempt is in your file.",
      zh: (n) => `${one(n) ? "你" : "你们"}没有扫码就想进去。没有码，哪里都进不去。这次尝试已经记入档案。` },
    "healthcode:zhengzhou": {
      en: "you travelled to Zhengzhou about the bank money. Your health code is now red. Stay where you are.",
      zh: (n) => `${one(n) ? "你" : "你们"}为了银行的钱去了郑州。现在${one(n) ? "你" : "你们"}的健康码是红码。请原地不动。` },
    "train:tout": {
      en: "you tried to buy a ticket from a tout. The name on the ticket must match your face. This has been noted.",
      zh: (n) => `${one(n) ? "你" : "你们"}想从黄牛手里买票。车票上的名字必须和你的脸一致。这件事已经记录了。` },
    "train:blacklist": {
      en: "you are on the court list of judgment defaulters. No train for you. Pay your debts first.",
      zh: (n) => `${one(n) ? "你" : "你们"}在失信被执行人名单上。不能坐火车。先把债还了。` }
  };
  const listNames = (n) => n.length === 1 ? n[0] : n.length <= 6 ? n.slice(0, -1).join(", ") + " and " + n[n.length - 1] : n.slice(0, 5).join(", ") + " and " + (n.length - 5) + " others";
  const listNamesZh = (n) => n.length === 1 ? n[0] : n.length <= 6 ? n.slice(0, -1).join("、") + "和" + n[n.length - 1] : n.slice(0, 5).join("、") + "等" + n.length + "人";

  // Original avatar in 1960s propaganda-poster style: a smiling local Party secretary with rosy cheeks, round glasses,
  // olive Zhongshan suit, cap with a red star, red Party pin and a red-and-gold sunburst behind him. Animated with CSS.
  const ray = (i) => { const r = 170, a1 = (i * 22.5 - 4) * Math.PI / 180, a2 = (i * 22.5 + 4) * Math.PI / 180; return `<path d="M100 84 L${(100 + r * Math.cos(a1)).toFixed(1)} ${(84 + r * Math.sin(a1)).toFixed(1)} L${(100 + r * Math.cos(a2)).toFixed(1)} ${(84 + r * Math.sin(a2)).toFixed(1)}Z"/>`; };
  const AVATAR = `<svg viewBox="0 0 200 200" class="gd-av" aria-hidden="true">
    <defs><radialGradient id="gdsun" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="#ffd85a"/><stop offset=".35" stop-color="#f29a2e"/><stop offset="1" stop-color="#c8102e"/></radialGradient></defs>
    <rect width="200" height="200" fill="url(#gdsun)"/>
    <g class="gd-rays" fill="#ffe7a0" opacity=".35">${Array.from({ length: 16 }, (_, i) => ray(i)).join("")}</g>
    <g class="gd-body">
      <g stroke="#2a1a10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M30 200 C34 154 64 140 100 138 C136 140 166 154 170 200Z" fill="#5f6b3a"/>
        <path d="M30 200 C34 154 64 140 100 138 C74 150 60 172 56 200Z" fill="#4c5730" stroke="none"/>
        <path d="M80 138 L92 152 L100 142 L108 152 L120 138 L110 134 L100 142 L90 134Z" fill="#6f7b46"/>
        <path d="M100 142 V200" fill="none"/>
        <g fill="#e8c35a" stroke-width="1.2"><circle cx="100" cy="156" r="2.6"/><circle cx="100" cy="171" r="2.6"/><circle cx="100" cy="186" r="2.6"/></g>
        <g fill="#566234" stroke-width="1.8"><path d="M64 162 h24 v15 h-24z"/><path d="M112 162 h24 v15 h-24z"/></g>
        <path d="M88 128 h24 v12 c-6 5 -18 5 -24 0z" fill="#f3b98a"/>
      </g>
      <g transform="translate(78 158)"><circle r="5.5" fill="#c8102e" stroke="#ffd24a" stroke-width="1.2"/><path class="gd-pin" d="M0 -3 L.9 -.9 2.9 -.9 1.3 .3 1.9 2.4 0 1.2 -1.9 2.4 -1.3 .3 -2.9 -.9 -.9 -.9Z" fill="#ffd24a"/></g>
    </g>
    <g class="gd-arm" stroke="#2a1a10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M150 200 L146 150 Q146 140 156 140 L166 140 Q172 142 170 152 L168 200Z" fill="#5f6b3a"/>
      <g class="gd-hand" fill="#f8c79a">
        <path d="M148 140 C144 128 146 118 150 114 L170 114 C174 120 172 132 168 140Z"/>
        <path d="M150 116 L148 98 Q150 93 154 97 L155 115"/><path d="M155 115 L155 92 Q158 87 161 92 L161 115"/>
        <path d="M161 115 L162 94 Q165 90 167 95 L166 116"/><path d="M166 117 L169 102 Q172 99 173 104 L170 120"/>
        <path d="M148 128 L138 118 Q136 113 141 114 L150 121"/></g>
    </g>
    <g class="gd-head">
      <g stroke="#2a1a10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M66 92 C66 64 80 52 100 52 C120 52 134 64 134 92 C134 120 120 136 100 136 C80 136 66 120 66 92Z" fill="#f8c79a"/>
        <ellipse cx="65" cy="96" rx="6" ry="10" fill="#f3b98a"/><ellipse cx="135" cy="96" rx="6" ry="10" fill="#f3b98a"/>
        <path d="M66 74 C64 58 78 48 100 48 C122 48 136 58 134 74 L130 66 C120 62 80 62 70 66Z" fill="#1d1712"/>
        <path d="M60 64 C60 40 80 30 100 30 C120 30 140 40 140 64 C126 58 74 58 60 64Z" fill="#5f6b3a"/>
        <path d="M58 66 C76 58 124 58 142 66 L140 72 C122 66 78 66 60 72Z" fill="#4c5730"/>
        <path class="gd-star" d="M100 36 l3.2 6.6 7.2 .9 -5.3 5 1.3 7.2 -6.4 -3.5 -6.4 3.5 1.3 -7.2 -5.3 -5 7.2 -.9z" fill="#e3242b" stroke-width="1.4"/>
      </g>
      <g class="gd-cheeks" fill="#ef7f6a" opacity=".55"><ellipse cx="78" cy="108" rx="9" ry="5.5"/><ellipse cx="122" cy="108" rx="9" ry="5.5"/></g>
      <g stroke="#2a1a10" stroke-linecap="round" fill="none">
        <g class="gd-brows"><path d="M77 80 q9 -6 18 -1 M105 79 q9 -5 18 1" stroke-width="3.2"/></g>
        <g class="gd-eyes"><path d="M80 93 q6 -6 12 0 M108 93 q6 -6 12 0" stroke-width="2.8"/></g>
        <g stroke-width="1.8" stroke="#3a2a1a"><circle cx="86" cy="92" r="10.5"/><circle cx="114" cy="92" r="10.5"/><path d="M96.5 92 h7"/></g>
        <path d="M100 96 q-4 10 0 13 q3 1 5 -1" stroke-width="2"/>
      </g>
      <g class="gd-smile">
        <path d="M82 114 q18 18 36 0 q-18 8 -36 0z" fill="#8c2a22" stroke="#2a1a10" stroke-width="2" stroke-linejoin="round"/>
        <path d="M85 115.5 q15 5 30 0 l-1 3 q-14 4 -28 0z" fill="#fff"/>
        <ellipse class="gd-mouth" cx="100" cy="122" rx="6" ry="1.6" fill="#d9625a"/>
        <path d="M80 112 q-2 2 -1 4 M120 112 q2 2 1 4" stroke="#2a1a10" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </g>
    </g>
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
  #gd .gd-name{position:absolute;left:12px;top:10px;right:12px;color:#fff6d8;text-shadow:0 2px 0 #7d0a17,0 0 10px rgba(125,10,23,.6)}
  #gd .gd-name b{display:block;font-size:24px}
  #gd .gd-name span{font:600 12px ui-monospace,Menlo,monospace;color:#ffe9a8;letter-spacing:.06em}
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

  #gd svg *{transform-box:view-box}
  #gd .gd-rays{transform-origin:100px 84px;animation:gdrot 40s linear infinite}
  #gd .gd-body{transform-origin:100px 200px;animation:gdbreath 3.2s ease-in-out infinite}
  #gd .gd-head{transform-origin:100px 136px;animation:gdidle 4.5s ease-in-out infinite}
  #gd .gd-cheeks{transform-origin:100px 108px;animation:gdcheek 2.4s ease-in-out infinite}
  #gd .gd-star{transform-origin:100px 45px;animation:gdstar 3s ease-in-out infinite}
  #gd .gd-arm{transform-origin:158px 200px;transform:translateY(70px);transition:transform .6s cubic-bezier(.2,.9,.3,1.3)}
  #gd .gd-hand{transform-origin:156px 140px}
  #gd.talk .gd-arm,#gd.wave .gd-arm{transform:none}
  #gd.wave .gd-hand{animation:gdwave .5s ease-in-out 3 alternate}
  #gd.talk:not(.wave) .gd-hand{animation:gdwag .35s ease-in-out infinite alternate}
  #gd.talk .gd-head{animation:gdnod .7s ease-in-out infinite alternate}
  #gd.talk .gd-brows{animation:gdbrow .7s ease-in-out infinite alternate}
  #gd.ring .gd-head{animation:gdshake .25s ease-in-out infinite alternate}
  #gd .gd-smile{transform-origin:100px 113px}
  #gd.talk .gd-smile{animation:gdtalk .24s ease-in-out infinite alternate}
  #gd.talk.lipsync .gd-smile{animation:none;transform:scaleY(var(--open,1))}
  #gd.talk .gd-mouth{animation:none}
  @keyframes gdtalk{0%{transform:scaleY(.75)}40%{transform:scaleY(1.45)}70%{transform:scaleY(.95)}100%{transform:scaleY(1.6)}}
  @keyframes gdrot{to{transform:rotate(360deg)}}
  @keyframes gdbreath{50%{transform:scale(1.015,1.025)}}
  @keyframes gdidle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg) translateY(-1px)}}
  @keyframes gdnod{from{transform:rotate(-3deg) translateY(0)}to{transform:rotate(2deg) translateY(2px)}}
  @keyframes gdbrow{to{transform:translateY(-2.5px)}}
  @keyframes gdcheek{50%{transform:scale(1.06)}}
  @keyframes gdstar{50%{transform:scale(1.15) rotate(8deg);filter:brightness(1.3)}}
  @keyframes gdwave{from{transform:rotate(-16deg)}to{transform:rotate(18deg)}}
  @keyframes gdwag{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
  @keyframes gdshake{from{transform:rotate(-1.5deg)}to{transform:rotate(1.5deg)}}
  @media (prefers-reduced-motion: reduce){#gd,#gd *{animation:none!important;transition:none!important}}`;
  document.head.appendChild(style);

  function build() {
    el = document.createElement("div"); el.id = "gd";
    el.innerHTML = `<div class="gd-top"><span class="dot"></span><span class="lbl">Incoming call</span><span class="t">00:00</span></div>
      <div class="gd-vid">${AVATAR}<div class="gd-ringtxt"><i>✆</i>林书记 is calling…</div>
      <div class="gd-name"><b>Secretary Lin</b><span>林书记 · Secretary · Communist Party Committee</span></div></div>
      <div class="gd-sub"></div><div class="gd-end"><button type="button">End call</button></div>`;
    el.querySelector("button").onclick = () => window.Guide.hang();
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
  function zhVoice() {
    const v = voices().filter((x) => x.lang && /^zh(-|_)?(cn|hans)?/i.test(x.lang));
    return v.find((x) => /cn/i.test(x.lang) && /google|natural|neural|premium/i.test(x.name)) || v.find((x) => /cn/i.test(x.lang)) || v[0] || null;
  }
  // fetch the ElevenLabs audio while the phone rings (returns null if the server has no key)
  async function fetchTTS(text) {
    if (!KEY) return null;
    try {
      const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: KEY, text }) });
      if (!r.ok) return null;
      const a = new Audio(URL.createObjectURL(await r.blob()));
      await new Promise((res) => { a.onloadedmetadata = res; a.onerror = res; setTimeout(res, 3000); });
      return a;
    } catch (e) { return null; }
  }
  let current = null;
  let lipRaf = null;
  function lipSync(a) {
    // drive the mouth from the voice's loudness
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(a), an = ctx.createAnalyser(); an.fftSize = 512;
      src.connect(an); an.connect(ctx.destination);
      const buf = new Uint8Array(an.fftSize); el.classList.add("lipsync");
      const loop = () => {
        an.getByteTimeDomainData(buf); let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const open = Math.min(1.9, 0.7 + Math.sqrt(sum / buf.length) * 9);
        el.style.setProperty("--open", open.toFixed(2));
        lipRaf = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {}
  }
  function stopLip() { cancelAnimationFrame(lipRaf); if (el) { el.classList.remove("lipsync"); el.style.removeProperty("--open"); } }
  function playAudio(a) {
    return new Promise((res) => { current = a; lipSync(a); a.onended = a.onerror = () => { stopLip(); res(); }; const pr = a.play(); if (pr) pr.catch(() => { stopLip(); res(); }); });
  }
  function sayZh(text) {
    return new Promise((res) => {
      const v = zhVoice();
      if (!window.speechSynthesis || !v) return res();
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = 0.95; u.pitch = 0.8;
      u.onend = u.onerror = () => res(); speechSynthesis.speak(u); setTimeout(res, 25000);
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
    if (current) { try { current.pause(); } catch (e) {} current = null; }
    stopLip();
    if (el) { el.classList.remove("in", "talk", "ring", "wave"); }
  }

  function call(L, done) {
    if (!enabled || !L) { if (done) done(); return; }
    if (!el) build();
    hang(); const my = ++seq;
    const sub = el.querySelector(".gd-sub"), lbl = el.querySelector(".lbl"), tEl = el.querySelector(".t");
    sub.innerHTML = ""; lbl.textContent = "Incoming call"; tEl.textContent = "";
    el.classList.add("ring"); requestAnimationFrame(() => el.classList.add("in"));
    ring(); const r2 = setTimeout(() => my === seq && ring(), 1100);
    const audioP = fetchTTS(L.zh); // fetched while ringing
    ringT = setTimeout(async () => {
      clearTimeout(r2); if (my !== seq) return;
      el.classList.remove("ring"); el.classList.add("talk", "wave"); lbl.textContent = "On call · 林书记";
      setTimeout(() => el && el.classList.remove("wave"), 1500);
      const start = Date.now(); const tick = setInterval(() => { if (my !== seq) return clearInterval(tick); const s = ((Date.now() - start) / 1000) | 0; tEl.textContent = "00:" + String(s).padStart(2, "0"); }, 250);
      const audio = await audioP; if (my !== seq) return;
      const dur = audio && isFinite(audio.duration) && audio.duration > 0 ? audio.duration * 1000 : L.en.length * 60;
      if (window.Music && Music.isOn()) Music.duck(Math.min(30000, Math.max(dur, L.en.length * 45) + 2000));
      // English captions, paced to the Mandarin audio
      const typeMs = Math.max(dur - 400, L.en.length * 45);
      typeOut(sub, L.en, typeMs);
      await Promise.all([audio ? playAudio(audio) : sayZh(L.zh), new Promise((r) => setTimeout(r, typeMs + 1200))]);
      if (my !== seq) return;
      el.classList.remove("talk"); lbl.textContent = "Call ended";
      endT = setTimeout(() => { if (my === seq) { clearInterval(tick); el.classList.remove("in"); } if (done) setTimeout(done, 700); }, 3500);
    }, 2000);
  }

  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
  // queue: new offenders are batched per offence; calls play one after another
  const seen = new Set(), pending = new Map(); let busy = false, batchT = null;
  function flush() {
    if (busy || !pending.size) return;
    const [k, names] = pending.entries().next().value; pending.delete(k);
    busy = true;
    const w = WARN[k];
    call({
      en: "Hello. This is Secretary Lin from the Communist Party committee. " + listNames(names) + ": " + w.en +
        " This is your official warning. You are invited to a learning camp — xuéxí bān — to study the correct thinking.",
      // spoken out loud: only a short call naming the offenders; the full story is in the English captions
      zh: "喂！我是林书记。" + listNamesZh(names) + "！这是正式警告。请" + (names.length === 1 ? "你" : "你们") + "参加学习班。"
    }, () => { busy = false; flush(); });
  }
  function report(sceneId, offenders) {
    let added = false;
    (offenders || []).forEach((o) => {
      const k = sceneId + ":" + o.opt, id = k + ":" + o.name;
      if (!WARN[k] || seen.has(id)) return;
      seen.add(id); added = true;
      if (!pending.has(k)) pending.set(k, []);
      pending.get(k).push(o.name);
    });
    if (added) { clearTimeout(batchT); batchT = setTimeout(flush, 2500); }
  }
  window.Guide = {
    report,
    hang() { hang(); busy = false; },
    reset() { seen.clear(); pending.clear(); },
    toggle() { enabled = !enabled; if (!enabled) { hang(); busy = false; pending.clear(); } return enabled; },
    isOn: () => enabled
  };
})();
