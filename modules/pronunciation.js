// =============================================
//   MODULE: PRONUNCIATION PRACTICE (AI-Powered)
// =============================================
var Pronunciation = (function () {
  // Fallback words used on first load (before AI generates new ones)
  const SEED_WORDS = [
    { word: 'Technology', phonetic: '/tekˈnɒlədʒi/', sentence: 'Technology is transforming the world.', tip: 'Stress on 2nd syllable: tek-NOL-ogy' },
    { word: 'Particularly', phonetic: '/pəˈtɪkjʊlərli/', sentence: 'This is particularly useful.', tip: '5 syllables — don\'t skip any' },
    { word: 'Comfortable', phonetic: '/ˈkʌmftəbəl/', sentence: 'I feel comfortable in this role.', tip: '3 syllables: CUMF-tuh-bul' },
    { word: 'Entrepreneur', phonetic: '/ˌɒntrəprəˈnɜːr/', sentence: 'She is a successful entrepreneur.', tip: 'ohn-truh-pruh-NUR' },
    { word: 'Asynchronous', phonetic: '/eɪˈsɪŋkrənəs/', sentence: 'Asynchronous APIs improve UX.', tip: 'ay-SINK-ruh-nus' },
    { word: 'Hierarchy', phonetic: '/ˈhaɪərɑːki/', sentence: 'The project follows a clear hierarchy.', tip: 'HI-uh-rar-kee' },
  ];

  const PHONEMES = [
    { sym:'TH', ex:'THink / THis', tip:'Tongue between teeth — not "D" or "T"', words:'think, this, there, three' },
    { sym:'V/W', ex:'Vine / Wine', tip:'"V" — teeth on lip. "W" — round lips only', words:'very, wine, value, wonder' },
    { sym:'R', ex:'Right', tip:'No retroflex — curl tongue slightly back', words:'right, rare, rural, river' },
    { sym:'ə', ex:'schwa', tip:'Most unstressed vowels become "uh"', words:'about, system, problem' },
    { sym:'æ', ex:'cAt', tip:'Open mouth wider than you think', words:'cat, map, apple, that' },
    { sym:'ɪ', ex:'sIt', tip:'Short and relaxed — not long "ee"', words:'sit, bit, this, pick' },
  ];

  let words = [...SEED_WORDS];
  let wordIdx = 0;
  let isRec = false;
  let mode = 'words';
  let aiWordsLoading = false;

  function render() {
    wordIdx = 0; mode = 'words';
    document.getElementById('page-pronunciation').innerHTML = `
      <div class="page-hdr">
        <h1>🎤 <span>Pronunciation</span></h1>
        <p>AI-powered pronunciation practice — get new words every session & real AI feedback on your speech</p>
      </div>
      <div class="tabs" id="pron-tabs">
        <button class="tab active" data-mode="words">Word Practice</button>
        <button class="tab" data-mode="phonemes">Phoneme Guide</button>
        <button class="tab" data-mode="sentences">AI Sentences</button>
      </div>
      <div id="pron-content"></div>
    `;
    document.querySelectorAll('#pron-tabs .tab').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('#pron-tabs .tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        mode = t.dataset.mode;
        renderContent();
      });
    });
    renderContent();
  }

  function renderContent() {
    if (mode === 'words') renderWords();
    else if (mode === 'phonemes') renderPhonemes();
    else renderSentences();
  }

  // ── AI: Generate fresh random words ──
  async function generateAIWords() {
    aiWordsLoading = true;
    renderWords();
    const prompt = `Generate 8 random English words that Indian CSE students commonly mispronounce in interviews.
Mix difficulty: 3 easy, 3 medium, 2 hard. Include technical + professional words.

Return ONLY valid JSON array:
[
  {"word":"...", "phonetic":"/IPA.../", "sentence":"Example sentence using the word", "tip":"Common Indian mispronunciation mistake & correct way"}
]`;
    const res = await App.callGemini(prompt);
    aiWordsLoading = false;
    if (res.error) { App.toast(res.error, 'error'); renderWords(); return; }
    try {
      const m = res.text.match(/\[[\s\S]*\]/);
      const parsed = JSON.parse(m?.[0] || res.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        words = parsed;
        wordIdx = 0;
      }
    } catch (e) { App.toast('Could not parse AI words, using defaults', 'error'); }
    renderWords();
  }

  // ── AI: Evaluate pronunciation ──
  async function evaluatePronunciation(targetWord, transcript) {
    const resultEl = document.getElementById('pron-result');
    const bodyEl = document.getElementById('pron-result-body');
    resultEl.style.display = 'block';
    bodyEl.innerHTML = '<div style="text-align:center;padding:16px"><div class="spinner" style="margin:0 auto 10px"></div>AI analyzing your pronunciation...</div>';

    const prompt = `You are a pronunciation coach for Indian English speakers preparing for tech interviews.

Target word: "${targetWord}"
What the student said (speech-to-text): "${transcript}"

Evaluate:
1. Did they say the correct word?
2. Rate pronunciation accuracy 1-100
3. Specific feedback on what they said vs what it should sound like
4. One concrete tip to improve

Return ONLY valid JSON:
{"score":1-100, "correct":true/false, "heard":"what you heard them say", "feedback":"specific feedback", "tip":"improvement tip"}`;

    const res = await App.callGemini(prompt);
    if (res.error) { bodyEl.innerHTML = `<div style="color:var(--rose)">${res.error}</div>`; return; }
    try {
      const m = res.text.match(/\{[\s\S]*\}/);
      const d = JSON.parse(m?.[0] || res.text);
      const sc = d.score || 50;
      const col = sc >= 80 ? 'var(--emerald)' : sc >= 50 ? 'var(--amber)' : 'var(--rose)';
      bodyEl.innerHTML = `
        <div style="text-align:center;margin-bottom:14px">
          <div style="font-family:var(--font2);font-size:48px;font-weight:900;color:${col}">${sc}%</div>
          <div style="font-size:12px;color:var(--text3)">Pronunciation Score</div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px">
          <span class="chip ${d.correct ? 'chip-emerald' : 'chip-rose'}">${d.correct ? '✅ Correct word' : '❌ Wrong word detected'}</span>
        </div>
        ${d.heard ? `<div style="font-size:12px;color:var(--text3);margin-bottom:8px">🎙️ AI heard: "<strong style="color:var(--text1)">${d.heard}</strong>"</div>` : ''}
        <div style="font-size:13px;color:var(--text2);line-height:1.7;background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:10px">${d.feedback}</div>
        <div style="font-size:12px;color:var(--teal);background:rgba(0,212,177,0.06);border-radius:8px;padding:10px">
          💡 <strong>Tip:</strong> ${d.tip}
        </div>
      `;
      if (sc >= 80) App.addXP(10, 'Pronunciation: ' + targetWord);
    } catch (e) {
      bodyEl.innerHTML = `<div style="color:var(--text2)">${res.text}</div>`;
    }
  }

  function renderWords() {
    const w = words[wordIdx];
    document.getElementById('pron-content').innerHTML = `
      <div class="pron-layout">
        <div>
          <div class="pron-word-card">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="color:var(--text3);font-size:11px;text-transform:uppercase;letter-spacing:1px">WORD ${wordIdx + 1} OF ${words.length}</div>
              <button class="btn btn-ghost btn-sm" id="gen-ai-words" style="margin-left:auto;color:var(--accent2);border:1px solid var(--accent2);font-size:11px">
                <i class="fas fa-magic"></i> Generate New Words (AI)
              </button>
            </div>
            ${aiWordsLoading ? '<div style="text-align:center;padding:30px"><div class="spinner" style="margin:0 auto 12px"></div>AI generating fresh words...</div>' : `
            <div class="big-word">${w.word}</div>
            <div class="word-phonetic">${w.phonetic}</div>
            <div class="word-sentence">"${w.sentence}"</div>
            <div style="margin-bottom:20px">
              <div class="chip chip-amber" style="display:inline-flex">⚠️ &nbsp;${w.tip}</div>
            </div>
            <div class="mic-wrap">
              <div style="display:flex;gap:12px;margin-bottom:18px">
                <button class="btn btn-ghost btn-sm" id="hear-btn"><i class="fas fa-volume-up"></i> Hear it</button>
                <button class="btn btn-ghost btn-sm" id="prev-btn"><i class="fas fa-chevron-left"></i> Prev</button>
                <button class="btn btn-ghost btn-sm" id="next-btn">Next <i class="fas fa-chevron-right"></i></button>
              </div>
              <button class="mic-btn" id="pron-mic"><i class="fas fa-microphone"></i></button>
              <div class="mic-status" id="pron-status">Tap mic & say the word clearly</div>
            </div>`}
          </div>
          <div id="pron-result" style="display:none;margin-top:16px" class="card">
            <div class="sec-title" style="font-size:14px"><i class="fas fa-robot" style="color:var(--accent2)"></i> AI Pronunciation Analysis</div>
            <div id="pron-result-body"></div>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">All Words</div>
            ${words.map((word, i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border2);cursor:pointer;transition:var(--tr)" class="word-pick ${i === wordIdx ? 'word-pick-active' : ''}" data-i="${i}">
                <span style="font-size:13px;font-weight:${i === wordIdx ? '700' : '500'};color:${i === wordIdx ? 'var(--accent2)' : 'var(--text1)'}">${word.word}</span>
                <span style="font-size:11px;color:var(--text3);margin-left:auto">${word.phonetic}</span>
              </div>`).join('')}
          </div>
          <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.12)">
            <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">💡 Tip</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7">Click "Generate New Words" to get fresh AI-generated words every time. AI evaluates your pronunciation — not just text matching!</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('gen-ai-words').addEventListener('click', generateAIWords);
    if (!aiWordsLoading) {
      document.getElementById('hear-btn')?.addEventListener('click', () => App.speak(w.word));
      document.getElementById('prev-btn')?.addEventListener('click', () => { if (wordIdx > 0) { wordIdx--; renderWords(); } });
      document.getElementById('next-btn')?.addEventListener('click', () => { if (wordIdx < words.length - 1) { wordIdx++; renderWords(); } });
      document.querySelectorAll('.word-pick').forEach(el => {
        el.addEventListener('click', () => { wordIdx = parseInt(el.dataset.i); renderWords(); });
      });
      setupMic();
    }
  }

  function setupMic() {
    const micBtn = document.getElementById('pron-mic');
    const status = document.getElementById('pron-status');
    if (!micBtn) return;
    let transcript = '', lastText = '';

    micBtn.addEventListener('click', () => {
      if (isRec) { isRec = false; App.SpeechRec.stop(); return; }
      if (!App.SpeechRec.isSupported) { App.toast('Use Chrome for voice features', 'error'); return; }
      isRec = true; transcript = ''; lastText = '';
      micBtn.classList.add('recording');
      status.textContent = '🔴 Listening...';
      document.getElementById('pron-result').style.display = 'none';

      function startListening() {
        App.SpeechRec.listen(
          t => { lastText = t; status.textContent = `"${transcript + (transcript ? ' ' : '') + t}"`; },
          () => {
            transcript += (transcript ? ' ' : '') + lastText;
            lastText = '';
            if (isRec) {
              startListening();
            } else {
              micBtn.classList.remove('recording');
              if (!transcript) { status.textContent = 'Nothing heard. Try again.'; return; }
              status.textContent = `Done! You said: "${transcript}"`;
              evaluatePronunciation(words[wordIdx].word, transcript);
            }
          },
          err => {
            if (err === 'no-speech' && isRec) { startListening(); }
            else { isRec = false; micBtn.classList.remove('recording'); status.textContent = 'Error: ' + err; }
          }
        );
      }
      startListening();
    });
  }

  function renderPhonemes() {
    document.getElementById('pron-content').innerHTML = `
      <div class="page-hdr" style="margin-bottom:18px"><p style="margin-top:0">Click any sound to hear it spoken. Focus on sounds that differ most from Indian languages.</p></div>
      <div class="phoneme-grid">
        ${PHONEMES.map(p => `
          <div class="phoneme-card" data-word="${p.words.split(',')[0]}">
            <div class="ph-sym">[${p.sym}]</div>
            <div class="ph-word">${p.ex}</div>
            <div class="ph-tip">${p.tip}</div>
            <div style="margin-top:8px"><span class="chip chip-teal" style="font-size:10px">🔊 Click to hear</span></div>
          </div>
        `).join('')}
      </div>
    `;
    document.querySelectorAll('.phoneme-card').forEach(card => {
      card.addEventListener('click', () => App.speak(card.dataset.word));
    });
  }

  // ── AI Sentences: Generate a paragraph to read aloud ──
  async function renderSentences() {
    const content = document.getElementById('pron-content');
    content.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner" style="margin:0 auto 14px"></div>AI generating a practice paragraph...</div>';

    const prompt = `Generate a short English paragraph (3-4 sentences, ~50 words) for an Indian CSE student to read aloud for pronunciation practice.
Include words commonly mispronounced by Indians (like "algorithm", "development", "architecture", "specifically", "asynchronous").
Topic: random tech/interview topic.

Return ONLY valid JSON:
{"title":"Topic Title", "paragraph":"The paragraph to read...", "hardWords":["word1","word2","word3"], "tips":"Quick pronunciation tip for the hardest word"}`;

    const res = await App.callGemini(prompt);
    if (res.error) { content.innerHTML = `<div class="card"><div style="color:var(--rose)">${res.error}</div></div>`; return; }
    try {
      const m = res.text.match(/\{[\s\S]*\}/);
      const d = JSON.parse(m?.[0] || res.text);
      content.innerHTML = `
        <div class="card" style="margin-bottom:16px">
          <div style="font-size:16px;font-weight:800;margin-bottom:12px">${d.title || 'Reading Practice'}</div>
          <div style="font-size:16px;line-height:2;color:var(--text1);margin-bottom:16px;background:var(--bg2);border-radius:12px;padding:18px">${d.paragraph}</div>
          ${d.hardWords?.length ? `<div style="margin-bottom:12px"><span style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase">Tricky Words:</span> ${d.hardWords.map(w=>`<span class="chip chip-amber" style="margin-left:6px;cursor:pointer" data-word="${w}">${w}</span>`).join('')}</div>` : ''}
          ${d.tips ? `<div style="font-size:12px;color:var(--teal);background:rgba(0,212,177,0.06);border-radius:8px;padding:10px">💡 ${d.tips}</div>` : ''}
        </div>
        <div class="card" style="text-align:center;padding:28px">
          <button class="btn btn-ghost btn-sm" id="hear-paragraph" style="margin-bottom:14px"><i class="fas fa-volume-up"></i> Hear Full Paragraph</button>
          <div style="margin-bottom:14px">
            <button class="mic-btn" id="sent-mic"><i class="fas fa-microphone"></i></button>
          </div>
          <div id="sent-status" style="font-size:13px;color:var(--text2)">Tap mic, read the paragraph aloud, then tap again to stop</div>
          <div id="sent-transcript" style="display:none;margin-top:14px;background:var(--bg2);border-radius:10px;padding:14px;text-align:left;font-size:13px;line-height:1.7"></div>
        </div>
        <div id="sent-result" style="display:none;margin-top:16px" class="card">
          <div class="sec-title" style="font-size:14px"><i class="fas fa-robot" style="color:var(--accent2)"></i> AI Reading Evaluation</div>
          <div id="sent-result-body"></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn btn-primary btn-full" id="gen-new-sent"><i class="fas fa-magic"></i> Generate New Paragraph</button>
        </div>
      `;
      // Event listeners
      document.getElementById('hear-paragraph')?.addEventListener('click', () => App.speak(d.paragraph));
      document.querySelectorAll('[data-word]').forEach(el => el.addEventListener('click', () => App.speak(el.dataset.word)));
      document.getElementById('gen-new-sent')?.addEventListener('click', renderSentences);
      setupSentenceMic(d.paragraph);
    } catch (e) { content.innerHTML = `<div class="card"><div style="color:var(--text2)">${res.text}</div></div>`; }
  }

  function setupSentenceMic(originalParagraph) {
    const mic = document.getElementById('sent-mic');
    const status = document.getElementById('sent-status');
    const transcriptEl = document.getElementById('sent-transcript');
    if (!mic) return;
    let recText = '', lastText = '';

    mic.addEventListener('click', () => {
      if (isRec) { isRec = false; App.SpeechRec.stop(); return; }
      if (!App.SpeechRec.isSupported) { App.toast('Use Chrome', 'error'); return; }
      isRec = true; recText = ''; lastText = '';
      mic.classList.add('recording');
      status.innerHTML = '<span style="color:var(--rose)">🔴 Reading… speak clearly</span>';

      function startListening() {
        App.SpeechRec.listen(
          t => { lastText = t; transcriptEl.style.display = 'block'; transcriptEl.textContent = recText + (recText ? ' ' : '') + t; },
          () => {
            recText += (recText ? ' ' : '') + lastText; lastText = '';
            if (isRec) { startListening(); }
            else {
              mic.classList.remove('recording');
              status.textContent = '✅ Done! Evaluating...';
              evaluateReading(originalParagraph, recText);
            }
          },
          err => {
            if (err === 'no-speech' && isRec) { startListening(); }
            else { isRec = false; mic.classList.remove('recording'); status.textContent = 'Error: ' + err; }
          }
        );
      }
      startListening();
    });
  }

  async function evaluateReading(original, spoken) {
    const result = document.getElementById('sent-result');
    const body = document.getElementById('sent-result-body');
    result.style.display = 'block';
    body.innerHTML = '<div style="text-align:center;padding:16px"><div class="spinner" style="margin:0 auto 10px"></div>AI analyzing your reading...</div>';

    const prompt = `You are a pronunciation and reading fluency coach for Indian English speakers.

Original paragraph: "${original}"
What the student read (speech-to-text): "${spoken}"

Evaluate: accuracy (did they read the right words?), fluency, pronunciation of hard words, and pace.

Return ONLY valid JSON:
{"score":1-100, "accuracy":"percentage of words correct", "feedback":"2-3 sentences of feedback", "mispronounced":["words that were mispronounced or skipped"], "strengths":["what they did well"], "tip":"one concrete improvement tip"}`;

    const res = await App.callGemini(prompt);
    if (res.error) { body.innerHTML = `<div style="color:var(--rose)">${res.error}</div>`; return; }
    try {
      const m = res.text.match(/\{[\s\S]*\}/);
      const d = JSON.parse(m?.[0] || res.text);
      const sc = d.score || 50;
      const col = sc >= 80 ? 'var(--emerald)' : sc >= 50 ? 'var(--amber)' : 'var(--rose)';
      body.innerHTML = `
        <div style="text-align:center;margin-bottom:14px">
          <div style="font-family:var(--font2);font-size:48px;font-weight:900;color:${col}">${sc}%</div>
          <div style="font-size:12px;color:var(--text3)">Reading Score</div>
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:12px">${d.feedback}</div>
        ${d.mispronounced?.length ? `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--rose);text-transform:uppercase;margin-bottom:6px">🔴 Tricky Words</div>${d.mispronounced.map(w=>`<span class="chip chip-rose" style="margin:3px;cursor:pointer" data-word="${w}">${w}</span>`).join('')}</div>` : ''}
        ${d.strengths?.length ? `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;margin-bottom:6px">✅ Strengths</div>${d.strengths.map(s=>`<div style="font-size:12px;margin-bottom:4px"><i class="fas fa-check" style="color:var(--emerald)"></i> ${s}</div>`).join('')}</div>` : ''}
        <div style="font-size:12px;color:var(--teal);background:rgba(0,212,177,0.06);border-radius:8px;padding:10px">💡 ${d.tip}</div>
      `;
      document.querySelectorAll('[data-word]').forEach(el => el.addEventListener('click', () => App.speak(el.dataset.word)));
      if (sc >= 70) App.addXP(15, 'Pronunciation: Read Aloud');
    } catch (e) { body.innerHTML = `<div style="color:var(--text2)">${res.text}</div>`; }
  }

  return { render };
})();
window.Pronunciation = Pronunciation;
