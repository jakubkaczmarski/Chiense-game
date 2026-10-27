// Shared game content — used by the server, the phones and the projector.
// Every scene is a documented real-life situation; sources are listed in README.md.
// Receipts show: what is collected (logs), who holds it (to), and how the state gets it (state).
//   state: "direct"  = sent to police / government automatically
//          "demand"  = held by a company; police and state security can demand it
//                      (Cybersecurity Law 2017; National Intelligence Law 2017, Art. 7)
//          "none"    = nothing worth noting
(function (root) {
  const SCENES = [
    {
      id: "sim",
      guess: {"q": "How many mobile phone subscriptions does China have?", "options": ["900 million", "1.3 billion", "1.8 billion"], "correct": 2, "answer": "1.83 billion (2025) — 130 per 100 people"},
      brief: {"tldr": "Your phone number = your ID = your face.", "title": "Real-name registration", "points": ["Since 2010 every Chinese phone number must be registered to an ID card; the 2017 Cybersecurity Law made real names mandatory online.", "Since 1 December 2019 a face scan is also required for every new SIM card.", "Your number is the master key: WeChat, Alipay, your bank and 12306 train tickets all log in with it."], "ask": "Who here had to show ID to get their SIM card?", "notes": "Poland has required ID for prepaid SIMs since the 2016 anti-terror law (deadline Feb 2017), so the class has done a version of this. The US still sells anonymous prepaid SIMs. Point out the difference is not registration itself but what the link can be used for later."},
      debrief: {"pro": "Supporters say: real names make scams, trolling and threats traceable — the same argument Poland used for its 2016 SIM registration law.", "tldr": "Real names make everything traceable \u2014 Europe registers too, the rules differ.", "title": "Anonymity ends at the SIM card", "points": ["The face check ties a biometric template to your ID — the anchor every other database hooks into.", "Real names make online speech traceable: accountability for the state, self-censorship for users.", "Europe registers SIMs too; the difference is what may be done with that link later (GDPR purpose limits, courts)."], "ir": "Identity infrastructure is state capacity: whoever controls the ID layer can govern everything built on top of it.", "notes": "Ask: is a registered SIM in Poland really so different? Push them toward 'who can access it and under what rules'."},
      nums: {"chain": ["Phone number", "+", "ID card", "+", "Your face", "=", "Train ticket", "WeChat / Alipay", "Hospital", "Hotel"], "items": [["1.83bn", "mobile phone subscriptions — 130 per 100 people (2025)"], ["1 Dec 2019", "new SIM cards need a face scan matched to your ID"], ["Apr 2020", "paper tickets gone on all high-speed rail — your ID + face is the ticket"], ["1.44bn", "people use WeChat every month — signed up with this number (2026)"]], "src": "MIIT 2025 bulletin via China News Service (2026); China Daily (2019, 2020); Tencent Q2 2026 results."},
      word: { zh: "实名制", py: "shímíngzhì", en: "real-name system", note: "Every phone number, account and ticket is tied to your real ID." },
      clock: "07:30",
      cams: ["kiosk"],
      title: "Get a phone number",
      story: "You just moved to Shanghai for a new job. First task: a phone number. WeChat, Alipay, your bank and every delivery app need one.",
      why: "Since 2010 every Chinese phone number must be registered to an ID card. Since 1 December 2019 carriers must also scan your face and match it to the ID photo. You can do it in a shop or in the carrier's app — but you can't skip it. There is a black market for SIM cards registered to other people, mostly used by scam gangs.",
      options: [
        {
          id: "app", kind: "quick", label: "Order a SIM in the China Unicom app", face: "enrol",
          outcome: "ok",
          result: "You photograph both sides of your ID card and record a short face video in the app. The SIM arrives by courier the same day.",
          logs: ["Photo of both sides of your ID card", "Face video matched to your ID photo", "Delivery address"],
          to: ["chinaunicom"], state: "demand"
        },
        {
          id: "refuse", kind: "private", label: "Go to a store, show your ID — but refuse the face scan",
          outcome: "blocked",
          result: "The clerk shakes her head: since December 2019 no carrier may issue a number without a face check. No scan, no SIM.",
          logs: [], to: [], state: "none"
        },
        {
          id: "black", kind: "rebel", label: "Buy a SIM already registered to someone else, from a street seller",
          outcome: "consequence",
          result: "It works — for a week. Since the 2020 “card-breaking” campaign (断卡行动) police hunt traded SIMs used by scam gangs. The number is cut off, and you and the real owner are flagged.",
          logs: ["SIM registered to a stranger's ID — linked to you by phone location", "Flagged in the anti-fraud system"],
          to: ["chinamobile", "police"], state: "direct"
        }
      ],
      explain: "ID has been required for every phone number since 2010. Since 1 Dec 2019 carriers must also verify your face. Your number then becomes your real-name key for every app.",
      compare: {
        cn: "ID + mandatory face check, in store or in the app.",
        eu: "Poland has required ID for prepaid SIMs since 2016–17 (anti-terror law). No face scan.",
        us: "No SIM registration law. Prepaid SIMs can be bought with cash and no ID."
      }
    },
    {
      id: "breakfast",
      guess: {"q": "What share of in-store spending in China was paid in cash in 2023?", "options": ["7%", "25%", "45%"], "correct": 0, "answer": "Just 7% — QR wallets took 66%"},
      brief: {"tldr": "China went from cash to QR in a decade \u2014 two firms see every purchase.", "title": "A cashless society", "points": ["QR wallets paid for about 66% of in-store spending in 2023; cash was down to about 7%.", "Two companies run the rails: Tencent (WeChat Pay) and Ant Group (Alipay).", "Both require your real name and a Chinese bank card — every jianbing is a named record."], "ask": "When did you last pay with cash?", "notes": "Point to the chart on the right of the next screen. Mention tourists struggled so much that in 2024 Beijing pushed to make foreign cards and cash easier to use."},
      debrief: {"pro": "World Bank: 89% of Chinese adults have a financial account and 82% pay merchants digitally (2021) — QR codes brought street vendors and villages into the system.", "tldr": "Payment data is a diary; Beijing reined in Ant Group to control it.", "title": "Your wallet is a diary", "points": ["Payment history reveals routine, location, health, relationships and income.", "Cash is still legal tender and the central bank says refusing it is illegal — yet it is now the privacy option, not the normal one.", "The digital yuan (e-CNY) promises only “controllable anonymity”: small payments private, the central bank can still see the rest."], "ir": "Platform power vs Party power: in 2020 Beijing halted Ant Group's record IPO and brought fintech under central-bank control — data is too strategic to leave to private firms.", "notes": "Ant Group's IPO was suspended in November 2020, days before listing, after Jack Ma criticised regulators."},
      word: { zh: "扫码", py: "sǎo mǎ", en: "scan the code", note: "How China pays: point your phone at a QR code." },
      clock: "08:10",
      cams: [],
      stats: {
        title: "QR wallets vs cash in Chinese shops",
        sub: "Share of in-store spending (by value)",
        years: ["2017", "2019", "2021", "2023", "2027*"],
        wallet: [36, 48, 54, 66, 79],
        cash: [null, null, 10.3, 7, 3],
        facts: [
          ["469M → 583M", "mobile-payment users, 2016 → 2018 (CNNIC)"],
          ["75%", "of internet users aged 60+ pay by phone (CNNIC, June 2024)"]
        ],
        src: "Worldpay Global Payments Reports 2018–2024 · *forecast · cash share not reported for 2017/2019"
      },
      title: "Breakfast",
      story: "A jianbing stand outside your building. ¥7. A WeChat Pay QR code is taped to the cart. Or you could just order it on Meituan and eat at your desk.",
      why: "In a decade China went from cash to QR codes. To use WeChat Pay or Alipay you must first verify your real name and link a Chinese bank card. Delivery apps like Meituan add your address and habits. Cash is still legal tender and shops may not refuse it — but almost nobody uses it.",
      options: [
        {
          id: "wechat", kind: "quick", label: "Scan the WeChat Pay QR code on the cart",
          outcome: "ok", result: "Paid in two seconds.",
          logs: ["¥7.00 · street food stall · 08:12", "Linked to your real-name WeChat account and bank card"],
          to: ["tencent"], state: "demand"
        },
        {
          id: "delivery", kind: "comfort", label: "Order it on Meituan, delivered to your desk",
          outcome: "ok", result: "Arrives in 25 minutes. Meituan now knows where you work, when you eat and what you like.",
          logs: ["Delivery address: your office, 32nd floor", "Order history: jianbing, extra egg, 08:40", "Rider's GPS route to your door"],
          to: ["meituan"], state: "demand"
        },
        {
          id: "cash", kind: "private", label: "Pay with cash",
          outcome: "ok", result: "The vendor takes it — she has to by law — and digs for change in a tin. The person behind you sighs.",
          logs: [], to: [], state: "none"
        }
      ],
      explain: "Mobile payment is near-universal in Chinese cities. The People's Bank of China has warned shops that refusing cash is illegal — cash is now the privacy option, not the normal one.",
      compare: {
        cn: "Two companies, Tencent and Ant Group, see almost every everyday purchase.",
        eu: "Your bank and the card network see card payments. GDPR limits reuse; cash is still common.",
        us: "Banks and card networks can share purchase data with marketers; no federal privacy law limits it."
      }
    },
    {
      id: "metro",
      guess: {"q": "Cameras per 1,000 people in Chongqing, the world's most-watched city?", "options": ["18", "68", "168"], "correct": 2, "answer": "168 per 1,000 people"},
      brief: {"tldr": "Commuting = cameras, QR gates and GPS logs.", "title": "The watched commute", "points": ["Shanghai's rail network carries about 10 million trips a day; the metro QR app runs through your WeChat or Alipay account.", "Chongqing has around 168 cameras per 1,000 people — the most-watched city measured.", "Ride-hailing apps log your exact pickup, route and drop-off."], "ask": "How many cameras do you think you passed this morning?", "notes": "Even the 'anonymous' choice — a transport card bought with cash — still passes station cameras. Watch the camera feed on the next screen."},
      debrief: {"pro": "Gallup: 94% of people in China feel safe walking alone at night — 3rd in the world, vs 71% in the US and 68% in Poland (2024).", "tldr": "Location data is power \u2014 Didi's fine shows data = national security.", "title": "Location is the most revealing data", "points": ["Didi was fined ¥8.026bn in 2022 for illegally processing 64.7bn pieces of personal data, incl. 107M face scans.", "The punishment started days after Didi listed in New York (2021) — data became a national-security issue.", "China's Data Security Law (2021) and PIPL (2021) now regulate companies strictly — but not the state's own access."], "ir": "Data as geopolitics: Beijing feared Didi's maps reaching US regulators; Washington fears TikTok's data reaching Beijing. Same logic, opposite direction.", "notes": "Good moment to link to the TikTok debate in the US and the €530m Irish DPC fine on TikTok (2025)."},
      nums: {"items": [["10.2M", "rail-transit trips a day in Shanghai (2025)"], ["64.7bn", "pieces of personal data Didi processed illegally"], ["107M", "passenger face scans Didi over-collected — plus 167M precise locations"], ["168 / 1,000", "cameras per 1,000 people in Chongqing — the world’s most-watched city (2019)"]], "src": "Shanghai Transport via The Paper (2026); CAC Q&A on the ¥8.026bn Didi fine (2022); Comparitech via SCMP."},
      word: { zh: "天网", py: "tiānwǎng", en: "“Sky Net”", note: "The official name of China’s national CCTV network." },
      clock: "08:40",
      cams: ["street", "traffic"],
      title: "Commute",
      story: "Your office is across the river in Lujiazui. Rush hour.",
      why: "Every way of getting around leaves a trail. The metro QR code is tied to your account, Didi stores your route, and the city is covered by cameras — in Shenzhen, road cameras capture number plates and drivers' faces to check licences.",
      options: [
        {
          id: "qr", kind: "quick", label: "Metro, with the QR code in the Metro Daduhui app",
          outcome: "ok", result: "Beep. Through the gate.",
          logs: ["Entered Jing'an Temple 08:41 → exited Lujiazui 09:02", "Ride history tied to your phone number"],
          to: ["metro"], state: "demand"
        },
        {
          id: "card", kind: "private", label: "Metro, with a transport card bought with cash",
          outcome: "ok", result: "No account, no name. The station cameras still record you.",
          logs: ["Station CCTV recording"],
          to: ["metro", "police"], state: "direct"
        },
        {
          id: "taxi", kind: "comfort", label: "Order a Didi",
          outcome: "ok", result: "Your Didi arrives in 3 minutes.",
          logs: ["Pickup and drop-off addresses", "Full GPS route of the ride"],
          to: ["didi"], state: "demand"
        }
      ],
      explain: "In 2022 regulators fined Didi ¥8 billion (≈€1.2bn) — partly for excessive collection of passengers' location data. China restricts companies hard. Its own cameras are another story.",
      compare: {
        cn: "Strict rules for companies (the Didi fine), few limits on state cameras.",
        eu: "The EU AI Act bans police real-time face recognition in public, with narrow exceptions.",
        us: "No federal rule. Some cities ban police face recognition; others use it."
      }
    },
    {
      id: "post",
      guess: {"q": "How many accounts were removed in ONE 2022 internet clean-up campaign?", "options": ["68,000", "680,000", "6.8 million"], "correct": 2, "answer": "6.8 million accounts and 54 million posts"},
      brief: {"tldr": "Social media runs on real names and shows your province.", "title": "Real-name social media", "points": ["China has about 1.1 billion internet users; Weibo has about 560 million a month.", "Accounts are tied to your real name; since April 2022 Weibo shows every user's province.", "Everyday complaints are allowed — the question is what crosses the line."], "ask": "Would you post the same things if your name and location were shown?", "notes": "Let them choose without hints. The 'complain about the metro' option is fine in real life — that surprises people."},
      debrief: {"pro": "Supporters say: real names cut online fraud, harassment and panic-causing rumours.", "tldr": "Venting is allowed; organising gets deleted.", "title": "Censorship is mostly invisible", "points": ["In one 2022 clean-up campaign alone, 6.8 million accounts and 54 million posts were removed.", "Research (King, Pan & Roberts) found censors delete calls for collective action more than criticism.", "Consequences escalate: removal, account ban, then being “invited to tea” (喝茶) by police."], "ir": "Authoritarian resilience: let people vent, stop them organising. Complaints give the state information; protests threaten it.", "notes": "Li Wenliang (Wuhan, 2020) is the clearest case — warned colleagues on WeChat, made to sign a police letter. Secretary Lin may have just called someone."},
      nums: {"items": [["1.125bn", "internet users in China (end 2025)"], ["561M", "people use Weibo every month (June 2026)"], ["Apr 2022", "Weibo began showing every user’s province — you can’t turn it off"], ["6.8M", "accounts and 54M posts removed in one year of the “Qinglang” clean-up (2022)"]], "src": "CNNIC 57th report via ECNS (2026); Weibo Q2 2026 results (SEC); Reuters (2022); Cyberspace Administration of China (2023)."},
      word: { zh: "被和谐", py: "bèi héxié", en: "“to be harmonised”", note: "Slang for being censored — from the official goal of a 和谐社会, harmonious society." },
      clock: "12:30",
      cams: [],
      title: "Lunch break on Weibo",
      story: "Your metro was 20 minutes late this morning. You open Weibo — your account is verified with your phone number, so with your real name.",
      why: "Social media accounts in China must be real-name registered (since 2017). Everyday complaints are normal and tolerated. Content about sensitive political topics gets removed. Since 2022 Weibo shows every user's province, based on their IP address.",
      options: [
        {
          id: "lunch", kind: "safe", label: "Post a photo of your lunch",
          outcome: "ok", result: "12 likes. Under your name it says “IP属地: 上海” — IP location: Shanghai.",
          logs: ["Post published under your real-name account", "Your province shown publicly"],
          to: ["weibo"], state: "demand"
        },
        {
          id: "complain", kind: "voice", label: "Complain about the late metro",
          outcome: "ok", result: "Posted. Complaints like this are everyday content on Weibo.",
          logs: ["Complaint published under your real-name account", "Your province shown publicly"],
          to: ["weibo"], state: "demand"
        },
        {
          id: "sensitive", kind: "rebel", label: "Repost a video of a local protest",
          outcome: "consequence", result: "Removed. The notice says it “violates relevant laws and regulations”.",
          logs: ["Repost deleted by content moderation", "Account flagged"],
          to: ["weibo"], state: "demand"
        }
      ],
      explain: "Real-name registration has been required on social media since 2017. Platforms must remove illegal content themselves — so moderation happens inside the company, quickly.",
      compare: {
        cn: "Real name behind every account. Political content removed. Province shown publicly.",
        eu: "The Digital Services Act: platforms must explain removals and let you appeal. You can stay pseudonymous.",
        us: "The First Amendment stops government censorship. Platforms moderate as they like."
      }
    },
    {
      id: "doctor",
      guess: {"q": "How many people have activated China's medical-insurance QR code?", "options": ["100 million", "500 million", "Over 1 billion"], "correct": 2, "answer": "1.08 billion (Jan 2024)"},
      brief: {"tldr": "Health records run through WeChat and QR codes.", "title": "Health data", "points": ["About 1.33 billion people have basic medical insurance; over 1 billion activated its QR “e-code”.", "Hospitals book through WeChat accounts with your ID number; face-scan payment is spreading.", "Consultations often happen with the next patients waiting in the same room."], "ask": "Who should be allowed to see your medical records?", "notes": "Ask if anyone has been to a doctor in China — the open-room experience surprises Europeans."},
      debrief: {"pro": "Supporters say: WeChat booking and the insurance QR code replace hours of queueing, and one code works anywhere in the country.", "tldr": "Health data is legally 'sensitive' \u2014 and leaks anyway.", "title": "Sensitive data, weak walls", "points": ["China's PIPL (2021) treats medical data as “sensitive” — separate consent required.", "In practice leaks happen: a hospital's own software contractor stole 2.88M booking records.", "EU: GDPR special category. US: HIPAA covers doctors and insurers — but not most health apps."], "ir": "Health data has always served state campaigns — from the one-child policy to zero-COVID.", "notes": "Bridge to the next scene: the health code was health data turned into a movement permit."},
      nums: {"items": [["1.33bn", "people covered by basic medical insurance (2025)"], ["1.08bn", "activated the medical-insurance QR “e-code” (Jan 2024)"], ["45.7%", "of insurance payments at one top Zhejiang hospital went through the e-code (2023)"], ["2.88M", "patients’ booking records stolen by a hospital’s own software contractor"]], "src": "Xinhua (2026); People’s Daily (2024); Supreme People’s Court case examples via Xinhua (2026)."},
      word: { zh: "刷脸", py: "shuā liǎn", en: "“swipe your face”", note: "Pay, enter or check in with your face instead of a card." },
      clock: "14:00",
      cams: ["kiosk:pay"],
      title: "Doctor's visit",
      story: "A rash that won't go away. You take the afternoon off to see a dermatologist at a big public hospital.",
      why: "Big public hospitals are crowded, so most patients book through the hospital's WeChat account with their ID number and medical insurance card. Since January 2026 China is rolling out face-scan payment for medical insurance. Privacy inside the consulting room is often limited.",
      options: [
        {
          id: "wechat", kind: "quick", label: "Book in the hospital's WeChat account",
          outcome: "ok",
          result: "Booked with your ID number. In the consulting room, the next patients wait inside while you describe your rash.",
          logs: ["Appointment linked to your ID number", "Diagnosis stored with your medical insurance record"],
          to: ["hospital", "tencent"], state: "demand"
        },
        {
          id: "counter", kind: "private", label: "Queue at the counter with your insurance card",
          outcome: "ok",
          result: "Two hours of queueing. Same doctor, same crowded room.",
          logs: ["Registration linked to your insurance card", "Diagnosis stored with your medical insurance record"],
          to: ["hospital"], state: "demand"
        },
        {
          id: "face", kind: "future", label: "Pay at the face-scan terminal", face: "pay",
          outcome: "ok",
          result: "No card, no phone. You look at the screen and the insurance pays.",
          logs: ["Face matched to your medical insurance account", "Diagnosis stored with your medical insurance record"],
          to: ["hospital", "insurance"], state: "demand"
        }
      ],
      explain: "The UK government warns travellers that in China a consultation may happen in the same room as other patients and their families. Face-scan payment for medical insurance is being rolled out nationwide, aiming for full coverage in about three years.",
      compare: {
        cn: "Face-scan insurance payment spreading. Consultations often shared with other patients.",
        eu: "Health data is a GDPR “special category” (Art. 9). One patient per room is the norm.",
        us: "HIPAA protects data held by doctors and insurers — but not most health apps."
      }
    },
    {
      id: "healthcode",
      guess: {"q": "How many times was WeChat's health code shown?", "options": ["2 million", "200 million", "20 billion"], "correct": 2, "answer": "Over 20 billion times, by 800 million people"},
      brief: {"tldr": "A colour on your phone decided where you could go.", "title": "Pandemic tracking", "points": ["From 2020 to 2022 a green, yellow or red code decided where you could go.", "WeChat's health code alone had about 800 million users and 20 billion displays.", "The NYT found Alipay's code appeared to send data to the police."], "ask": "Would you accept a tracking app during a pandemic?", "notes": "Many students remember lockdowns; ask how it felt to scan into every shop in Poland? (Poland used no such system.)"},
      debrief: {"pro": "Supporters say: fast tracing let most of China live fairly normally for much of 2020–21 while other countries were in lockdown.", "tldr": "Emergency tools get misused \u2014 Zhengzhou 2022.", "title": "Function creep", "points": ["Zhengzhou, June 2022: 1,317 bank depositors' codes turned red to stop a protest; five officials were punished.", "The codes were switched off in December 2022, after nationwide protests against zero-COVID.", "EU contact-tracing apps were decentralised: Bluetooth, no location, no central database."], "ir": "Emergency powers outlast emergencies — the app was switched off, the infrastructure and habits remain.", "notes": "The November 2022 'A4 / white paper' protests are a good link."},
      nums: {"items": [["800M", "people used WeChat’s health code — over 20 billion displays (2021)"], ["1.2bn", "Alipay health-code uses in its first five weeks (2020)"], ["1,317", "bank depositors in Henan given red codes to stop a protest; 5 officials punished (2022)"], ["13 Dec 2022", "travel code switched off; telecoms said they would delete the data"]], "src": "KrASIA (2021); China Daily (2020); Sixth Tone (2022); Yicai Global / CNBC (2022). The NYT found Alipay’s code appeared to share data with police (2020)."},
      word: { zh: "健康码", py: "jiànkāng mǎ", en: "health code", note: "The green / yellow / red COVID code that decided where you could go." },
      clock: "2022",
      cams: [],
      title: "Flashback: the health code",
      story: "It's June 2022. To enter the metro, a mall or your office you must show a green health code in Alipay or WeChat. Your parents in Henan can't withdraw their savings — four rural banks froze all withdrawals in April.",
      why: "During COVID every resident had a green, yellow or red code. It decided where you could go. In June 2022, officials in Zhengzhou turned the codes of 1,317 bank depositors red to stop them protesting. The officials were later punished. The tracking codes were switched off in December 2022.",
      options: [
        {
          id: "scan", kind: "quick", label: "Scan the venue QR code and show your green code",
          outcome: "ok", result: "Green. The guard waves you into the office.",
          logs: ["Venue check-in: office tower, 09:02", "Health code status: green"],
          to: ["govt"], state: "direct"
        },
        {
          id: "noscan", kind: "private", label: "Walk in without scanning",
          outcome: "blocked", result: "The guard stops you at the door. No code, no entry — anywhere.",
          logs: [], to: [], state: "none"
        },
        {
          id: "zhengzhou", kind: "rebel", label: "Travel to Zhengzhou to help your parents get their money back",
          outcome: "consequence", result: "You scan the Zhengzhou code at the station. It turns red. You can't leave the station area or use the metro.",
          logs: ["Code turned red after scanning in Zhengzhou", "Movement restricted"],
          to: ["govt"], state: "direct"
        }
      ],
      explain: "This really happened: 1,317 depositors of four Henan rural banks got red codes in June 2022. Officials had given them red codes without authorisation; five were punished. It showed how a health tool could be used to control people.",
      compare: {
        cn: "Codes controlled movement for nearly three years and were misused against protesters.",
        eu: "EU COVID certificates were checked on entry but showed no location data and were not used to track people.",
        us: "No national health pass. Exposure-notification apps were voluntary and anonymous."
      }
    },
    {
      id: "train",
      guess: {"q": "Rail trips blocked for people on the court debtor list (to 2019)?", "options": ["56,000", "560,000", "5.6 million"], "correct": 2, "answer": "5.61 million rail trips"},
      brief: {"tldr": "Your ID + face is your train ticket.", "title": "Your face is the ticket", "points": ["Chinese railways handled about 4.6 billion trips in 2025 — every ticket is in your real name.", "Since 2020 there are no paper tickets on high-speed rail: the gate reads your ID and checks your face.", "A face-check gate takes about 3 seconds."], "ask": "Would you trade your face for a faster gate?", "notes": "With 10+ players, one random person is on the court debtor list and will be refused a ticket."},
      debrief: {"pro": "FU Berlin survey (2018): about 80% of Chinese internet users approved of social credit systems, seeing them as a source of reliable information.", "tldr": "'Social credit' is blacklists, not one score.", "title": "“Social credit” = blacklists", "points": ["There is no single national citizen score — it's mostly court and regulatory blacklists.", "People on the court list of judgment defaulters were blocked from 5.6 million rail trips (to 2019).", "Most entries target unpaid debts and companies — but restricting movement is a powerful tool."], "ir": "Myth vs reality: Western media's 'Black Mirror score' is wrong, yet the real system shows how data turns into control over movement.", "notes": "Good place to bust the social-credit myth (Logic Magazine / Shazeda Ahmed; Foreign Policy 2018)."},
      nums: {"items": [["4.59bn", "rail passenger trips in 2025 — every ticket in a real name"], ["3 sec", "to pass a face-check gate: ID card + face, no ticket (2018)"], ["5.61M", "rail trips blocked for people on the court debtor list (to 2019)"], ["502", "banned debtors caught using passports to dodge the ban — 8,000+ trips (2025)"]], "src": "gov.cn (2026); National Business Daily (2018); China Daily (2019); Guangming Daily (2025)."},
      word: { zh: "失信被执行人", py: "shīxìn bèi zhíxíng rén", en: "“person who broke trust”", note: "The official term for someone on the court list of judgment defaulters." },
      clock: "18:30",
      cams: ["gate"],
      title: "Train home",
      story: "Long weekend. You want a high-speed train to your parents' city.",
      why: "Every train ticket in China is sold to a real name — the rule was introduced to stop ticket touts. At many stations the gate reads your ID card and scans your face, so you never show a ticket. People on the court list of judgment defaulters cannot buy high-speed rail or plane tickets.",
      options: [
        {
          id: "app", kind: "quick", label: "Book on 12306, the official railway app", face: "gate",
          outcome: "ok", result: "Booked. At the station there's no ticket to show: the gate reads your ID card and checks your face.",
          logs: ["Ticket issued to your ID number", "Trip: Shanghai → hometown, Friday 19:05", "Face check at the station gate"],
          to: ["railway"], state: "demand"
        },
        {
          id: "station", kind: "private", label: "Buy at the station counter with cash", face: "gate",
          outcome: "ok", result: "Cash is fine — but you still need your ID card, and the gate still checks your face.",
          logs: ["Ticket issued to your ID number", "Trip: Shanghai → hometown, Friday 19:05", "Face check at the station gate"],
          to: ["railway"], state: "demand"
        },
        {
          id: "tout", kind: "rebel", label: "Buy a ticket from a tout outside the station",
          outcome: "blocked", result: "Useless: the name on the ticket must match the ID card you show at the gate.",
          logs: [], to: [], state: "none"
        }
      ],
      blacklist: "Purchase refused. Your ID is on the Supreme People's Court list of judgment defaulters (an unpaid court judgment). High-speed rail and flights are blocked.",
      explain: "This is the real “social credit system”: not one score per citizen, but mainly blacklists. People who ignore court judgments end up on a national list and can't buy plane or high-speed rail tickets.",
      compare: {
        cn: "Real-name tickets, face-check gates, court blacklists that block travel.",
        eu: "No national travel blacklist. For most trains a ticket is just a ticket.",
        us: "No rail blacklist. The No Fly List exists — for planes."
      }
    },
    {
      id: "night",
      guess: {"q": "How many hotel guests' data leaked from China's Huazhu group in 2018?", "options": ["1.3 million", "13 million", "130 million"], "correct": 2, "answer": "130 million guests, ~500 million records"},
      brief: {"tldr": "Every hotel sends your ID to the police.", "title": "Where you sleep", "points": ["Hotels must check every guest's ID and pass it to the local police.", "In 2018 data on 130 million Huazhu hotel guests leaked.", "Since June 2025 hotels may not force a face scan if you show ID."], "ask": "Have you ever handed over your passport at a hotel abroad?", "notes": "EU hotels also register foreign guests (Schengen rules) — so again the question is what happens to the data."},
      debrief: {"pro": "In 2020 facial recognition and police databases helped reunite Mao Yin with his parents — 32 years after he was abducted as a toddler (AP).", "tldr": "Joining databases turns daily life into one file.", "title": "Data fusion", "points": ["Police systems (“Police Cloud”) flag “key persons” when they check into a hotel or buy a ticket.", "In 2022 a hacker offered a Shanghai police database on ~1 billion people for 10 bitcoin.", "The real power is not one camera but connecting phone, payment, travel and hotel records."], "ir": "Surveillance as a system: each database is ordinary; joined together they make one person, one file (一人一档).", "notes": "Next step is the file finale — tell them to look at their phones."},
      nums: {"items": [["Every guest", "hotels must check your ID and send it to local police"], ["130M", "Huazhu hotel guests’ data leaked — ~500M records (2018)"], ["1bn", "people in a Shanghai police database offered for 10 bitcoin (2022, unverified claim)"], ["Jun 2025", "nationwide: hotels can’t force a face scan if you show ID"]], "src": "Hotel Public Security Measures (gov.cn); Sixth Tone (2024); Caixin (2018); Reuters (2022); China Daily HK (2025)."},
      word: { zh: "登记", py: "dēngjì", en: "to register", note: "Hotels must 登记 every guest’s ID with the police." },
      clock: "22:30",
      cams: ["gate:compound"],
      title: "Where do you sleep?",
      story: "Drinks after work ran late. You're on the other side of the city — and it's 23:00.",
      why: "Hotels and guesthouses in China must register every guest's ID card with the police. Many used to require a face scan too — since 2024 Shanghai and other cities say they can't force one if you show a valid ID. Internet cafés (网吧) are a cheap place to crash, but they scan your ID card too — real-name internet access has been required since 2002. Many residential compounds open their gates by face recognition.",
      options: [
        {
          id: "hotel", kind: "comfort", label: "Check into a hotel nearby",
          outcome: "ok", result: "The receptionist scans your ID card. The face scan is optional now — you decline it.",
          logs: ["Guest registration sent to the local police system"],
          to: ["hotel", "police"], state: "direct"
        },
        {
          id: "wangba", kind: "cheap", label: "Sleep in a 24-hour internet café (网吧)",
          outcome: "ok", result: "¥15 for the night. You scan your ID card at the counter; the system logs your ID, your seat and the sites you visit.",
          logs: ["ID card scanned at internet café 23:05", "Browsing log tied to your ID number"],
          to: ["netcafe"], state: "demand"
        },
        {
          id: "home", kind: "quick", label: "Take a Didi home",
          outcome: "ok", result: "Your compound's gate opens when it recognises your face.",
          logs: ["Didi route across the city", "Face recognised at your compound gate 23:14"],
          to: ["didi", "compound"], state: "demand"
        }
      ],
      explain: "Hotel registration with the police is a long-standing rule. In April 2024 Shanghai police told hotels to stop forcing face scans on guests with valid ID — a small win for privacy, after public complaints.",
      compare: {
        cn: "Every hotel stay goes to the police. Face scans now optional in some cities.",
        eu: "Many EU countries require guest registration; in Spain, since 2024, hotels must send it to the Interior Ministry.",
        us: "Hotels keep guest records; police generally need legal process to get them."
      }
    }
  ];

  const POLLS = [
    {
      id: "trade",
      q: "Would you accept today's system if it made life this convenient?",
      options: ["Yes, honestly", "Only some parts", "No way"],
      china: "Surveys find many Chinese citizens accept it: a 2018 nationally representative survey found 82% support for CCTV surveillance, and even collecting intelligence on everyone got over 53%."
    },
    {
      id: "fear",
      q: "Who worries you more with your data?",
      options: ["The government", "Big tech companies", "Both equally", "Neither"],
      china: "Chinese respondents mostly worry about private companies, not the state (MacDonald, Duke Kunshan survey, 2021–23)."
    },
    {
      id: "cctv",
      q: "Should Kraków use face-recognition cameras in public spaces to fight crime?",
      options: ["Yes", "No", "Not sure"],
      china: "A Fudan University study found Chinese citizens generally willing to accept government face-recognition cameras — more so the more they trust institutions."
    }
  ];

  // Linear show order controlled by the presenter.
  const STEPS = [{ type: "lobby" }, { type: "intro" }, { type: "daily" }];
  // per scene: explain the topic (brief) → play (scene) → results (reveal) → what it means (debrief)
  SCENES.forEach((s, i) => {
    if (s.id === "metro") STEPS.push({ type: "camhist" }); // how China's camera network was built, before the commute
    STEPS.push({ type: "brief", i }); STEPS.push({ type: "scene", i }); STEPS.push({ type: "reveal", i }); STEPS.push({ type: "debrief", i });
    // side quest after the Weibo scene: the class counsellor phones every player privately
    if (s.id === "post") { STEPS.push({ type: "censor" }); STEPS.push({ type: "inform" }); STEPS.push({ type: "informres" }); }
    if (s.id === "metro") STEPS.push({ type: "jaywalk" }); // a random player gets "caught jaywalking"
  });
  STEPS.push({ type: "case" });
  STEPS.push({ type: "file" });
  STEPS.push({ type: "unique" });
  STEPS.push({ type: "meta" });
  POLLS.forEach((p, i) => { STEPS.push({ type: "poll", i }); STEPS.push({ type: "pollres", i }); });
  STEPS.push({ type: "end" });

  // Speaker notes for the presenter console (/present)
  const NOTES = {
    lobby: { tldr: "Get everyone in, explain the rules of the day.", say: ["Scan the QR code, pick a name", "We live one day in Shanghai, 07:30 to 22:30", "Each moment: I explain → you choose → we see where your data went"] },
    scene: { tldr: "Let them choose — don't explain yet.", say: ["Read the situation out loud", "Give them ~1 minute, watch the 'decided' counter", "Secretary Lin calls if someone breaks the rules"] },
    reveal: { tldr: "Show the results, compare China / EU / US.", say: ["Point at the bars and blocked attempts", "Read the China / EU / US comparison", "Ask one person why they chose what they did"] },
    file: { tldr: "Everything you did, merged into one police-style file.", say: ["Everyone taps through their file on the phone", "The wall shows the whole room", "Read one or two tags aloud"] },
    unique: { tldr: "A few data points are enough to identify you.", say: ["Show how few details make someone unique", "So 'anonymised' data rarely is"] },
    meta: { tldr: "Plot twist: this game tracked you too.", say: ["Let them look at their phones first", "Every website sees most of this — no cookie banner here"] },
    poll: { tldr: "Your turn to judge.", say: ["Read the question", "Give 20–30 seconds"] },
    pollres: { tldr: "Compare the room with Chinese survey data.", say: ["Read the result", "Contrast with the Chinese figure on screen"] },
    end: { tldr: "Wrap up, back to the slides.", say: ["They can delete their data on the phone", "Continue with Europe, the US and the discussion"] }
  };

  const WHO = {
    chinamobile: "China Mobile", chinaunicom: "China Unicom", tencent: "Tencent (WeChat)", alibaba: "Ant Group (Alipay)",
    didi: "Didi", weibo: "Weibo", metro: "Shanghai Metro", railway: "China Railway (12306)", hospital: "Hospital",
    insurance: "Medical insurance bureau", hotel: "Hotel", ctrip: "Ctrip", compound: "Compound management",
    govt: "Local government", police: "Police", meituan: "Meituan", netcafe: "Internet café (real-name system)"
  };
  // what kind of choice each option is — shown as a tag so the choices are clearly different
  const KINDS = {
    quick: "⚡ Quick", private: "🛡 Private", rebel: "✊ Push back", comfort: "🛋 Comfort", cheap: "💸 Cheap",
    safe: "🙂 Play safe", voice: "📣 Speak up", future: "🤖 High-tech"
  };
  const STATE = {
    direct: "Sent to the state automatically",
    demand: "Police and state security can demand it (Cybersecurity Law 2017; National Intelligence Law 2017)",
    none: ""
  };

  // ---------- "One person, one file" (一人一档) ----------
  // Builds the profile a police big-data platform could assemble from one player's choices.
  // Modelled on Reuters (2022) police tenders for "one person, one file" software and
  // Human Rights Watch (2017) on the "Police Cloud", its alerts and the 7 "key personnel" categories.
  function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
  function buildFile(rec) {
    const a = (id) => (rec.answers && rec.answers[id] && rec.answers[id].final) || null;
    const h = hash(rec.name + (rec.seed || ""));
    const faces = rec.faces || [];
    const file = { id: `310104 ${2000 + (h % 7)}${String(1 + (h % 12)).padStart(2, "0")}${String(1 + (h % 28)).padStart(2, "0")} ${String(h).slice(-4)}`,
      phone: `+86 13${h % 10} •••• ${String(h % 10000).padStart(4, "0")}`, sections: [], inferences: [], tags: [], alerts: [], points: 0 };
    const sec = (title, rows) => { rows = rows.filter(Boolean); if (rows.length) { file.sections.push({ title, rows }); file.points += rows.length; } };

    const sim = a("sim");
    sec("Identity", [
      ["Name", rec.name], ["ID card", file.id],
      sim ? ["Phone", `${file.phone} · ${sim === "app" ? "China Unicom" : "China Mobile"}`] : null,
      sim ? ["Face template", faces.some((f) => f.how === "camera") ? "captured live from your camera" : "on file (ID photo match)"] : null
    ]);
    const m = a("metro"), n = a("night");
    sec("Places", [
      m ? ["Morning location", m === "taxi" ? "home address (Didi pickup)" : "Jing'an Temple station area"] : null,
      m ? ["Workplace", "Lujiazui, Pudong"] : null,
      n === "home" ? ["Home", "compound gate, face entry 23:14"] : null,
      n === "hotel" ? ["Overnight", "hotel in own city, 22:30"] : null,
      n === "wangba" ? ["Overnight", "24-hour internet café, ID scanned 23:05"] : null,
      a("train") ? ["Hometown", "train booked Fri 19:05"] : null
    ]);
    const b = a("breakfast");
    sec("Money", [
      b === "wechat" ? ["Payments", "WeChat Pay · street food 08:12"] : null,
      b === "delivery" ? ["Payments", "Meituan · breakfast delivered to office 08:40"] : null,
      b === "cash" ? ["Payments", "cash — no record (gap in file)"] : null
    ]);
    const p = a("post");
    sec("Online", [
      p ? ["Weibo", "real-name account · shows Shanghai"] : null,
      p === "complain" ? ["Posts", "complaint about public transport"] : null,
      p === "sensitive" ? ["Posts", "reposted protest video — deleted"] : null
    ]);
    const d = a("doctor");
    sec("Health", [d ? ["Hospital", "dermatology · diagnosis on insurance record"] : null, d === "face" ? ["Insurance", "face-pay enabled"] : null]);
    const hc = a("healthcode");
    sec("2022 record", [hc === "scan" ? ["Health code", "green · office check-in"] : null, hc === "zhengzhou" ? ["Health code", "RED · Zhengzhou, June 2022"] : null]);

    // inferences: what a system could conclude
    if (m) file.inferences.push("Works in the Lujiazui financial district → likely finance sector");
    if (b === "cash" || m === "card" || faces.some((f) => f.how === "refused")) file.inferences.push("Avoids digital traces (cash / anonymous card / refused scan) → privacy-conscious");
    if (hc === "zhengzhou") file.inferences.push("Family affected by the Henan bank freeze → grievance against authorities");
    if (p === "sensitive") file.inferences.push("Shares protest content → politically sensitive views");
    if (sim === "black") file.inferences.push("Uses a phone number registered to someone else → possible fraud link");
    if (b === "delivery") file.inferences.push("Orders breakfast to the office → workplace address confirmed");
    if (rec.inform && rec.inform.target) file.inferences.push(`Reported a classmate (${rec.inform.target}) to the counsellor → reliable informant (信息员)`);
    if (rec.inform && rec.inform.refused) file.inferences.push("Refused to inform on classmates → uncooperative attitude");
    const lin = rec.lin || {}, linVals = Object.values(lin);
    if (linVals.includes(true)) file.inferences.push("Signed a self-criticism → admitted wrongdoing, on record");
    if (linVals.includes(false)) { file.inferences.push("Refused to sign a self-criticism → defiant"); file.alerts.push("Refused self-criticism — escalated to local police station (喝茶)"); }
    if (d) file.inferences.push("Recurring skin condition → health status known to insurer and state");

    // key personnel (重点人员) — Ministry of Public Security categories reported by HRW
    if (hc === "zhengzhou") file.tags.push("KEY PERSON · petitioner");
    if (p === "sensitive") file.tags.push("KEY PERSON · undermines stability");
    if (linVals.includes(false) && !file.tags.length) file.tags.push("KEY PERSON · uncooperative");
    const bl = rec.answers && rec.answers.train && rec.answers.train.blacklisted;
    if (bl) file.tags.push("COURT LIST · judgment defaulter");

    // Police Cloud-style alerts
    if (n === "hotel") file.alerts.push("Local resident stayed in a hotel in their own city");
    if (n === "wangba") file.alerts.push("Overnight at an internet café — browsing log available");
    if (sim === "black") file.alerts.push("Traded SIM card — anti-fraud system");
    if (hc === "zhengzhou") file.alerts.push("Travel to Zhengzhou during depositor protests");
    if (p === "sensitive") file.alerts.push("Sensitive content posted from a real-name account");
    if (file.tags.length) file.alerts.push("Assigned to grid worker for regular check-ins");

    // ---------- commercial profile (用户画像, "user portrait") ----------
    // What platforms like Tencent, Alibaba, Didi and Meituan could infer for ad targeting.
    const os = (rec.device && rec.device.os) || "";
    const mk = { tags: [], needs: [], ads: [], price: [] };
    const tag = (t, conf) => mk.tags.push({ t, conf });
    if (m) tag("Office worker · Lujiazui finance district", 92);
    if (m) tag("Above-average income (inferred from workplace)", 74);
    if (m === "taxi" || n === "home") tag("Pays for convenience · Didi user", 85);
    if (m === "qr" || m === "card") tag("Daily metro commuter", 95);
    if (b === "wechat") tag("Street-food breakfast · price-sensitive mornings", 68);
    if (b === "delivery") tag("Busy professional · orders food to work", 86);
    if (b === "cash" || m === "card") tag("Hard to profile · uses cash", 60);
    if (sim === "app") tag("Online-first · orders by courier", 70);
    if (p === "lunch") tag("Foodie · posts food photos", 81);
    if (p === "complain") tag("Frustrated commuter", 77);
    if (p === "sensitive") tag("News & politics engaged", 66);
    if (d) tag("Skin condition · dermatology patient", 88);
    if (d === "face") tag("Comfortable with biometric payment", 83);
    if (hc === "zhengzhou") tag("Family financial stress · Henan bank freeze", 79);
    if (a("train")) tag("Hometown outside Shanghai · weekend traveller", 90);
    if (n === "hotel") tag("Late nights out · stays in hotels locally", 72);
    if (n === "wangba") tag("Gamer · late nights, low budget", 80);
    if (/iPhone|iPad|Mac/.test(os)) tag("Apple user · premium segment", 97);

    if (d) { mk.needs.push("Clear skin — skincare, private clinics"); mk.ads.push(["Health", "Dermatologist-approved serum · results in 7 days"]); }
    if (hc === "zhengzhou") { mk.needs.push("Quick cash for family"); mk.ads.push(["Finance", "Instant micro-loan · approved in 3 minutes"]); }
    if (a("train")) { mk.needs.push("Cheap trips home, gifts for parents"); mk.ads.push(["Travel", "Weekend high-speed rail deals · plus gift boxes for parents"]); }
    if (m === "qr" || m === "card") { mk.needs.push("A faster commute"); mk.ads.push(["Mobility", "E-bike for your Jing’an → Lujiazui commute"]); }
    if (m === "taxi" || n === "home") { mk.needs.push("Rides when tired, late at night"); mk.ads.push(["Rides", "Night-ride membership · skip surge pricing"]); }
    if (n === "hotel") { mk.needs.push("Late food and a place to crash"); mk.ads.push(["Food", "Hotpot delivered in 30 min · open till 3 am"]); }
    if (n === "wangba") { mk.needs.push("Cheap fun, a place to stay"); mk.ads.push(["Games", "New mobile game · 7-day login bonus"]); }
    if (b === "delivery") mk.ads.push(["Food", "Breakfast subscription delivered to your desk · ¥199/month"]);
    if (m) { mk.needs.push("Career growth, savings"); mk.ads.push(["Finance", "Wealth-management app for finance professionals"]); }
    if (p === "lunch") mk.ads.push(["Food", "New restaurants near Lujiazui · lunch set ¥39"]);

    if (/iPhone|iPad/.test(os)) mk.price.push("iPhone users got smaller ride discounts than other phones: ¥2.07 vs ¥4.12 per trip (Fudan University study, 800+ rides)");
    if ((m === "taxi" || n === "home") && !/iPhone|iPad/.test(os)) mk.price.push("Loyal ride-hailing users have reported paying more than new users for the same trip — “big-data swindling” (大数据杀熟)");
    if (mk.price.length) mk.price.push("Banned since 2021 (PIPL Art. 24) and 2022 (algorithm rules) — enforcement is the question");
    file.market = mk;
    file.points += mk.tags.length;
    return file;
  }

  // 1–2 minute general intro: what privacy is and where the idea comes from
  const INTRO = {
    tldr: "Privacy = control over who knows what about you.",
    def: "Privacy is the claim of individuals to determine for themselves when, how and to what extent information about them is communicated to others.",
    defBy: "Alan Westin, Privacy and Freedom (1967)",
    personal: "Personal data = any information about an identified or identifiable person — name, ID number, location, face, online identifiers (GDPR, Art. 4).",
    timeline: [
      ["1890", "“The right to be let alone” — Warren & Brandeis, Harvard Law Review"],
      ["1948", "Privacy becomes a human right — UN Universal Declaration, Art. 12"],
      ["1970", "First data-protection law in the world — Hesse, West Germany"],
      ["1983", "“Informational self-determination” — German Constitutional Court census ruling"],
      ["2013", "Snowden reveals mass surveillance by the US NSA"],
      ["2018", "EU GDPR applies — fines up to 4% of global turnover"],
      ["2021", "China's Personal Information Protection Law (PIPL)"]
    ],
    models: [["EU", "a fundamental right"], ["USA", "a consumer & market issue"], ["China", "rules for companies, security for the state"]],
    word: { zh: "隐私", py: "yǐnsī", en: "privacy", note: "Literally “hidden private matters” — traditionally things kept out of sight, not a right." },
    say: ["Privacy isn't about hiding — it's about control: who knows what about you", "The idea is young: from “the right to be let alone” (1890) to GDPR (2018)", "Three models today: EU rights, US market, China state security", "Today you'll feel the Chinese model from the inside"]
  };

  // Quick quizzes on the talk steps: answered on the phone, instant right/wrong
  const QUIZ = {
    intro: { q: "Where was the world's first data-protection law passed?", options: ["The USA", "Hesse, West Germany", "China"], correct: 1, why: "Hesse, West Germany, in 1970 — after fears about government computers." },
    daily: { q: "Roughly how many WeChat messages are sent every day?", options: ["450 million", "4.5 billion", "45 billion"], correct: 2, why: "About 45 billion a day (Tencent, 2018) — every one tied to a real name." },
    camhist: { q: "Which city got 40,000 HD cameras within a year after the 2009 riots?", options: ["Beijing", "Ürümqi", "Shanghai"], correct: 1, why: "Ürümqi, capital of Xinjiang — the start of the region becoming a surveillance lab." },
    case: { q: "In Gallup's 2024 safety ranking, which country was ahead of China?", options: ["Singapore", "USA", "Poland"], correct: 0, why: "Singapore (98%) — China was 3rd with 94%; the US 71%, Poland 68%." },
    jaywalk: { q: "What did Shenzhen do to jaywalkers from 2017?", options: ["Fined them ¥500", "Showed their face and name on giant street screens", "Took away their phone"], correct: 1, why: "LED screens at crossings showed their photo, name and part of their ID number — 13,930 people at one crossing in 10 months." },
    "debrief:sim": { q: "Can you buy a prepaid SIM in Poland without ID?", options: ["Yes, anonymously", "No — ID required since 2016–17", "Only online"], correct: 1, why: "Poland's 2016 anti-terror law ended anonymous prepaid SIMs (deadline Feb 2017)." },
    "debrief:breakfast": { q: "What did Beijing do to Ant Group (Alipay) in 2020?", options: ["Gave it a bank licence", "Halted its record IPO", "Nationalised it"], correct: 1, why: "The IPO was suspended days before listing — the state reined in a data giant." },
    "debrief:metro": { q: "Why was Didi fined ¥8 billion in 2022?", options: ["Unsafe drivers", "Illegal data processing", "Tax evasion"], correct: 1, why: "64.7 billion pieces of personal data processed illegally, incl. face scans and locations." },
    "debrief:post": { q: "What do Chinese censors delete most, according to research?", options: ["Criticism of leaders", "Calls for collective action", "Foreign news"], correct: 1, why: "King, Pan & Roberts: criticism often stays up — organising gets deleted." },
    "debrief:doctor": { q: "Under China's PIPL (2021), medical data is…", options: ["Public information", "“Sensitive” — needs separate consent", "Owned by the state"], correct: 1, why: "PIPL lists medical data as sensitive personal information." },
    "debrief:healthcode": { q: "Why did 1,317 people in Zhengzhou get red codes in June 2022?", options: ["COVID cases", "To stop a bank-depositor protest", "Travel abroad"], correct: 1, why: "Officials misused the health code to stop protests — five were punished." },
    "debrief:train": { q: "What is China's “social credit system” mostly?", options: ["One national score for everyone", "Court and regulatory blacklists", "An Alipay game"], correct: 1, why: "Mostly blacklists — e.g. the court list of judgment defaulters." },
    "debrief:night": { q: "Who receives your hotel registration in China?", options: ["Only the hotel", "The local police", "The tourism bureau"], correct: 1, why: "Hotels must pass every guest's ID to local police." }
  };
  // "Banned or allowed?" flip-card game after the Weibo scene
  const CENSOR = {
    cards: [{"id": "pooh", "en": "Winnie the Pooh", "zh": "小熊维尼", "banned": true, "verdict": "🚫 Censored · 2017–18", "story": "Bloggers compared Xi Jinping to Pooh from 2013. In 2017 Pooh images were blocked on social media, and again in Feb 2018 after presidential term limits were scrapped."}, {"id": "chair", "en": "“Empty chair”", "zh": "空椅子", "banned": true, "verdict": "🚫 Censored · 2010", "story": "Liu Xiaobo won the 2010 Nobel Peace Prize while in prison, so the prize was handed to an empty chair. Even the phrase “empty chair” was scrubbed online."}, {"id": "may35", "en": "“May 35th”", "zh": "五月三十五日", "banned": true, "verdict": "🚫 Censored · every June", "story": "A code for June 4th, 1989 — the Tiananmen crackdown. Users invent dates like this because “June 4” itself is blocked."}, {"id": "disagree", "en": "“I disagree”", "zh": "我不同意", "banned": true, "verdict": "🚫 Censored · Feb 2018", "story": "Blocked on Weibo, with “emperor”, “shameless” and Orwell's Animal Farm, when term limits on the presidency were abolished."}, {"id": "letter_n", "en": "The letter “N”", "zh": "字母 N", "banned": true, "verdict": "🚫 Briefly censored · Feb 2018", "story": "Critics wrote “N > 2” — more than two presidential terms. For a few days the single letter N was blocked."}, {"id": "lying_flat", "en": "“Lying flat”", "zh": "躺平", "banned": true, "verdict": "⚠️ Restricted · 2021", "story": "A youth movement of doing the minimum instead of overworking. A Douban group with 9,000+ members was deleted and platforms were told to “strictly restrict” new posts."}, {"id": "peng", "en": "“Peng Shuai”", "zh": "彭帅", "banned": true, "verdict": "🚫 Censored · Nov 2021", "story": "The tennis star accused a former vice-premier of coercing her into sex. Her post vanished within half an hour; users then wrote “eating melons” and “Eddie Peng is too handsome” to discuss it."}, {"id": "democracy", "en": "“Democracy”", "zh": "民主", "banned": false, "verdict": "✅ Allowed", "story": "It's one of the 12 official Core Socialist Values — the same ones scrolling on the red banner above. The Party defines it as “whole-process people's democracy”."}, {"id": "xi", "en": "“Xi Jinping”", "zh": "习近平", "banned": false, "verdict": "✅ Allowed — but…", "story": "His name is everywhere in official news. What gets blocked are nicknames and jokes — like Winnie the Pooh — and critical comments under posts about him."}, {"id": "tiananmen", "en": "“Tiananmen”", "zh": "天安门", "banned": false, "verdict": "✅ Allowed — but…", "story": "The square is a tourist spot and on the national emblem. It's the date — June 4th, 1989 — and images like “Tank Man” that are scrubbed."}, {"id": "freedom", "en": "“Freedom”", "zh": "自由", "banned": false, "verdict": "✅ Allowed", "story": "Another Core Socialist Value on the banner. The word is fine — posts about specific cases, like detained lawyers or activists, are what disappear."}, {"id": "panda", "en": "“Panda”", "zh": "熊猫", "banned": false, "verdict": "✅ Allowed", "story": "A national symbol — used in “panda diplomacy”. Not every cute animal is banned, just the one that looks like the leader."}],
    tldr: "Guess which words are banned on Weibo — then flip for the story.",
    say: ["Each phone has 12 cards: tap Banned or Allowed, the card flips with the real story", "Trick cards: “Democracy”, “Freedom”, “Xi Jinping” and “Tiananmen” look banned — but the words are allowed; it's jokes, dates and cases that get blocked", "Censorship is narrow but fast: Peng Shuai's post was gone within half an hour", "Users fight back with code words: “May 35th”, “eating melons”, “N > 2”", "Press F (or the console button) to flip all cards on the projector"],
    sources: "HuffPost UK (2018); CS Monitor / Global Voices (2010); Hong Kong Free Press (2021); NYT via Deccan Herald (2021)"
  };

  // The jaywalker moment
  const JAYWALK = {
    tldr: "One of you just got caught jaywalking — and the city put your face on a screen.",
    say: ["Shenzhen, from April 2017: LED screens at big crossings showed jaywalkers' photo, name and part of their ID number", "13,930 people were shown at one busy crossing in 10 months (Shenzhen traffic police, 2018)", "Nov 2018, Ningbo: the system “caught” businesswoman Dong Mingzhu jaywalking — it was her face on a bus advert", "Plans followed to send fines straight to people's phones"],
    angle: "Public shaming as governance: the camera doesn't just fine you, it shows your neighbours. Is shame a legitimate policy tool?",
    sources: "Sophos Naked Security (2018); SCMP (2018); Biometric Update (2018)"
  };
  // Earlier choices that come back later in the day (applied by the server)
  const CARRY = {
    simFrozen: { because: "Because you bought a street SIM at 07:30…", result: "Payment failed: your WeChat account is frozen — it's linked to a number cut off in the card-breaking campaign. Pay cash.", logs: [] },
    trainKeyPerson: { because: "Because you reposted the protest video at 12:30…", result: "The face gate beeps red: KEY PERSON alert. Two officers question you for 20 minutes before you can board.", logs: ["Face match at station gate: KEY PERSON alert", "20-minute police check, recorded"], to: ["railway", "police"], state: "direct" },
    trainReported: { because: "Because a classmate reported you to Teacher Jan…", result: "Your 12306 account is “under review” after a report. You get a ticket — 30 minutes later.", logs: ["12306 account flagged after a report", "Ticket issued after manual review"], to: ["railway", "police"], state: "demand" },
    nightGrid: { because: "Because you refused to sign the self-criticism…", result: "A grid worker (网格员) is waiting at your compound gate: “Just a friendly check-in.” He asks about your phone call today.", logs: ["Grid worker visit at your home 23:15", "Notes added to your file"], to: ["compound", "police"], state: "direct" },
    nightPetitioner: { because: "Because you went to Zhengzhou about the bank money…", result: "1 a.m.: the front desk calls — two police officers want to “have a chat”. Petitioners checking into hotels trigger alerts.", logs: ["Hotel check-in flagged: petitioner", "Police visit 01:05"], to: ["hotel", "police"], state: "direct" }
  };

  // Backup discussion questions for the presenter, if the room is quiet
  const PROMPTS = {
    sim: { reveal: ["Did anyone try to skip the face scan? Why?", "Would you notice if a Polish carrier started asking for your face?"],
      debrief: ["Is a registered SIM card in Poland really so different from China's?", "Who should be allowed to link your number to your identity — police, banks, platforms?", "Does a real-name internet make it safer, or just more censored?"] },
    breakfast: { reveal: ["Who chose cash — and would you still, with a queue sighing behind you?", "What could Tencent learn about you from one month of breakfasts?"],
      debrief: ["Would you accept a digital euro with “controllable anonymity”?", "Who should hold payment data — private companies or the state? Which is worse?"] },
    metro: { reveal: ["Did anyone pick the anonymous card? Did it actually make you anonymous?", "Which app on your phone knows your location right now?"],
      debrief: ["Is TikTok in the US the mirror image of Didi in New York?", "Should location data get extra protection, like health data?"] },
    post: { reveal: ["Why did the metro complaint stay up but the protest video got removed?", "Would you post differently if your city showed under your name?"],
      debrief: ["Is self-censorship worse than censorship?", "European platforms remove content too — what makes the EU's Digital Services Act different?"] },
    doctor: { reveal: ["Would you book a doctor through a messaging app?", "Who in Poland can see your records in the patient account (IKP)?"],
      debrief: ["Should insurers ever see data from your health apps?", "Is convenience worth giving up medical privacy?"] },
    healthcode: { reveal: ["Would you have scanned the code — out of fear, habit or solidarity?", "What would you do if your code turned red for no reason?"],
      debrief: ["Was the EU's decentralised app better — or just less effective?", "Should emergency surveillance tools switch off automatically after a set time?"] },
    train: { reveal: ["Is a face gate more or less fair than a human ticket inspector?", "Should people who don't pay court debts be stopped from travelling?"],
      debrief: ["Why do Western media keep talking about a single “social credit score”?", "Would a travel ban for unpaid debts work in Poland?"] },
    night: { reveal: ["Did you know EU hotels also register foreign guests?", "Would you accept a face scan at a hotel to skip the queue?"],
      debrief: ["Which is more dangerous: one camera everywhere, or many databases joined together?", "Who should be allowed to join databases — and who decides?"] },
    intro: ["What's one thing you'd hate a stranger to know about you?", "Is privacy a Western idea — or universal?"],
    daily: ["Which number surprised you most?", "How many of these would be true for you in Poland too?"],
    informres: ["Would you report a classmate who cheated in an exam? Is that different?", "Is informing loyalty or betrayal — and to whom?", "How is this different from “see something, say something” in the West?"],
    censor: ["Which card surprised you most?", "Is it better to censor a few topics fast — or many slowly?", "What code words would you invent?"],
    jaywalk: ["Would public shaming stop you jaywalking?", "What if the system gets the face wrong — like it did with Dong Mingzhu?"],
    camhist: ["Why would a government test surveillance on a minority region first?", "Once the cameras exist, can they be used only for crime?"],
    case: ["Would you trade privacy for feeling safe at night?", "Who pays the price for a “safe” society?"],
    file: ["Which line in your file surprised you most?", "Who should be allowed to see a file like this?"],
    unique: ["Have you ever believed “anonymous data” was really anonymous?", "What three facts would single you out in this room?"],
    meta: ["Did anyone notice the game tracking you? Why not?", "What do the apps on your phone collect right now?"],
    pollres: ["Why did you vote the way you did?", "Would your answer change if you'd grown up in China?"],
    end: ["Will you change anything after today?", "EU, US or China — which model would you choose, and why?"]
  };

  // How the camera network was built — and why Xinjiang matters
  const CAMHIST = {
    tldr: "Cameras spread city by city — Xinjiang became the testing ground.",
    timeline: [
      ["2000s", "Golden Shield", "金盾", "The Ministry of Public Security builds a national police network and databases.", ""],
      ["2005", "Sky Net", "天网", "Urban CCTV programme launched “to fight crime and prevent disasters”.", ""],
      ["2010", "Urumqi", "乌鲁木齐", "After the July 2009 riots (197 dead, official figure), 40,000 HD cameras go up in Xinjiang's capital within a year.", "xj"],
      ["2015", "Sharp Eyes", "雪亮", "Goal: 100% of public space covered by 2020, “no blind spots” — reaching villages too.", ""],
      ["2016–19", "Xinjiang lab", "新疆", "Checkpoints, phone scanners and the IJOP app flag people for using WhatsApp or “not socialising with neighbours”; DNA and iris scans taken from everyone aged 12–65.", "xj"],
      ["2019+", "Export", "出口", "Hikvision and Dahua put on the US Entity List; the same tools are sold abroad.", ""]
    ],
    callout: "Xinjiang is where China tested the full package — cameras + data + checkpoints + detention. The UN human rights office (2022) said the abuses there “may constitute crimes against humanity”.",
    say: ["Cameras didn't arrive all at once: police networks (2000s), city CCTV (2005), villages (2015)", "Xinjiang after 2009 became the laboratory — then the tools spread nationwide", "Human Rights Watch (2019) reverse-engineered the police app: it flagged ordinary behaviour", "The UN human rights office (2022): possible crimes against humanity"],
    sources: "State media via CDT (2010); IPVM (Skynet / Sharp Eyes); Human Rights Watch (2019); OHCHR (2022); US Commerce Dept (2019)"
  };

  // "Every day in China": per-day figures derived from official / company annual totals
  const DAILY = {
    tldr: "Every second, China's 1.4 billion people generate a mountain of data.",
    items: [
      { n: "112 million TB", per: 1.3e3, unit: "TB of data", label: "of data generated per day (41.06 zettabytes in 2024 ÷ 366)", src: "National Data Administration via Xinhua (2025)" },
      { n: "3.4 billion", per: 3.4e9 / 86400, unit: "online payments", label: "online payments a day through Alipay, WeChat Pay & co. (306bn in Q1 2025 ÷ 90)", src: "People's Bank of China (2025)" },
      { n: "45 billion", per: 45e9 / 86400, unit: "WeChat messages", label: "WeChat messages a day — plus 410 million calls (2018)", src: "Tencent via Caixin (2019)" },
      { n: "477 million", per: 174.5e9 / 366 / 86400, unit: "parcels", label: "parcels a day — each with a name, phone number and address (174.5bn in 2024)", src: "State Post Bureau via Jiemian (2025)" },
      { n: "12.6 million", per: 4.59e9 / 365 / 86400, unit: "rail trips", label: "real-name train trips a day (4.59bn in 2025)", src: "gov.cn (2026)" }
    ],
    say: ["These are per-day averages from official annual totals", "Watch the counters — they tick while we talk", "Every one of these records is tied to a real name"]
  };

  // "The case for it": third-party figures on safety, inclusion and public support, with caveats
  const CASE = {
    tldr: "Why many people accept it: it feels safe and it works.",
    safe: { title: "Feel safe walking alone at night", src: "Gallup Global Safety Report 2025 (2024 data)", rows: [["China", 94], ["World", 73], ["USA", 71], ["Poland", 68]] },
    tiles: [
      ["0.5", "homicides per 100,000 people in China (2020) — Poland 0.68 (2024), US 5.8 (2023)", "UNODC"],
      ["89%", "of Chinese adults have a financial account; 82% pay merchants digitally (2021)", "World Bank Global Findex"],
      ["95.5%", "satisfied with the central government (2016 survey, 31,000+ people over 13 years)", "Harvard Ash Center"],
      ["~80%", "of Chinese internet users approved of social credit systems (2018)", "Freie Universität Berlin"]
    ],
    caveats: [
      "Surveys in a censored country may overstate support — people may not answer freely.",
      "Low crime has many causes: Japan is also very safe without China's level of surveillance.",
      "Safety for most can coexist with control over some: dissidents, Uyghurs, petitioners."
    ],
    ask: "Is feeling safe worth being watched? Would you make that trade in Kraków?",
    notes: "Present this honestly: these are the strongest arguments the system's supporters make. Then point to the caveats. Links to the class poll about face-recognition cameras in Kraków."
  };

  // Side quest: "Inform on a classmate". Teacher Jan (扬老师), the class counsellor (辅导员 fǔdǎoyuán) —
  // in Chinese universities counsellors do the Party's political work with students.
  const INFORM = {
    caller: "Teacher Jan", zh: "扬老师", role: "Class counsellor · 辅导员 fǔdǎoyuán",
    lines: [
      "Hello, it's Teacher Jan, your class counsellor.",
      "Someone in your group posted complaints online about the school and the city.",
      "Who was it? Tell me and you get +50 points. Nobody will know it came from you."
    ],
    thanks: "Thank you. Your loyalty has been noted. +50 points.",
    refused: "I see. Your attitude has also been noted.",
    word: { zh: "信息员", py: "xìnxīyuán", en: "informant", note: "Students recruited by universities to report on classmates and teachers." },
    facts: [
      ["Since 2008", "Chinese universities have run teams of student informants (学生信息员) who report on what teachers say in class", "China Media Project (2018)"],
      ["¥20–200", "paid per report at one university — more for “critical” information", "China Media Project (2018)"],
      ["2018", "Lecturers in Beijing and Wuhan were disciplined after students reported comments made in class", "China Media Project (2018)"],
      ["≈ $15,000", "top reward for a national-security tip under the 2022 Ministry of State Security rules", "China Digital Times (2022)"]
    ],
    ask: "Why did you report — or refuse? Loyalty to the group, to the authority, or to yourself?",
    // poster-style portrait of Jan (with his OK): wide-brim hat, round gold sunglasses, ponytail, beige blazer, red Party pin
    avatar: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="tzbg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#ffe08a"/><stop offset=".5" stop-color="#f2a33a"/><stop offset="1" stop-color="#c8102e"/></radialGradient></defs>
      <rect width="200" height="200" fill="url(#tzbg)"/>
      <g stroke="#2a1a10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M120 116 C132 124 136 140 128 156 C124 146 118 136 112 128Z" fill="#c9a26a"/>
        <path d="M28 200 C32 158 62 144 100 142 C138 144 168 158 172 200Z" fill="#d9ccb4"/>
        <path d="M84 140 L100 176 L116 140 L110 136 L100 150 L90 136Z" fill="#f6f6f2"/>
        <path d="M84 140 L70 150 L86 200 M116 140 L130 150 L114 200" fill="none" stroke="#a89c86" stroke-width="2"/>
        <path d="M89 126 h22 v14 c-6 5 -16 5 -22 0z" fill="#f0c4a0"/>
        <path d="M72 94 C72 70 84 60 100 60 C116 60 128 70 128 94 C128 118 116 134 100 134 C84 134 72 118 72 94Z" fill="#f6d0ac"/>
        <path d="M74 106 C78 126 90 134 100 134 C110 134 122 126 126 106 C122 118 114 124 100 124 C86 124 78 118 74 106Z" fill="#b98f62" stroke="none" opacity=".7"/>
        <ellipse cx="72" cy="98" rx="5" ry="8" fill="#f0c4a0"/><ellipse cx="128" cy="98" rx="5" ry="8" fill="#f0c4a0"/>
        <path d="M34 72 C52 62 148 62 166 72 C160 80 40 80 34 72Z" fill="#3c3d2c"/>
        <path d="M71 70 L74 36 C86 31 114 31 126 36 L129 70Z" fill="#45472f"/>
        <path d="M70 62 C90 58 110 58 130 62 L130 70 C110 66 90 66 70 70Z" fill="#141414"/>
      </g>
      <g stroke="#caa04a" stroke-width="2.2"><circle cx="87" cy="92" r="10" fill="#1b1b1b"/><circle cx="113" cy="92" r="10" fill="#1b1b1b"/><path d="M97 91 q3 -3 6 0 M77 90 l-5 -2 M123 90 l5 -2" fill="none"/></g>
      <g fill="#fff" opacity=".35"><ellipse cx="83" cy="88" rx="3" ry="2"/><ellipse cx="109" cy="88" rx="3" ry="2"/></g>
      <g stroke="#2a1a10" stroke-linecap="round" fill="none"><path d="M100 98 q-3 8 0 11" stroke-width="1.8"/><path d="M90 116 q8 6 18 -1" stroke-width="2.4"/><path d="M90 112 q10 -3 20 0" stroke="#9c7650" stroke-width="2"/></g>
      <g transform="translate(74 160)"><circle r="5.5" fill="#c8102e" stroke="#ffd24a" stroke-width="1.2"/><path d="M0 -3 L.9 -.9 2.9 -.9 1.3 .3 1.9 2.4 0 1.2 -1.9 2.4 -1.3 .3 -2.9 -.9 -.9 -.9Z" fill="#ffd24a"/></g></svg>`,
    angle: "Collectivism cuts both ways: group loyalty can protect classmates — or be turned into watching each other. Mass denunciation peaked in the Cultural Revolution; informant systems are its quieter heir."
  };

  const FILE_WORD = { zh: "一人一档", py: "yī rén yī dàng", en: "one person, one file", note: "Police software that merges everything about you into a single profile." };
  const api = { SCENES, POLLS, STEPS, WHO, STATE, KINDS, NOTES, CASE, INFORM, INTRO, DAILY, PROMPTS, CAMHIST, QUIZ, JAYWALK, CARRY, CENSOR, buildFile, FILE_WORD };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GAME = api;
})(this);
