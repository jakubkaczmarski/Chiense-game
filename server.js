// "A Day in Shanghai" — live classroom data-privacy game.
// Zero dependencies: run with `node server.js` (Node 18+).
// Everything is kept in memory only and disappears when the server stops.

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { SCENES, POLLS, STEPS, buildFile } = require("./public/content.js");

const PORT = Number(process.env.PORT) || 3000;
const HOST_KEY = process.env.HOST_KEY || crypto.randomBytes(3).toString("hex");
const PUBLIC = path.join(__dirname, "public");

// ---------- state ----------
let state = freshState();
function freshState() {
  return { step: 0, players: new Map(), feed: [], blacklisted: new Set(), totalPoints: 0, sceneShownAt: {}, seq: 0 };
}
const screens = new Set();     // SSE responses for projector
const playerStreams = new Map(); // pid -> Set(res)

// ---------- helpers ----------
const now = () => Date.now();
function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 20000) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); } });
  });
}
function clientIp(req) {
  const xf = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xf || req.socket.remoteAddress || "";
}
function maskIp(ip) {
  ip = ip.replace(/^::ffff:/, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ip.split(".").slice(0, 3).join(".") + ".x";
  if (ip.includes(":")) return ip.split(":").slice(0, 3).join(":") + ":…";
  return ip || "unknown";
}
function parseUA(ua = "") {
  let os = "Other", browser = "Other";
  if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Mac OS X/.test(ua)) os = "Mac";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Linux/.test(ua)) os = "Linux";
  const m = ua.match(/Android\s([\d.]+)/) || ua.match(/OS\s([\d_]+)\slike Mac/);
  const osVer = m ? m[1].replace(/_/g, ".") : "";
  if (/SamsungBrowser/.test(ua)) browser = "Samsung Internet";
  else if (/CriOS|Chrome\//.test(ua) && !/Edg/.test(ua)) browser = "Chrome";
  else if (/Edg/.test(ua)) browser = "Edge";
  else if (/FxiOS|Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua)) browser = "Safari";
  const model = (ua.match(/Android [\d.]+; ([^;)]+)/) || [])[1] || "";
  return { os, osVer, browser, model: model.trim() };
}
const clean = (s, n = 24) => String(s || "").replace(/[<>]/g, "").trim().slice(0, n);
const currentStep = () => STEPS[state.step];
const sceneOpt = (si, oid) => SCENES[si].options.find((o) => o.id === oid);

// ---------- aggregates ----------
function sceneStats(si) {
  const scene = SCENES[si];
  const counts = {}, attempts = {};
  scene.options.forEach((o) => { counts[o.id] = 0; attempts[o.id] = 0; });
  let answered = 0, blocked = 0, msSum = 0, msN = 0, blacklistedHits = 0;
  for (const p of state.players.values()) {
    const a = p.answers[scene.id];
    if (!a) continue;
    a.attempts.forEach((id) => { if (attempts[id] !== undefined) attempts[id]++; });
    blocked += a.attempts.filter((id) => sceneOpt(si, id)?.outcome === "blocked").length;
    if (a.final) { counts[a.final]++; answered++; }
    if (a.blacklisted) blacklistedHits++;
    if (a.ms) { msSum += a.ms; msN++; }
  }
  return { counts, attempts, answered, blocked, avgMs: msN ? Math.round(msSum / msN) : 0, blacklistedHits };
}
function fingerprintKey(p, keys) {
  const parts = [p.device.os, (p.meta.lang || "").slice(0, 2)];
  keys.forEach((k) => parts.push(p.answers[k]?.final || "-"));
  return parts.join("|");
}
function uniqueness() {
  const players = [...state.players.values()];
  const small = ["metro", "night", "post"];
  const full = SCENES.map((s) => s.id);
  const count = (keys) => {
    const m = new Map();
    players.forEach((p) => { const k = fingerprintKey(p, keys); m.set(k, (m.get(k) || 0) + 1); });
    return { m, unique: players.filter((p) => m.get(fingerprintKey(p, keys)) === 1).length };
  };
  const s = count(small), f = count(full);
  return { total: players.length, smallUnique: s.unique, fullUnique: f.unique, sm: s.m, fm: f.m, small, full };
}
function metaStats() {
  const players = [...state.players.values()];
  const tally = (fn) => { const t = {}; players.forEach((p) => { const k = fn(p) || "unknown"; t[k] = (t[k] || 0) + 1; }); return t; };
  let ms = [], switches = 0, hiddenMs = 0, batt = [], darks = 0;
  players.forEach((p) => {
    Object.values(p.answers).forEach((a) => a.ms && ms.push(a.ms));
    switches += p.tabSwitches || 0;
    hiddenMs += p.hiddenMs || 0;
    if (typeof p.meta.battery === "number") batt.push(p.meta.battery);
    if (p.meta.dark) darks++;
  });
  const slowest = SCENES.map((s, i) => ({ title: s.title, avg: sceneStats(i).avgMs })).sort((a, b) => b.avg - a.avg)[0];
  return {
    n: players.length,
    os: tally((p) => p.device.os),
    browser: tally((p) => p.device.browser),
    lang: tally((p) => (p.meta.lang || "").slice(0, 2).toUpperCase()),
    avgMs: ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : 0,
    switches, hiddenMs, darks,
    battery: batt.length ? Math.round(batt.reduce((a, b) => a + b, 0) / batt.length) : null,
    lowBattery: batt.filter((b) => b < 20).length,
    slowest,
    faceCamera: players.filter((p) => (p.faces || []).some((f) => f.how === "camera")).length,
    faceRefused: players.filter((p) => (p.faces || []).some((f) => f.how === "refused")).length,
    faceScans: players.reduce((n, p) => n + (p.faces || []).length, 0)
  };
}
function pollStats(pi) {
  const counts = POLLS[pi].options.map(() => 0);
  for (const p of state.players.values()) {
    const v = p.polls[POLLS[pi].id];
    if (typeof v === "number" && counts[v] !== undefined) counts[v]++;
  }
  return counts;
}

// ---------- payloads ----------
function screenPayload() {
  const step = currentStep();
  const out = { step, stepIndex: state.step, stepCount: STEPS.length, players: state.players.size, names: [...state.players.values()].map((p) => p.name).slice(-60), feed: state.feed.slice(-14), totalPoints: state.totalPoints };
  if (step.type === "scene" || step.type === "reveal") out.stats = sceneStats(step.i);
  if (step.type === "unique") { const u = uniqueness(); out.unique = { total: u.total, smallUnique: u.smallUnique, fullUnique: u.fullUnique }; }
  if (step.type === "file") out.files = [...state.players.values()].map((p) => { const f = buildFile({ name: p.name, answers: p.answers, faces: p.faces, seed: p.pid, device: p.device }); return { name: p.name, id: f.id, tags: f.tags, alerts: f.alerts.length, points: f.points + f.inferences.length, mtags: f.market.tags.map((x) => x.t) }; });
  if (step.type === "meta") out.meta = metaStats();
  if (step.type === "poll" || step.type === "pollres") { out.poll = pollStats(step.i); out.voted = [...state.players.values()].filter((p) => p.polls[POLLS[step.i].id] !== undefined).length; }
  if (step.type === "end") out.meta = metaStats();
  return out;
}
function playerPayload(p) {
  const step = currentStep();
  const out = { step, stepIndex: state.step, players: state.players.size, me: { name: p.name, answers: p.answers, polls: p.polls, points: p.points } };
  if (step.type === "scene" || step.type === "reveal") {
    out.blacklisted = SCENES[step.i].id === "train" && state.blacklisted.has(p.pid);
  }
  if (step.type === "reveal") out.stats = sceneStats(step.i);
  if (step.type === "unique") {
    const u = uniqueness();
    out.unique = { total: u.total, smallUnique: u.smallUnique, fullUnique: u.fullUnique, meSmall: u.sm.get(fingerprintKey(p, u.small)) || 0, meFull: u.fm.get(fingerprintKey(p, u.full)) || 0 };
  }
  if (step.type === "meta" || step.type === "end" || step.type === "file") {
    out.meta = {
      ip: maskIp(p.ip), device: p.device, client: p.meta, joinedAt: p.joinedAt,
      tabSwitches: p.tabSwitches, hiddenMs: p.hiddenMs, points: p.points, faces: p.faces || [],
      hesitation: SCENES.map((s) => ({ title: s.title, ms: p.answers[s.id]?.ms || null, attempts: p.answers[s.id]?.attempts.length || 0 }))
    };
  }
  if (step.type === "pollres") out.poll = pollStats(step.i);
  return out;
}

// ---------- broadcasting ----------
let pending = null;
function broadcast() {
  if (pending) return;
  pending = setTimeout(() => {
    pending = null;
    const sp = "data: " + JSON.stringify(screenPayload()) + "\n\n";
    screens.forEach((res) => res.write(sp));
    for (const [pid, set] of playerStreams) {
      const p = state.players.get(pid);
      const msg = p ? "data: " + JSON.stringify(playerPayload(p)) + "\n\n" : "data: " + JSON.stringify({ gone: true, step: currentStep() }) + "\n\n";
      set.forEach((res) => res.write(msg));
    }
  }, 120);
}
setInterval(() => {
  screens.forEach((r) => r.write(": ping\n\n"));
  playerStreams.forEach((s) => s.forEach((r) => r.write(": ping\n\n")));
}, 20000);

function addLogs(p, logs, clock) {
  logs.forEach((l) => { state.feed.push({ id: ++state.seq, t: clock, name: p.name, text: l }); p.points++; state.totalPoints++; });
  if (state.feed.length > 200) state.feed = state.feed.slice(-200);
}

function onStepEnter() {
  const step = currentStep();
  if (step.type === "scene") {
    state.sceneShownAt[step.i] = now();
    if (SCENES[step.i].id === "train" && state.blacklisted.size === 0) {
      // Pick roughly 1 in 8 players (at least one once 3+ are playing) for the court blacklist.
      const ids = [...state.players.keys()];
      const n = ids.length >= 10 ? 1 : 0; // one person, only in a full room — being listed is rare
      ids.sort(() => Math.random() - 0.5).slice(0, n).forEach((id) => state.blacklisted.add(id));
    }
  }
}

// ---------- routes ----------
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".wasm": "application/wasm", ".task": "application/octet-stream", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp3": "audio/mpeg" };
function serveFile(res, file) {
  fs.readFile(path.join(PUBLIC, file), (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;

  if (req.method === "HEAD" && p === "/music.mp3") { fs.access(path.join(PUBLIC, "music.mp3"), (e) => { res.writeHead(e ? 404 : 200); res.end(); }); return; }
  if (req.method === "HEAD" && /^\/models\/[\w.-]+$/.test(p)) { fs.access(path.join(PUBLIC, p.slice(1)), (e) => { res.writeHead(e ? 404 : 200); res.end(); }); return; }
  if (req.method === "GET") {
    if (p === "/" || p === "/play") return serveFile(res, "play.html");
    if (p === "/screen") return serveFile(res, "screen.html");
    if (p === "/content.js") return serveFile(res, "content.js");
    if (p === "/qr.js") return serveFile(res, "qr.js");
    if (p === "/cams.js") return serveFile(res, "cams.js");
    if (p === "/facescan.js") return serveFile(res, "facescan.js");
    if (p === "/story.js") return serveFile(res, "story.js");
    if (p === "/music.js") return serveFile(res, "music.js");
    if (p === "/guide.js") return serveFile(res, "guide.js");
    if (p === "/music.mp3") return serveFile(res, "music.mp3");
    if (p === "/start.mp3") return serveFile(res, "start.mp3");
    if (/^\/(mediapipe|models)\/[\w./-]+$/.test(p) && !p.includes("..")) return serveFile(res, p.slice(1));
    if (p === "/events") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive", "X-Accel-Buffering": "no" });
      res.write("retry: 2000\n\n");
      const pid = url.searchParams.get("pid");
      if (url.searchParams.get("screen")) {
        screens.add(res);
        res.write("data: " + JSON.stringify(screenPayload()) + "\n\n");
        req.on("close", () => screens.delete(res));
      } else if (pid) {
        if (!playerStreams.has(pid)) playerStreams.set(pid, new Set());
        playerStreams.get(pid).add(res);
        const pl = state.players.get(pid);
        res.write("data: " + JSON.stringify(pl ? playerPayload(pl) : { gone: true, step: currentStep() }) + "\n\n");
        req.on("close", () => { const s = playerStreams.get(pid); if (s) { s.delete(res); if (!s.size) playerStreams.delete(pid); } });
      }
      return;
    }
    res.writeHead(404); return res.end("Not found");
  }

  if (req.method !== "POST") { res.writeHead(405); return res.end(); }
  const body = await readBody(req);

  if (p === "/api/join") {
    const pid = crypto.randomUUID();
    const ua = req.headers["user-agent"] || "";
    const m = body.meta || {};
    state.players.set(pid, {
      pid, name: clean(body.name, 18) || "Citizen " + (state.players.size + 1),
      joinedAt: now(), ip: clientIp(req), device: parseUA(ua),
      meta: {
        lang: clean(m.lang, 12), langs: clean(m.langs, 40), tz: clean(m.tz, 40),
        screen: clean(m.screen, 16), dpr: Number(m.dpr) || null, dark: !!m.dark,
        battery: typeof m.battery === "number" ? Math.round(m.battery) : null,
        charging: m.charging === true, net: clean(m.net, 8), cores: Number(m.cores) || null, mem: Number(m.mem) || null
      },
      answers: {}, polls: {}, points: 0, tabSwitches: 0, hiddenMs: 0
    });
    broadcast();
    return json(res, 200, { pid });
  }

  const player = state.players.get(body.pid);

  if (p === "/api/answer") {
    if (!player) return json(res, 404, { error: "unknown" });
    const step = currentStep();
    const si = Number(body.scene);
    if (step.type !== "scene" || step.i !== si) return json(res, 409, { error: "closed" });
    const scene = SCENES[si], opt = sceneOpt(si, body.option);
    if (!opt) return json(res, 400, { error: "bad option" });
    const a = player.answers[scene.id] || (player.answers[scene.id] = { attempts: [], final: null, ms: null });
    if (a.final) return json(res, 200, { done: true });
    a.attempts.push(opt.id);
    if (body.face && typeof body.face === "object") {
      const how = ["camera", "simulated", "refused"].includes(body.face.how) ? body.face.how : "simulated";
      player.faces = player.faces || [];
      player.faces.push({ scene: scene.id, how, conf: Number(body.face.conf) || null, blinked: !!body.face.blinked });
    }
    if (!a.ms) a.ms = Math.max(0, now() - (state.sceneShownAt[si] || now()));
    let outcome = opt.outcome;
    const blacklisted = scene.id === "train" && state.blacklisted.has(player.pid) && opt.outcome === "ok";
    if (outcome === "blocked") {
      addLogs(player, opt.logs, scene.clock);
    } else {
      a.final = opt.id;
      if (blacklisted) { a.blacklisted = true; outcome = "blacklisted"; addLogs(player, ["Ticket purchase denied — court blacklist match"], scene.clock); }
      else addLogs(player, opt.logs, scene.clock);
    }
    broadcast();
    return json(res, 200, { outcome });
  }

  if (p === "/api/meta") {
    if (!player) return json(res, 404, {});
    if (typeof body.tabSwitch === "number") player.tabSwitches += Math.min(1, body.tabSwitch);
    if (typeof body.hiddenMs === "number") player.hiddenMs += Math.min(body.hiddenMs, 3600000);
    if (typeof body.battery === "number") player.meta.battery = Math.round(body.battery);
    return json(res, 200, {});
  }

  if (p === "/api/poll") {
    if (!player) return json(res, 404, {});
    const step = currentStep();
    if (step.type !== "poll") return json(res, 409, {});
    const v = Number(body.option);
    if (POLLS[step.i].options[v] === undefined) return json(res, 400, {});
    player.polls[POLLS[step.i].id] = v;
    broadcast();
    return json(res, 200, {});
  }

  if (p === "/api/delete") {
    if (player) {
      state.totalPoints -= player.points;
      state.players.delete(player.pid);
      state.blacklisted.delete(player.pid);
      state.feed = state.feed.filter((f) => f.name !== player.name);
    }
    broadcast();
    return json(res, 200, { deleted: true });
  }

  if (p === "/api/host") {
    if (body.key !== HOST_KEY) return json(res, 403, { error: "wrong key" });
    if (body.action === "next") state.step = Math.min(STEPS.length - 1, state.step + 1);
    if (body.action === "prev") state.step = Math.max(0, state.step - 1);
    if (body.action === "goto" && Number.isInteger(body.step)) state.step = Math.max(0, Math.min(STEPS.length - 1, body.step));
    if (body.action === "reset") state = freshState();
    if (body.action === "next" || body.action === "goto") onStepEnter();
    broadcast();
    return json(res, 200, { step: state.step });
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => {
  console.log(`\n  A Day in Shanghai is running`);
  console.log(`  Phones join at:      http://localhost:${PORT}/`);
  console.log(`  Projector (control): http://localhost:${PORT}/screen?key=${HOST_KEY}`);
  console.log(`  Host key: ${HOST_KEY}  (set HOST_KEY=... to choose your own)`);
  const lan = Object.values(require("os").networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
  lan.forEach((ip) => console.log(`  Same Wi-Fi screen:   http://${ip}:${PORT}/screen?key=${HOST_KEY}`));
  console.log("");
});
