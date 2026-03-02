// =============================================
//   MODULE: VOCABULARY BUILDER
// =============================================
var Vocabulary = (function () {
    const WORDS = [
        { word: 'Articulate', ph: '/ɑːˈtɪkjʊlɪt/', meaning: 'Express ideas clearly and effectively', example: 'She was able to articulate her thoughts during the interview.', type: 'Professional' },
        { word: 'Concise', ph: '/kənˈsaɪs/', meaning: 'Brief, giving only essential info', example: 'Keep your answers concise and to the point.', type: 'Interview' },
        { word: 'Collaborate', ph: '/kəˈlæbəreɪt/', meaning: 'Work jointly with others', example: 'We collaborate across teams to deliver the project.', type: 'Professional' },
        { word: 'Initiative', ph: '/ɪˈnɪʃɪətɪv/', meaning: 'The ability to act without being asked', example: 'She took the initiative to fix the bug before it escalated.', type: 'Interview' },
        { word: 'Proactive', ph: '/prəʊˈæktɪv/', meaning: 'Taking action before problems arise', example: 'A proactive engineer anticipates issues early.', type: 'Professional' },
        { word: 'Scalable', ph: '/ˈskeɪləbəl/', meaning: 'Able to grow without performance loss', example: 'The architecture must be scalable to millions of users.', type: 'CSE' },
        { word: 'Optimize', ph: '/ˈɒptɪmaɪz/', meaning: 'Improve efficiency and performance', example: 'We optimized the SQL query and reduced load time by 60%.', type: 'CSE' },
        { word: 'Deploy', ph: '/dɪˈplɔɪ/', meaning: 'Release software to production', example: 'We deploy to AWS every Friday after testing.', type: 'CSE' },
        { word: 'Resilient', ph: '/rɪˈzɪlɪənt/', meaning: 'Able to recover quickly from difficulties', example: 'Our system is resilient to server failures.', type: 'CSE' },
        { word: 'Iterative', ph: '/ˈɪtərətɪv/', meaning: 'Repeating a process to improve it', example: 'We follow an iterative development approach.', type: 'Professional' },
        { word: 'Leverage', ph: '/ˈlevərɪdʒ/', meaning: 'Use something to maximum advantage', example: 'We leverage cloud services to reduce cost.', type: 'Professional' },
        { word: 'Adept', ph: '/əˈdept/', meaning: 'Highly skilled at something', example: 'She is adept at debugging complex systems.', type: 'Interview' },
        { word: 'Meticulous', ph: '/mɪˈtɪkjʊləs/', meaning: 'Extremely careful and precise', example: 'A meticulous code review prevents bugs.', type: 'Interview' },
        { word: 'Eloquent', ph: '/ˈeləkwənt/', meaning: 'Fluent and persuasive in speech', example: 'His eloquent presentation impressed the panel.', type: 'Interview' },
        { word: 'Pragmatic', ph: '/præɡˈmætɪk/', meaning: 'Dealing with things sensibly and practically', example: 'Take a pragmatic approach to problem-solving.', type: 'Professional' },
        { word: 'Consensus', ph: '/kənˈsensəs/', meaning: 'General agreement among a group', example: 'We reached a consensus on the API design.', type: 'Professional' },
        { word: 'Synthesize', ph: '/ˈsɪnθɪsaɪz/', meaning: 'Combine elements into a new whole', example: 'The report synthesizes data from multiple sources.', type: 'CSE' },
        { word: 'Coherent', ph: '/kəʊˈhɪərənt/', meaning: 'Logical and consistent', example: 'The architecture needs to be coherent across all modules.', type: 'CSE' },
        { word: 'Diligent', ph: '/ˈdɪlɪdʒənt/', meaning: 'Showing care and effort in work', example: 'A diligent engineer writes tests for every feature.', type: 'Interview' },
        { word: 'Versatile', ph: '/ˈvɜːsətaɪl/', meaning: 'Able to adapt to many functions', example: 'He is a versatile developer — frontend and backend.', type: 'Interview' },
        { word: 'Benchmark', ph: '/ˈbentʃmɑːk/', meaning: 'A standard to measure against', example: 'We use benchmarks to evaluate algorithm performance.', type: 'CSE' },
        { word: 'Asynchronous', ph: '/eɪˈsɪŋkrənəs/', meaning: 'Not occurring at the same time', example: 'Asynchronous APIs improve user experience.', type: 'CSE' },
        { word: 'Cohesive', ph: '/kəʊˈhiːsɪv/', meaning: 'United and working well together', example: 'A cohesive team delivers better results.', type: 'Professional' },
        { word: 'Inference', ph: '/ˈɪnfərəns/', meaning: 'A conclusion based on evidence', example: 'The ML model makes inferences from training data.', type: 'CSE' },
        { word: 'Eloquence', ph: '/ˈeləkwəns/', meaning: 'Fluent and effective use of language', example: 'Eloquence in communication is key for leadership.', type: 'Interview' },
    ];
    let idx = 0;
    let flipped = false;
    let mode = 'flashcard';

    function render() {
        idx = 0; flipped = false;
        document.getElementById('page-vocabulary').innerHTML = `
      <div class="page-hdr">
        <h1>📚 <span>Vocabulary</span></h1>
        <p>Build your professional and CSE-specific English vocabulary</p>
      </div>
      <div class="tabs" id="vocab-tabs">
        <button class="tab active" data-mode="flashcard">Flashcards</button>
        <button class="tab" data-mode="quiz">Quiz</button>
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
        else if (mode === 'quiz') renderQuiz();
        else renderWordList();
    }

    function renderFlashcard() {
        const w = WORDS[idx];
        const st = App.getState();
        document.getElementById('vocab-content').innerHTML = `
      <div class="vocab-layout">
        <div>
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
            <div style="flex:1;text-align:center;font-size:13px;color:var(--text2)">Card ${idx + 1} / ${WORDS.length}</div>
            <button class="btn btn-ghost btn-sm" id="fc-next">→</button>
          </div>
          <div class="progress-track" style="margin-bottom:14px">
            <div class="progress-fill" style="width:${Math.round(((idx + 1) / WORDS.length) * 100)}%"></div>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">Progress</div>
            <div style="font-size:32px;font-weight:900;font-family:var(--font2);color:var(--emerald)">${st.wordsLearned || 0}</div>
            <div style="font-size:12px;color:var(--text2)">words learned</div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
              <span class="chip chip-emerald">${Math.round(((st.wordsLearned || 0) / WORDS.length) * 100)}% complete</span>
              <span class="chip chip-teal">+5 XP per word</span>
            </div>
          </div>
          <div class="card" style="background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.12)">
            <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;margin-bottom:8px">Word of the Day</div>
            <div style="font-size:24px;font-weight:800;font-family:var(--font2)">${WORDS[new Date().getDate() % WORDS.length].word}</div>
            <div style="font-size:12px;color:var(--accent2);margin:4px 0">${WORDS[new Date().getDate() % WORDS.length].ph}</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.6">${WORDS[new Date().getDate() % WORDS.length].meaning}</div>
          </div>
        </div>
      </div>
    `;
        document.getElementById('flashcard').addEventListener('click', () => { flipped = !flipped; renderFlashcard(); });
        document.getElementById('hear-word')?.addEventListener('click', e => { e.stopPropagation(); App.speak(w.word + '. ' + w.meaning); });
        document.getElementById('fc-prev').addEventListener('click', () => { if (idx > 0) { idx--; flipped = false; renderFlashcard(); } });
        document.getElementById('fc-next').addEventListener('click', () => { if (idx < WORDS.length - 1) { idx++; flipped = false; renderFlashcard(); } });
        document.getElementById('fc-hard').addEventListener('click', () => { App.toast('Marked as hard — keep practicing!'); if (idx < WORDS.length - 1) { idx++; flipped = false; renderFlashcard(); } });
        document.getElementById('fc-easy').addEventListener('click', () => {
            App.setState({ wordsLearned: (App.getState().wordsLearned || 0) + 1 });
            App.addXP(5, 'Learned: ' + w.word);
            if (idx < WORDS.length - 1) { idx++; flipped = false; renderFlashcard(); }
            else App.toast('🎉 All cards reviewed!', 'success');
        });
    }

    function renderQuiz() {
        const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
        const quizWords = pick(WORDS, 5);
        let qi = 0; let score = 0;
        const showQ = () => {
            if (qi >= quizWords.length) {
                document.getElementById('vocab-content').innerHTML = `
          <div class="card" style="text-align:center;padding:40px">
            <div style="font-size:54px;margin-bottom:14px">${score >= 4 ? '🏆' : score >= 2 ? '👍' : '😅'}</div>
            <div style="font-family:var(--font2);font-size:28px;font-weight:800">${score}/${quizWords.length}</div>
            <div style="color:var(--text2);margin:10px 0">${score >= 4 ? 'Excellent!' : score >= 2 ? 'Good effort!' : 'Keep practicing!'}</div>
            <button class="btn btn-primary" id="retry-quiz" style="margin-top:18px"><i class="fas fa-redo"></i> Try Again</button>
          </div>`;
                document.getElementById('retry-quiz').addEventListener('click', () => renderQuiz());
                App.addXP(score * 5, 'Vocab Quiz');
                return;
            }
            const w = quizWords[qi];
            const opts = pick(WORDS.filter(x => x.word !== w.word), 3).concat(w);
            opts.sort(() => Math.random() - 0.5);
            document.getElementById('vocab-content').innerHTML = `
        <div class="card" style="max-width:600px;margin:0 auto">
          <div class="chip chip-accent" style="margin-bottom:14px">Question ${qi + 1} of ${quizWords.length}</div>
          <div style="font-family:var(--font2);font-size:30px;font-weight:800;margin-bottom:6px">${w.word}</div>
          <div style="font-size:13px;color:var(--accent2);margin-bottom:22px">${w.ph}</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${opts.map((o, i) => `<button class="btn btn-ghost quiz-opt" data-correct="${o.word === w.word}" style="text-align:left;justify-content:flex-start;padding:14px 18px;border-radius:12px">
              <span style="width:26px;height:26px;border-radius:50%;background:var(--bg4);display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:12px;font-weight:700">${String.fromCharCode(65 + i)}</span>
              ${o.meaning}
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
        };
        showQ();
    }

    function renderWordList() {
        const st = App.getState();
        const learned = new Set(Array.from({ length: st.wordsLearned || 0 }, (_, i) => WORDS[i]?.word));
        document.getElementById('vocab-content').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${WORDS.map((w, i) => `
          <div class="word-list-item">
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700">${w.word}</div>
              <div style="font-size:11px;color:var(--accent2);margin:2px 0">${w.ph}</div>
              <div style="font-size:12px;color:var(--text2)">${w.meaning}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <span class="chip ${w.type === 'CSE' ? 'chip-teal' : w.type === 'Interview' ? 'chip-accent' : 'chip-amber'}">${w.type}</span>
              ${learned.has(w.word) ? '<span class="chip chip-emerald">✓ Learned</span>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    }

    return { render };
})();
window.Vocabulary = Vocabulary;
