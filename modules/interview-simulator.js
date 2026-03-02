// =============================================
//   MODULE: AI INTERVIEW SIMULATOR (CV-POWERED)
// =============================================
var Interview = (function () {

    // ── Fallback question bank (used if no CV) ──
    const FALLBACK = {
        hr: [
            'Tell me about yourself.',
            'What are your greatest strengths and weaknesses?',
            'Why do you want to work at this company?',
            'Where do you see yourself in 5 years?',
            'How do you handle pressure and tight deadlines?',
            'Tell me about a time you failed and what you learned.',
        ],
        tech: [
            'Explain Object-Oriented Programming to a non-technical person.',
            'What is the difference between a process and a thread?',
            'Explain REST API. How does it work?',
            'Walk me through how you would debug a production issue.',
            'What are microservices and when would you use them?',
            'Explain a complex technical project you worked on.',
        ],
        behavioral: [
            'Describe a time you worked in a team under pressure.',
            'Tell me about a difficult colleague and how you handled it.',
            'Give an example of when you showed leadership.',
            'Describe a project where you had to learn something quickly.',
            'Tell me about a time you disagreed with your manager.',
            'How do you prioritize tasks when everything is urgent?',
        ],
    };

    // ── State ──
    let cvText = '';
    let generatedQs = null;   // {hr:[], tech:[], behavioral:[]}
    let type = 'hr';
    let qIdx = 0;
    let isRec = false;
    let transcript = '';
    let isGenerating = false;
    let sessionMode = 'setup'; // 'setup' | 'interview'

    // ── RENDER ENTRY POINT ──
    function render() {
        // Restore saved CV from state if any
        const saved = App.getState().cvText || '';
        if (saved && !cvText) cvText = saved;
        generatedQs = App.getState().cvGeneratedQs || null;

        if (sessionMode === 'interview' && generatedQs) renderInterview();
        else renderSetup();
    }

    // ─────────────────────────────────────────────
    //  SETUP SCREEN  (CV paste + options)
    // ─────────────────────────────────────────────
    function renderSetup() {
        sessionMode = 'setup';
        const hasCv = cvText.trim().length > 40;
        const hasQs = !!generatedQs;

        document.getElementById('page-interview').innerHTML = `
      <div class="page-hdr">
        <h1>💼 Interview <span>Simulator</span></h1>
        <p>Paste your CV/resume and Gemini AI will generate a personalised mock interview just for you</p>
      </div>

      <div class="two-col" style="align-items:start">

        <!-- LEFT: CV Input -->
        <div>
          <div class="card" style="margin-bottom:18px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
              <div>
                <div style="font-size:16px;font-weight:700">📄 Your CV / Resume</div>
                <div style="font-size:12px;color:var(--text3);margin-top:3px">Paste the text content of your resume below</div>
              </div>
              ${hasCv ? '<span class="chip chip-emerald">✅ CV Loaded</span>' : ''}
            </div>
            <textarea id="cv-input" class="form-input" rows="14"
              style="resize:vertical;font-size:12px;line-height:1.7;font-family:monospace"
              placeholder="Paste your CV here...

Example:
Name: Dilip Kumar
B.Tech CSE, 3rd Year — XYZ University
CGPA: 8.5/10

Projects:
• E-Commerce App (React, Node.js, MongoDB)
  – Built cart, auth, payment gateway
• DSA Visualizer (Python, Tkinter)
  – Visualizes sorting algorithms in real time

Skills: C++, Python, JavaScript, React, Node.js, SQL, Git

Internship:
• Backend Intern at ABC Tech (June 2024)
  – Built REST APIs, improved query performance by 40%

Achievements:
• LeetCode 400+ problems solved
• Codeforces Rating 1450
• 2nd place, College Hackathon 2024">${cvText}</textarea>
            <div style="display:flex;gap:10px;margin-top:12px">
              <button class="btn btn-primary" id="save-cv-btn" style="flex:1">
                <i class="fas fa-magic"></i> Generate Interview Questions with AI
              </button>
              <button class="btn btn-ghost btn-sm" id="clear-cv-btn" title="Clear CV">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Tips -->
          <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.12)">
            <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:10px">💡 What to include in your CV text</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;color:var(--text2);line-height:1.7">
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>Your name & college</div>
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>Projects with tech stack</div>
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>Skills & languages</div>
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>Internships / work exp</div>
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>CGPA / achievements</div>
              <div><i class="fas fa-check-circle" style="color:var(--emerald);margin-right:5px"></i>Competitive programming</div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Options + Previously generated -->
        <div>
          <!-- Interview type selector -->
          <div class="card" style="margin-bottom:14px">
            <div style="font-size:14px;font-weight:700;margin-bottom:14px">Interview Type</div>
            <div style="display:flex;flex-direction:column;gap:8px" id="int-type-list">
              ${[
                { id: 'hr', icon: '👤', label: 'HR Round', desc: 'Personality, goals, communication' },
                { id: 'tech', icon: '💻', label: 'Technical Round', desc: 'Your projects, tech stack, CS concepts' },
                { id: 'behavioral', icon: '🧠', label: 'Behavioural Round', desc: 'Situations, teamwork, leadership' },
                { id: 'full', icon: '🎯', label: 'Full Interview', desc: 'Mix of all rounds (recommended)' },
            ].map(t => `
                <label style="display:flex;align-items:center;gap:12px;background:var(--bg3);border:2px solid ${type === t.id ? 'var(--accent)' : 'var(--border2)'};border-radius:12px;padding:12px 14px;cursor:pointer;transition:var(--tr)" class="type-radio-label" data-type="${t.id}">
                  <input type="radio" name="int-type" value="${t.id}" ${type === t.id ? 'checked' : ''} style="display:none">
                  <span style="font-size:22px">${t.icon}</span>
                  <div>
                    <div style="font-weight:700;font-size:13px">${t.label}</div>
                    <div style="font-size:11px;color:var(--text3)">${t.desc}</div>
                  </div>
                </label>`).join('')}
            </div>
          </div>

          <!-- Start without CV -->
          <div class="card" style="margin-bottom:14px">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">🎲 Quick Start (no CV)</div>
            <div style="font-size:12px;color:var(--text2);margin-bottom:12px">Use our built-in question bank for general practice</div>
            <button class="btn btn-ghost btn-sm btn-full" id="quick-start-btn">
              <i class="fas fa-play"></i> Start General Interview
            </button>
          </div>

          <!-- Previously generated -->
          ${hasQs ? `
          <div class="card" style="background:rgba(16,185,129,0.05);border-color:rgba(16,185,129,0.2)">
            <div style="font-size:13px;font-weight:600;color:var(--emerald);margin-bottom:6px">✅ Questions Ready!</div>
            <div style="font-size:12px;color:var(--text2);margin-bottom:12px">AI already generated personalized questions from your CV</div>
            <button class="btn btn-teal btn-sm btn-full" id="resume-interview-btn">
              <i class="fas fa-play-circle"></i> Continue My Interview
            </button>
          </div>` : ''}
        </div>
      </div>

      <!-- Generating overlay -->
      <div id="generating-overlay" style="display:none;position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;flex-direction:column;gap:18px;text-align:center">
        <div class="spinner" style="width:52px;height:52px;border-width:4px"></div>
        <div style="font-family:var(--font2);font-size:22px;font-weight:700">Gemini is reading your CV...</div>
        <div style="color:var(--text2);font-size:14px">Generating personalised interview questions based on your background</div>
      </div>
    `;

        // Type selector
        document.querySelectorAll('.type-radio-label').forEach(label => {
            label.addEventListener('click', () => {
                type = label.dataset.type;
                document.querySelectorAll('.type-radio-label').forEach(l =>
                    l.style.borderColor = l.dataset.type === type ? 'var(--accent)' : 'var(--border2)'
                );
            });
        });

        document.getElementById('save-cv-btn').addEventListener('click', generateFromCV);
        document.getElementById('clear-cv-btn').addEventListener('click', () => {
            cvText = ''; generatedQs = null;
            App.setState({ cvText: '', cvGeneratedQs: null });
            renderSetup();
        });
        document.getElementById('quick-start-btn').addEventListener('click', () => {
            generatedQs = FALLBACK; sessionMode = 'interview'; qIdx = 0;
            renderInterview();
        });
        document.getElementById('resume-interview-btn')?.addEventListener('click', () => {
            sessionMode = 'interview'; qIdx = 0; renderInterview();
        });
    }

    // ─────────────────────────────────────────────
    //  GENERATE QUESTIONS FROM CV
    // ─────────────────────────────────────────────
    async function generateFromCV() {
        const inputEl = document.getElementById('cv-input');
        const text = inputEl?.value?.trim() || '';
        if (text.length < 40) {
            App.toast('Please paste your CV content first (at least 40 characters)', 'error');
            return;
        }
        cvText = text;
        App.setState({ cvText: text });

        // Show overlay
        const overlay = document.getElementById('generating-overlay');
        if (overlay) { overlay.style.display = 'flex'; }

        const prompt = `You are an expert technical interviewer at a top tech company (Google/Microsoft/Amazon level). 
A student has provided their resume/CV. Generate a comprehensive, personalized interview question set based SPECIFICALLY on their background.

STUDENT'S CV:
${text}

Generate questions that:
1. Reference their SPECIFIC projects, tech stack, and experiences
2. Probe deep into their stated skills
3. Challenge them on concepts from their chosen domain
4. Include scenario questions based on their project work

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "hr": [
    "Tell me about yourself — specifically walk me through your journey from [their college] to becoming a [their role/skills] developer.",
    "Your CV mentions [specific achievement]. Can you tell me more about that?",
    "Why are you specifically interested in [their target domain based on CV]?",
    "What's the most challenging problem you've solved, and how did you communicate that to non-technical people?",
    "In 5 years, where do you see yourself given your focus on [their tech stack]?",
    "What motivates you to work in [their area of interest]?"
  ],
  "tech": [
    "I see you've worked with [specific tech from their CV]. Explain [relevant deep concept].",
    "In your [project name] project, how did you handle [specific technical challenge]?",
    "Walk me through the architecture of [their main project].",
    "You know [specific language]. What's the difference between [relevant comparison]?",
    "How would you scale [their project] to handle 1 million users?",
    "What was the biggest technical challenge in [their project] and how did you solve it?"
  ],
  "behavioral": [
    "Tell me about a time during [their project/internship] when you faced a major technical setback.",
    "How did you manage your time between academics and [their extracurricular/projects]?",
    "Describe a time you had to learn [technology from their CV] quickly. What was your approach?",
    "Tell me about a collaborative project. What was your specific contribution?",
    "Have you ever disagreed with a peer on a technical decision in [context from CV]? How did you handle it?",
    "What's the biggest lesson you've learned from [their most significant experience on CV]?"
  ]
}

Make every question SPECIFIC to their actual CV content — reference real project names, real technologies, real achievements they mentioned.`;

        const res = await App.callGemini(prompt);
        if (overlay) { overlay.style.display = 'none'; }

        if (res.error) {
            App.toast('AI Error: ' + res.error, 'error');
            return;
        }
        try {
            const m = res.text.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(m?.[0] || res.text);
            // Build 'full' type as a mixed set
            const allQs = [
                ...(parsed.hr || []).slice(0, 2),
                ...(parsed.tech || []).slice(0, 3),
                ...(parsed.behavioral || []).slice(0, 2),
            ];
            parsed.full = allQs;
            generatedQs = parsed;
            App.setState({ cvGeneratedQs: parsed });
            App.toast('✅ Personalized interview ready!', 'success');
            sessionMode = 'interview'; qIdx = 0;
            renderInterview();
        } catch (e) {
            App.toast('Could not parse AI response. Try again.', 'error');
            // Fallback: use the raw text as a single question
            generatedQs = { ...FALLBACK, full: [res.text, ...FALLBACK.hr] };
            sessionMode = 'interview'; qIdx = 0;
            renderInterview();
        }
    }

    // ─────────────────────────────────────────────
    //  INTERVIEW SCREEN
    // ─────────────────────────────────────────────
    function renderInterview() {
        sessionMode = 'interview';
        const qs = getQuestions();
        const isCvBased = !!cvText && cvText.trim().length > 40 && generatedQs && generatedQs !== FALLBACK;
        const q = qs[qIdx] || 'Tell me about yourself.';

        document.getElementById('page-interview').innerHTML = `
      <div class="page-hdr" style="margin-bottom:16px">
        <h1>💼 Interview <span>Simulator</span></h1>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          ${isCvBased ? `<span class="chip chip-emerald"><i class="fas fa-file-alt"></i> CV-Personalised</span>` : '<span class="chip chip-amber">General Mode</span>'}
          <span class="chip chip-accent">${type.toUpperCase()} Round</span>
          <button class="btn btn-ghost btn-sm" id="back-to-setup" style="margin-left:auto">
            <i class="fas fa-arrow-left"></i> Change CV / Type
          </button>
        </div>
      </div>

      <div class="type-pills" id="type-pills">
        ${(['hr', 'tech', 'behavioral', 'full']).map(t => `
          <button class="type-pill ${type === t ? 'active' : ''}" data-type="${t}">
            ${{ hr: '👤 HR', tech: '💻 Tech', behavioral: '🧠 Behavioural', full: '🎯 Full' }[t]}
          </button>`).join('')}
      </div>

      <div class="interview-layout">
        <!-- LEFT: Question + Answer -->
        <div>
          <!-- Progress bar -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="font-size:12px;color:var(--text3);flex-shrink:0">Q ${qIdx + 1} of ${qs.length}</div>
            <div class="progress-track" style="flex:1;height:5px">
              <div class="progress-fill" style="width:${Math.round(((qIdx) / qs.length) * 100)}%"></div>
            </div>
            <div style="font-size:12px;color:var(--text2);flex-shrink:0">${qs.length - qIdx - 1} remaining</div>
          </div>

          <div class="question-panel" style="margin-bottom:16px">
            <div class="q-num">Question ${qIdx + 1} of ${qs.length} · ${type.toUpperCase()} ROUND ${isCvBased ? '· Personalised from your CV' : ''}</div>
            <div class="q-text">"${q}"</div>
          </div>

          <!-- Answer area -->
          <div contenteditable="true" class="answer-box" id="answer-box"
            placeholder="Speak your answer using the mic, or type it here... Use the STAR method: Situation → Task → Action → Result"
            data-placeholder="Speak your answer using the mic, or type it here... Use the STAR method: Situation → Task → Action → Result">
          </div>

          <!-- Controls -->
          <div class="interview-controls" style="margin-bottom:14px">
            <button class="mic-btn" id="int-mic" style="width:52px;height:52px;font-size:20px" title="Record your answer">
              <i class="fas fa-microphone"></i>
            </button>
            <div id="int-status" style="flex:1;font-size:13px;color:var(--text2)">
              ${App.SpeechRec.isSupported ? '🎙️ Tap mic to answer verbally — just like a real interview!' : '⚠️ Voice needs Chrome — type instead'}
            </div>
            <button class="btn btn-ghost btn-sm" id="skip-q-btn"><i class="fas fa-forward"></i> Skip</button>
            <button class="btn btn-primary" id="get-feedback-btn"><i class="fas fa-robot"></i> Get AI Feedback</button>
          </div>

          <!-- STAR Tip -->
          <div class="card" style="background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.15)">
            <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:6px">💡 STRATEGY</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7">
              Use the <strong style="color:var(--text1)">STAR method</strong>: <em>Situation → Task → Action → Result</em>. 
              Aim for <strong style="color:var(--text1)">60–90 seconds</strong>. Avoid fillers (<em>um, uh, like, basically</em>).
              ${isCvBased ? ' The question is based on <strong style="color:var(--teal)">your actual CV</strong> — use those specific examples!' : ''}
            </div>
          </div>

          <!-- Navigation between questions -->
          <div style="display:flex;gap:8px;margin-top:14px">
            <button class="btn btn-ghost btn-sm" id="prev-q-btn" ${qIdx === 0 ? 'disabled style="opacity:0.4"' : ''}>
              <i class="fas fa-chevron-left"></i> Prev
            </button>
            <button class="btn btn-ghost btn-sm" id="next-q-btn" ${qIdx >= qs.length - 1 ? 'disabled style="opacity:0.4"' : ''}>
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- RIGHT: AI Feedback Panel + All Questions -->
        <div>
          <div class="ai-feedback-panel" style="margin-bottom:14px">
            <div style="font-size:14px;font-weight:700;margin-bottom:4px">
              <i class="fas fa-robot" style="color:var(--accent2)"></i> AI Feedback
            </div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Answer → click "Get AI Feedback" for instant analysis</div>
            <div id="fb-content" style="color:var(--text3);font-size:13px;text-align:center;padding:24px 0">
              <i class="fas fa-comments" style="font-size:34px;opacity:0.2;display:block;margin-bottom:10px"></i>
              Awaiting your answer...
            </div>
          </div>

          <!-- All questions in sidebar -->
          <div class="card">
            <div class="sec-title" style="font-size:12px">All Questions</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              ${qs.map((question, i) => `
                <div class="q-nav-item ${i === qIdx ? 'active' : ''}" data-qi="${i}"
                  style="
                    padding:9px 12px;border-radius:9px;cursor:pointer;
                    background:${i === qIdx ? 'rgba(108,99,255,0.12)' : 'transparent'};
                    border:1px solid ${i === qIdx ? 'rgba(108,99,255,0.25)' : 'transparent'};
                    transition:var(--tr);font-size:12px;color:${i === qIdx ? 'var(--accent2)' : 'var(--text2)'};
                    display:flex;gap:8px;align-items:flex-start">
                  <span style="font-weight:700;flex-shrink:0;color:${i === qIdx ? 'var(--accent2)' : 'var(--text3)'}">${i + 1}.</span>
                  <span style="line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${question}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

        // Events
        document.getElementById('back-to-setup').addEventListener('click', () => { sessionMode = 'setup'; renderSetup(); });
        document.querySelectorAll('.type-pill').forEach(p => {
            p.addEventListener('click', () => {
                type = p.dataset.type; qIdx = 0;
                renderInterview();
            });
        });
        document.getElementById('prev-q-btn').addEventListener('click', () => { if (qIdx > 0) { qIdx--; renderInterview(); } });
        document.getElementById('next-q-btn').addEventListener('click', () => { if (qIdx < qs.length - 1) { qIdx++; renderInterview(); } });
        document.getElementById('skip-q-btn').addEventListener('click', () => { if (qIdx < qs.length - 1) { qIdx++; renderInterview(); } });
        document.getElementById('get-feedback-btn').addEventListener('click', () => {
            const ans = document.getElementById('answer-box')?.innerText?.trim() || transcript;
            if (!ans || ans === document.getElementById('answer-box')?.dataset.placeholder) {
                App.toast('Please answer the question first', 'error'); return;
            }
            getFeedback(q, ans);
        });
        document.querySelectorAll('.q-nav-item').forEach(item => {
            item.addEventListener('click', () => { qIdx = parseInt(item.dataset.qi); renderInterview(); });
        });
        document.getElementById('answer-box').addEventListener('focus', function () {
            if (!this.innerText.trim()) this.innerText = '';
        });
        setupMic();
    }

    function getQuestions() {
        const source = generatedQs || FALLBACK;
        return source[type] || source.hr || FALLBACK.hr;
    }

    // ── MIC ──
    function setupMic() {
        const btn = document.getElementById('int-mic');
        const status = document.getElementById('int-status');
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (isRec) { App.SpeechRec.stop(); return; }
            if (!App.SpeechRec.isSupported) return;
            isRec = true; transcript = '';
            btn.classList.add('recording');
            status.innerHTML = '<span style="color:var(--rose)">🔴 Listening… speak your answer clearly</span>';
            App.SpeechRec.listen(
                t => {
                    transcript = t;
                    const ab = document.getElementById('answer-box');
                    if (ab) { ab.innerText = t; ab.classList.add('filled'); }
                },
                () => {
                    isRec = false;
                    btn.classList.remove('recording');
                    status.innerHTML = '✅ Done! Review and click <strong>Get AI Feedback</strong>.';
                },
                err => {
                    isRec = false;
                    btn.classList.remove('recording');
                    status.textContent = 'Mic error: ' + err;
                }
            );
        });
    }

    // ── AI FEEDBACK ──
    async function getFeedback(question, answer) {
        const fb = document.getElementById('fb-content');
        fb.innerHTML = '<div class="loading-wrap"><div class="spinner"></div><div class="loading-text">Gemini is analysing your answer...</div></div>';

        const cvContext = cvText.trim().length > 40 ? `\n\nCANDIDATE'S CV CONTEXT:\n${cvText.substring(0, 1500)}` : '';
        const prompt = `You are an expert interview coach evaluating a candidate's SPOKEN answer to an interview question.${cvContext}

Interview Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer honestly. If the candidate used fillers (um, uh, like), noted them. If they missed key points, highlight that.
Consider:
- Fluency & speaking confidence (not just words)
- Content relevance & depth
- Grammar & sentence structure
- Use of specific examples (STAR method)

Return ONLY valid JSON:
{
  "fluencyScore": 1-10 integer,
  "contentScore": 1-10 integer,
  "grammarScore": 1-10 integer,
  "overallComment": "2-3 honest sentences on the overall quality of the answer",
  "strengths": ["what they did well"],
  "improvements": ["specific things to fix"],
  "sampleAnswer": "A 3-4 sentence model answer specific to this question and their background"
}`;

        const res = await App.callGemini(prompt);
        if (res.error) {
            fb.innerHTML = `<div style="color:var(--rose);font-size:13px;padding:20px">⚠️ ${res.error}</div>`;
            return;
        }
        try {
            const m = res.text.match(/\{[\s\S]*\}/);
            const data = JSON.parse(m?.[0] || res.text);
            const sc = (n, max = 10) => {
                const col = n >= 7 ? 'var(--emerald)' : n >= 5 ? 'var(--amber)' : 'var(--rose)';
                return `<div style="font-family:var(--font2);font-size:26px;font-weight:900;color:${col}">${n}<span style="font-size:14px;color:var(--text3)">/${max}</span></div>`;
            };
            fb.innerHTML = `
        <div class="fb-scores" style="margin-bottom:14px">
          <div class="fb-score-item">${sc(data.fluencyScore)}<div class="fb-score-label">Fluency</div></div>
          <div class="fb-score-item">${sc(data.contentScore)}<div class="fb-score-label">Content</div></div>
          <div class="fb-score-item">${sc(data.grammarScore)}<div class="fb-score-label">Grammar</div></div>
        </div>
        <div class="fb-body" style="margin-bottom:12px;font-size:13px;color:var(--text2);line-height:1.7">${data.overallComment}</div>

        ${data.strengths?.length ? `
        <div style="margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">✅ Strengths</div>
          ${data.strengths.map(s => `<div class="tip-row"><i class="fas fa-check" style="color:var(--emerald)"></i>${s}</div>`).join('')}
        </div>` : ''}

        ${data.improvements?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">💡 Improve</div>
          ${data.improvements.map(s => `<div class="tip-row"><i class="fas fa-arrow-up" style="color:var(--amber)"></i>${s}</div>`).join('')}
        </div>` : ''}

        <div class="model-answer">
          <strong style="color:var(--teal);font-size:11px;text-transform:uppercase;letter-spacing:0.5px">📝 Model Answer</strong><br><br>
          ${data.sampleAnswer}
        </div>
      `;
            const avg = Math.round((data.fluencyScore + data.contentScore + data.grammarScore) / 3);
            App.setState({ interviewsDone: (App.getState().interviewsDone || 0) + 1 });
            App.addXP(avg * 5, 'Interview Practice');
        } catch (e) {
            fb.innerHTML = `<div class="fb-body" style="color:var(--text2)">${res.text}</div>`;
        }
    }

    return { render };
})();
window.Interview = Interview;
