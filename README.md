# A Day in Shanghai — live classroom data-privacy game

Everyone scans a QR code and lives through eight documented real-life situations as a Chinese resident. Every moment offers clearly different strategies, tagged on the phone (⚡ Quick, 🛡 Private, ✊ Push back, 🛋 Comfort, 💸 Cheap…): SIM registration with a face check, WeChat Pay / Alipay, the commute, a Weibo post, a hospital visit, the 2022 health code (Zhengzhou red-code case), a 12306 train with face-check gates, and a hotel night. Each choice shows up live on the projector: what is collected, who holds it (China Mobile, Tencent, Ant Group, Didi, Weibo, 12306…) and whether the state gets it automatically or can demand it, and how the same moment works in the EU/Poland and the US. Then come an anonymity test, a "this game was tracking you too" reveal, and three class polls compared with Chinese survey data.

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

## Side quest: inform on a classmate

Right after the Weibo scene, **Teacher Jan (扬老师), the class counsellor (辅导员)**, phones every player privately: the phone rings and vibrates, they accept, and she asks who in the group complained online, offering +50 points. Players tap a classmate's name or refuse. The projector only shows how many have answered; the next step reveals how many reported someone, how many refused, the most-reported names, and real facts about student informants (学生信息员) in Chinese universities. Reporting or refusing also appears in each player's file at the end.

## Banned or allowed? (flip cards)

After the Weibo scene, every phone gets 12 cards — 7 censored (Winnie the Pooh, “empty chair”, “May 35th”, “I disagree”, the letter N, “lying flat”, Peng Shuai) and 5 trick cards that are allowed (“Democracy”, “Freedom”, “Xi Jinping”, “Tiananmen”, panda). Tap **Banned** or **Allowed** and the card flips to show the real story. The projector shows how the room voted; press **F** (or the console button) to flip all cards.

## Jaywalker caught

After the commute, the projector flashes a “jaywalker shame screen” with a random player's name, a masked ID number and a pixelated face — like Shenzhen's LED screens from April 2017 (13,930 people shown at one crossing in 10 months; in 2018 Ningbo's system “caught” Dong Mingzhu's face on a bus advert). The caught player's phone says so; everyone else gets a quick quiz.

## Quizzes and consequences

Every talk slide (intro, data scale, camera history, each debrief, the case for it, jaywalker) has a one-tap quiz on the phones with instant right/wrong and the explanation. Earlier choices also come back later in the day: a street SIM freezes your WeChat Pay at breakfast, the protest repost triggers a KEY PERSON alert at the train gate, being reported delays your 12306 ticket, refusing the self-criticism brings a grid worker to your gate, and the Zhengzhou trip gets you a police visit at the hotel. The phone always says “Because you … earlier”.

## Guess the number

On every explain slide, phones get a quick “guess the number” question (e.g. *How many mobile phone subscriptions does China have?* 900 million / 1.3 billion / 1.8 billion). The projector shows how many have guessed; after the scene, the results screen and every phone reveal the answer and the share of the room that got it right.

## Warning calls: Secretary Lin

**Secretary Lin (林书记 Lín shūjì)** is an original character: the local Communist Party secretary of your community (社区党委书记). He phones the projector — and the rule-breaker's own phone, where they can sign a self-criticism or hang up — only when someone does something against the rules: asking to skip the SIM face scan, reposting the protest video, walking in without a health code, going to Zhengzhou, buying from a ticket tout, or being on the court debtor list. A ringing call card slides in, he names the players who did it, and speaks in Mandarin while English captions appear. New offenders are batched into one call per offence, and calls queue one after another.

- **Voice (ElevenLabs).** In Railway → *Variables*, set `ELEVENLABS_API_KEY`. Optional: `ELEVENLABS_VOICE_ID` (pick a native Mandarin male voice in the ElevenLabs voice library; the default is a generic premade voice) and `ELEVENLABS_MODEL` (default `eleven_multilingual_v2`). Only the host screen (with `?key=`) can request speech, and each line is cached in memory.
- Without a key, the browser's built-in Chinese voice is used if the laptop has one; otherwise captions only.
- **G** or the ☎ button turns calls on/off, **Esc** hangs up. Lines are at the top of `public/guide.js`.

## Music

Press **♪ Music** (or **M**) on the projector page for original generative background music: guzheng-style plucked strings in the Chinese pentatonic scale. The music switches with the day — each scene has its own track (Morning market, Rush hour, Street, Waiting room, Under watch, Night, Reflection), with a short glissando at each change; the button shows the current track. Press **N** to skip to the next track by hand. To use your own licensed track instead, put it at `public/music.mp3`.

When you press Next from the lobby to the first scene, the projector plays a start jingle (`public/start.mp3`) with a full-screen 开始 *kāishǐ* ("begin") flash, and ducks the background music while it plays. Replace or delete `public/start.mp3` to change or silence it.

## Presenting

- **→ / Space / PageDown**: next step (works with a presentation clicker). **← / PageUp**: back. **h**: hide controls.
- The order: lobby → **intro: what is privacy?** (definition, 1890–2021 timeline, EU / US / China models) → **every day in China** (live-ticking data counters) → 8 × (**explain → play → results → debrief**) → “One person, one file” finale → anonymity test → meta reveal → 3 × (poll → results) → end.
- **Explain** and **debrief** steps are presenter slides inside the game: three key points, a question to ask the room (before) or a political-science angle (after). Phones show “eyes on the big screen” during these.
- **Presenter console:** open `/present?key=<HOST_KEY>` on your laptop screen (projector shows `/screen?key=…`). It shows your speaker notes for the current step, what's next, live answer counts, who Secretary Lin is about to call, a timer, and Back/Next buttons. Click any line in the run of show to jump there. Arrow keys work in both windows.
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
- "The case for it" step: 94% feel safe walking alone at night in China (3rd in the world) vs 73% world, 71% US, 68% Poland — Gallup Global Safety Report 2025; homicide rate 0.5 per 100k (China 2020) vs Poland 0.68, US 5.8 — UNODC; 89% account ownership, 82% digital merchant payments (2021) — World Bank Global Findex; 95.5% satisfied with central government (2016) — Harvard Ash Center; ~80% of internet users approve of social credit systems (2018) — FU Berlin (Kostka); Mao Yin reunited after 32 years via facial recognition (2020) — AP/ABC
- Side quest: university student-informant teams since 2008, ¥20–200 per report, lecturers disciplined in 2018 after student reports — China Media Project (2018); up to ≈$15,000 for national-security tips (2022 MSS rules) — China Digital Times
- Every day in China: 41.06 ZB of data in 2024 — National Data Administration via Xinhua (2025); 306bn non-bank online payments in Q1 2025 — PBOC; 45bn WeChat messages and 410M calls a day (2018) — Tencent via Caixin; 174.5bn parcels in 2024 — State Post Bureau via Jiemian
- Anonymity / fingerprinting facts: Sweeney (2000); de Montjoye et al., Scientific Reports (2013); Eckersley, EFF Panopticlick (2010)
- How the cameras came (before the commute): Skynet 2005, Sharp Eyes 2015 "100% coverage by 2020" — IPVM; 40,000 cameras in Urumqi after the 2009 riots (197 dead) — Washington Post via China Digital Times (2010); IJOP app — Human Rights Watch (2019); "may constitute crimes against humanity" — OHCHR (2022)
- "Card-breaking" campaign (断卡行动) against traded SIM cards and bank accounts since October 2020 — Caixin (2024); internet cafés: real-name registration and face-recognition pilots — Identity Week / China Daily (2016)
- Jaywalker screens: Sophos Naked Security (2018), SCMP (2018), Biometric Update (2018); censored words: HuffPost UK (2018), CS Monitor / Global Voices (2010), Hong Kong Free Press (2021), Wikipedia/Reclaim The Net on “lying flat” (2021)
- Core Socialist Values slogans on the projector banner are the official 12 values
- Face-scan medical insurance payment, nationwide in ~3 years — NHSA via english.gov.cn (Jan 2026)
- TikTok fined €530m for EU data transfers to China (May 2025) — Irish DPC
- Poland prepaid SIM registration (2016 anti-terror law, deadline Feb 2017) — Kraków Post, EDRi
- No US federal privacy law; ~20 state laws (2026) — Enzuzo, AGG, IAPP tracker
- 2018 Chinese survey: 82.2% support CCTV, 61.1% internet monitoring, 53%+ intelligence on everyone — Journal of Information Technology and Politics (2022)
- Chinese respondents worry more about companies than the state — A. MacDonald (Duke Kunshan), Cambridge Centre for Geopolitics (2023)
- Chinese citizens broadly accept government face-recognition cameras — Fan & Wu, Asia Pacific Journal of Public Administration (Fudan)

QR code library: qrcode-generator by Kazuhiko Arase (MIT).
