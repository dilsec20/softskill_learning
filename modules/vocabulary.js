// =============================================
//   MODULE: VOCABULARY BUILDER (AI-Powered)
// =============================================
var Vocabulary = (function () {
    // Seed words (shown on first load before AI generates new ones)
    const SEED_WORDS = [
        { word: 'Articulate', ph: '/ɑːˈtɪkjʊlɪt/', meaning: 'Express ideas clearly and effectively', example: 'She was able to articulate her thoughts during the interview.', type: 'Professional' },
        { word: 'Scalable', ph: '/ˈskeɪləbəl/', meaning: 'Able to grow without performance loss', example: 'The architecture must be scalable to millions of users.', type: 'CSE' },
        { word: 'Proactive', ph: '/prəʊˈæktɪv/', meaning: 'Taking action before problems arise', example: 'A proactive engineer anticipates issues early.', type: 'Professional' },
        { word: 'Concise', ph: '/kənˈsaɪs/', meaning: 'Brief, giving only essential info', example: 'Keep your answers concise and to the point.', type: 'Interview' },
        { word: 'Deploy', ph: '/dɪˈplɔɪ/', meaning: 'Release software to production', example: 'We deploy to AWS every Friday after testing.', type: 'CSE' },
        { word: 'Initiative', ph: '/ɪˈnɪʃɪətɪv/', meaning: 'The ability to act without being asked', example: 'She took the initiative to fix the bug.', type: 'Interview' },
        { word: 'Resilient', ph: '/rɪˈzɪlɪənt/', meaning: 'Able to recover quickly from difficulties', example: 'Our system is resilient to server failures.', type: 'CSE' },
        { word: 'Eloquent', ph: '/ˈeləkwənt/', meaning: 'Fluent and persuasive in speech', example: 'His eloquent presentation impressed the panel.', type: 'Interview' },
    ];

    let words = [...SEED_WORDS];
    let idx = 0;
    let flipped = false;
    let mode = 'flashcard';
    let aiLoading = false;

    function render() {
        idx = 0; flipped = false;
        document.getElementById('page-vocabulary').innerHTML = `
      <div class="page-hdr">
        <h1>📚 <span>Vocabulary</span></h1>
        <p>AI-powered vocabulary builder — fresh words, verbal quizzes & sentence practice</p>
      </div>
      <div class="tabs" id="vocab-tabs">
        <button class="tab active" data-mode="flashcard">Flashcards</button>
        <button class="tab" data-mode="quiz">AI Quiz</button>
        <button class="tab" data-mode="speaking">Speak & Use</button>
        <button class="tab" data-mode="wordlist">Word List</button>
      </div>
      <div id="vocab-content"></div>
    `;
        document.querySelectorAll('#vocab-tabs .tab').forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('#vocab-tabs .tab').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                mode = t.dataset.mode;
                renderMode();
            });
        });
        renderMode();
    }

    function renderMode() {
        if (mode === 'flashcard') renderFlashcard();
        else if (mode === 'quiz') renderAIQuiz();
        else if (mode === 'speaking') renderSpeaking();
        else renderWordList();
    }

    // ── AI: Generate fresh vocabulary words ──
    async function generateAIWords() {
        aiLoading = true;
        renderFlashcard();
        const prompt = `Generate 10 random advanced English vocabulary words useful for Indian CSE students in tech interviews and professional settings.
Mix: 4 Professional, 3 CSE/Technical, 3 Interview words. Avoid very common words.

Return ONLY valid JSON array:
[{"word":"...", "ph":"/IPA.../", "meaning":"clear definition", "example":"example sentence using the word", "type":"Professional|CSE|Interview"}]`;

        const res = await App.callGemini(prompt);
        aiLoading = false;
        if (res.error) { App.toast(res.error, 'error'); renderFlashcard(); return; }
        try {
            const m = res.text.match(/\[[\s\S]*\]/);
            const parsed = JSON.parse(m?.[0] || res.text);
            if (Array.isArray(parsed) && parsed.length > 0) {
                words = parsed;
                idx = 0; flipped = false;
            }
        } catch (e) { App.toast('Could not parse AI words', 'error'); }
        renderFlashcard();
    }

    function renderFlashcard() {
        const w = words[idx];
        const st = App.getState();
        document.getElementById('vocab-content').innerHTML = `
      <div class="vocab-layout">
        <div>
          <div style="margin-bottom:12px;text-align:right">
            <button class="btn btn-ghost btn-sm" id="gen-ai-vocab" style="color:var(--accent2);border:1px solid var(--accent2);font-size:11px">
              <i class="fas fa-magic"></i> Generate New Words (AI)
            </button>
          </div>
          ${aiLoading ? '<div class="card" style="text-align:center;padding:40px"><div class="spinner" style="margin:0 auto 12px"></div>AI generating fresh vocabulary...</div>' : `
          <div class="flashcard-wrap">
            <div class="flashcard ${flipped ? 'flipped' : ''}" id="flashcard">
              <div class="card-face card-front">
                <div class="chip chip-accent" style="margin-bottom:16px">${w.type}</div>
                <div class="fc-word">${w.word}</div>
                <div class="fc-phonetic">${w.ph}</div>
                <div class="fc-tap"><i class="fas fa-hand-pointer"></i> Click to reveal meaning</div>
              </div>
              <div class="card-face card-back">
                <div class="fc-meaning">${w.meaning}</div>
                <div class="fc-example">"${w.example}"</div>
                <div style="margin-top:18px;display:flex;gap:8px">
                  <button class="btn btn-ghost btn-sm" id="hear-word"><i class="fas fa-volume-up"></i> Hear it</button>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-actions">
            <button class="btn-hard" id="fc-hard">😰 Hard — try again</button>
            <button class="btn-easy" id="fc-easy">✅ Easy — I know this!</button>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <button class="btn btn-ghost btn-sm" id="fc-prev">←</button>
            <div style="flex:1;text-align:center;font-size:13px;color:var(--text2)">Card ${idx + 1} / ${words.length}</div>
            <button class="btn btn-ghost btn-sm" id="fc-next">→</button>
          </div>
          <div class="progress-track" style="margin-bottom:14px"><div class="progress-fill" style="width:${Math.round(((idx + 1) / words.length) * 100)}%"></div></div>
          `}
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">Progress</div>
            <div style="font-size:32px;font-weight:900;font-family:var(--font2);color:var(--emerald)">${st.wordsLearned || 0}</div>
            <div style="font-size:12px;color:var(--text2)">words learned</div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
              <span class="chip chip-teal">+5 XP per word</span>
            </div>
          </div>
          <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.12)">
            <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">💡 AI-Powered</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7">Click "Generate New Words" for fresh AI vocabulary every time. Try the "Speak & Use" tab to practice using words in sentences!</div>
          </div>
        </div>
      </div>
    `;
        document.getElementById('gen-ai-vocab').addEventListener('click', generateAIWords);
        if (!aiLoading) {
            document.getElementById('flashcard')?.addEventListener('click', () => { flipped = !flipped; renderFlashcard(); });
            document.getElementById('hear-word')?.addEventListener('click', e => { e.stopPropagation(); App.speak(w.word + '. ' + w.meaning); });
            document.getElementById('fc-prev')?.addEventListener('click', () => { if (idx > 0) { idx--; flipped = false; renderFlashcard(); } });
            document.getElementById('fc-next')?.addEventListener('click', () => { if (idx < words.length - 1) { idx++; flipped = false; renderFlashcard(); } });
            document.getElementById('fc-hard')?.addEventListener('click', () => { App.toast('Marked hard — keep practicing!'); if (idx < words.length - 1) { idx++; flipped = false; renderFlashcard(); } });
            document.getElementById('fc-easy')?.addEventListener('click', () => {
                App.setState({ wordsLearned: (App.getState().wordsLearned || 0) + 1 });
                App.addXP(5, 'Learned: ' + w.word);
                if (idx < words.length - 1) { idx++; flipped = false; renderFlashcard(); }
                else App.toast('🎉 All cards reviewed!', 'success');
            });
        }
    }

    // ── AI Quiz: verbal definition quiz ──
    async function renderAIQuiz() {
        const content = document.getElementById('vocab-content');
        content.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner" style="margin:0 auto 14px"></div>AI generating quiz questions...</div>';

        const prompt = `Generate 5 vocabulary quiz questions for a CSE student. Each question shows a word and 4 options (1 correct meaning, 3 wrong).
Use advanced professional/technical English words that are useful in interviews.

Return ONLY valid JSON array:
[{"word":"...", "ph":"/IPA.../", "correct":"the correct meaning", "options":["meaning1","meaning2","meaning3","meaning4"], "sentence":"example sentence"}]

Make sure "correct" matches one of the "options" exactly.`;

        const res = await App.callGemini(prompt);
        if (res.error) { content.innerHTML = `<div class="card"><div style="color:var(--rose)">${res.error}</div></div>`; return; }
        try {
            const m = res.text.match(/\[[\s\S]*\]/);
            const quizData = JSON.parse(m?.[0] || res.text);
            if (!Array.isArray(quizData) || quizData.length === 0) throw new Error('empty');
            runQuiz(quizData);
        } catch (e) { content.innerHTML = '<div class="card"><div style="color:var(--rose)">Could not generate quiz. Try again.</div><button class="btn btn-primary btn-sm" id="retry-q" style="margin-top:12px"><i class="fas fa-redo"></i> Retry</button></div>'; document.getElementById('retry-q')?.addEventListener('click', renderAIQuiz); }
    }

    function runQuiz(quizData) {
        let qi = 0, score = 0;
        function showQ() {
            const content = document.getElementById('vocab-content');
            if (qi >= quizData.length) {
                content.innerHTML = `
          <div class="card" style="text-align:center;padding:40px">
            <div style="font-size:54px;margin-bottom:14px">${score >= 4 ? '🏆' : score >= 2 ? '👍' : '😅'}</div>
            <div style="font-family:var(--font2);font-size:28px;font-weight:800">${score}/${quizData.length}</div>
            <div style="color:var(--text2);margin:10px 0">${score >= 4 ? 'Excellent vocabulary!' : score >= 2 ? 'Good effort — keep learning!' : 'Practice more words!'}</div>
            <button class="btn btn-primary" id="retry-quiz" style="margin-top:18px"><i class="fas fa-magic"></i> New AI Quiz</button>
          </div>`;
                document.getElementById('retry-quiz').addEventListener('click', renderAIQuiz);
                App.addXP(score * 5, 'AI Vocab Quiz');
                return;
            }
            const q = quizData[qi];
            const opts = [...(q.options || [q.correct, 'N/A', 'N/A', 'N/A'])];
            content.innerHTML = `
        <div class="card" style="max-width:600px;margin:0 auto">
          <div class="chip chip-accent" style="margin-bottom:14px">Question ${qi + 1} of ${quizData.length}</div>
          <div style="font-family:var(--font2);font-size:30px;font-weight:800;margin-bottom:6px">${q.word}</div>
          <div style="font-size:13px;color:var(--accent2);margin-bottom:22px">${q.ph || ''}</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${opts.map((o, i) => `<button class="btn btn-ghost quiz-opt" data-correct="${o === q.correct}" style="text-align:left;justify-content:flex-start;padding:14px 18px;border-radius:12px">
              <span style="width:26px;height:26px;border-radius:50%;background:var(--bg4);display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:12px;font-weight:700">${String.fromCharCode(65 + i)}</span>
              ${o}
            </button>`).join('')}
          </div>
        </div>`;
            document.querySelectorAll('.quiz-opt').forEach(b => {
                b.addEventListener('click', () => {
                    const correct = b.dataset.correct === 'true';
                    if (correct) { b.style.borderColor = 'var(--emerald)'; b.style.background = 'rgba(16,185,129,0.1)'; score++; App.toast('✅ Correct!', 'success'); }
                    else { b.style.borderColor = 'var(--rose)'; b.style.background = 'rgba(244,63,94,0.1)'; App.toast('❌ Incorrect', 'error'); }
                    document.querySelectorAll('.quiz-opt').forEach(x => x.disabled = true);
                    setTimeout(() => { qi++; showQ(); }, 900);
                });
            });
        }
        showQ();
    }

    // ── Speak & Use: say a word in a sentence, AI evaluates ──
    function renderSpeaking() {
        const w = words[Math.floor(Math.random() * words.length)];
        const content = document.getElementById('vocab-content');
        content.innerHTML = `
      <div class="card" style="max-width:700px;margin:0 auto;text-align:center;padding:36px">
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">USE THIS WORD IN A SENTENCE</div>
        <div style="font-family:var(--font2);font-size:36px;font-weight:900;color:var(--accent2);margin-bottom:6px">${w.word}</div>
        <div style="font-size:14px;color:var(--teal);margin-bottom:6px">${w.ph}</div>
        <div style="font-size:14px;color:var(--text2);margin-bottom:20px">${w.meaning}</div>
        <div style="margin-bottom:14px">
          <button class="btn btn-ghost btn-sm" id="hear-speak-word"><i class="fas fa-volume-up"></i> Hear pronunciation</button>
        </div>
        <button class="mic-btn" id="speak-mic" style="width:72px;height:72px;font-size:28px;margin-bottom:14px"><i class="fas fa-microphone"></i></button>
        <div id="speak-status" style="font-size:13px;color:var(--text2);margin-bottom:14px">Tap mic and say a sentence using "<strong>${w.word}</strong>"</div>
        <div id="speak-transcript" style="display:none;background:var(--bg2);border-radius:10px;padding:14px;text-align:left;font-size:13px;line-height:1.7;margin-bottom:14px"></div>
      </div>
      <div id="speak-result" style="display:none;max-width:700px;margin:16px auto 0" class="card">
        <div class="sec-title" style="font-size:14px"><i class="fas fa-robot" style="color:var(--accent2)"></i> AI Evaluation</div>
        <div id="speak-result-body"></div>
      </div>
      <div style="max-width:700px;margin:14px auto 0;display:flex;gap:10px">
        <button class="btn btn-primary btn-full" id="next-speak-word"><i class="fas fa-magic"></i> Next Random Word</button>
      </div>
    `;
        document.getElementById('hear-speak-word')?.addEventListener('click', () => App.speak(w.word));
        document.getElementById('next-speak-word')?.addEventListener('click', renderSpeaking);
        setupSpeakMic(w);
    }

    function setupSpeakMic(w) {
        const mic = document.getElementById('speak-mic');
        const status = document.getElementById('speak-status');
        const transcriptEl = document.getElementById('speak-transcript');
        if (!mic) return;
        let isRecording = false, recText = '', lastText = '';

        mic.addEventListener('click', () => {
            if (isRecording) { isRecording = false; App.SpeechRec.stop(); return; }
            if (!App.SpeechRec.isSupported) { App.toast('Use Chrome', 'error'); return; }
            isRecording = true; recText = ''; lastText = '';
            mic.classList.add('recording');
            status.innerHTML = '<span style="color:var(--rose)">🔴 Recording... say a sentence using the word</span>';

            function startListening() {
                App.SpeechRec.listen(
                    t => { lastText = t; transcriptEl.style.display = 'block'; transcriptEl.textContent = recText + (recText ? ' ' : '') + t; },
                    () => {
                        recText += (recText ? ' ' : '') + lastText; lastText = '';
                        if (isRecording) { startListening(); }
                        else {
                            mic.classList.remove('recording');
                            if (!recText.trim()) { status.textContent = 'Nothing heard. Try again.'; return; }
                            status.textContent = '✅ Done! AI evaluating...';
                            evaluateSentence(w, recText);
                        }
                    },
                    err => {
                        if (err === 'no-speech' && isRecording) { startListening(); }
                        else { isRecording = false; mic.classList.remove('recording'); status.textContent = 'Error: ' + err; }
                    }
                );
            }
            startListening();
        });
    }

    async function evaluateSentence(w, spoken) {
        const result = document.getElementById('speak-result');
        const body = document.getElementById('speak-result-body');
        result.style.display = 'block';
        body.innerHTML = '<div style="text-align:center;padding:16px"><div class="spinner" style="margin:0 auto 10px"></div>AI analyzing your sentence...</div>';

        const prompt = `You are an English vocabulary coach. A CSE student was asked to use the word "${w.word}" (meaning: ${w.meaning}) in a sentence.

What they said: "${spoken}"

Evaluate:
1. Did they use the word correctly in context?
2. Was the sentence grammatically correct?
3. Was it a meaningful, natural sentence?
4. Rate overall 1-10

Return ONLY valid JSON:
{"score":1-10, "usedCorrectly":true/false, "grammarOk":true/false, "feedback":"2-3 sentences of feedback", "betterSentence":"a model sentence using the word", "tip":"one improvement tip"}`;

        const res = await App.callGemini(prompt);
        if (res.error) { body.innerHTML = `<div style="color:var(--rose)">${res.error}</div>`; return; }
        try {
            const m = res.text.match(/\{[\s\S]*\}/);
            const d = JSON.parse(m?.[0] || res.text);
            const sc = d.score || 5;
            const col = sc >= 8 ? 'var(--emerald)' : sc >= 5 ? 'var(--amber)' : 'var(--rose)';
            body.innerHTML = `
        <div style="text-align:center;margin-bottom:14px">
          <div style="font-family:var(--font2);font-size:48px;font-weight:900;color:${col}">${sc}</div>
          <div style="font-size:12px;color:var(--text3)">/ 10</div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px">
          <span class="chip ${d.usedCorrectly ? 'chip-emerald' : 'chip-rose'}">${d.usedCorrectly ? '✅ Correct usage' : '❌ Incorrect usage'}</span>
          <span class="chip ${d.grammarOk ? 'chip-emerald' : 'chip-amber'}">${d.grammarOk ? '✅ Grammar OK' : '⚠️ Grammar issues'}</span>
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:10px">${d.feedback}</div>
        ${d.betterSentence ? `<div class="model-answer"><strong style="color:var(--teal);font-size:11px;text-transform:uppercase">📝 Model Sentence</strong><br><br>${d.betterSentence}</div>` : ''}
        ${d.tip ? `<div style="font-size:12px;color:var(--teal);background:rgba(0,212,177,0.06);border-radius:8px;padding:10px;margin-top:10px">💡 ${d.tip}</div>` : ''}
      `;
            if (sc >= 7) App.addXP(10, 'Vocab Sentence: ' + w.word);
        } catch (e) { body.innerHTML = `<div style="color:var(--text2)">${res.text}</div>`; }
    }

    function renderWordList() {
        const st = App.getState();
        document.getElementById('vocab-content').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${words.map((w, i) => `
          <div class="word-list-item">
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700">${w.word}</div>
              <div style="font-size:11px;color:var(--accent2);margin:2px 0">${w.ph}</div>
              <div style="font-size:12px;color:var(--text2)">${w.meaning}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <span class="chip ${w.type === 'CSE' ? 'chip-teal' : w.type === 'Interview' ? 'chip-accent' : 'chip-amber'}">${w.type}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:16px">
        <button class="btn btn-primary" id="gen-wordlist"><i class="fas fa-magic"></i> Generate New Word Set</button>
      </div>
    `;
        document.getElementById('gen-wordlist')?.addEventListener('click', async () => { await generateAIWords(); mode = 'wordlist'; renderWordList(); });
    }

    return { render };
})();
window.Vocabulary = Vocabulary;
