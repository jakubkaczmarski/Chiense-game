// Simulated surveillance camera feeds for the projector (original canvas animations, no footage).
// Types: street (pedestrian face matching), traffic (plates + driver faces), gate (station face-scan
// gate = ticket), kiosk (face enrolment / liveness check).
(function (root) {
  const GREEN = "#3ee08f", AMBER = "#ffbf47", RED = "#ff5a4e", INK = "#d7efe2";
  const MONO = "600 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const FALLBACK = ["Wang L.", "Li N.", "Zhang W.", "Liu Y.", "Chen J.", "Yang X.", "Zhao M.", "Huang Q."];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const fakeId = () => "310" + ((Math.random() * 900 + 100) | 0) + "••••" + ((Math.random() * 9000 + 1000) | 0);
  const plate = () => "沪" + pick("ABCDEFGHJK") + "·" + Array.from({ length: 5 }, () => pick("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ")).join("");

  class CamFeed {
    constructor(type, opts = {}) {
      this.type = type; this.names = (opts.names && opts.names.length ? opts.names : FALLBACK).slice();
      this.cam = opts.cam || "CAM-0" + ((Math.random() * 8 + 1) | 0); this.clock = opts.clock || "08:41";
      this.W = 640; this.H = 360; this.variant = opts.variant || "";
      this.el = document.createElement("canvas");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.el.width = this.W * dpr; this.el.height = this.H * dpr;
      this.el.style.cssText = "width:100%;height:auto;display:block;border-radius:10px;background:#050807";
      this.ctx = this.el.getContext("2d"); this.ctx.scale(dpr, dpr);
      this.t0 = performance.now(); this.alive = true; this.agents = [];
      this.reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.init();
      const loop = (now) => { if (!this.alive) return; this.draw((now - this.t0) / 1000); if (!this.reduced) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
    stop() { this.alive = false; }
    setNames(n) { if (n && n.length) this.names = n.slice(); }
    name() { return pick(this.names); }

    init() {
      if (this.type === "street") for (let i = 0; i < 6; i++) this.agents.push(this.walker(rnd(0, this.W)));
      if (this.type === "traffic") for (let i = 0; i < 3; i++) this.agents.push(this.car(i, rnd(-200, this.W)));
      if (this.type === "gate") this.cycle = this.gateCycle();
      if (this.type === "kiosk") this.cycle = { name: this.name(), id: fakeId(), start: 0 };
    }
    walker(x) {
      const depth = rnd(0, 1);
      return { x, dir: Math.random() < 0.5 ? 1 : -1, depth, speed: rnd(22, 46) * (0.6 + depth), seen: null, name: this.name(), id: fakeId(), conf: rnd(91, 99.4).toFixed(1), phase: rnd(0, 6) };
    }
    car(lane, x) {
      return { lane, x: x ?? -180, speed: rnd(70, 130), plate: plate(), name: this.name(), kmh: (rnd(38, 72) | 0), phone: Math.random() < 0.25, seen: null, color: pick(["#4a5a63", "#6b5f4c", "#3d4d44", "#5c4a55", "#7a7f82"]) };
    }
    gateCycle() { return { name: this.name(), id: fakeId(), train: "G" + ((Math.random() * 9000 + 100) | 0), start: null, restricted: Math.random() < 0.15 }; }

    // ---------- shared chrome ----------
    chrome(t, label) {
      const c = this.ctx, W = this.W, H = this.H;
      for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(200,255,220,${Math.random() * 0.06})`; c.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
      c.fillStyle = "rgba(0,0,0,0.18)"; for (let y = 0; y < H; y += 3) c.fillRect(0, y, W, 1);
      const g = c.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.95); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.55)");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.font = MONO; c.textBaseline = "top";
      c.fillStyle = INK; c.fillText(`${this.cam}  ${label}`, 14, 12);
      const s = Math.floor(t) % 60, [hh, mm] = this.clock.split(":").map(Number), m2 = mm + Math.floor((t + 0) / 60);
      const ts = `2026-10-27  ${String(hh).padStart(2, "0")}:${String(m2 % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      c.fillText(ts, W - c.measureText(ts).width - 14, 12);
      if (Math.floor(t * 2) % 2 === 0 || this.reduced) { c.fillStyle = RED; c.beginPath(); c.arc(W - 22, H - 20, 6, 0, 7); c.fill(); }
      c.fillStyle = INK; c.fillText("REC", W - 58, H - 27);
      c.strokeStyle = "rgba(215,239,226,0.5)"; c.lineWidth = 1.5;
      [[10, 34], [W - 10, 34], [10, H - 10], [W - 10, H - 10]].forEach(([x, y], i) => { const dx = i % 2 ? -18 : 18, dy = i < 2 ? 18 : -18; c.beginPath(); c.moveTo(x + dx, y); c.lineTo(x, y); c.lineTo(x, y + dy); c.stroke(); });
    }
    box(x, y, w, h, color, label, sub) {
      const c = this.ctx; c.strokeStyle = color; c.lineWidth = 2; c.strokeRect(x, y, w, h);
      if (!label) return;
      c.font = MONO; const tw = Math.max(c.measureText(label).width, sub ? c.measureText(sub).width : 0) + 12, th = sub ? 36 : 20;
      let ly = y - th - 4; if (ly < 32) ly = y + h + 4;
      let lx = Math.min(Math.max(4, x), this.W - tw - 4);
      c.fillStyle = "rgba(4,10,8,0.82)"; c.fillRect(lx, ly, tw, th); c.fillStyle = color; c.fillRect(lx, ly, 3, th);
      c.fillStyle = color; c.fillText(label, lx + 8, ly + 4); if (sub) { c.fillStyle = INK; c.fillText(sub, lx + 8, ly + 20); }
    }

    // ---------- scenes ----------
    draw(t) {
      const c = this.ctx, W = this.W, H = this.H;
      c.fillStyle = "#0a0f0d"; c.fillRect(0, 0, W, H);
      if (this.type === "street") this.street(t);
      if (this.type === "traffic") this.traffic(t);
      if (this.type === "gate") this.gate(t);
      if (this.type === "kiosk") this.kiosk(t);
      this.lastT = t;
    }
    street(t) {
      const c = this.ctx, W = this.W, H = this.H, dt = Math.min(0.05, t - (this.lastT || t));
      c.fillStyle = "#121a17"; c.fillRect(0, H * 0.45, W, H * 0.55);
      c.strokeStyle = "rgba(120,160,140,0.15)"; c.lineWidth = 1;
      for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(W / 2 + i * 20, H * 0.45); c.lineTo(W / 2 + i * 120, H); c.stroke(); }
      for (let k = 0; k < 6; k++) { const y = H * 0.45 + Math.pow(k / 6, 1.6) * H * 0.55; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      c.fillStyle = "#18221e"; for (let i = 0; i < 7; i++) c.fillRect(i * 96, H * 0.12, 80, H * 0.33);
      const labeled = [];
      this.agents.sort((a, b) => b.depth - a.depth).forEach((a) => {
        a.x += a.dir * a.speed * dt;
        if (a.x < -60 || a.x > W + 60) Object.assign(a, this.walker(a.dir > 0 ? -50 : W + 50), { dir: a.dir });
        const s = 0.55 + a.depth * 0.9, base = H * 0.5 + a.depth * H * 0.42, bob = Math.sin(t * 6 + a.phase) * 2 * s;
        const hr = 9 * s, bw = 22 * s, bh = 52 * s, hx = a.x, hy = base - bh - hr * 2 + bob;
        c.fillStyle = "#5d6f66"; c.beginPath(); c.arc(hx, hy + hr, hr, 0, 7); c.fill();
        c.fillStyle = "#46554e"; c.beginPath(); c.roundRect ? c.roundRect(hx - bw / 2, hy + hr * 2 + 2, bw, bh, 6 * s) : c.rect(hx - bw / 2, hy + hr * 2 + 2, bw, bh); c.fill();
        const legs = Math.sin(t * 6 + a.phase) * 6 * s; c.strokeStyle = "#46554e"; c.lineWidth = 5 * s;
        c.beginPath(); c.moveTo(hx - 4 * s, hy + hr * 2 + bh); c.lineTo(hx - 4 * s + legs, base + 10 * s); c.moveTo(hx + 4 * s, hy + hr * 2 + bh); c.lineTo(hx + 4 * s - legs, base + 10 * s); c.stroke();
        const inZone = a.x > 60 && a.x < W - 60;
        if (inZone && a.seen === null) a.seen = t;
        const crowded = labeled.some((lx) => Math.abs(lx - hx) < 150);
        if (a.seen !== null && a.depth > 0.25 && !crowded) {
          labeled.push(hx);
          const age = t - a.seen, fs = hr * 2.6;
          if (age < 0.9) this.box(hx - fs / 2, hy - 2, fs, fs, AMBER, "SCANNING…");
          else this.box(hx - fs / 2, hy - 2, fs, fs, GREEN, `MATCH ${a.name} · ${a.conf}%`, `ID ${a.id}`);
        }
      });
      this.chrome(t, "NANJING RD · FACE MATCH");
    }
    traffic(t) {
      // Gantry ANPR camera facing oncoming traffic: cars approach in perspective,
      // plate + driver face are boxed, readouts go to a log panel (no floating labels).
      const c = this.ctx, W = this.W, H = this.H, dt = Math.min(0.05, t - (this.lastT || t));
      const vx = W * 0.36, vy = H * 0.2, by = H * 0.98, halfB = W * 0.36;
      const roadX = (lane, y) => { const k = (y - vy) / (by - vy); return vx + lane * halfB * 0.62 * k; };
      // road
      c.fillStyle = "#161d1a"; c.beginPath(); c.moveTo(vx - 6, vy); c.lineTo(vx + 6, vy); c.lineTo(vx + halfB, by); c.lineTo(vx - halfB, by); c.closePath(); c.fill();
      c.strokeStyle = "rgba(230,230,200,0.55)"; c.lineWidth = 2;
      [-1, 1].forEach((e) => { c.beginPath(); c.moveTo(vx + e * 6, vy); c.lineTo(vx + e * halfB, by); c.stroke(); });
      c.setLineDash([14, 18]); c.lineDashOffset = -t * 90;
      [-1 / 3, 1 / 3].forEach((e) => { c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx + e * halfB * 1.86, by); c.stroke(); }); c.setLineDash([]);
      // gantry
      c.fillStyle = "#2a3532"; c.fillRect(vx - halfB * 0.55, H * 0.12, halfB * 1.1, 6);
      // cars
      if (!this.cars) { this.cars = []; this.log = []; }
      const lanes = [-1, 0, 1];
      if (this.cars.length < 3 && Math.random() < dt * 1.2) {
        const free = lanes.filter((l) => !this.cars.some((k) => k.lane === l && k.z < 0.45));
        if (free.length) this.cars.push({ lane: pick(free), z: 0, sp: rnd(0.16, 0.24), plate: plate(), name: this.name(), kmh: (rnd(38, 72) | 0), phone: Math.random() < 0.25, read: false, color: pick(["#4a5a63", "#6b5f4c", "#3d4d44", "#5c4a55", "#7a7f82", "#2f3d52"]) });
      }
      this.cars.forEach((k) => { k.z += k.sp * dt; });
      this.cars = this.cars.filter((k) => k.z < 1.12);
      this.cars.slice().sort((a, b) => a.z - b.z).forEach((k) => {
        const zz = Math.pow(k.z, 1.4), y = vy + (by - vy) * zz, s = 0.06 + zz * 0.78;
        const x = roadX(k.lane * 1.05, y), w = 150 * s, h = 92 * s, top = y - h;
        // body
        c.fillStyle = k.color; c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, top, w, h, 12 * s) : c.rect(x - w / 2, top, w, h); c.fill();
        // windshield
        c.fillStyle = "#1c2630"; c.beginPath(); c.moveTo(x - w * 0.36, top + h * 0.12); c.lineTo(x + w * 0.36, top + h * 0.12); c.lineTo(x + w * 0.42, top + h * 0.45); c.lineTo(x - w * 0.42, top + h * 0.45); c.closePath(); c.fill();
        // driver (left-hand drive: driver on the viewer's right)
        c.fillStyle = "#6d7f74"; c.beginPath(); c.arc(x + w * 0.2, top + h * 0.3, h * 0.09, 0, 7); c.fill();
        c.fillRect(x + w * 0.13, top + h * 0.37, w * 0.14, h * 0.08);
        // lights + plate (blue Chinese plate)
        c.fillStyle = "#e9eed2"; c.fillRect(x - w * 0.44, top + h * 0.58, w * 0.16, h * 0.1); c.fillRect(x + w * 0.28, top + h * 0.58, w * 0.16, h * 0.1);
        const pw = w * 0.34, ph = h * 0.15, px = x - pw / 2, py = top + h * 0.72;
        c.fillStyle = "#1d4fb8"; c.fillRect(px, py, pw, ph);
        if (s > 0.45) { c.fillStyle = "#fff"; c.font = `700 ${Math.max(8, ph * 0.7) | 0}px ui-monospace,Menlo,monospace`; c.textBaseline = "middle"; c.textAlign = "center"; c.fillText(k.plate, x, py + ph / 2 + 1); c.textAlign = "left"; c.textBaseline = "top"; }
        // detection once close enough
        if (k.z > 0.42) {
          const col = k.phone && k.z > 0.6 ? RED : GREEN;
          c.strokeStyle = k.z < 0.55 ? AMBER : GREEN; c.lineWidth = 2; c.strokeRect(px - 4, py - 4, pw + 8, ph + 8);
          const fr = h * 0.15; c.strokeStyle = k.z < 0.55 ? AMBER : col; c.strokeRect(x + w * 0.2 - fr, top + h * 0.3 - fr, fr * 2, fr * 2);
          if (k.z > 0.6 && !k.read) { k.read = true; this.log.unshift({ plate: k.plate, kmh: k.kmh, name: k.name, phone: k.phone }); this.log = this.log.slice(0, 4); }
        }
      });
      // log panel
      const lx = W * 0.7, lw = W * 0.28, ly = 40;
      c.fillStyle = "rgba(4,10,8,0.85)"; c.fillRect(lx, ly, lw, H - ly - 40);
      c.font = MONO; c.textBaseline = "top"; c.fillStyle = AMBER; c.fillText("ANPR + FACE LOG", lx + 10, ly + 10);
      this.log.forEach((e, i) => {
        const y = ly + 34 + i * 66;
        c.fillStyle = e.phone ? RED : GREEN; c.fillRect(lx + 8, y, 3, 56);
        c.fillStyle = "#e9f2ff"; c.fillText(e.plate, lx + 18, y + 2);
        c.fillStyle = INK; c.fillText(`${e.kmh} km/h · ${e.name}`, lx + 18, y + 20);
        c.fillStyle = e.phone ? RED : GREEN; c.fillText(e.phone ? "⚠ phone in hand" : "licence valid ✓", lx + 18, y + 38);
      });
      if (!this.log.length) { c.fillStyle = INK; c.fillText("waiting for vehicles…", lx + 10, ly + 36); }
      this.chrome(t, "YAN'AN ELEVATED RD · ANPR");
    }
    gate(t) {
      const c = this.ctx, W = this.W, H = this.H;
      if (this.cycle.start === null) this.cycle.start = t;
      const k = t - this.cycle.start, cy = this.cycle;
      if (k > 6.2) { this.cycle = this.gateCycle(); this.cycle.start = t; this.cycle.name = this.name(); }
      c.fillStyle = "#121a17"; c.fillRect(0, H * 0.55, W, H * 0.45);
      c.fillStyle = "#1b2522"; c.fillRect(0, H * 0.08, W, 40);
      c.font = MONO; c.fillStyle = AMBER; c.fillText(this.variant === "compound" ? "小区入口  RESIDENTS ONLY · 刷脸进门 FACE ENTRY" : "进站口  ENTRANCE · 实名制验证 REAL-NAME CHECK", 24, H * 0.08 + 13);
      const gx = W * 0.36;
      [gx - 120, gx + 120].forEach((x) => { c.fillStyle = "#2a3632"; c.fillRect(x - 18, H * 0.42, 36, H * 0.34); c.fillStyle = "#3a4a44"; c.fillRect(x - 18, H * 0.42, 36, 10); });
      const open = Math.min(1, Math.max(0, (k - 3.6) / 0.4)) * (cy.restricted ? 0 : 1);
      c.fillStyle = cy.restricted && k > 3.6 ? RED : "#7fb39a";
      c.fillRect(gx - 102, H * 0.6, 92 * (1 - open), 8); c.fillRect(gx + 10 + 92 * open, H * 0.6, 92 * (1 - open), 8);
      const p = Math.min(1, k / 2.6), s = 0.5 + p * 0.75, px = gx, base = H * 0.62 + p * H * 0.3;
      const walk = cy.restricted ? Math.min(k, 3.6) : k, yo = Math.max(0, walk - 4) * 60;
      const hr = 16 * s, hy = base - 110 * s - yo * 0.2;
      c.globalAlpha = Math.max(0, 1 - Math.max(0, k - 5) * 1.5);
      c.fillStyle = "#5d6f66"; c.beginPath(); c.arc(px, hy, hr, 0, 7); c.fill();
      c.fillStyle = "#46554e"; c.fillRect(px - 26 * s, hy + hr + 2, 52 * s, 90 * s);
      c.globalAlpha = 1;
      if (k > 0.8 && k < 5) this.box(px - hr * 1.5, hy - hr * 1.5, hr * 3, hr * 3, cy.restricted && k > 3.4 ? RED : k < 1.8 ? AMBER : GREEN, k < 1.8 ? "FACE DETECTED" : `${cy.name}`);
      const home = this.variant === "compound";
      if (home) cy.restricted = false;
      const steps = home
        ? [[1.2, "FACE DETECTED", "resident database"], [2.0, "RESIDENT MATCH", cy.name + " · Bldg 7"], [2.8, "UNIT 1204", "entry 23:14 logged"], [3.4, "GATE OPEN", "entry logged"]]
        : [[1.2, "ID CARD READ", cy.id], [2.0, "FACE MATCH", "97.6% vs ID photo"], [2.8, "12306 TICKET", cy.train + " · found by ID"], [3.4, cy.restricted ? "⛔ RESTRICTED" : "GATE OPEN", cy.restricted ? "court defaulter list" : "no ticket shown"]];
      const lx = W * 0.62; c.fillStyle = "rgba(4,10,8,0.8)"; c.fillRect(lx, H * 0.24, W * 0.34, 176);
      steps.forEach(([at, a, b], i) => {
        if (k < at) return;
        const bad = cy.restricted && i === 3, y = H * 0.24 + 12 + i * 41;
        c.fillStyle = bad ? RED : GREEN; c.fillText((bad ? "✕ " : "✓ ") + a, lx + 12, y); c.fillStyle = INK; c.fillText(b, lx + 30, y + 17);
      });
      this.chrome(t, this.variant === "compound" ? "JING'AN RESIDENCE · GATE A" : "HONGQIAO STATION · TICKET GATE");
    }
    kiosk(t) {
      const c = this.ctx, W = this.W, H = this.H, cy = this.cycle;
      const k = (t % 7);
      if (k < (this.lastK || 0)) { cy.name = this.name(); cy.id = fakeId(); }
      this.lastK = k;
      const fx = W * 0.34, fy = H * 0.56, rx = 78, ry = 102;
      c.strokeStyle = "rgba(120,170,150,0.35)"; c.lineWidth = 2; c.beginPath(); c.ellipse(fx, fy, rx + 26, ry + 26, 0, 0, 7); c.stroke();
      c.fillStyle = "#33413b"; c.beginPath(); c.ellipse(fx, fy, rx, ry, 0, 0, 7); c.fill();
      const blink = k > 2 && k < 2.2 ? 0.2 : 1;
      const pts = [[-34, -18], [34, -18], [-48, -30], [-20, -32], [20, -32], [48, -30], [0, 10], [-12, 24], [12, 24], [-28, 48], [0, 56], [28, 48], [-62, 10], [62, 10], [-50, 70], [50, 70], [0, -70]];
      c.fillStyle = "#1a2320"; c.beginPath(); c.ellipse(fx - 34, fy - 18, 12, 6 * blink, 0, 0, 7); c.ellipse(fx + 34, fy - 18, 12, 6 * blink, 0, 0, 7); c.fill();
      c.strokeStyle = "#1a2320"; c.lineWidth = 3; c.beginPath(); c.moveTo(fx - 26, fy + 48); c.quadraticCurveTo(fx, fy + 58, fx + 26, fy + 48); c.stroke();
      const scan = fy - ry + ((k * 90) % (ry * 2));
      c.strokeStyle = "rgba(62,224,143,0.25)"; c.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const [ax, ay] = pts[i], [bx, by] = pts[j]; if (Math.hypot(ax - bx, ay - by) < 48) { c.beginPath(); c.moveTo(fx + ax, fy + ay); c.lineTo(fx + bx, fy + by); c.stroke(); } }
      pts.forEach(([x, y]) => { const near = Math.abs(fy + y - scan) < 30; c.fillStyle = near ? "#bfffe0" : GREEN; c.beginPath(); c.arc(fx + x, fy + y, near ? 3.5 : 2.2, 0, 7); c.fill(); });
      if (k < 4) { c.fillStyle = "rgba(62,224,143,0.6)"; c.fillRect(fx - rx - 20, scan, (rx + 20) * 2, 2); }
      const lx = W * 0.6; c.font = MONO; c.fillStyle = "rgba(4,10,8,0.8)"; c.fillRect(lx, H * 0.26, W * 0.36, 170);
      const lines = [[0.5, AMBER, "LIVENESS CHECK", "please blink"], [2.4, GREEN, "LIVE PERSON ✓", "not a photo"], [3.4, GREEN, "MATCHED TO ID PHOTO", (98 + (cy.id.length % 2) * 1.2).toFixed(1) + "% · " + cy.id], [4.4, GREEN, this.variant === "pay" ? "PAID ¥38 · " + cy.name : this.variant === "cyberid" ? "CYBERSPACE ID ISSUED" : "ENROLLED: " + cy.name, this.variant === "pay" ? "medical insurance account" : this.variant === "cyberid" ? "all accounts linked" : "face template stored"]];
      lines.forEach(([at, col, a, b], i) => { if (k < at) return; const y = H * 0.26 + 12 + i * 40; c.fillStyle = col; c.fillText(a, lx + 12, y); c.fillStyle = INK; c.fillText(b, lx + 12, y + 17); });
      this.chrome(t, this.variant === "pay" ? "HOSPITAL CASHIER · FACE PAY" : this.variant === "cyberid" ? "NATIONAL ONLINE ID · ENROL" : "CHINA MOBILE STORE · FACE ENROL");
    }
  }
  root.CamFeed = CamFeed;
})(window);
