// "Incoming call" on the projector: Secretary Lin (林书记 Lín shūjì), the local Communist Party secretary of the
// community (社区党委书记), an original character. He phones in only when players do something against the rules,
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

  // Original avatar, drawn as a pencil sketch on old paper: an older local Party secretary in a grey Zhongshan suit
  // (four pockets, turn-down collar), swept-back hair, round glasses, red Party pin, cigarette.
  const AVATAR = `<svg viewBox="0 0 200 200" class="gd-av" aria-hidden="true">
    <defs>
      <filter id="gdpaper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="gdpencil"><feTurbulence type="turbulence" baseFrequency=".05" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>
      <pattern id="gdhatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V4" stroke="#5a4a3a" stroke-width=".8" opacity=".55"/></pattern>
    </defs>
    <rect width="200" height="200" fill="#e8dcc2"/><rect width="200" height="200" fill="#e8dcc2" filter="url(#gdpaper)"/>
    <g filter="url(#gdpencil)" stroke="#3b3128" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 200 C34 152 64 138 100 136 C136 138 166 152 170 200Z" fill="#cfc5af" stroke-width="2"/>
      <path d="M30 200 C34 152 64 138 100 136 C70 146 54 170 50 200Z" fill="url(#gdhatch)" stroke="none"/>
      <path d="M78 136 L92 150 L100 140 L108 150 L122 136 L112 132 L100 140 L88 132Z" fill="#d9d0bc" stroke-width="1.8"/>
      <path d="M100 140 V200" stroke-width="1.6" fill="none"/>
      <g fill="#8d8270" stroke="none"><circle cx="100" cy="152" r="2.3"/><circle cx="100" cy="166" r="2.3"/><circle cx="100" cy="180" r="2.3"/><circle cx="100" cy="194" r="2.3"/></g>
      <g fill="none" stroke-width="1.5"><path d="M64 160 h24 v16 h-24z M64 160 l12 6 l12 -6"/><path d="M112 160 h24 v16 h-24z M112 160 l12 6 l12 -6"/><path d="M58 188 h28 M114 188 h28"/></g>
      <path d="M86 128 h28 v12 c-6 5 -22 5 -28 0z" fill="#ead9bd" stroke-width="1.5"/>
      <ellipse cx="100" cy="90" rx="34" ry="42" fill="#efe2c8" stroke-width="2"/>
      <path d="M68 94 C66 74 72 64 80 60 M132 94 C134 74 128 64 120 60" fill="none" stroke-width="1.2" opacity=".6"/>
      <ellipse cx="66" cy="96" rx="5" ry="9" fill="#ead9bd" stroke-width="1.5"/><ellipse cx="134" cy="96" rx="5" ry="9" fill="#ead9bd" stroke-width="1.5"/>
      <path d="M66 80 C62 54 80 40 102 40 C124 40 140 54 134 80 C130 64 118 56 100 58 C86 58 74 64 66 80Z" fill="#3e352c" stroke-width="1.6"/>
      <path d="M74 64 C86 50 112 46 128 58 M80 58 C92 48 112 46 124 52" fill="none" stroke="#e8dcc2" stroke-width=".8" opacity=".5"/>
      <path d="M78 80 q9 -4 17 0 M105 80 q9 -4 17 0" fill="none" stroke-width="2.6"/>
      <g class="gd-eyes" stroke="none" fill="#2b231c"><ellipse cx="87" cy="90" rx="2.8" ry="2.8"/><ellipse cx="113" cy="90" rx="2.8" ry="2.8"/></g>
      <g fill="none" stroke-width="1.6"><circle cx="87" cy="90" r="10"/><circle cx="113" cy="90" r="10"/><path d="M97 90 h6 M77 89 l-10 -2 M123 89 l10 -2"/></g>
      <path d="M100 94 q-5 12 -1 15 q3 1 6 -1" fill="none" stroke-width="1.6"/>
      <path d="M84 104 q-4 10 2 18 M116 104 q4 10 -2 18" fill="none" stroke-width="1" opacity=".55"/>
      <ellipse class="gd-mouth" cx="100" cy="118" rx="7" ry="1.8" fill="#5c3a2c" stroke="none"/>
      <path d="M90 128 q10 4 20 0" fill="none" stroke-width="1" opacity=".5"/>
      <g transform="translate(140 150)"><path d="M-8 18 C-10 4 -4 -6 8 -8 C16 -6 18 4 14 18Z" fill="#efe2c8" stroke-width="1.6"/><path d="M-2 -2 C0 -6 6 -8 10 -6" fill="none" stroke-width="1.2"/>
        <path d="M4 -6 L30 -16" stroke="#f4efe4" stroke-width="3.4"/><path d="M4 -6 L30 -16" stroke="#3b3128" stroke-width=".6" fill="none" transform="translate(0 1.7)"/><circle cx="30" cy="-16" r="2" fill="#e0602a" stroke="none"/>
        <path class="gd-steam" d="M31 -20 q-6 -8 0 -14 q6 -6 0 -14 M35 -22 q-4 -6 1 -12" fill="none" stroke="#6b5f52" stroke-width="1.2" opacity=".55"/></g>
    </g>
    <g transform="translate(76 156)"><circle r="5.5" fill="#c8102e" stroke="#ffd24a" stroke-width="1.2"/><path d="M0 -3 L.9 -.9 2.9 -.9 1.3 .3 1.9 2.4 0 1.2 -1.9 2.4 -1.3 .3 -2.9 -.9 -.9 -.9Z" fill="#ffd24a"/></g>
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
  #gd .gd-name{position:absolute;left:16px;top:12px;right:16px;color:#2b231c}
  #gd .gd-name b{display:block;font-size:24px}
  #gd .gd-name span{font:600 12px ui-monospace,Menlo,monospace;color:#a50e16;letter-spacing:.06em}
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
      <div class="gd-vid">${AVATAR}<div class="gd-ringtxt"><i>✆</i>林书记 is calling…</div>
      <div class="gd-name"><b>Secretary Lin</b><span>林书记 · Party Secretary · Community Party Committee</span></div></div>
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
  function playAudio(a) {
    return new Promise((res) => { current = a; a.onended = a.onerror = () => res(); const pr = a.play(); if (pr) pr.catch(() => res()); });
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
    if (el) { el.classList.remove("in", "talk", "ring"); }
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
      el.classList.remove("ring"); el.classList.add("talk"); lbl.textContent = "On call · 林书记";
      const start = Date.now(); const tick = setInterval(() => { if (my !== seq) return clearInterval(tick); const s = ((Date.now() - start) / 1000) | 0; tEl.textContent = "00:" + String(s).padStart(2, "0"); }, 250);
      const audio = await audioP; if (my !== seq) return;
      const dur = audio && isFinite(audio.duration) && audio.duration > 0 ? audio.duration * 1000 : L.en.length * 60;
      if (window.Music && Music.isOn()) Music.duck(Math.min(30000, dur + 1500));
      // English captions, paced to the Mandarin audio
      typeOut(sub, L.en, Math.max(1500, dur - 400));
      await Promise.all([audio ? playAudio(audio) : sayZh(L.zh), new Promise((r) => setTimeout(r, dur + 300))]);
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
      en: "Hello. This is Secretary Lin from the community Party committee. " + listNames(names) + ": " + w.en,
      zh: "喂，你好。我是社区党委的林书记。" + listNamesZh(names) + "，" + w.zh(names)
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
