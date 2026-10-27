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

  // Original avatar: an older local Party secretary — round glasses, short grey hair, dark Zhongshan suit, red Party pin, tea mug.
  const AVATAR = `<svg viewBox="0 0 200 200" class="gd-av" aria-hidden="true">
    <defs><radialGradient id="gdbg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#3a1a14"/><stop offset="1" stop-color="#140806"/></radialGradient></defs>
    <rect width="200" height="200" fill="url(#gdbg)"/>
    <g opacity=".25" fill="#ffd24a"><circle cx="24" cy="120" r="10"/><rect x="156" y="70" width="28" height="44" rx="4"/></g>
    <path d="M38 200 C42 150 70 136 100 136 C130 136 158 150 162 200Z" fill="#33363b"/>
    <path d="M86 136 L100 150 L114 136" fill="#f2f2f2"/><path d="M84 136 L100 152 L100 200 M116 136 L100 152" stroke="#24262a" stroke-width="3" fill="none"/>
    <g fill="#55585e"><circle cx="100" cy="162" r="2.6"/><circle cx="100" cy="176" r="2.6"/><circle cx="100" cy="190" r="2.6"/></g>
    <path d="M66 172 h18 v6 h-18z M118 172 h18 v6 h-18z" fill="#2a2c30"/>
    <g transform="translate(76 158)"><circle r="6.5" fill="#c8102e" stroke="#ffd24a" stroke-width="1.4"/><path d="M0 -3.6 L1.05 -1.1 3.4 -1.1 1.5 0.4 2.2 2.9 0 1.4 -2.2 2.9 -1.5 0.4 -3.4 -1.1 -1.05 -1.1Z" fill="#ffd24a"/></g>
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
