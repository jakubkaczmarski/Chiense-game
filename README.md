# A Day in Shanghai — live classroom data-privacy game

Everyone scans a QR code and lives through eight documented real-life situations as a Chinese resident: SIM registration with a face check, WeChat Pay / Alipay, the commute, a Weibo post, a hospital visit, the 2022 health code (Zhengzhou red-code case), a 12306 train with face-check gates, and a hotel night. Each choice shows up live on the projector: what is collected, who holds it (China Mobile, Tencent, Ant Group, Didi, Weibo, 12306…) and whether the state gets it automatically or can demand it, and how the same moment works in the EU/Poland and the US. Then come an anonymity test, a "this game was tracking you too" reveal, and three class polls compared with Chinese survey data.

No dependencies. Node 18+. All data lives in memory and is gone when the server stops. Every player can also delete their own record at the end.

## Run it

```bash
node server.js                 # or: HOST_KEY=mysecret PORT=3000 node server.js
```

The terminal prints the projector link with your host key: `/screen?key=...`. Without the key, the screen is view-only.

Phones must be able to reach your laptop. Pick one option:

1. **Tunnel (recommended — university Wi-Fi often blocks device-to-device traffic).** Phones can then use mobile data too.
   ```bash
   npx cloudflared tunnel --url http://localhost:3000
   ```
   Open `https://<random>.trycloudflare.com/screen?key=...` on the projector. The QR code picks up the public URL automatically.
2. **Same Wi-Fi.** Open the "Same Wi-Fi screen" link the server prints (not `localhost`, or the QR will point to localhost).
3. **Railway (easiest permanent link).** Push this folder to a GitHub repo, then in Railway: *New Project → Deploy from GitHub repo*. Railway detects Node and runs `npm start`. In *Variables* set `HOST_KEY` to a secret of your choice, then under *Settings → Networking* click *Generate Domain*. Open `https://<your-app>.up.railway.app/screen?key=<HOST_KEY>` on the projector — the QR code points phones to the same address, and HTTPS means the face scan can use real cameras.
   - Keep it at **one instance** (the default): game state lives in memory.
   - A redeploy or restart wipes the room — deploy before class, not during.
   - Free/trial plans may sleep when idle; open the screen page a few minutes before class to wake it.
4. **Your own server.** Deploy it anywhere that runs Node (or Render/Railway/Fly). If it sits behind a proxy, keep response buffering off for `/events` (Server-Sent Events).

If the QR ever shows the wrong address, add `&join=https://your-public-url` to the screen link.

## Guide: Master Lin calls in

At every step an original character, **Master Lin (林师傅 Lín shīfu)**, "phones" the projector: a ringing incoming-call card slides in on the right, he picks up, and his instructions appear as subtitles while the browser's built-in voice reads them (a Chinese greeting is spoken only if a Chinese voice is installed; Chrome on a laptop usually has one). The music dips while he talks. **G** or the ☎ button turns him on/off, **Esc** hangs up. Edit his lines at the top of `public/guide.js`.

## Music

Press **♪ Music** (or **M**) on the projector page for original generative background music: guzheng-style plucked strings in the Chinese pentatonic scale. The music switches with the day — each scene has its own track (Morning market, Rush hour, Street, Waiting room, Under watch, Night, Reflection), with a short glissando at each change; the button shows the current track. Press **N** to skip to the next track by hand. To use your own licensed track instead, put it at `public/music.mp3`.

When you press Next from the lobby to the first scene, the projector plays a start jingle (`public/start.mp3`) with a full-screen 开始 *kāishǐ* ("begin") flash, and ducks the background music while it plays. Replace or delete `public/start.mp3` to change or silence it.

## Presenting

- **→ / Space / PageDown**: next step (works with a presentation clicker). **← / PageUp**: back. **h**: hide controls.
- The order: lobby → 8 × (scene → reveal) → “One person, one file” finale → anonymity test → meta reveal → 3 × (poll → results) → end.
- The file finale merges each player’s choices and real device data into a police-style profile with system inferences, “key person” tags (petitioner, undermines stability, court defaulter) and Police Cloud–style alerts; the projector shows everyone’s files as a wall.
- During a **scene**, the screen shows only how many have decided (no spoilers). **Reveal** shows the bars, blocked attempts, the real fact and the China / EU / US comparison.
- On the **train** scene, if 10+ people play, one random player is on the court list of judgment defaulters and is refused a ticket.
- **Reset** wipes all players. Do a test run with 2–3 phones, then press Reset before class.

## Face scan (real camera, on-device only)

At the SIM, hospital face-pay and train-gate moments, phones ask for consent and then open the front camera. Google's MediaPipe Face Landmarker (bundled in `public/mediapipe`, Apache-2.0) finds the face, tracks landmarks and checks a blink. **No image or video leaves the phone** — only "camera / simulated / refused" and a match percentage are sent. Refusing, or no camera, gives a simulated scan.

- Camera access needs HTTPS (the cloudflared tunnel provides it; plain `http://` on Wi-Fi will fall back to simulation on most phones).
- The face model (≈3.7 MB) loads from Google's servers. To run fully offline, download it once into `public/models/`:
  `curl -o public/models/face_landmarker.task https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`

## What the "meta reveal" collects

Shown back to each player at the end: device and OS (from the user agent), browser, IP (last part masked), languages, time zone, screen size, dark mode, battery (Android Chrome), network type, CPU cores/RAM, join time, how often they left the tab, and how long they hesitated on each decision. Nothing is stored on disk.

## Sources behind the game's claims

- Face scans for new SIM cards since 1 Dec 2019; ID for phone numbers since 2010; real-name social media since 2017 — MIT Technology Review (2019), SCMP (2025)
- Cyberspace ID launched 15 July 2025 (MPS + CAC), accepted by WeChat, Taobao, Douyin — SCMP, Business Standard (2025)
- Didi fined ¥8.026bn (2022) incl. excessive location collection — Infosecurity Magazine, Rödl & Partner, MERICS
- Social credit = mainly blacklists (court list of judgment defaulters), not one score — Logic Magazine / Shazeda Ahmed; Foreign Policy (2018)
- Weibo shows users' province from IP (since April 2022) — Al Jazeera, CNN (2022)
- Consultations often in the same room as other patients — UK government, "Medical treatment in China"
- Zhengzhou red health codes for 1,317 Henan bank depositors (June 2022), officials punished — Sixth Tone
- Travel code switched off 13 Dec 2022 — The Nanjinger
- Hotels can no longer force face scans; ID registration still required (Shanghai, April 2024) — RFA
- National Intelligence Law (2017), Art. 7 — China Law Translate
- Face-recognition station gates (ID card + face, no ticket shown) — China Daily (2019)
- Shenzhen road cameras capture plates and drivers' faces — SCMP
- “One person, one file” police software tenders in 22 of 31 provinces — Reuters via Euronews (2022)
- Police Cloud, 7 “key personnel” categories, hotel-stay alerts — Human Rights Watch (2017)
- Grid management (≈1M grids, 4.5M grid workers in COVID) — Wikipedia summary of academic sources
- QR/mobile wallets vs cash in Chinese shops (projector, breakfast scene): wallets 36% (2017), 48% (2019), 54% (2021), 66% (2023), 79% (2027 forecast) of in-store spending; cash 10.3% (2021), 7% (2023), 3% (2027 forecast) — Worldpay Global Payments Reports 2018–2024. Mobile-payment users 469M (2016) → 583M (2018); 75.4% of internet users aged 60+ use mobile payment (June 2024) — CNNIC
- Core Socialist Values slogans on the projector banner are the official 12 values
- Face-scan medical insurance payment, nationwide in ~3 years — NHSA via english.gov.cn (Jan 2026)
- TikTok fined €530m for EU data transfers to China (May 2025) — Irish DPC
- Poland prepaid SIM registration (2016 anti-terror law, deadline Feb 2017) — Kraków Post, EDRi
- No US federal privacy law; ~20 state laws (2026) — Enzuzo, AGG, IAPP tracker
- 2018 Chinese survey: 82.2% support CCTV, 61.1% internet monitoring, 53%+ intelligence on everyone — Journal of Information Technology and Politics (2022)
- Chinese respondents worry more about companies than the state — A. MacDonald (Duke Kunshan), Cambridge Centre for Geopolitics (2023)
- Chinese citizens broadly accept government face-recognition cameras — Fan & Wu, Asia Pacific Journal of Public Administration (Fudan)

QR code library: qrcode-generator by Kazuhiko Arase (MIT).
