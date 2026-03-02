// =============================================
//   MODULE: LEARNING PATH (with Lesson Detail)
// =============================================
var LearningPath = (function () {
  const PHASES = [
    {
      label: 'Phase 1: Foundation', weeks: 'Weeks 1–3', color: '#6c63ff', lessons: [
        {
          id: 'l1', name: 'Phonetics & Sound System', meta: '20 min · Beginner', xp: 20,
          icon: '🔤', tip: '44 sounds of English',
          theory: `English has **44 distinct sounds** (phonemes), but only 26 letters. Understanding these sounds is the first step to clear pronunciation.

**5 key categories:**
1. **Short vowels** — cat, bit, hot, cup, bed
2. **Long vowels** — cake, kite, home, cute, feet
3. **Consonants** — b, d, f, g, h, j, k, l, m, n, p, r, s, t, v, w, y, z
4. **Blends** — bl, cr, str, spr
5. **Digraphs** — sh, ch, th, wh, ph`,
          practice: ['Repeat after: /æ/ — cat, map, that, back', 'Repeat after: /iː/ — feet, meet, seat, heat', 'Repeat after: /θ/ — think, three, through, throw', 'Say aloud: "The thirty-three thieves thought they thrilled the throne"'],
          exercise: 'Record yourself saying these 5 words: "World, Vegetable, Particularly, Comfortable, February". Focus on each syllable.'
        },
        {
          id: 'l2', name: 'Reducing Mother Tongue Influence', meta: '25 min · Beginner', xp: 25,
          icon: '🗣️', tip: 'Common Indian-English errors',
          theory: `Indian languages significantly influence our English pronunciation. Here are the most common patterns:

**Common substitutions to fix:**
| Indian-English | Correct English | Example |
|---|---|---|
| W → V | Say "World" not "Vorld" | Wine ≠ Vine |
| V → B | Avoid "bery" for "very" | Very, Vivid |
| D → TH | "dis" → "this" | The, This, There |
| Double stress | Bal-ance → BAL-ance | FOtograph |
| Adding vowels | Film → "Filim" | Speak clearly |

**Why it happens:** Our brain maps English sounds to the closest sounds in our native language. Practice re-mapping these.`,
          practice: ['Say: "This vine is very fine" — all 4 sounds differently', 'Contrast: "Vine / Wine / Fine / Mine"', 'Say "THE" — tongue between teeth, breath out gently', 'Record: "Whether the weather is fine, or whether the weather is not"'],
          exercise: 'Pick 3 words you often mispronounce. Record yourself saying them, then compare with the pronunciation on Google Translate.'
        },
        {
          id: 'l3', name: 'Basic Sentence Construction', meta: '20 min · Beginner', xp: 20,
          icon: '📝', tip: 'S + V + O structure',
          theory: `Every English sentence follows a logical structure. Master this and you can construct any sentence.

**The SVO Formula:** Subject + Verb + Object

| Part | Role | Example |
|---|---|---|
| Subject | WHO does it | "I", "The team", "My project" |
| Verb | WHAT they do | "built", "is", "works" |
| Object | What it affects | "an app", "well", "the feature" |

**Common patterns:**
- "I **built** a React application." → S + V + O
- "The system **works** efficiently." → S + V + Adverb
- "We **delivered** the project **on time**." → S + V + O + Adverb

**Interview tip:** Indians often skip the subject. Always say "I think", "I believe", "In my experience" — never start with just the opinion.`,
          practice: ['Construct: "I + designed + an e-commerce website"', 'Construct: "My team + collaborated + across 3 departments"', 'Expand: "I built an app" → add more details', 'Fix: "Was working on the project" → Add "I" at the start!'],
          exercise: 'Write 5 sentences about your main project using S+V+O. Then speak them aloud naturally.'
        },
        {
          id: 'l4', name: 'Vowel & Consonant Mastery', meta: '30 min · Beginner', xp: 30,
          icon: '🎵', tip: 'Short & long vowels',
          theory: `English vowels are particularly tricky because the same letter makes multiple sounds.

**The 5 main vowels and their sounds:**
- **A**: /æ/ (cat), /eɪ/ (cake), /ɑː/ (car)
- **E**: /e/ (bed), /iː/ (feet)
- **I**: /ɪ/ (sit), /aɪ/ (site)
- **O**: /ɒ/ (hot), /əʊ/ (home)
- **U**: /ʌ/ (cup), /uː/ (food)

**Critical consonants for Indians:**
- **TH** (/θ/ and /ð/): Tongue tip between teeth
- **V vs W**: V — top teeth on lower lip; W — round lips only
- **R**: Don't trill! Soft, slightly curled tongue

**The Schwa /ə/:** The most common English sound — "about", "system", "the" — all unstressed vowels become this neutral "uh" sound.`,
          practice: ['Minimal pairs: bit/beat, shot/shut, pool/pull', 'Say TH correctly: think, this, there, through, though', 'Contrast V and W: van/wan, vine/wine, vest/west', 'Practise schwa: about, system, problem, the, a'],
          exercise: 'Record yourself reading this aloud: "The system was particularly vulnerable, especially during the winter months."'
        },
        {
          id: 'l5', name: 'Stress & Intonation Basics', meta: '25 min · Beginner', xp: 25,
          icon: '🎶', tip: 'Which syllable gets emphasis',
          theory: `Word stress changes meaning. Sentence intonation shows your intent.

**Word stress rules:**
- Most 2-syllable nouns: stress on FIRST syllable → PRE-sent, RE-cord, CON-tent
- Most 2-syllable verbs: stress on SECOND syllable → pre-SENT, re-CORD, con-TENT
- "-tion" words: stress before "-tion" → com-MU-ni-CA-tion, pro-NUN-ci-A-tion

**Sentence stress:** Emphasize content words (nouns, verbs, adjectives), reduce function words (the, a, is, of).
- "I BUILT a REACT APP for my PROJECT" ✅
- "I BUILT A REACT APP FOR MY PROJECT" ❌ (unnatural)

**Intonation patterns:**
- ↗ Rising: Questions — "Did you work on this project?"
- ↘ Falling: Statements — "I solved the problem."
- ↗↘ Fall-rise: Uncertainty — "I think it might work."`,
          practice: ['Clap on stressed syllables in: PARticularly, comFORtable, TECHnology', 'Read with falling intonation: "I am a computer science student."', 'Read with rising intonation: "Can you explain your project?"', 'Stress practice: "The PRESENT is a preSENT to the present."'],
          exercise: 'Record your answer to "Tell me about yourself" and listen back. Where do you sound flat? Add more stress variation.'
        },
        {
          id: 'l6', name: '100 Most Used Words', meta: '30 min · Beginner', xp: 30,
          icon: '📖', tip: 'Core vocabulary',
          theory: `Mastering the 100 most common English words gives you ~50% of any conversation. These are mostly function words — practice them until they're automatic.

**Top 30 must-know words (practice these):**
the, be (is/am/are/was/were), to, of, and, a, in, that, have, I, it, for, not, on, with, he, as, you, do, at, this, but, his, by, from, they, we, say, her, she

**Professional conversation starters:**
- "I believe that..." 
- "In my experience..."
- "To put it simply..."
- "What I mean is..."
- "Could you clarify..."
- "I'd like to add that..."

**Bridge phrases (avoid silence):**
- "That's a great question. Let me think for a moment..."
- "If I understand correctly..."
- "What I did was..."`,
          practice: ['Read aloud 10 times: "In my experience, the most important thing is..."', 'Complete: "I believe that [your opinion about technology]"', 'Use these in a sentence: consequently, furthermore, nevertheless', 'Say fluidly: "To be honest, I would say that..."'],
          exercise: 'Have a 2-minute conversation (with yourself or a friend) using at least 10 connecting phrases like "furthermore", "however", "in addition".'
        },
      ]
    },
    {
      label: 'Phase 2: Fluency', weeks: 'Weeks 4–6', color: '#00d4b1', lessons: [
        {
          id: 'l7', name: 'Reducing Hesitation & Fillers', meta: '25 min · Intermediate', xp: 30,
          icon: '⏸️', tip: 'Replace umm/aah with pauses',
          theory: `Hesitation fillers (um, uh, like, basically, you know) make you sound unconfident. The cure is **deliberate pausing**.

**Common fillers to eliminate:**
- "Um, uh, er" → Replace with a brief pause (1-2 seconds)
- "Like" → Remove entirely or replace with "approximately / around"
- "Basically" → Use "essentially / fundamentally / in short"
- "You know" → Remove — trust your listener
- "Kind of / sort of" → Be more specific and confident

**The Power of the Pause:**
A 2-second pause feels longer to YOU than to your listener. The listener perceives it as you thinking carefully. Practice silence.

**Interview technique:**
Say: "That's a great question. [PAUSE] I think the most important aspect is..."
NOT: "Um, yeah, so like, I think maybe it's..."`,
          practice: ['Record 30 seconds about your project — count your fillers', 'Repeat the same recording, replacing all fillers with pauses', 'Read this: "The [pause] most important thing [pause] is communication."', 'Answer "Tell me about yourself" without any fillers — 3 attempts'],
          exercise: 'Record yourself for 2 minutes. Count every "um", "uh", "like", "basically". Then redo the recording aiming for 0 fillers.'
        },
        {
          id: 'l8', name: 'Connected Speech & Linking', meta: '30 min · Intermediate', xp: 30,
          icon: '🔗', tip: 'Flow between words naturally',
          theory: `Native English speakers don't say each word separately — they link them together. This is called **connected speech**.

**4 types of linking:**
1. **Consonant → Vowel linking:** "pick it up" sounds like "pickit up"
2. **Consonant → Consonant (elision):** "next day" → "nex day" (the t is often dropped)
3. **Vowel → Vowel (intrusion):** "go away" → "go-w-away" (a w sound appears)
4. **Reduction:** "want to" → "wanna", "going to" → "gonna" (in casual speech)

**Common reductions in professional speech:**
- "I am going to" → "I'm gonna / I'm going to"
- "Do you" → "D'ya" 
- "What do you" → "Whatcha"
- "Could you" → "Couldja"

**Practice principle:** Don't try to sound like a native immediately. Focus on smooth, flowing speech first.`,
          practice: ['Say fluidly: "I am going to explain the architecture of the application"', 'Link: "pick_it_up", "turn_it_on", "look_at_it"', 'Smooth reading: "Tell me about yourself and your experience"', 'Practice the phrase: "I\'d appreciate it if you could..."'],
          exercise: 'Read a paragraph from any English article aloud, focusing on linking words smoothly rather than pronouncing each word separately.'
        },
        {
          id: 'l9', name: 'Tense Usage in Spoken English', meta: '35 min · Intermediate', xp: 35,
          icon: '⏰', tip: 'Past, present, future',
          theory: `Incorrect tense is one of the most common errors in Indian-English. Spoken English uses specific tenses in specific situations.

**The 4 most important tenses in interviews:**
1. **Simple Past** — for completed actions: "I **built** this project in 2023."
2. **Present Perfect** — for recent/ongoing experience: "I **have worked** with React for 2 years."
3. **Simple Present** — for facts/habits: "I **use** Git for version control."
4. **Past Continuous** — for parallel actions: "While I **was developing** the backend, my team was designing the UI."

**HUGE common errors:**
- ❌ "I am working here since 3 years" → ✅ "I **have been** working here for 3 years"
- ❌ "I did not went" → ✅ "I **did not go**"
- ❌ "She don't know" → ✅ "She **doesn't know**"
- ❌ "The build is fail" → ✅ "The build **has failed** / **failed**"`,
          practice: ['Correct: "I am learning programming since 2020"', 'Correct: "She don\'t understand the concept"', 'Say correctly: "I have worked on 3 major projects in college"', 'Describe your project using Simple Past tense throughout'],
          exercise: 'Write and speak a 1-minute description of your best project using correct tenses for each part: what you built (past), what you know now (present perfect), what you plan to do (future).'
        },
        {
          id: 'l10', name: 'Phrasal Verbs for Daily Use', meta: '25 min · Intermediate', xp: 25,
          icon: '🔧', tip: 'Go through, bring up, etc.',
          theory: `Phrasal verbs are verb + preposition combinations. They're everywhere in professional English.

**Top 20 phrasal verbs for tech/business:**
| Phrasal Verb | Meaning | Example |
|---|---|---|
| set up | establish/configure | "I set up the CI/CD pipeline" |
| figure out | solve/understand | "I figured out the bug" |
| work on | develop/maintain | "I work on the backend" |
| bring up | mention/raise | "Let me bring up the key issue" |
| go through | examine/review | "Let's go through the requirements" |
| look into | investigate | "I'll look into that error" |
| come up with | create/invent | "I came up with a better algorithm" |
| hand over | transfer responsibility | "I handed over the code after review" |
| break down | explain step by step | "Let me break down the architecture" |
| reach out | contact | "Please reach out if you need help" |`,
          practice: ['Use in a sentence: "I figured out..." "I came up with..." "I looked into..."', 'Describe debugging: use "look into", "figure out", "narrow down"', 'Explain a project handoff: use "hand over", "set up", "go through"', 'Answer: "How did you handle a bug?" using 3 phrasal verbs'],
          exercise: 'Tell the story of your best project using at least 6 phrasal verbs from the list above.'
        },
        {
          id: 'l11', name: 'Expressing Opinions Confidently', meta: '30 min · Intermediate', xp: 30,
          icon: '💬', tip: 'I think / In my view',
          theory: `In interviews, expressing opinions confidently (without being arrogant) is a key skill. Use these frameworks:

**Assertive opinion phrases:**
- "In my opinion / view..." 
- "I strongly believe that..."
- "Based on my experience..."
- "I would argue that..."
- "As far as I'm concerned..."

**Agreeing with nuance:**
- "I agree with that, and I'd also add that..."
- "That's a valid point. Building on that..."
- "Absolutely, and what I've found is..."

**Disagreeing professionally:**
- "I see where you're coming from, but..."
- "I respectfully disagree because..."
- "That's one perspective. However, I think..."

**Hedging (when uncertain):**
- "I'm not entirely sure, but I think..."
- "If I recall correctly..."
- "I'd need to verify this, but my understanding is..."`,
          practice: ['Opinion: "I think remote work is better because..."', 'Agree with nuance: "Python is easier than Java... I agree, but..."', 'Disagree politely: "AI will replace developers" — disagree professionally', 'Express uncertainty: answer a question you\'re not 100% sure about'],
          exercise: 'Pick a controversial tech topic (AI, coding bootcamps, low-code tools). Give a 1-minute balanced opinion using assertive but professional phrases.'
        },
        {
          id: 'l12', name: 'Listening & Response Practice', meta: '40 min · Intermediate', xp: 40,
          icon: '👂', tip: 'Active listening techniques',
          theory: `Active listening is NOT just hearing — it's demonstrating understanding and building on what was said.

**Techniques for active listening:**
1. **Paraphrase back:** "So what you're saying is..." / "If I understand correctly..."
2. **Ask clarifying questions:** "Could you elaborate on...?" / "What exactly do you mean by...?"
3. **Affirm understanding:** "I see", "That makes sense", "Right, so..."
4. **Build connection:** "That's similar to what I experienced when..."
5. **Take notes mentally** and reference them later in conversation

**In an interview context:**
- If you don't understand a question: "Could you rephrase that?" or "Let me make sure I understand — are you asking about...?"
- Show engagement: nod, make eye contact, don't interrupt
- Reference earlier points: "Going back to what you said about X..."

**Common Indian communication pitfall:**
We often answer without fully processing the question. Take 2-3 seconds to listen, process, then respond.`,
          practice: ['Practice: hear "Tell me about yourself" → paraphrase → then answer', 'Response to "Why [company]?": listen carefully, add their specific values', 'Clarify: "What exactly do you mean by \'good communication skills\'?"', 'Reference back: answer a Q and connect it to something said earlier'],
          exercise: 'Watch a 5-minute English TED Talk. Then summarize the 3 main points in your own words — spoken aloud.'
        },
      ]
    },
    {
      label: 'Phase 3: Professional Communication', weeks: 'Weeks 7–9', color: '#f59e0b', lessons: [
        {
          id: 'l13', name: 'Email Writing in English', meta: '30 min · Intermediate', xp: 35, icon: '📧', tip: 'Formal & informal formats',
          theory: `Professional emails follow a strict structure. Clear emails build your professional reputation.\n\n**Standard email structure:**\n1. Subject line: clear and specific\n2. Greeting: "Dear [Name]," / "Hi [Name],"\n3. Opening line: state the purpose\n4. Body: main content, concise paragraphs\n5. Call to action: what you want\n6. Closing: "Best regards," / "Thanks,"\n\n**Professional phrases:**\n- "I am writing to inform you about..."\n- "Please find attached..."\n- "I would appreciate your feedback on..."\n- "Looking forward to your response"`,
          practice: ['Write: Subject line for "asking about internship status"', 'Write: Opening line for an apology email', 'Write: A professional 5-line email requesting a meeting', 'Fix: "Dear sir please send me the details ASAP"'],
          exercise: 'Write a complete professional email to your professor asking for a recommendation letter. Use all 6 structural parts.'
        },
        {
          id: 'l14', name: 'Presentation Skills', meta: '40 min · Advanced', xp: 40, icon: '📊', tip: 'Structure, delivery, eye contact',
          theory: `Great presentations follow a formula: Tell → Show → Tell.\n\n**The 3Ps Framework:**\n- **Purpose**: Why should they listen?\n- **Points**: 3 clear main ideas\n- **Proof**: Examples, data, stories\n\n**Opening techniques:**\n- Start with a question: "Have you ever faced this bug at 3 AM?"\n- Start with a statistic: "70% of engineers struggle with communicating their work"\n- Start with a story: "Six months ago, I built something that failed — here's what I learned"\n\n**Delivery tips:**\n- Make eye contact with different people\n- Use hand gestures to emphasize\n- Vary your pace — slow down for key points\n- Pause after important statements`,
          practice: ['Practice opening: "Today I want to talk about..."', 'Slow down delivery: read a sentence, then repeat it 30% slower', 'Eye contact practice: record yourself and check if you look at camera', 'Structure your project in 3 points: What/How/Why'],
          exercise: 'Give a 2-minute presentation about your main project. Record it. Watch it back and improve delivery.'
        },
        {
          id: 'l15', name: 'Explain Tech to Non-Tech', meta: '35 min · Advanced', xp: 35, icon: '🔄', tip: 'Simplify CSE concepts',
          theory: `One of the most valuable skills in tech: explaining complex systems simply.\n\n**The Feynman Technique:**\n1. Explain the concept as if to a 10-year-old\n2. Identify where you got confused\n3. Go back and simplify that part\n4. Use analogies and stories\n\n**Analogy examples:**\n- "An API is like a waiter in a restaurant — it takes your order (request) to the kitchen (server) and brings back the food (response)"\n- "Git is like Google Docs version history — you can see every change and go back in time"\n- "RAM is like your desk — the bigger it is, the more you can work on simultaneously"\n\n**What to avoid:** Don't say "basically", avoid jargon, don't assume prior knowledge`,
          practice: ['Explain "what is a database" to a 10-year-old', 'Explain "API" using a restaurant analogy', 'Explain your biggest project in 30 seconds without jargon', 'Explain recursion using a real-life analogy'],
          exercise: 'Explain how your main project works to an imaginary non-technical parent. Record it. It should be under 90 seconds and jargon-free.'
        },
        {
          id: 'l16', name: 'Group Discussion Techniques', meta: '30 min · Advanced', xp: 30, icon: '👥', tip: 'Interrupt politely',
          theory: `Group Discussions (GDs) are part of many selection processes. Key: contribute without dominating.\n\n**Entering a discussion:**\n- "I'd like to add a point here..."\n- "Building on what [X] said..."\n- "That's a great point. I'd also like to mention..."\n\n**Interrupting politely:**\n- "Sorry to interrupt, but..."\n- "If I may add..."\n- "Just to clarify the point..."\n\n**Bringing others in:**\n- "What do you think, [X]?"\n- "I'd like to hear another perspective on this."\n\n**Summarizing/concluding:**\n- "To summarize what we've discussed..."\n- "The group seems to agree that..."\n- "In conclusion, the key points are..."`,
          practice: ['Practice entering: "I\'d like to add that..."', 'Interrupt politely: "If I may add a quick point..."', 'Summarize: "So we\'ve discussed X, Y, and Z. In conclusion..."', 'Lead the conclusion: "To wrap up our discussion..."'],
          exercise: 'Pick a GD topic (e.g., "AI in Education") and speak for 2 minutes covering multiple perspectives. Use transition phrases.'
        },
        {
          id: 'l17', name: 'Business Vocabulary for CSE', meta: '25 min · Intermediate', xp: 25, icon: '💼', tip: 'Agile, sprint, deployment',
          theory: `Tech companies use specific business vocabulary. Knowing these terms shows professionalism.\n\n**Agile & Development terms:**\n- **Sprint**: A short (2-week) development cycle\n- **Standup**: Daily 15-min team sync meeting\n- **Backlog**: List of pending tasks\n- **MVP**: Minimum Viable Product\n- **Iteration**: One round of improvement\n- **Stakeholder**: Anyone with interest in the project\n\n**General business terms:**\n- **KPI**: Key Performance Indicator (measurable goal)\n- **Bandwidth**: Capacity/availability ("Do you have bandwidth for this?")\n- **Leverage**: Use something to advantage ("We can leverage existing code")\n- **Scalable**: Able to grow without problems\n- **ROI**: Return on Investment`,
          practice: ['Use in a sentence: "Our team follows an agile sprint model"', 'Explain: "We built an MVP and iterated based on user feedback"', 'Use: "The system is scalable to handle 10x more users"', 'Describe your project workflow using: sprint, backlog, iteration'],
          exercise: 'Describe a project you worked on using at least 8 business/tech terms from this lesson.'
        },
        {
          id: 'l18', name: 'Asking Smart Questions', meta: '20 min · Intermediate', xp: 20, icon: '❓', tip: 'Clarify, explore, probe',
          theory: `Asking the right questions shows intelligence and engagement. At the end of an interview, always ask questions!\n\n**Types of smart questions:**\n- **Clarifying**: "Could you elaborate on what you mean by [X]?"\n- **Exploring**: "What does a typical day look like for this role?"\n- **Probing**: "How does the team handle technical debt?"\n- **Future-focused**: "What are the growth opportunities for someone in this position?"\n\n**Must-ask interview questions:**\n1. "What does success look like in this role after 3 months?"\n2. "What technical challenges is the team currently facing?"\n3. "How does code review work in your team?"\n4. "What opportunities are there for learning and mentorship?"\n5. "What's the tech stack and how often does it evolve?"\n\n**Never ask:** salary (first round), "What does your company do?" (should know already)`,
          practice: ['Ask 3 questions you\'d want to know after a tech interview', 'Formulate: a question about tech stack and growth', 'Practice: "Could you elaborate on the team structure?"', 'Rephrase: "How much do I get paid?" professionally'],
          exercise: 'Come up with 5 unique smart questions to ask in your dream company\'s interview. Speak them aloud confidently.'
        },
      ]
    },
    {
      label: 'Phase 4: Interview Mastery', weeks: 'Weeks 10–12', color: '#f43f5e', lessons: [
        {
          id: 'l19', name: 'Tell Me About Yourself', meta: '30 min · Advanced', xp: 45, icon: '🙋', tip: 'Present, past, future formula',
          theory: `"Tell me about yourself" is the most important interview question. Master it.\n\n**The 3-Part Formula:**\n1. **Present**: Who you are + current situation\n2. **Past**: What you've done + key achievement\n3. **Future**: Why this company + your goal\n\n**Template:**\n"I am [Name], a final-year CSE student at [College]. I specialize in [your stack]. Most recently, I built [your best project] — [one impressive result]. Before that, I [internship/achievement]. I'm particularly excited about this role because [specific reason], and I see myself [future goal]."\n\n**Golden rules:**\n- Keep it to 60-90 seconds\n- Start with present, not birth date!\n- End with WHY this company\n- Practice until it sounds natural, not memorized`,
          practice: ['Draft your 3-part intro following the formula', 'Time yourself: must be between 60-90 seconds', 'Record and check: does it end with "why this company"?', 'Remove all fillers: no "um", "so", "basically"'],
          exercise: 'Record your "Tell me about yourself" answer 3 times. Each time, make it sound more natural and less memorized.'
        },
        {
          id: 'l20', name: 'STAR Method for Behavioral Qs', meta: '35 min · Advanced', xp: 45, icon: '⭐', tip: 'Situation Task Action Result',
          theory: `Behavioral questions require the STAR method for structured answers.\n\n**STAR Framework:**\n- **S**ituation: Set the context (1-2 sentences)\n- **T**ask: Your role/responsibility (1 sentence)\n- **A**ction: What YOU specifically did (3-4 sentences — this is the main part)\n- **R**esult: Measurable outcome (1-2 sentences)\n\n**Example — "Tell me about a time you faced a technical challenge":**\n- S: "During my 3rd year project, our database was timing out under heavy load."\n- T: "As the backend developer, it was my responsibility to resolve this."\n- A: "I profiled the queries, added indexes, implemented caching with Redis, and rewrote 3 slow queries."\n- R: "This reduced response time from 3 seconds to 200ms — a 15x improvement."\n\n**KEY**: The Action step must use "I", not "we". Show YOUR specific contribution.`,
          practice: ['Tell a STAR story about: "a project that went wrong"', 'Tell a STAR story about: "working in a team with conflict"', 'Tell a STAR story about: "learning something quickly under pressure"', 'Check: does your Result include a number/metric?'],
          exercise: 'Prepare STAR answers for these 3 questions: (1) biggest challenge (2) leadership example (3) failure and lesson.'
        },
        {
          id: 'l21', name: 'Answering HR Questions', meta: '40 min · Advanced', xp: 50, icon: '🤝', tip: 'Strengths, weaknesses, goals',
          theory: `HR rounds assess cultural fit and soft skills. Know these answers cold.\n\n**Strengths (pick 3, give examples):**\n"My key strengths are problem-solving, quick learning, and collaboration. For instance, when [specific example]..."\n\n**Weaknesses (show self-awareness + growth):**\n"My weakness is that I tend to over-engineer solutions. I've been working on this by setting scope limits and timeboxing." NEVER say: "I work too hard" or "I have no weaknesses."\n\n**Salary expectations:**\n"Based on my research and skills, I'm targeting [range]. However, I'm flexible depending on the overall compensation package and growth opportunities."\n\n**Why this company:**\nSpecific reasons — their product, tech stack, culture, problems they solve. Research beforehand!\n\n**Greatest achievement:**\nUse STAR: a specific, quantified result from a project, competition, or internship.`,
          practice: ['List your top 3 professional strengths with examples', 'Prepare a genuine weakness + what you\'re doing about it', 'Answer: "Where do you see yourself in 5 years?"', 'Research one company and prepare a specific "Why [Company]?"'],
          exercise: 'Record a complete HR interview round: Tell me about yourself → Strength → Weakness → Why this company → Goals. Full 5 minutes.'
        },
        {
          id: 'l22', name: 'Technical Interview Communication', meta: '45 min · Advanced', xp: 50, icon: '🖥️', tip: 'Think aloud while solving DSA',
          theory: `Technical interviews aren't just about solving problems — they assess HOW you communicate your thinking.\n\n**Think-aloud technique:**\n1. "Let me understand the problem first... So I need to..."\n2. "My first instinct is to use [approach] because..."\n3. "Let me think about edge cases... What if the input is empty / negative / very large?"\n4. "The time complexity of this would be O(n log n), and space complexity O(n)"\n5. "Let me code this up... [code] ... and test with an example"\n\n**Communication phrases for coding:**\n- "I'm going to use a HashMap here because..."\n- "This has O(n²) time complexity — let me see if I can optimize this"\n- "I see an edge case here — what if [X]?"\n- "Let me trace through with the example: if input is [X], then [Y]..."\n\n**When stuck:** "Let me think through this differently..." or "Could you give me a hint on the approach?"`,
          practice: ['Explain aloud: "How would you reverse a linked list?"', 'Explain: time and space complexity of binary search', 'Practice: "I see a potential edge case where..."', 'Role-play: stuck on a problem → ask for hint professionally'],
          exercise: 'Pick any LeetCode Easy problem. Solve it while narrating every thought aloud — as if in a real interview.'
        },
        {
          id: 'l23', name: 'Body Language & Confidence', meta: '25 min · Advanced', xp: 30, icon: '💪', tip: 'Eye contact, posture, gestures',
          theory: `Body language is 55% of communication. Your non-verbal signals matter as much as words.\n\n**Posture:**\n- Sit up straight — conveys confidence and attention\n- Lean slightly forward — shows engagement\n- Don't cross arms — appears defensive\n\n**Eye contact:**\n- Online: look at the CAMERA, not the screen\n- Hold eye contact for 3-5 seconds at a time\n- Don't stare continuously — that's uncomfortable\n\n**Hand gestures:**\n- Use open palms to show honesty\n- Count points on your fingers\n- Avoid pointing directly — use open hand\n\n**Voice confidence:**\n- Speak from your diaphragm, not your nose\n- Don't raise pitch at end of statements (uptalk)\n- Smile — it warms your voice even on the phone\n\n**Online interview tips:**\n- Camera at eye level (raise laptop if needed)\n- Good lighting from front\n- Clean, professional background`,
          practice: ['Practice in mirror: speak for 1 min making eye contact', 'Record: are you hunching? Correct posture and re-record', 'Gesture practice: count 3 points on your fingers while explaining', 'Voice: say "I am confident" in a confident tone vs uncertain tone'],
          exercise: 'Set up your camera as if for a real interview. Record a 3-minute mock answer. Review posture, eye contact, gestures.'
        },
        {
          id: 'l24', name: 'Full Mock Interview', meta: '60 min · Advanced', xp: 75, icon: '🏆', tip: 'Complete interview simulation',
          theory: `This is your final test. A complete mock interview covering all topics you've mastered.\n\n**Interview structure to simulate:**\n1. Self-introduction (2 min)\n2. HR questions — 3 questions (10 min)\n3. Technical discussion — project deep-dive (15 min)\n4. Behavioral questions — 2 STAR stories (10 min)\n5. DSA problem — explain while solving (15 min)\n6. Your questions to interviewer (5 min)\n\n**Preparation checklist:**\n☐ Clear "Tell me about yourself" answer\n☐ 3 STAR stories ready\n☐ 5 smart questions to ask\n☐ Your projects explained with depth\n☐ 3 languages/frameworks to discuss confidently\n☐ Camera setup, lighting, background\n\n**After the interview:**\n- Send a thank-you email within 24 hours\n- Note down all questions asked\n- Improve weak areas before next interview`,
          practice: ['Time your intro: must be 60-90 seconds exactly', 'List 5 questions you\'ll ask at the end', 'Write one STAR story for "biggest challenge" — memorize it', 'Set up your interview environment: camera, lighting, background'],
          exercise: 'Do a complete 45-minute mock interview session — either with a friend, or record yourself answering all 6 types of questions in sequence.'
        },
      ]
    },
  ];

  let currentLesson = null;  // null = list view, lesson obj = detail view
  let prevPage = null;

  function render() {
    currentLesson = null;
    renderList();
  }

  // ─────────────────────────────────────────────
  //  LIST VIEW
  // ─────────────────────────────────────────────
  function renderList() {
    const st = App.getState();
    const completed = new Set(st.lessonsCompleted || []);
    const total = PHASES.reduce((a, p) => a + p.lessons.length, 0);
    const pct = Math.round((completed.size / total) * 100);

    document.getElementById('page-learning-path').innerHTML = `
      <div class="page-hdr">
        <h1>Learning <span>Path</span></h1>
        <p>12-week structured English mastery program for CSE students — click any lesson to open it</p>
      </div>

      <div class="card" style="margin-bottom:24px;display:flex;align-items:center;gap:24px">
        <div>
          <div style="font-size:38px;font-weight:900;font-family:var(--font2);color:var(--accent2)">${pct}%</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px">Complete</div>
        </div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:8px">
            <span>${completed.size} / ${total} lessons done</span>
            <span style="color:var(--accent2);font-weight:600">${total - completed.size} remaining</span>
          </div>
          <div class="progress-track" style="height:10px">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      ${PHASES.map((ph, i) => `
        <div class="phase-block">
          <div class="phase-hdr">
            <div class="phase-dot" style="background:${ph.color}">${i + 1}</div>
            <div>
              <div class="phase-name">${ph.label}</div>
              <div style="font-size:12px;color:var(--text3)">${ph.weeks}</div>
            </div>
            <div style="margin-left:auto">
              <span class="chip ${i === 0 ? 'chip-accent' : i === 1 ? 'chip-teal' : i === 2 ? 'chip-amber' : 'chip-rose'}">${ph.lessons.filter(l => completed.has(l.id)).length}/${ph.lessons.length} done</span>
            </div>
          </div>
          <div class="lessons-grid">
            ${ph.lessons.map(l => {
      const done = completed.has(l.id);
      return `
                <button class="lesson-row ${done ? 'done' : ''}" data-id="${l.id}"
                  style="text-align:left;width:100%;cursor:pointer">
                  <div class="lesson-check ${done ? 'done' : ''}">${done ? '<i class="fas fa-check"></i>' : l.icon}</div>
                  <div style="flex:1">
                    <div class="lesson-title">${l.name}</div>
                    <div style="font-size:11px;color:var(--text3);margin-top:2px">${l.meta} · ${l.tip}</div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                    <div class="lesson-xp">+${l.xp} XP</div>
                    ${done ? '<span style="font-size:10px;color:var(--emerald)">✅ Done</span>' : '<i class="fas fa-chevron-right" style="color:var(--text3);font-size:11px"></i>'}
                  </div>
                </button>`;
    }).join('')}
          </div>
        </div>
      `).join('')}
    `;

    document.querySelectorAll('.lesson-row[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const lesson = PHASES.flatMap(p => p.lessons).find(l => l.id === id);
        if (lesson) openLesson(lesson);
      });
    });
  }

  // ─────────────────────────────────────────────
  //  LESSON DETAIL VIEW
  // ─────────────────────────────────────────────
  function openLesson(lesson) {
    currentLesson = lesson;
    const st = App.getState();
    const completed = new Set(st.lessonsCompleted || []);
    const isDone = completed.has(lesson.id);
    // find phase for color
    const phase = PHASES.find(p => p.lessons.some(l => l.id === lesson.id));
    const phaseColor = phase?.color || 'var(--accent)';
    // find next lesson
    const allLessons = PHASES.flatMap(p => p.lessons);
    const idx = allLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = allLessons[idx + 1] || null;

    // Convert **bold** markdown to HTML
    function md(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p style="margin-top:10px">')
        .replace(/\n/g, '<br>')
        .replace(/\| (.*?) \|/g, (_, row) => `<td style="padding:6px 12px;border-bottom:1px solid var(--border2)">${row}</td>`)
        .replace(/<td/g, m => m);
    }

    // Split theory into paragraphs
    const theoryHtml = '<p style="margin-top:0">' + md(lesson.theory) + '</p>';

    document.getElementById('page-learning-path').innerHTML = `
      <!-- Breadcrumb back -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <button class="btn btn-ghost btn-sm" id="back-to-list">
          <i class="fas fa-arrow-left"></i> Learning Path
        </button>
        <span style="color:var(--text3);font-size:13px">/ ${phase?.label}</span>
        <span style="color:var(--text3);font-size:13px">/ ${lesson.name}</span>
        ${isDone ? '<span class="chip chip-emerald" style="margin-left:auto">✅ Completed</span>' : '<span class="chip chip-amber" style="margin-left:auto">+' + lesson.xp + ' XP on completion</span>'}
      </div>

      <div class="sidebar-layout" style="align-items:start">
        <!-- LEFT: Main lesson content -->
        <div>
          <!-- Hero -->
          <div class="hero-card" style="margin-bottom:22px;background:linear-gradient(135deg,${phaseColor}22,${phaseColor}08);border-color:${phaseColor}33">
            <div style="font-size:52px;margin-bottom:12px">${lesson.icon}</div>
            <div style="font-family:var(--font2);font-size:26px;font-weight:800">${lesson.name}</div>
            <div style="color:var(--text2);font-size:14px;margin-top:6px">${lesson.meta}</div>
            <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
              <span class="chip chip-teal"><i class="fas fa-lightbulb"></i> ${lesson.tip}</span>
              <span class="chip chip-amber"><i class="fas fa-star"></i> +${lesson.xp} XP</span>
              ${phase ? `<span class="chip" style="background:${phaseColor}18;color:${phaseColor};border:1px solid ${phaseColor}30">${phase.label}</span>` : ''}
            </div>
          </div>

          <!-- Theory -->
          <div class="card" style="margin-bottom:18px">
            <div class="sec-title" style="font-size:15px"><i class="fas fa-book-open" style="color:var(--accent2)"></i> Lesson Content</div>
            <div style="font-size:14px;color:var(--text2);line-height:1.9;font-family:var(--font)">
              ${theoryHtml}
            </div>
          </div>

          <!-- Practice Drill -->
          <div class="card" style="margin-bottom:18px;background:rgba(0,212,177,0.04);border-color:rgba(0,212,177,0.15)">
            <div class="sec-title" style="font-size:15px"><i class="fas fa-microphone" style="color:var(--teal)"></i> Practice Drills</div>
            <div style="color:var(--text2);font-size:12px;margin-bottom:14px">Speak each drill aloud — don't just read!</div>
            ${lesson.practice.map((p, i) => `
              <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid var(--border2)">
                <div style="width:28px;height:28px;border-radius:50%;background:${phaseColor}22;border:1px solid ${phaseColor}33;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:${phaseColor};flex-shrink:0">${i + 1}</div>
                <div style="flex:1;font-size:13px;color:var(--text1);line-height:1.6">${p}</div>
                <button class="btn btn-ghost btn-sm speak-drill" data-text="${p.replace(/"/g, '&quot;')}" style="flex-shrink:0">
                  <i class="fas fa-volume-up"></i>
                </button>
              </div>`).join('')}
          </div>

          <!-- Assignment -->
          <div class="card" style="margin-bottom:20px;background:rgba(108,99,255,0.06);border-color:rgba(108,99,255,0.18)">
            <div class="sec-title" style="font-size:15px"><i class="fas fa-tasks" style="color:var(--accent2)"></i> Assignment</div>
            <div style="font-size:14px;color:var(--text2);line-height:1.8">${lesson.exercise}</div>
          </div>

          <!-- Complete button -->
          ${!isDone ? `
          <button class="btn btn-primary btn-full" id="mark-done-btn" style="padding:16px;font-size:16px;margin-bottom:16px">
            <i class="fas fa-check-circle"></i> Mark as Complete & Earn +${lesson.xp} XP
          </button>` : `
          <div class="card" style="background:rgba(16,185,129,0.08);border-color:rgba(16,185,129,0.25);text-align:center;padding:18px;margin-bottom:16px">
            <i class="fas fa-check-circle" style="font-size:28px;color:var(--emerald);margin-bottom:8px;display:block"></i>
            <div style="font-weight:700;color:var(--emerald)">Lesson Completed!</div>
            <div style="font-size:12px;color:var(--text2);margin-top:4px">You earned +${lesson.xp} XP for this lesson</div>
          </div>`}

          <!-- Next Lesson -->
          ${nextLesson ? `
          <button class="btn btn-ghost btn-full" id="next-lesson-btn" style="padding:14px">
            <i class="fas fa-arrow-right"></i> Next: ${nextLesson.name}
          </button>` : ''}
        </div>

        <!-- RIGHT: Sidebar -->
        <div style="position:sticky;top:calc(var(--topbar-h) + 20px)">
          <!-- Quick navigation -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:12px">Quick Navigation</div>
            ${allLessons.map((l, i) => `
              <div class="lesson-nav-item ${l.id === lesson.id ? 'active' : ''}" data-lid="${l.id}"
                style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border2);cursor:pointer;transition:var(--tr)">
                <span style="font-size:16px">${l.icon}</span>
                <span style="font-size:11px;font-weight:${l.id === lesson.id ? '700' : '500'};color:${l.id === lesson.id ? 'var(--accent2)' : 'var(--text2)'};flex:1;line-height:1.4">${l.name}</span>
                ${completed.has(l.id) ? '<i class="fas fa-check" style="color:var(--emerald);font-size:10px"></i>' : ''}
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('back-to-list').addEventListener('click', () => { currentLesson = null; renderList(); });
    document.getElementById('mark-done-btn')?.addEventListener('click', () => {
      const list = [...(App.getState().lessonsCompleted || [])];
      if (!list.includes(lesson.id)) {
        list.push(lesson.id);
        App.setState({ lessonsCompleted: list });
        App.addXP(lesson.xp, 'Lesson: ' + lesson.name);
      }
      openLesson(lesson); // re-render with completed state
    });
    document.getElementById('next-lesson-btn')?.addEventListener('click', () => { if (nextLesson) openLesson(nextLesson); });
    document.querySelectorAll('.speak-drill').forEach(btn => {
      btn.addEventListener('click', () => App.speak(btn.dataset.text));
    });
    document.querySelectorAll('.lesson-nav-item[data-lid]').forEach(nav => {
      nav.addEventListener('click', () => {
        const l = allLessons.find(x => x.id === nav.dataset.lid);
        if (l) openLesson(l);
      });
    });
  }

  return { render };
})();
window.LearningPath = LearningPath;
