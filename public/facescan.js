// On-phone face scan for "A Day in Shanghai".
// Uses the front camera and Google's MediaPipe Face Landmarker, running entirely in this browser.
// No image or video ever leaves the phone; only the result (mode, confidence, blinked) is sent to the game.
// Falls back to a simulated scan when the camera or the model is unavailable, or when the player refuses.
(function () {
  const MODEL_LOCAL = "/models/face_landmarker.task";
  const MODEL_REMOTE = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
  const WASM = new URL("mediapipe/wasm", document.baseURI).href;
  const BUNDLE = new URL("mediapipe/vision_bundle.mjs", document.baseURI).href;
  let landmarkerP = null;

  function loadLandmarker() {
    if (landmarkerP) return landmarkerP;
    landmarkerP = (async () => {
      const vision = await import(BUNDLE);
      const files = await vision.FilesetResolver.forVisionTasks(WASM);
      let model = MODEL_REMOTE;
      try { const r = await fetch(MODEL_LOCAL, { method: "HEAD" }); if (r.ok) model = MODEL_LOCAL; } catch (e) {}
      const make = (delegate) => vision.FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: model, delegate }, runningMode: "VIDEO", numFaces: 1, outputFaceBlendshapes: true
      });
      try { return await make("GPU"); } catch (e) { return await make("CPU"); }
    })().catch((e) => { landmarkerP = null; throw e; });
    return landmarkerP;
  }

  const TEXT = {
    enrol: { who: "China Mobile", title: "Face verification required", body: "Real-name rules: we must match your face to your ID card before issuing a number.", done: "Face template stored with your ID" },
    pay: { who: "Hospital cashier", title: "Pay with your face", body: "Look at the camera to pay from your medical insurance account.", done: "Paid ¥38 from medical insurance" },
    gate: { who: "Station gate 14", title: "Face = ticket", body: "Look at the camera. Your face is matched to your ID card and your 12306 ticket.", done: "Matched to ID and ticket" }
  };

  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function injectCss() {
    if (document.getElementById("fs-css")) return;
    const s = el("style"); s.id = "fs-css";
    s.textContent = `
.fs{position:fixed;inset:0;z-index:50;background:#06100b;color:#e8f4ed;display:flex;flex-direction:column;align-items:center;padding:calc(18px + env(safe-area-inset-top)) 18px calc(18px + env(safe-area-inset-bottom));font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:fsin .3s ease-out}
@keyframes fsin{from{opacity:0;transform:scale(1.03)}}
.fs .who{font:700 12px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#3ee08f}
.fs h3{font-size:22px;margin:6px 0 4px;text-align:center}
.fs .body{font-size:14px;color:#a9bfb3;text-align:center;max-width:320px;line-height:1.45}
.fs .ring{position:relative;width:min(72vw,300px);aspect-ratio:3/4;margin:18px 0 14px;border-radius:50%;overflow:hidden;background:#0d1a14;box-shadow:0 0 0 4px #17352a}
.fs .ring.ok{box-shadow:0 0 0 4px #3ee08f,0 0 40px rgba(62,224,143,.45)}
.fs video,.fs canvas.ov{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
.fs canvas.ov{pointer-events:none}
.fs .scanbar{position:absolute;left:0;right:0;height:3px;background:#3ee08f;box-shadow:0 0 14px #3ee08f;animation:fsscan 1.8s ease-in-out infinite}
@keyframes fsscan{0%,100%{top:8%}50%{top:90%}}
.fs .fs-status{min-height:46px;font:600 15px ui-monospace,Menlo,monospace;text-align:center;color:#ffbf47}
.fs .fs-status.good{color:#3ee08f}
.fs .log{width:100%;max-width:340px;font:12px ui-monospace,Menlo,monospace;color:#8fb3a1;display:grid;gap:4px;margin-top:6px}
.fs .log div{animation:fsin .3s}
.fs .btns{display:grid;gap:10px;width:100%;max-width:340px;margin-top:auto}
.fs button{font:700 16px -apple-system,BlinkMacSystemFont,sans-serif;border-radius:14px;padding:15px;border:0;cursor:pointer}
.fs .go{background:#12a66a;color:#fff}
.fs .no{background:transparent;color:#ff8a80;border:1.5px solid #5a2620}
.fs .fine{font-size:12px;color:#7d968a;text-align:center;max-width:330px;line-height:1.4;margin-top:10px}
@media (prefers-reduced-motion:reduce){.fs,.fs .scanbar,.fs .log div{animation:none}}`;
    document.head.appendChild(s);
  }

  function consent(root, t) {
    return new Promise((resolve) => {
      root.innerHTML = "";
      root.append(el("div", "who", t.who), el("h3", null, t.title), el("p", "body", t.body));
      const ring = el("div", "ring"); ring.append(el("div", "scanbar")); root.append(ring);
      root.append(el("p", "fine", "Classroom game: the scan runs only on this phone. No photo or video is sent anywhere. In China, refusing would mean no service."));
      const btns = el("div", "btns"), go = el("button", "go", "Scan my face"), no = el("button", "no", "I don’t consent");
      btns.append(go, no); root.append(btns);
      go.onclick = () => resolve(true); no.onclick = () => resolve(false);
    });
  }

  async function run(mode, opts = {}) {
    injectCss();
    const t = TEXT[mode] || TEXT.enrol, name = opts.name || "Resident";
    const root = el("div", "fs"); document.body.appendChild(root);
    const quick = mode !== "enrol";
    let stream = null, raf = 0;
    const cleanup = () => { cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((tr) => tr.stop()); root.remove(); };
    try {
      if (!opts.skipConsent) {
        const yes = await consent(root, t);
        if (!yes) { await simulated(root, t, name, true); cleanup(); return { how: "refused", conf: null, blinked: false }; }
      }
      // camera
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      } catch (e) { await simulated(root, t, name, false, "Camera not available — simulated scan"); cleanup(); return { how: "simulated", conf: null, blinked: false }; }
      const res = await live(root, t, name, stream, quick, (id) => { raf = id; });
      cleanup(); return res;
    } catch (e) { cleanup(); return { how: "simulated", conf: null, blinked: false }; }
  }

  function scanView(root, t) {
    root.innerHTML = "";
    root.append(el("div", "who", t.who), el("h3", null, t.title));
    const ring = el("div", "ring"), video = el("video"), ov = el("canvas", "ov"), bar = el("div", "scanbar");
    video.setAttribute("playsinline", ""); video.muted = true; video.autoplay = true;
    ring.append(video, ov, bar); root.append(ring);
    const status = el("div", "fs-status", "Starting camera…"), log = el("div", "log");
    root.append(status, log);
    const btns = el("div", "btns"), skip = el("button", "no", "Skip — simulate instead"); btns.append(skip); root.append(btns);
    return { ring, video, ov, bar, status, log, skip };
  }
  const addLog = (log, s) => { const d = el("div", null, "› " + s); log.append(d); };

  async function live(root, t, name, stream, quick, setRaf) {
    const v = scanView(root, t);
    v.video.srcObject = stream;
    await v.video.play().catch(() => {});
    let skipped = false; v.skip.onclick = () => { skipped = true; };
    v.status.textContent = "Loading face scanner…";
    let lm = null;
    try { lm = await Promise.race([loadLandmarker(), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 15000))]); } catch (e) { lm = null; }
    const ctx = v.ov.getContext("2d");
    const conf = (96 + Math.random() * 3.4).toFixed(1);
    let phase = "find", faceSince = null, blinked = false, start = performance.now(), doneAt = null;
    addLog(v.log, lm ? "face model loaded on device" : "model offline — tracking simulated");
    return new Promise((resolve) => {
      const step = (now) => {
        if (skipped) { resolve({ how: "simulated", conf: null, blinked: false }); return; }
        const w = v.video.videoWidth || 640, h = v.video.videoHeight || 480;
        if (v.ov.width !== w) { v.ov.width = w; v.ov.height = h; }
        ctx.clearRect(0, 0, w, h);
        let face = null, blinkScore = 0;
        if (lm && v.video.readyState >= 2) {
          try {
            const r = lm.detectForVideo(v.video, now);
            face = r.faceLandmarks && r.faceLandmarks[0];
            const bs = r.faceBlendshapes && r.faceBlendshapes[0];
            if (bs) { const g = (n) => (bs.categories.find((c) => c.categoryName === n) || {}).score || 0; blinkScore = Math.max(g("eyeBlinkLeft"), g("eyeBlinkRight")); }
          } catch (e) {}
        } else if (!lm && now - start > 1200) {
          // no model: pretend a face sits in the middle of the frame
          face = fakeFace(now);
        }
        if (face) {
          ctx.fillStyle = "#3ee08f";
          for (let i = 0; i < face.length; i += 3) { const p = face[i]; ctx.globalAlpha = 0.85; ctx.fillRect(p.x * w - 1.5, p.y * h - 1.5, 3, 3); }
          ctx.globalAlpha = 1;
          let x0 = 1, y0 = 1, x1 = 0, y1 = 0; face.forEach((p) => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); });
          ctx.strokeStyle = phase === "done" ? "#3ee08f" : "#ffbf47"; ctx.lineWidth = 4;
          ctx.strokeRect(x0 * w - 10, y0 * h - 10, (x1 - x0) * w + 20, (y1 - y0) * h + 20);
          if (faceSince === null) { faceSince = now; addLog(v.log, `face detected · ${face.length} landmarks`); }
        } else if (phase !== "done") faceSince = null;

        const held = faceSince ? now - faceSince : 0;
        if (phase === "find") {
          v.status.className = "fs-status"; v.status.textContent = face ? "Hold still…" : "Put your face in the oval";
          if (held > (quick ? 700 : 1200)) {
            if (quick) { phase = "match"; } else { phase = "blink"; addLog(v.log, "liveness check started"); }
          }
          if (now - start > 14000 && !face) { resolve({ how: "simulated", conf: null, blinked: false, noface: true }); return; }
        }
        if (phase === "blink") {
          v.status.textContent = "Blink to prove you’re a real person";
          if (blinkScore > 0.45 || (!lm && held > 2600) || held > 6500) { blinked = blinkScore > 0.45; addLog(v.log, blinked ? "blink detected — live person ✓" : "liveness passed"); phase = "match"; }
        }
        if (phase === "match") { phase = "done"; doneAt = now; v.ring.classList.add("ok"); v.bar.remove();
          v.status.className = "fs-status good"; v.status.textContent = `✓ ${name} · ${conf}% match`;
          addLog(v.log, `matched to national ID photo · ${conf}%`); addLog(v.log, t.done); }
        if (phase === "done" && now - doneAt > 1600) { resolve({ how: "camera", conf: Number(conf), blinked, model: !!lm }); return; }
        setRaf(requestAnimationFrame(step));
      };
      setRaf(requestAnimationFrame(step));
    });
  }

  // A plausible landmark cloud for when the model can't load (keeps the effect, honestly labelled).
  const FAKE = (() => { const pts = []; for (let i = 0; i < 160; i++) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()); pts.push([Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.27]); } return pts; })();
  function fakeFace(now) { const dx = Math.sin(now / 900) * 0.01, dy = Math.cos(now / 1100) * 0.01; return FAKE.map(([x, y]) => ({ x: 0.5 + x + dx, y: 0.48 + y + dy })); }

  function simulated(root, t, name, refused, note) {
    return new Promise((resolve) => {
      root.innerHTML = "";
      root.append(el("div", "who", t.who), el("h3", null, refused ? "Refused — simulating" : t.title));
      root.append(el("p", "body", refused ? "In China, refusing means no phone number, no ticket, no payment. Here, we just simulate it." : (note || "")));
      const ring = el("div", "ring"), cv = el("canvas", "ov"); cv.style.transform = "none"; cv.width = 300; cv.height = 400; ring.append(cv, el("div", "scanbar")); root.append(ring);
      const status = el("div", "fs-status", "Simulated scan…"); root.append(status);
      const c = cv.getContext("2d"), t0 = performance.now();
      const loop = (now) => {
        const k = now - t0; c.clearRect(0, 0, 300, 400);
        c.fillStyle = "#33413b"; c.beginPath(); c.ellipse(150, 200, 92, 124, 0, 0, 7); c.fill();
        c.fillStyle = "#3ee08f"; FAKE.forEach(([x, y]) => c.fillRect(150 + x * 460, 200 + y * 460, 3, 3));
        if (k > 1800) { status.className = "fs-status good"; status.textContent = refused ? "Simulated: no consent recorded" : `✓ ${name} · simulated match`; ring.classList.add("ok"); }
        if (k > 3000) { resolve(); return; }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }

  window.FaceScan = { run, preload: () => loadLandmarker().catch(() => {}) };
})();
