// Presenter explanations: one plain-language "what this means / how to say it" line under each talking point.
// Keys are the step type, or "type:sceneId" for scene steps. Arrays line up with the console's bullets (null = no note).
// "extra" arrays line up with the "If you have time" list.
(function (root) {
  const WHY = {
    "scene:sim": [null, "Quick = the app does everything from your sofa (photo of ID + face video). Private = trying to keep your face out of it. Push back = the black market for SIMs registered in someone else's name — real, mostly used by scam gangs.", "Don't reveal yet: there is no legal way to get a number without the face check.", "This is the street-SIM route. It sets off the “card-breaking” campaign consequences later in the day."],
    "scene:breakfast": [null, "Quick = the QR code every Chinese street stall has. Comfort = delivery apps (Meituan) — the most data: address, habits, the rider's route. Private = cash, legal but rare."],
    "scene:metro": [null, "Quick = the metro QR code tied to your phone. Private = an anonymous card bought with cash — but the cameras still see you. Comfort = Didi, which logs your exact route."],
    "scene:post": [null, "Play safe = harmless content; Speak up = an everyday complaint, usually tolerated; Push back = collective-action content, which censors target first.", "Secretary Lin will call the people who chose this."],
    "scene:doctor": [null, "Quick = booking via the hospital's WeChat account (Tencent sees the booking). Private = queueing at the counter. High-tech = paying with your face — the real camera scan runs on their phones."],
    "scene:healthcode": [null, "Quick = what nearly everyone did. Private = walking in without scanning — impossible, guards stopped you. Push back = the real Zhengzhou bank-depositor case.", "Guards checked codes at every door — no code, no entry.", "Based on June 2022: depositors who travelled to protest got red codes at the station."],
    "scene:train": [null, "Quick = 12306 app, face check at the gate. Private = cash at the counter — still your ID and your face. Push back = a tout's ticket, useless because the name must match your ID.", "Real-name ticketing killed the ticket-tout business."],
    "scene:night": [null, "Comfort = hotel (ID sent to police). Cheap = an internet café — real-name internet since 2002, your browsing tied to your ID. Quick = Didi home, where the compound gate recognises your face."],
    "pollres": [null, "Use this to contrast: what the room said vs. what surveys in China find. Ask if anyone is surprised — and why the answers might differ (trust, experience, what people compare it to)."],
    lobby: [
      "Give them a minute; latecomers can still scan the small QR code in the corner later.",
      "The whole game is one ordinary working day — morning SIM card to a bed at night.",
      "This is the rhythm for every moment: short explanation, a choice on the phone, then the results on the big screen."
    ],
    intro: [
      "Most people think privacy = having something to hide. Reframe it: it's about who decides what others know about you — you, a company or the state.",
      "Privacy as a legal idea is barely 130 years old; data protection only about 50. Every step was a reaction to new technology (cameras, computers, the internet).",
      "Anu Bradford's “Digital Empires” (2023): the US leaves data to the market, the EU protects it as a human right, China lets the state steer it. We'll compare all three all day.",
      "Students will make choices as a Shanghai resident and see where their data goes — no slides needed, they'll feel it."
    ],
    "intro:extra": [
      "Westin's definition is the one most textbooks use. Key word: “determine” — privacy is about control, not secrecy.",
      "Two Boston lawyers reacting to the new portable Kodak camera and gossip newspapers printing private photos. The first time anyone argued for a legal right to privacy.",
      "After WWII and totalitarian regimes, Article 12 says no one shall face “arbitrary interference with his privacy, family, home or correspondence”.",
      "The German state of Hesse passed it because government was starting to store citizens' records on computers. Europe's data-protection tradition starts here.",
      "Germans boycotted a national census. The court ruled every person has the right to decide what happens to their personal data — the philosophical root of GDPR.",
      "Edward Snowden leaked NSA files showing mass collection of phone records and internet data. It showed Western democracies surveil too, and pushed the EU to tighten its rules.",
      "GDPR gives rights (access, deletion, objection) and fines up to €20M or 4% of global turnover — e.g. Meta was fined €1.2bn in 2023 for sending EU data to the US.",
      "China's GDPR-style law: strict rules for companies (consent, minimal collection, sensitive data). But state organs keep wide exceptions for security and their “statutory duties”."
    ],
    daily: [
      "We took official yearly totals and divided by the days of the year — so these are averages, not estimates of a single day.",
      "The counters start from zero when the slide opens: let it run for 20–30 seconds while you talk, then point at how far they've climbed.",
      "This is the key difference to Europe: in China almost every one of these records carries your ID number, because phone, payment and ticket all need your real name."
    ],
    "brief:sim": [
      "The 2010 rule came from the telecom ministry to fight spam and fraud. The 2017 Cybersecurity Law (Art. 24) extended it: no phone, internet or posting service without your real identity.",
      "The face scan is matched against your ID-card photo. It was introduced in Dec 2019 to stop people registering numbers in someone else's name.",
      "WeChat, Alipay, banks and the 12306 train app all log in with an SMS code to your number — so whoever holds the number record can link everything you do back to you."
    ],
    "reveal:sim": [
      "Point at the blocked bar: nobody in the room managed to skip the face scan. That's the reality — there is no opt-out.",
      "Your phone number works like a universal username: link it once to your ID and face, and every app inherits your real identity."
    ],
    "debrief:sim": [
      "A “biometric template” is a mathematical map of your face. Once it's tied to your ID, any camera that recognises your face can know who you are.",
      "Real names cut both ways: easier to catch scammers and trolls (the government's argument), but people also stop saying things that could get them in trouble.",
      "Poland has required ID for SIM cards since 2016. The difference is GDPR's “purpose limitation”: data collected for one purpose can't freely be reused for another, and EU courts have struck down blanket data retention."
    ],
    "brief:breakfast": [
      "Figures from Worldpay's Global Payments Report: two-thirds of shop spending goes through phone wallets; cash has almost disappeared.",
      "WeChat Pay (Tencent) and Alipay (Ant Group) together handle the vast majority of mobile payments in China — two companies see almost every purchase.",
      "A jianbing is a street pancake for about ¥7. Even this tiny purchase is logged under your real name, time and location."
    ],
    "reveal:breakfast": [
      "So many shops stopped accepting cash that the central bank had to remind them it's illegal to refuse it (2020) and push again in 2024 when tourists couldn't pay. Choosing cash is now a privacy statement."
    ],
    "debrief:breakfast": [
      "Ask: what could someone learn from a year of your bank app? Where you live and work, when you're sick (pharmacy), who you date (dinner for two), how much you earn.",
      "Paying cash is legal and protected — but socially awkward. Privacy becomes something you have to actively work for.",
      "The e-CNY is China's central-bank digital currency. “Controllable anonymity” (可控匿名) means small payments stay private, but the central bank can see larger flows — the state, not banks, holds the data."
    ],
    camhist: [
      "Golden Shield (2000s) was the police database and network backbone; Sky Net (2005) put CCTV in cities; Sharp Eyes (2015) took it to villages — named after Mao's slogan “the masses have sharp eyes”.",
      "After the 2009 Ürümqi riots, Xinjiang got 40,000 cameras within a year, then checkpoints, phone scanners and DNA collection from 2016. Many of these tools then spread to the rest of China.",
      "Human Rights Watch got hold of the police app (IJOP) and decoded it: it flagged people for things like using WhatsApp, not talking to neighbours or leaving by the back door.",
      "In Aug 2022 the UN human rights office concluded the detention of Uyghurs “may constitute international crimes, in particular crimes against humanity”. China rejects this."
    ],
    "brief:metro": [
      "Shanghai's metro is one of the busiest in the world. Paying with the metro QR code means every ride is linked to your WeChat/Alipay account and phone number.",
      "This is an estimate by the research firm Comparitech (2019). For comparison, London — Europe's most-watched city — had about 68 per 1,000 in the same study.",
      "Didi, Uber-style ride-hailing: every trip stores exact GPS start, end and route. That's a map of your life — home, work, doctor, friends."
    ],
    "reveal:metro": [
      "Didi was punished hard by its own government — so China does regulate companies, sometimes more harshly than the West.",
      "But the same laws barely limit what the police and state can collect — that asymmetry is the point."
    ],
    "debrief:metro": [
      "The regulator said Didi collected far more than it needed — including passengers' face scans, precise locations and even screenshots from their photo albums.",
      "Didi listed on the New York Stock Exchange on 30 June 2021 against Beijing's wishes. Two days later it was put under a cybersecurity review and removed from app stores. Beijing feared US access to Chinese mapping and travel data.",
      "China's 2021 laws are strict for companies — consent, minimal data, fines. But state organs have broad exceptions. Compare: GDPR also has exceptions for police, but courts and data-protection authorities check them."
    ],
    redlight: [
      "Don't mention the cameras — the surprise on the next screen is the lesson.",
      "In 2012 Chinese netizens joked about “Chinese-style road crossing”: wait until enough people gather, then all walk on red — no one can stop a crowd. Cameras with face recognition ended that logic: the camera matches every face.",
      "Everyone who crossed — alone or with the crowd — is caught. One face goes on the big screen; the rest are listed underneath.",
      "Wait = clean record (+5 loyalty), cross = shame screen, a fine at the doctor's later and −5 loyalty."
    ],
    jaywalk: [
      "Big LED screens next to crossings showed a photo, name and part of the ID number of people caught crossing on red — public shaming as a policy tool.",
      "Police said jaywalking went down at the crossings with screens. Ask the room whether shame works — and whether it's fair.",
      "Dong Mingzhu, head of the appliance maker Gree, was “caught” — but it was her face in an advert on a passing bus. Police admitted the error. It shows the systems make mistakes.",
      "The idea: get caught on camera, receive the fine by text message — no police officer needed."
    ],
    "brief:post": [
      "Weibo is China's Twitter. One in every two Chinese internet users scrolls it monthly.",
      "Since 2017 every account must be verified with a phone number (so a real name). Since April 2022 profiles show your province — officially to fight “fake news”, in practice also to expose people.",
      "Complaining about delayed trains or bad service is normal and usually stays up. The question is where the invisible line is."
    ],
    "reveal:post": [
      "The law makes platforms responsible for what users post (“main responsibility”, 主体责任). So Weibo deletes content itself, fast, before police even need to act."
    ],
    "debrief:post": [
      "The Cyberspace Administration runs regular “Qinglang” (清朗, “clear and bright”) clean-up campaigns against “harmful” content, gossip and fan culture.",
      "Harvard researchers (King, Pan & Roberts, 2013) studied millions of posts: criticism of officials often stays up; anything that could get people onto the street gets deleted.",
      "“Inviting someone to tea” is the euphemism for an informal police summons to talk about what you posted."
    ],
    censor: [
      "Phones show 12 cards. They guess, the card flips and tells the real story — let them play 2–3 minutes.",
      "These look like they'd be banned, but they're allowed. The lesson: China doesn't ban topics wholesale — it bans jokes, codes and specific cases.",
      "Peng Shuai, a famous tennis player, accused a former vice-premier of sexual coercion in Nov 2021. Her post vanished in about 30 minutes and her name was blocked.",
      "When a word is blocked, people invent new ones: “May 35th” for June 4th (Tiananmen), “eating melons” (吃瓜) for watching gossip unfold, “N > 2” for more than two presidential terms.",
      null
    ],
    inform: [null, "Teacher Jan is a class counsellor (辅导员): in Chinese universities counsellors look after students' political education.", null],
    informres: [
      "Student “information officers” (信息员) report on what lecturers say in class — originally to give feedback on teaching, increasingly used for political monitoring.",
      "Small payments per report: it's a job, not just loyalty.",
      "Lecturers were suspended or disciplined after students reported their comments — so teachers self-censor too.",
      "The Ministry of State Security pays citizens for tips about “spies”. Informing is encouraged far beyond the classroom."
    ],
    "brief:doctor": [
      "Almost everyone has state medical insurance; the insurance QR code in WeChat/Alipay works like a digital health card.",
      "You book a doctor through the hospital's WeChat account using your ID number; increasingly you pay by looking into a face-scan terminal.",
      "Big public hospitals are crowded; consultations often happen with the next patients and their families standing in the room. Privacy at the doctor's is not a given."
    ],
    "reveal:doctor": [
      "The National Healthcare Security Administration wants face-scan insurance payment everywhere — your face becomes your insurance card."
    ],
    "debrief:doctor": [
      "PIPL (2021) lists medical data as “sensitive personal information”: you must give separate, explicit consent before it's collected.",
      "But laws are only as good as enforcement: in one court case a software company that built a hospital booking system sold nearly 3 million patients' records.",
      "In the EU, GDPR Art. 9 gives health data extra protection. In the US, HIPAA protects data at doctors and insurers — but a period-tracking or fitness app is usually not covered."
    ],
    "brief:healthcode": [
      "From early 2020 every resident had a QR code in Alipay or WeChat. Green = move freely, yellow = quarantine, red = stay home. You scanned it to enter metros, malls and offices.",
      "About 800 million people used WeChat's version alone — it was the gate to normal life for nearly three years.",
      "The New York Times (2020) inspected the code and found it appeared to send users' location and ID to police servers."
    ],
    "reveal:healthcode": [
      "Henan bank customers whose savings were frozen wanted to protest in Zhengzhou; officials turned their codes red although they had no COVID. It caused public outrage; five officials were punished. One of the few times the misuse was officially admitted.",
      "The example of “function creep”: a tool built for one purpose (health) used for another (stopping protests)."
    ],
    "debrief:healthcode": [
      "Keep it concrete: the code was meant to stop COVID, and was used to stop a protest.",
      "After the November 2022 protests (the “A4” or “white paper” protests, sparked by a deadly fire in Ürümqi) zero-COVID ended and the codes were switched off in December.",
      "Europe's apps (like Poland's ProteGO Safe) used Bluetooth handshakes stored on the phone, not a central database or location — designed so the state couldn't track people."
    ],
    "brief:train": [
      "All train tickets have been in your real name since 2012. 12306 is the official railway booking app.",
      "Since 2020 high-speed trains have no paper tickets: you show your ID card or face at the gate and the system checks it's you.",
      "Fast and convenient — and every trip is logged with your identity, time and destination."
    ],
    "reveal:train": [
      "Western media often describe one big “social credit score” — in reality it's mostly lists. If you lose a court case and don't pay, you go on the “judgment defaulter” list (失信被执行人) — and the system blocks you from buying plane and high-speed rail tickets."
    ],
    "debrief:train": [
      "There's no single national score. Sesame Credit (Alipay) is a private loyalty-style score; the government system is mostly lists of companies and people who broke rules.",
      "That's millions of trips blocked — a powerful punishment without a prison sentence.",
      "Most people on lists are debtors or companies breaking regulations. But controlling who can travel is exactly the kind of tool that can be extended to others."
    ],
    "brief:night": [
      "A rule from 1987: every hotel scans your ID and uploads it to the police system. Foreigners are registered too — in the EU hotels also register foreign guests.",
      "The Huazhu group (Hanting, Ibis China…) leaked data on 130 million guests — reportedly after a programmer uploaded database login details to GitHub.",
      "After public complaints, hotels may no longer force a face scan if you show a valid ID — a small privacy win. Registration with police still happens."
    ],
    "reveal:night": [
      "A small but real example that public pressure can change rules in China — when it doesn't challenge the Party."
    ],
    "debrief:night": [
      "Police Cloud (警务云) links databases. When a flagged “key person” (e.g. a petitioner) checks into a hotel or buys a ticket, local police get an alert (Human Rights Watch, 2017).",
      "The hacker claimed it came from a Shanghai police database left open online — names, ID numbers, addresses, phone numbers and case records of up to a billion people.",
      "No single record is scary. The power is in joining them — that's the next slide: one person, one file."
    ],
    case: [
      "Gallup asks: “Do you feel safe walking alone at night where you live?” China scores higher than the US or Poland. Many Chinese point to cameras as the reason.",
      "China's official murder rate is among the lowest in the world — about ten times lower than the US. Caveat: official crime data in China is hard to verify.",
      "Mobile payment brought hundreds of millions of people into the financial system — street vendors and villagers included. That's real inclusion.",
      "Harvard surveyed people over 13 years: satisfaction with the central government is very high (lower with local officials). Caveat: people may not answer freely.",
      "In an online survey, most respondents saw social credit as a way to punish fraud and build trust — not as surveillance. Urban, educated people approved most."
    ],
    file: [
      "“One person, one file” (一人一档) is a real police goal: merging all records about a person into one profile.",
      "Every card on the wall is a student. Point at the red “key person” tags — those people will get extra attention.",
      "Pick a funny or striking tag to read out — it makes it personal."
    ],
    unique: [
      "With just phone type, language and a few choices, many people in the room are already unique.",
      "Researchers showed 87% of Americans can be identified by ZIP code, birth date and sex alone (Sweeney, 2000). “Anonymous” data can usually be re-identified."
    ],
    meta: [
      "Let them scroll first — the surprise works best in silence.",
      "Any website sees your device, browser, language, screen and IP address without asking. In the EU, tracking you with it needs consent; here we didn't ask — like most apps in China."
    ],
    award: [
      "Read out the list: people gained points for being convenient, obedient and helpful to authority.",
      "And lost points for privacy, protest and refusing to cooperate — the same choices that kept their files clean.",
      "Every year around 1 July (the Party's anniversary) the Party honours “Outstanding Communist Party Members” — loyalty is publicly rewarded.",
      "Then ask the question on the screen: who would be better off in China tomorrow?"
    ],
    end: ["The delete button really erases their record from the server.", "The game showed the Chinese model from the inside — now compare it with the EU and the US."]
  };
  root.EXPLAIN = WHY;
})(typeof window !== "undefined" ? window : globalThis);
