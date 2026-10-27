// "Your file" as a multi-step story on the phone (tap right = next, tap left = back).
// Built from the player's own choices (GAME.buildFile) plus the real device data the game collected.
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const STAR = '<svg width="16" height="16" viewBox="0 0 24 24" style="fill:#ffd24a;vertical-align:-2px"><path d="M12 1.8l2.9 7.1 7.6.4-5.9 4.8 2 7.4L12 17.3l-6.6 4.2 2-7.4-5.9-4.8 7.6-.4z"/></svg>';
  const FACE = '<svg viewBox="0 0 70 80"><circle cx="35" cy="28" r="16" fill="#9aa6b6"/><path d="M5 80c2-20 14-30 30-30s28 10 30 30z" fill="#9aa6b6"/></svg>';

  function css() {
    if (document.getElementById("story-css")) return;
    const s = document.createElement("style"); s.id = "story-css";
    s.textContent = `
.story{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC",sans-serif;transition:background .5s}
.st-bars{display:flex;gap:4px;padding:calc(10px + env(safe-area-inset-top)) 12px 8px;z-index:3}
.st-bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.28);overflow:hidden;position:relative}
.st-bars i b{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}
.st-bars i.done b{transform:none}
.st-bars i.on b{animation:stbar var(--dur,7s) linear forwards}
@keyframes stbar{to{transform:none}}
.st-top{display:flex;justify-content:space-between;align-items:center;padding:0 16px 6px;z-index:3;font:700 11px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
.st-close{background:none;border:0;color:inherit;font:700 22px/1 -apple-system,sans-serif;padding:4px 6px;cursor:pointer}
.st-stage{flex:1;position:relative;padding:8px 20px calc(70px + env(safe-area-inset-bottom));overflow:hidden}
.st-slide{position:absolute;inset:8px 20px calc(70px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px;overflow-y:auto}
.st-slide > *{animation:strise .6s cubic-bezier(.2,.8,.2,1) both}
${Array.from({ length: 14 }, (_, i) => `.st-slide > *:nth-child(${i + 1}){animation-delay:${0.08 + i * 0.12}s}`).join("")}
@keyframes strise{from{opacity:0;transform:translateY(22px)}}
.st-kick{font:700 12px ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.75}
.st-h{font-size:30px;font-weight:800;line-height:1.08;letter-spacing:-.02em;text-wrap:balance}
.st-p{font-size:15px;line-height:1.45;opacity:.85}
.st-hint{position:absolute;left:0;right:0;bottom:calc(22px + env(safe-area-inset-bottom));text-align:center;font:600 12px ui-monospace,Menlo,monospace;letter-spacing:.12em;opacity:.6;animation:sthint 2s ease-in-out infinite;z-index:3;pointer-events:none}
@keyframes sthint{50%{opacity:.25}}
.st-tap{position:absolute;top:0;bottom:0;z-index:2;background:transparent;border:0;cursor:pointer}
.st-tap.l{left:0;width:32%}.st-tap.r{right:0;width:68%}
/* 1 compile */
.s-compile{background:#04100a;color:#c9f5dc}
.cp-row{display:flex;justify-content:space-between;font:14px ui-monospace,Menlo,monospace;padding:9px 0;border-bottom:1px dashed #1c3a2b}
.cp-row b{color:#3ee08f;opacity:0;animation:stpop .3s both}
.cp-bar{height:8px;border-radius:99px;background:#123022;overflow:hidden}.cp-bar i{display:block;height:100%;background:#3ee08f;width:0;animation:stfill 3s ease-out forwards .3s}
@keyframes stfill{to{width:100%}}@keyframes stpop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
/* 2 id */
.s-id{background:#2a0a0c;color:#f6ead2}
.id-card{background:#f5f0e4;color:#1d1a14;border-radius:18px;padding:16px;border-top:10px solid #c8102e;box-shadow:0 20px 40px rgba(0,0,0,.4);position:relative;overflow:hidden}
.id-card::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.6) 50%,transparent 65%);transform:translateX(-100%);animation:stholo 3s ease-in-out infinite 1s}
@keyframes stholo{60%,100%{transform:translateX(100%)}}
.id-g{display:grid;grid-template-columns:86px minmax(0,1fr);gap:12px;align-items:center;margin-top:10px}
.id-g > div{min-width:0}
.id-ph{width:86px;height:106px;border-radius:8px;background:#cfd6e0;display:grid;place-items:end center;overflow:hidden;position:relative}
.id-ph svg{width:76px}.id-ph::after{content:"";position:absolute;left:0;right:0;height:3px;background:#c8102e;box-shadow:0 0 10px #c8102e;animation:stscan 2s ease-in-out infinite}
@keyframes stscan{0%,100%{top:6%}50%{top:90%}}
.id-n{font-size:24px;font-weight:800}.id-m{font:12.5px ui-monospace,Menlo,monospace;color:#6d6452;margin-top:2px}
.id-stamps{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:12px;border-top:1px dashed #cbbfa4}
.stamp{display:inline-block;font:800 11px ui-monospace,Menlo,monospace;color:#c8102e;border:2.5px solid #c8102e;border-radius:5px;padding:4px 7px;transform:rotate(-4deg);animation:stslam .5s cubic-bezier(.3,1.6,.5,1) both}
.stamp.ok{color:#2d6b4a;border-color:#2d6b4a}
@keyframes stslam{from{opacity:0;transform:rotate(-4deg) scale(3)}}
/* 3 timeline */
.s-time{background:#0b1324;color:#e6ecff}
.tl{position:relative;padding-left:22px}
.tl::before{content:"";position:absolute;left:6px;top:6px;bottom:6px;width:2px;background:linear-gradient(#5b7cff,#c8102e)}
.tl-i{position:relative;padding:7px 0 9px;animation:strise .5s both}
.tl-i::before{content:"";position:absolute;left:-21px;top:12px;width:10px;height:10px;border-radius:50%;background:#0b1324;border:2px solid #7d95ff}
.tl-i.red::before{border-color:#ff5a4e;background:#ff5a4e}
.tl-t{font:700 12px ui-monospace,Menlo,monospace;color:#9db0ff}.tl-x{font-size:15px;font-weight:600;line-height:1.3}.tl-s{font-size:12.5px;opacity:.7}
/* 4 inferences */
.s-inf{background:#1d1404;color:#ffe9c2}
.inf{background:#2b1f08;border:1px solid #4d3912;border-radius:14px;padding:14px;font-size:15.5px;font-weight:600;line-height:1.35}
.inf small{display:block;font:700 10px ui-monospace,Menlo,monospace;letter-spacing:.12em;color:#ffbf47;margin-bottom:4px}
/* 5 alerts */
.s-alert{background:#140607;color:#ffe1dc}
.s-alert.calm{background:#06130d;color:#d2f5e3}
.al-band{background:linear-gradient(90deg,#9e0b1f,#c8102e,#9e0b1f);color:#ffd24a;border-radius:12px;padding:12px 14px;font:800 15px "PingFang SC",sans-serif;letter-spacing:.12em;border-bottom:2px solid #f4b400}
.al{display:flex;gap:10px;align-items:flex-start;background:#2a0d0e;border-left:4px solid #ff5a4e;border-radius:10px;padding:12px;font-size:15px;font-weight:600}
.al span{color:#ff5a4e}
.big{font-size:64px;font-weight:900;letter-spacing:-.04em;line-height:1}
/* can-do */
.s-can-state{background:#1a0506;color:#ffe9dc}.s-can-biz{background:#120d2a;color:#ece8ff}
.cd{border-radius:12px;padding:10px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);opacity:.6}
.cd.lit{opacity:1;background:rgba(200,16,46,.28);border-color:#ff5a4e;box-shadow:0 0 0 1px #ff5a4e inset}
.s-can-biz .cd.lit{background:rgba(143,123,255,.25);border-color:#a99bff;box-shadow:0 0 0 1px #a99bff inset}
.cd.leak{opacity:1;border-style:dashed}
.cd-t{font-size:15.5px;font-weight:800;display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.cd-you{font:700 9.5px ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#ffd24a;white-space:nowrap}
.cd-x{font-size:12.8px;line-height:1.4;opacity:.88;margin-top:3px}
/* 6 tags */
.s-tags{background:linear-gradient(160deg,#1b1240,#3b1d6e);color:#efeaff}
.tg{display:grid;gap:4px}.tg-l{display:flex;justify-content:space-between;font-size:14px;font-weight:600}.tg-l i{font-style:normal;color:#c7b9ff}
.tg-b{height:7px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}.tg-b b{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#8f7bff,#ff7bd5);transform-origin:left;animation:stgrow 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes stgrow{from{transform:scaleX(0)}}
/* 7 ads */
.s-ads{background:#f6f1ff;color:#1a1640}
.ad{background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 10px 24px rgba(60,40,140,.14);border:1px solid #ece6ff}
.ad span{display:block;font:700 10px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#b0623a;margin-bottom:4px}
.ad b{font-size:16px;line-height:1.3}.ad em{display:block;font-style:normal;font-size:12px;color:#8a86a8;margin-top:6px}
.need{display:inline-block;margin:0 6px 6px 0;font-size:13px;font-weight:600;color:#3b2f9a;background:#e8e3ff;border-radius:99px;padding:5px 11px}
/* 8 price */
.s-price{background:#1e0e03;color:#ffe6d0}
.pr{background:#331806;border-radius:14px;padding:14px;font-size:15px;line-height:1.4}
.pr.law{background:#0f1e33;color:#cfe0f5}
.pr-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pr-cmp div{background:#331806;border-radius:14px;padding:14px;text-align:center}.pr-cmp b{display:block;font-size:34px;font-weight:900}.pr-cmp small{font-size:12px;opacity:.8}
/* 9 real */
.s-real{background:#000;color:#e8e8e8}
.rl{display:flex;justify-content:space-between;gap:12px;font:14px ui-monospace,Menlo,monospace;padding:9px 0;border-bottom:1px solid #1d1d1d}
.rl span{color:#8a8a8a}.rl b{color:#fff;text-align:right;font-weight:600}
/* words */
.s-words{background:#5a0610;color:#ffe9b8}
.wd{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.wd div{background:rgba(0,0,0,.25);border:1px solid rgba(255,210,74,.3);border-radius:12px;padding:10px;animation:strise .5s both}
${Array.from({ length: 10 }, (_, i) => `.wd div:nth-child(${i + 1}){animation-delay:${0.3 + i * 0.1}s}`).join("")}
.wd b{display:block;font:800 22px "PingFang SC","Noto Sans SC",sans-serif;color:#ffd24a}.wd span{display:block;font:12px ui-monospace,Menlo,monospace;color:#fff}.wd em{display:block;font-style:normal;font-size:12px;opacity:.85}
/* 10 end */
.s-end{background:radial-gradient(circle at 50% 20%,#c8102e,#5a0610 70%);color:#ffe9b8}
.end-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.end-g div{background:rgba(0,0,0,.22);border:1px solid rgba(255,210,74,.35);border-radius:14px;padding:14px}
.end-g b{display:block;font-size:40px;font-weight:900;color:#ffd24a;font-variant-numeric:tabular-nums}.end-g small{font-size:12.5px}
.st-btn{margin-top:6px;background:#ffd24a;color:#5a0610;border:0;border-radius:14px;padding:14px;font:800 16px -apple-system,sans-serif;cursor:pointer;position:relative;z-index:4}
@media (prefers-reduced-motion:reduce){.story *{animation:none!important}}`;
    document.head.appendChild(s);
  }

  function countUp(root) {
    root.querySelectorAll("[data-n]").forEach((el) => {
      const to = Number(el.dataset.n), t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }

  function slides(ctx) {
    const { f, me, meta, G } = ctx, SC = G.SCENES, W = G.WHO;
    const ans = (id) => me.answers && me.answers[id] && me.answers[id].final;
    const opt = (sid) => { const s = SC.find((x) => x.id === sid); return s && s.options.find((o) => o.id === ans(sid)); };
    // holders & state counts from real choices
    const holders = new Set(); let direct = 0, demand = 0;
    SC.forEach((s) => { const o = opt(s.id); if (!o) return; o.to.forEach((w) => holders.add(w)); if (o.state === "direct") direct++; if (o.state === "demand") demand++; });
    const out = [];

    // 1. compiling
    const srcs = [...holders].map((w) => W[w]).concat(["Police Cloud (警务云)"]);
    out.push({ cls: "s-compile", dur: 4200, auto: true, html: `<div class="st-kick">一人一档 · One person, one file</div>
      <div class="st-h">Compiling your file…</div><div class="st-p">Pulling records from ${srcs.length} sources linked to your ID number.</div>
      <div class="cp-bar"><i></i></div>
      <div>${srcs.map((s, i) => `<div class="cp-row">${esc(s)}<b style="animation-delay:${0.4 + i * (2.6 / srcs.length)}s">✓ linked</b></div>`).join("")}</div>` });

    // 2. identity
    out.push({ cls: "s-id", html: `<div class="st-kick" style="color:#ffd24a">${STAR} 人员档案 · Personal file</div>
      <div class="id-card"><div style="font:700 11px ui-monospace,Menlo,monospace;color:#c8102e;letter-spacing:.1em">上海 · RESIDENT FILE · 模拟 simulation</div>
        <div class="id-g"><div class="id-ph">${FACE}</div><div><div class="id-n">${esc(me.name)}</div><div class="id-m">${esc(f.id)}</div><div class="id-m">${esc(f.phone)}</div>
        <div class="id-m">${(meta.faces || []).some((x) => x.how === "camera") ? "Face template: live camera scan" : "Face template: ID photo"}</div></div></div>
        <div class="id-stamps">${f.tags.length ? f.tags.map((t, i) => `<span class="stamp" style="animation-delay:${0.9 + i * 0.35}s">${esc(t)}</span>`).join("") : `<span class="stamp ok" style="animation-delay:.9s">ORDINARY RESIDENT</span>`}</div></div>
      <div class="st-p">${f.tags.length ? "Your choices put you on a watch list." : "No tags — but your file exists anyway, and it keeps updating."}</div>` });

    // 3. timeline
    const items = [];
    SC.forEach((s) => { const o = opt(s.id); if (!o) return;
      const red = o.outcome === "consequence" || (s.id === "train" && me.answers.train && me.answers.train.blacklisted);
      items.push(`<div class="tl-i${red ? " red" : ""}"><div class="tl-t">${esc(s.clock)} · ${esc(s.title)}</div><div class="tl-x">${esc(o.label)}</div><div class="tl-s">${esc((o.logs[0] || "No record") + (o.to.length ? " → " + o.to.map((w) => W[w]).join(", ") : ""))}</div></div>`); });
    out.push({ cls: "s-time", html: `<div class="st-kick">Your day, reconstructed</div><div class="st-h">Every step left a record.</div>
      <div class="tl">${items.map((x, i) => x.replace('class="tl-i', `style="animation-delay:${0.3 + i * 0.22}s" class="tl-i`)).join("") || '<div class="st-p">You made no choices.</div>'}</div>` });

    // 4. inferences
    out.push({ cls: "s-inf", html: `<div class="st-kick" style="color:#ffbf47">System inferences</div><div class="st-h">What the system concluded about you</div>
      ${f.inferences.length ? f.inferences.map((x) => { const [a, b] = x.split(" → "); return `<div class="inf"><small>${esc(a)}</small>→ ${esc(b || a)}</div>`; }).join("") : '<div class="st-p">Not much yet. Every extra choice would add more.</div>'}
      <div class="st-p">Nobody told the system these things. It combined harmless facts.</div>` });

    // 5. alerts
    out.push({ cls: f.alerts.length ? "s-alert" : "s-alert calm", html: f.alerts.length
      ? `<div class="al-band">${STAR} 警务云 · POLICE CLOUD ALERTS</div><div class="big"><span data-n="${f.alerts.length}">0</span></div><div class="st-p">alert${f.alerts.length === 1 ? "" : "s"} sent to your local police station</div>
         ${f.alerts.map((x) => `<div class="al"><span>⚠</span>${esc(x)}</div>`).join("")}
         <div class="st-p" style="font-size:12.5px">Based on real alerts described by Human Rights Watch (2017), e.g. a local resident staying in a hotel in their own city.</div>`
      : `<div class="st-kick">警务云 · Police Cloud</div><div class="big" style="color:#3ee08f">0</div><div class="st-h">alerts — today.</div><div class="st-p">Your file is quiet. It stays on record, and one wrong click could change that.</div>` });

    // 5b/5c. what they can do — real cases, lit up when they match your choices
    const iph = /iPhone|iPad/.test((meta.device || {}).os || "");
    const bl = me.answers && me.answers.train && me.answers.train.blacklisted;
    const can = (title, ex, lit) => `<div class="cd${lit ? " lit" : ""}"><div class="cd-t">${lit ? "● " : ""}${esc(title)}${lit ? '<span class="cd-you">applies to you</span>' : ""}</div><div class="cd-x">${esc(ex)}</div></div>`;
    out.push({ cls: "s-can s-can-state", html: `<div class="st-kick" style="color:#ffd24a">${STAR} Real cases · the state</div><div class="st-h">What the state can do with your file</div>
      ${can("Ban your travel", "20.47 million plane and 5.71 million high-speed rail tickets blocked for people on the court list (NDRC, 2019).", bl || !!ans("train"))}
      ${can("Freeze your movement", "Zhengzhou, June 2022: officials turned 1,317 bank depositors’ health codes red to stop a protest.", ans("healthcode") === "zhengzhou")}
      ${can("Silence you", "Dr Li Wenliang warned colleagues on WeChat about a new virus. Police made him sign a letter admitting “untrue statements” (Jan 2020). He died of COVID weeks later and was cleared.", ans("post") === "sensitive")}
      ${can("“Invite you to tea” · 喝茶 hē chá", "The euphemism for being summoned by police over what you said or posted.", ans("post") === "sensitive" || ans("healthcode") === "zhengzhou")}
      ${can("Know where you slept", "Hotel registrations flow into police systems; a local staying in a local hotel can trigger an alert (HRW, 2017).", ans("night") === "hotel" || ans("night") === "wangba")}` });
    out.push({ cls: "s-can s-can-biz", html: `<div class="st-kick" style="color:#c7b9ff">Real cases · companies</div><div class="st-h">What companies can do with your file</div>
      ${can("Charge you more", "Meituan users found loyal customers paying higher delivery fees (2020). In a Fudan study, iPhone users got smaller ride discounts.", iph || ans("metro") === "taxi" || ans("night") === "home" || ans("breakfast") === "delivery")}
      ${can("Score you", "Alipay’s Sesame Credit: a high score means no deposits for bikes or hotels. Its tech director said in 2015 that gaming ten hours a day would mark you as “idle”.", ans("breakfast") === "wechat" || ans("breakfast") === "delivery")}
      ${can("Aim at your weak spots", "Your tags become ads: loans when your family is in trouble, skincare after a hospital visit.", ans("healthcode") === "zhengzhou" || !!ans("doctor"))}
      ${can("Hand it to the state", "The National Intelligence Law (2017) obliges companies to cooperate with intelligence work.", true)}
      <div class="cd leak"><div class="cd-t">…and sometimes it all leaks</div><div class="cd-x">July 2022: a hacker offered Shanghai police data on about 1 billion people for 10 bitcoin.</div></div>` });

    // 6. advertiser tags
    const mk = f.market || { tags: [], needs: [], ads: [], price: [] };
    out.push({ cls: "s-tags", html: `<div class="st-kick" style="color:#c7b9ff">用户画像 · User portrait</div><div class="st-h">How Tencent, Alibaba &amp; Didi see you</div>
      ${mk.tags.slice(0, 9).map((x, i) => `<div class="tg"><div class="tg-l">${esc(x.t)}<i>${x.conf}%</i></div><div class="tg-b"><b style="width:${x.conf}%;animation-delay:${0.4 + i * 0.12}s"></b></div></div>`).join("") || '<div class="st-p">Too little data to profile you.</div>'}` });

    // 7. needs & ads
    out.push({ cls: "s-ads", html: `<div class="st-kick" style="color:#5b4bdb">Predicted needs &amp; wishes</div>
      <div>${mk.needs.map((x) => `<span class="need">${esc(x)}</span>`).join("")}</div>
      <div class="st-h" style="font-size:24px">The ads waiting for you</div>
      ${mk.ads.slice(0, 5).map(([c, t]) => `<div class="ad"><span>Sponsored · ${esc(c)}</span><b>${esc(t)}</b><em>Because: ${esc(c === "Health" ? "hospital visit" : c === "Finance" && t.includes("loan") ? "family bank freeze" : c === "Travel" ? "train home" : c === "Mobility" ? "your commute" : c === "Rides" ? "late Didi rides" : c === "Food" ? "late nights / food posts" : "your workplace")}</em></div>`).join("") || '<div class="st-p">No ads — you were hard to profile.</div>'}` });

    // 8. price
    const iphone = /iPhone|iPad/.test((meta.device || {}).os || "");
    out.push({ cls: "s-price", html: `<div class="st-kick" style="color:#ffb27a">大数据杀熟 · Big-data swindling</div><div class="st-h">Same ride. Different price.</div>
      <div class="pr-cmp"><div><small>Discount per ride · iPhone</small><b>¥<span data-n="2">0</span>.07</b></div><div><small>Discount per ride · other phones</small><b>¥<span data-n="4">0</span>.12</b></div></div>
      <div class="pr">${iphone ? "You are on an iPhone — in this study, you would get the smaller discount." : "Loyal users of apps like Meituan and Didi have reported paying more than new users for the same thing."}</div>
      <div class="pr law">⚖ Banned since 2021 (PIPL Art. 24) and 2022 (algorithm rules). Since 2022 you can switch off personalised recommendations and delete your tags. Few people do.</div>
      <div class="st-p" style="font-size:12px">Fudan University study, 800+ ride-hailing trips (reported 2021).</div>` });

    // 9. real data
    const c = meta.client || {}, d = meta.device || {}, ms = (meta.hesitation || []).reduce((n, h) => n + (h.ms || 0), 0);
    out.push({ cls: "s-real", html: `<div class="st-kick" style="color:#ff5a4e">● This part is real</div><div class="st-h">Collected from your phone today — no banner, no consent.</div>
      <div><div class="rl"><span>Device</span><b>${esc(d.os || "?")} ${esc(d.osVer || "")} · ${esc(d.browser || "")}</b></div>
      <div class="rl"><span>IP address</span><b>${esc(meta.ip || "?")}</b></div>
      <div class="rl"><span>Language</span><b>${esc(c.langs || c.lang || "?")}</b></div>
      <div class="rl"><span>Time zone</span><b>${esc(c.tz || "?")}</b></div>
      <div class="rl"><span>Screen</span><b>${esc(c.screen || "?")}</b></div>
      ${c.battery != null ? `<div class="rl"><span>Battery</span><b>${c.battery}%${c.charging ? " · charging" : ""}</b></div>` : ""}
      <div class="rl"><span>Left the game</span><b>${meta.tabSwitches || 0}×</b></div>
      <div class="rl"><span>Thinking time</span><b>${(ms / 1000).toFixed(1)} s</b></div></div>` });

    // 10. words
    const words = SC.filter((s) => s.word).map((s) => s.word).concat(G.FILE_WORD ? [G.FILE_WORD] : []).concat([{ zh: "喝茶", py: "hē chá", en: "“drink tea” = police questioning" }]);
    out.push({ cls: "s-words", html: `<div class="st-kick" style="color:#ffd24a">${STAR} 生词 · shēngcí · New words</div><div class="st-h">You now speak a little surveillance Chinese</div>
      <div class="wd">${words.map((w) => `<div><b>${esc(w.zh)}</b><span>${esc(w.py)}</span><em>${esc(w.en)}</em></div>`).join("")}</div>` });

    // 10. end
    const points = (me.points || 0) + f.points + f.inferences.length;
    out.push({ cls: "s-end", end: true, html: `<div class="st-kick" style="color:#ffd24a">${STAR}${STAR}${STAR} One day in Shanghai</div><div class="st-h">That was one ordinary day.</div>
      <div class="end-g"><div><b data-n="${points}">0</b><small>entries in your file</small></div><div><b data-n="${holders.size}">0</b><small>organisations holding your data</small></div>
      <div><b data-n="${direct}">0</b><small>times sent to the state automatically</small></div><div><b data-n="${demand}">0</b><small>times the state could demand it</small></div></div>
      <div class="st-p">Now multiply by 365 days and 1.4 billion people.</div><button class="st-btn" data-close>Back to the game</button>` });
    return out;
  }

  function mount(container, ctx) {
    css();
    const list = slides(ctx);
    let i = Math.min(ctx.start || 0, list.length - 1), timer = null;
    const root = document.createElement("div"); root.className = "story";
    root.innerHTML = `<div class="st-bars">${list.map(() => "<i><b></b></i>").join("")}</div>
      <div class="st-top"><span>一人一档 · your file</span><button class="st-close" aria-label="Close">×</button></div>
      <div class="st-stage"></div><button class="st-tap l" aria-label="Previous"></button><button class="st-tap r" aria-label="Next"></button><div class="st-hint">TAP TO CONTINUE ›</div>`;
    container.appendChild(root);
    const stage = root.querySelector(".st-stage"), bars = [...root.querySelectorAll(".st-bars i")];
    const show = (k) => {
      clearTimeout(timer); i = Math.max(0, Math.min(list.length - 1, k)); if (ctx.onIndex) ctx.onIndex(i);
      const sl = list[i]; root.className = "story " + sl.cls;
      bars.forEach((b, j) => { b.className = j < i ? "done" : j === i ? "on" : ""; b.style.setProperty("--dur", (sl.dur || 7000) + "ms"); });
      stage.innerHTML = `<div class="st-slide">${sl.html}</div>`;
      countUp(stage);
      root.querySelector(".st-hint").style.display = sl.end ? "none" : "";
      if (sl.auto) timer = setTimeout(() => show(i + 1), sl.dur);
      const btn = stage.querySelector("[data-close]"); if (btn) btn.onclick = (e) => { e.stopPropagation(); close(); };
      if (navigator.vibrate && sl.cls.startsWith("s-alert") && !sl.cls.includes("calm")) navigator.vibrate([120, 60, 120]);
    };
    const close = () => { clearTimeout(timer); root.remove(); if (ctx.onClose) ctx.onClose(); };
    root.querySelector(".st-tap.r").onclick = () => (i < list.length - 1 ? show(i + 1) : null);
    root.querySelector(".st-tap.l").onclick = () => show(i - 1);
    root.querySelector(".st-close").onclick = close;
    document.addEventListener("keydown", function key(e) { if (!document.body.contains(root)) return document.removeEventListener("keydown", key); if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); });
    show(i);
    return { close };
  }

  window.FileStory = { mount };
})();
