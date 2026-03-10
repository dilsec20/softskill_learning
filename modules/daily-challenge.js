// =============================================
//   MODULE: DAILY CHALLENGE (with AI Evaluation)
// =============================================
var DailyChallenge = (function () {
  const CHAL = [
    {
      icon: '📖', title: 'Read Aloud', desc: 'Read clearly & confidently', xp: 30,
      content: 'Technology is transforming the way we work and communicate. As a software engineer, the ability to explain complex systems in simple terms is just as valuable as writing efficient code. Good communication builds trust, accelerates projects, and opens doors to leadership opportunities.',
      instruction: 'Read slowly. Focus on: technology, communicate, efficient, opportunities.',
      evalFocus: 'pronunciation clarity, pace, stress on key words, and fluency'
    },
    {
      icon: '🖼️', title: 'Describe a Scenario', desc: '60-second structured answer', xp: 30,
      content: 'You join a new team and discover the codebase is messy with no documentation. Your manager asks you to improve it. How would you approach this?',
      instruction: 'Use STAR method: Situation, Task, Action, Result. Speak for 60+ seconds.',
      evalFocus: 'use of STAR method, clarity of plan, professional vocabulary, and confidence'
    },
    {
      icon: '✏️', title: 'Grammar Fix', desc: 'Spot and correct the errors', xp: 30,
      content: '1. "I am working here since 3 years."\n2. "She don\'t know the answer."\n3. "I have went to that conference yesterday."\n4. "The code is more better now."\n5. "He said me that the build was fail."',
      instruction: 'Speak the corrected version of each sentence aloud clearly.',
      evalFocus: 'correct grammar corrections, confidence, and clear articulation of each fix'
    },
    {
      icon: '🙋', title: 'Self Introduction', desc: '60-second elevator pitch', xp: 30,
      content: 'Introduce yourself as if appearing for your dream job at Google, Microsoft, or a top startup.',
      instruction: 'Cover: Name, College, Year, Key skills, One project, Why this role. Under 90 seconds!',
      evalFocus: 'structure (present-past-future), specific details, confidence, grammar, no fillers'
    },
    {
      icon: '💡', title: 'Express Opinion', desc: 'Give your view on a hot topic', xp: 30,
      content: '"AI will replace software engineers in the next 10 years." — Do you agree or disagree? Why?',
      instruction: 'Start with "In my opinion..." Use examples. 60-90 seconds. Be confident!',
      evalFocus: 'clear stance, supporting arguments, professional vocabulary, and sentence fluency'
    },
    {
      icon: '🎤', title: 'Pronunciation Challenge', desc: 'Technical paragraph — read aloud', xp: 30,
      content: 'The asynchronous architecture ensures scalability and resilience. Specifically, the distributed microservices communicate through RESTful APIs and message queues, providing approximately 99.9% uptime with particularly efficient throughput.',
      instruction: 'Read slowly. These are commonly mispronounced in interviews.',
      evalFocus: 'pronunciation of technical words (asynchronous, particularly, microservices, RESTful, throughput), pace and clarity'
    },
    {
      icon: '📊', title: 'Explain Your Project', desc: 'Explain to a non-technical person', xp: 30,
      content: 'Imagine your project is being presented to a non-tech VP. They want to know: What problem does it solve? How does it work? What was YOUR contribution? What was the impact?',
      instruction: 'Speak 60-90 seconds. Avoid jargon. Use analogies. Use "I built", "I designed".',
      evalFocus: 'simplicity of language, avoidance of jargon, clear structure, personal ownership words (I built/designed)'
    },
  ];

  let isRec = false, elapsed = 0, interval = null;
  let recordedTranscript = '';

  function render() {
    const st = App.getState();
    const today = new Date().toDateString();
    const ci = new Date().getDate() % CHAL.length;
    const c = CHAL[ci];
    const done = (st.challengesDone || []).includes(today);
    recordedTranscript = '';

    document.getElementById('page-daily-challenge').innerHTML = `
      <div class="page-hdr">
        <h1>⚡ Daily <span>Challenge</span></h1>
        <p>${done ? '✅ Today\'s challenge complete! Come back tomorrow for a new one.' : 'A new 5-minute exercise every day — earn +30 XP bonus!'}</p>
      </div>
      <div class="challenge-layout">

        <!-- LEFT: Main challenge -->
        <div>
          <div class="challenge-hero">
            <div class="ch-icon">${c.icon}</div>
            <div style="display:flex;justify-content:center;gap:8px;margin-bottom:10px">
              <span class="chip chip-teal">Today's Challenge</span>
              <span class="chip chip-amber">+${c.xp} XP Bonus</span>
            </div>
            <div class="ch-title">${c.title}</div>
            <div class="ch-desc">${c.desc}</div>
          </div>

          <div class="ch-content">${c.content.replace(/\n/g, '<br>')}</div>

          <div class="card" style="background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.15);margin-bottom:16px">
            <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;margin-bottom:6px">📌 Instructions</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7">${c.instruction}</div>
          </div>

          ${!done ? `
          <!-- Recording panel -->
          <div class="card" style="text-align:center;padding:28px;margin-bottom:14px" id="rec-panel">
            <div class="timer-num" id="ch-timer" style="display:none;margin-bottom:12px;font-family:var(--font2);font-size:40px;font-weight:900;color:var(--accent2)">00:00</div>
            <div style="display:flex;justify-content:center;margin-bottom:14px">
              <button class="mic-btn" id="ch-mic"><i class="fas fa-microphone"></i></button>
            </div>
            <div style="color:var(--text2);font-size:13px" id="ch-status">
              ${App.SpeechRec.isSupported ? '🎙️ Tap mic to start recording your answer' : '⚠️ Voice recognition requires Chrome — type your answer below and submit'}
            </div>
            <!-- Transcript display -->
            <div id="ch-transcript-wrap" style="display:none;margin-top:16px;background:var(--bg3);border-radius:12px;padding:16px;text-align:left">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:8px">📝 YOUR ANSWER</div>
              <div id="ch-transcript" style="font-size:13px;color:var(--text1);line-height:1.8"></div>
            </div>
            <!-- Manual text input (fallback) -->
            <div id="ch-text-wrap" style="margin-top:14px;display:${App.SpeechRec.isSupported ? 'none' : 'block'}">
              <textarea id="ch-text-input" class="form-input" rows="4" placeholder="Type your answer here..." style="text-align:left"></textarea>
            </div>
          </div>

          <!-- AI Feedback panel (hidden until answer given) -->
          <div id="ai-feedback-panel" style="display:none;margin-bottom:14px">
            <div class="ai-feedback-panel">
              <div style="font-size:14px;font-weight:700;margin-bottom:14px">
                <i class="fas fa-robot" style="color:var(--accent2)"></i> AI Evaluation
              </div>
              <div id="ai-fb-content" style="color:var(--text3);text-align:center;padding:20px 0">
                <div class="spinner" style="margin:0 auto 12px"></div>
                <div style="font-size:13px">Evaluating your answer...</div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div id="ch-actions" style="display:none">
            <button class="btn btn-primary btn-full" id="get-eval-btn" style="padding:14px;font-size:15px;margin-bottom:10px">
              <i class="fas fa-robot"></i> Evaluate My Answer with AI
            </button>
            <button class="btn btn-ghost btn-full" id="ch-done-btn" style="padding:12px;font-size:13px">
              <i class="fas fa-check-circle"></i> Skip Evaluation & Mark Complete (+${c.xp} XP)
            </button>
          </div>

          <!-- Already done -->
          ` : `
          <div class="card" style="background:rgba(16,185,129,0.08);border-color:rgba(16,185,129,0.25);text-align:center;padding:40px">
            <div style="font-size:54px;margin-bottom:14px">🏆</div>
            <div style="font-family:var(--font2);font-size:24px;font-weight:800;color:var(--emerald)">Challenge Complete!</div>
            <div style="color:var(--text2);margin-top:8px">Great work! Come back tomorrow for a new challenge.</div>
          </div>`}
        </div>

        <!-- RIGHT: Sidebar -->
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">All Challenges</div>
            ${CHAL.map((ch, i) => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border2)">
                <span style="font-size:22px">${ch.icon}</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:600">${ch.title}</div>
                  <div style="font-size:11px;color:var(--text3)">${ch.desc}</div>
                </div>
                ${i === ci ? '<span class="chip chip-teal">Today</span>' : ''}
              </div>`).join('')}
          </div>

          <div class="card">
            <div class="sec-title" style="font-size:13px">Your Stats</div>
            <div style="font-size:38px;font-weight:900;font-family:var(--font2);color:var(--accent2)">${(st.challengesDone || []).length}</div>
            <div style="font-size:12px;color:var(--text2)">challenges completed</div>
            <div style="margin-top:10px"><span class="chip chip-amber"><i class="fas fa-fire"></i> ${st.streak} day streak</span></div>
            <div style="margin-top:14px">
              <div class="sec-title" style="font-size:12px">How AI Evaluates You</div>
              <div style="font-size:12px;color:var(--text2);line-height:1.8">
                <i class="fas fa-check-circle" style="color:var(--teal);margin-right:5px"></i>Content & Structure<br>
                <i class="fas fa-check-circle" style="color:var(--teal);margin-right:5px"></i>Grammar & Tense<br>
                <i class="fas fa-check-circle" style="color:var(--teal);margin-right:5px"></i>Vocabulary<br>
                <i class="fas fa-check-circle" style="color:var(--teal);margin-right:5px"></i>Fluency & Confidence<br>
                <i class="fas fa-check-circle" style="color:var(--teal);margin-right:5px"></i>Task Completion
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!done) setupRecording(c, today);
  }

  // ── Recording logic ──
  function setupRecording(c, today) {
    const mic = document.getElementById('ch-mic');
    const status = document.getElementById('ch-status');
    const timerEl = document.getElementById('ch-timer');
    const transcriptWrap = document.getElementById('ch-transcript-wrap');
    const transcriptEl = document.getElementById('ch-transcript');
    const actions = document.getElementById('ch-actions');
    const getEvalBtn = document.getElementById('get-eval-btn');
    const doneBtn = document.getElementById('ch-done-btn');

    if (!mic) return;

    mic.addEventListener('click', () => {
      if (isRec) {
        isRec = false;
        App.SpeechRec.stop();
        return;
      }
      if (!App.SpeechRec.isSupported) {
        // show text input area instead
        document.getElementById('ch-text-wrap').style.display = 'block';
        actions.style.display = 'block';
        return;
      }
      isRec = true; elapsed = 0; recordedTranscript = '';
      let lastText = '';
      mic.classList.add('recording');
      timerEl.style.display = 'block';
      status.innerHTML = '<span style="color:var(--rose)">🔴 Recording… speak your answer clearly</span>';
      interval = setInterval(() => {
        elapsed++;
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
      }, 1000);

      function startListening() {
        App.SpeechRec.listen(
          t => {
            lastText = t;
            transcriptEl.textContent = recordedTranscript + (recordedTranscript ? ' ' : '') + t;
            transcriptWrap.style.display = 'block';
          },
          () => {
            recordedTranscript += (recordedTranscript ? ' ' : '') + lastText;
            lastText = '';
            if (isRec) {
              startListening(); // keep recording continuously
            } else {
              clearInterval(interval);
              mic.classList.remove('recording');
              status.innerHTML = `✅ Recorded <strong>${timerEl.textContent}</strong> — review your answer below`;
              actions.style.display = 'block';
              if (!recordedTranscript) {
                status.innerHTML += '<br><span style="color:var(--amber);font-size:12px">No speech detected. Type your answer instead.</span>';
                document.getElementById('ch-text-wrap').style.display = 'block';
              }
            }
          },
          err => {
            if (err === 'no-speech' && isRec) {
              startListening(); // silence — keep going
            } else {
              isRec = false; clearInterval(interval);
              mic.classList.remove('recording');
              status.textContent = 'Mic error: ' + err + ' — type your answer instead.';
              document.getElementById('ch-text-wrap').style.display = 'block';
              actions.style.display = 'block';
            }
          }
        );
      }
      startListening();
    });

    getEvalBtn?.addEventListener('click', () => {
      // Get answer from transcript or text input
      const typed = document.getElementById('ch-text-input')?.value?.trim();
      const answer = recordedTranscript || typed || '';
      if (!answer) {
        App.toast('Please record or type your answer first', 'error');
        return;
      }
      evaluateAnswer(c, answer, today);
    });

    doneBtn?.addEventListener('click', () => markComplete(today, c.xp, false));
  }

  // ── AI Evaluation ──
  async function evaluateAnswer(c, answer, today) {
    const panel = document.getElementById('ai-feedback-panel');
    const fbContent = document.getElementById('ai-fb-content');
    const actions = document.getElementById('ch-actions');

    panel.style.display = 'block';
    actions.style.display = 'none';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const prompt = `You are an expert English communication coach evaluating a CSE (Computer Science Engineering) student's spoken answer for a daily English practice challenge.

Challenge Type: "${c.title}"
Challenge Task: "${c.content}"
What to evaluate for: ${c.evalFocus}
Student's Answer: "${answer}"

Evaluate the answer honestly but encouragingly. Be specific about what they did well and what to improve.

Return ONLY valid JSON with this structure:
{
  "overallScore": 1-10,
  "scores": {
    "content": 1-10,
    "grammar": 1-10,
    "vocabulary": 1-10,
    "fluency": 1-10,
    "taskCompletion": 1-10
  },
  "summary": "2-3 sentence honest overall assessment",
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "grammarErrors": ["error found → corrected version"] or [],
  "betterVersion": "A model answer showing how this could be said better (2-4 sentences)"
}`;

    const res = await App.callGemini(prompt);

    if (res.error) {
      fbContent.innerHTML = `
        <div style="color:var(--rose);font-size:13px;padding:10px;text-align:left">
          <i class="fas fa-exclamation-triangle"></i> ${res.error}
        </div>
        <button class="btn btn-ghost btn-sm" id="skip-eval-btn" style="margin-top:12px">
          Mark Complete Without Evaluation (+${c.xp} XP)
        </button>`;
      document.getElementById('skip-eval-btn')?.addEventListener('click', () => markComplete(today, c.xp, false));
      return;
    }

    try {
      const m = res.text.match(/\{[\s\S]*\}/);
      const data = JSON.parse(m?.[0] || res.text);
      const sc = n => {
        const col = n >= 8 ? 'var(--emerald)' : n >= 6 ? 'var(--teal)' : n >= 4 ? 'var(--amber)' : 'var(--rose)';
        return `<span style="font-family:var(--font2);font-size:22px;font-weight:900;color:${col}">${n}</span><span style="font-size:11px;color:var(--text3)">/10</span>`;
      };
      const overall = data.overallScore || Math.round(Object.values(data.scores || {}).reduce((a, b) => a + b, 0) / 5);
      const ovCol = overall >= 8 ? 'var(--emerald)' : overall >= 6 ? 'var(--teal)' : overall >= 4 ? 'var(--amber)' : 'var(--rose)';

      fbContent.innerHTML = `
        <!-- Overall score -->
        <div style="text-align:center;margin-bottom:20px;padding:16px;background:var(--bg2);border-radius:12px">
          <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Overall Score</div>
          <div style="font-family:var(--font2);font-size:52px;font-weight:900;color:${ovCol};line-height:1">${overall}</div>
          <div style="font-size:13px;color:var(--text3)">out of 10</div>
        </div>

        <!-- 5 category scores -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
          ${[['Content', 'content'], ['Grammar', 'grammar'], ['Vocabulary', 'vocabulary'], ['Fluency', 'fluency'], ['Task ✓', 'taskCompletion']].map(([label, key]) => `
            <div style="background:var(--bg2);border-radius:10px;padding:10px;text-align:center">
              ${sc(data.scores?.[key] || 0)}
              <div style="font-size:10px;color:var(--text3);margin-top:4px">${label}</div>
            </div>`).join('')}
        </div>

        <!-- Summary -->
        <div style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:14px;padding:12px;background:var(--bg2);border-radius:10px">${data.summary}</div>

        <!-- Strengths -->
        ${data.strengths?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">✅ What You Did Well</div>
          ${data.strengths.map(s => `<div class="tip-row"><i class="fas fa-check" style="color:var(--emerald)"></i>${s}</div>`).join('')}
        </div>` : ''}

        <!-- Improvements -->
        ${data.improvements?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">💡 Areas to Improve</div>
          ${data.improvements.map(s => `<div class="tip-row"><i class="fas fa-arrow-up" style="color:var(--amber)"></i>${s}</div>`).join('')}
        </div>` : ''}

        <!-- Grammar errors -->
        ${data.grammarErrors?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--rose);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">🔴 Grammar Corrections</div>
          ${data.grammarErrors.map(e => `<div class="tip-row" style="font-size:12px;font-family:monospace"><i class="fas fa-times-circle" style="color:var(--rose)"></i>${e}</div>`).join('')}
        </div>` : ''}

        <!-- Model answer -->
        ${data.betterVersion ? `
        <div class="model-answer">
          <strong style="color:var(--teal);font-size:11px;text-transform:uppercase;letter-spacing:0.5px">📝 Model Answer</strong><br><br>
          ${data.betterVersion}
        </div>` : ''}

        <!-- Complete button -->
        <button class="btn btn-primary btn-full" id="final-done-btn" style="padding:14px;font-size:15px;margin-top:16px">
          <i class="fas fa-check-circle"></i> Mark Complete & Earn +${c.xp} XP
        </button>
      `;

      document.getElementById('final-done-btn')?.addEventListener('click', () => markComplete(today, c.xp, true));

    } catch (e) {
      fbContent.innerHTML = `
        <div style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:12px">${res.text}</div>
        <button class="btn btn-primary btn-sm" id="fallback-done-btn">Mark Complete (+${c.xp} XP)</button>`;
      document.getElementById('fallback-done-btn')?.addEventListener('click', () => markComplete(today, c.xp, false));
    }
  }

  // ── Mark Complete ──
  function markComplete(today, xp, hadEval) {
    const st = App.getState();
    const done = [...(st.challengesDone || [])];
    if (!done.includes(today)) done.push(today);
    App.setState({ challengesDone: done });
    App.addXP(xp, `Daily Challenge${hadEval ? ' (AI Evaluated)' : ''}`);
    render();
  }

  return { render };
})();
window.DailyChallenge = DailyChallenge;
