// =============================================
//   MODULE: PRONUNCIATION PRACTICE
// =============================================
var Pronunciation = (function () {
  const WORDS = [
    { word: 'World', phonetic: '/wɜːrld/', sentence: 'The world is full of opportunities.', common: 'Don\'t say "vorld" — W not V' },
    { word: 'Vegetable', phonetic: '/ˈvedʒtəbəl/', sentence: 'I eat vegetables every day.', common: '3 syllables: VEJ-tuh-bul' },
    { word: 'Particularly', phonetic: '/pəˈtɪkjʊlərli/', sentence: 'This is particularly useful.', common: '5 syllables — don\'t skip any' },
    { word: 'Comfortable', phonetic: '/ˈkʌmftəbəl/', sentence: 'I feel comfortable in this role.', common: '3 syllables: CUMF-tuh-bul' },
    { word: 'February', phonetic: '/ˈfebjueri/', sentence: 'The project started in February.', common: 'FEB-roo-erry' },
    { word: 'Technology', phonetic: '/tekˈnɒlədʒi/', sentence: 'Technology is transforming the world.', common: 'Stress on 2nd syllable: tek-NOL-ogy' },
    { word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', sentence: 'Good pronunciation builds confidence.', common: 'pro-NUN-see-AY-shun' },
    { word: 'Through', phonetic: '/θruː/', sentence: 'I worked through the problem.', common: 'Sounds like "threw" — not "throo-gh"' },
    { word: 'Entrepreneur', phonetic: '/ˌɒntrəprəˈnɜːr/', sentence: 'She is a successful entrepreneur.', common: 'ohn-truh-pruh-NUR' },
    { word: 'Specifically', phonetic: '/spəˈsɪfɪkli/', sentence: 'I specifically mentioned that issue.', common: '5 syllables — spuh-SIF-ik-lee' },
    { word: 'Hierarchy', phonetic: '/ˈhaɪərɑːki/', sentence: 'The project follows a clear hierarchy.', common: 'HI-uh-rar-kee' },
    { word: 'Vulnerability', phonetic: '/vʌlnərəˈbɪlɪti/', sentence: 'Address each vulnerability promptly.', common: 'vul-nuh-ruh-BIL-uh-tee' },
  ];
  const PHONEMES = [
    { sym: 'TH', ex: 'THink / THis', tip: 'Tongue between teeth — not "D" or "T"', words: 'think, this, there, three, though' },
    { sym: 'V/W', ex: 'Vine / Wine', tip: '"V" — upper teeth on lower lip. "W" — round lips only', words: 'very, wine, value, wonder' },
    { sym: 'R', ex: 'Right', tip: 'No Indian retroflex — curl tongue slightly back, don\'t touch roof', words: 'right, rare, rural, river' },
    { sym: 'ə', ex: 'schwa', tip: 'Most unstressed vowels become "uh" — the most common sound!', words: 'about, system, problem, the' },
    { sym: 'æ', ex: 'cAt', tip: 'Open mouth wider than you think — lower jaw down', words: 'cat, map, apple, that, black' },
    { sym: 'ɪ', ex: 'sIt', tip: 'Short and relaxed — not the long "ee" sound', words: 'sit, bit, this, pick, which' },
  ];
  const TWISTERS = [
    'She sells seashells by the seashore.',
    'Peter Piper picked a peck of pickled peppers.',
    'How much wood would a woodchuck chuck?',
    'Specific Pacific statistical issues.',
    'The sixth sick sheik\'s sixth sheep\'s sick.',
  ];

  let mode = 'words';
  let wordIdx = 0;
  let isRec = false;

  function render() {
    wordIdx = 0; mode = 'words';
    document.getElementById('page-pronunciation').innerHTML = `
      <div class="page-hdr">
        <h1>🎤 <span>Pronunciation</span></h1>
        <p>Practice speaking and fix common Indian-English errors</p>
      </div>
      <div class="tabs" id="pron-tabs">
        <button class="tab active" data-mode="words">Word Practice</button>
        <button class="tab" data-mode="phonemes">Phoneme Guide</button>
        <button class="tab" data-mode="twisters">Tongue Twisters</button>
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
    else renderTwisters();
  }

  function renderWords() {
    const w = WORDS[wordIdx];
    document.getElementById('pron-content').innerHTML = `
      <div class="pron-layout">
        <div>
          <div class="pron-word-card">
            <div style="color:var(--text3);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">WORD ${wordIdx + 1} OF ${WORDS.length}</div>
            <div class="big-word">${w.word}</div>
            <div class="word-phonetic">${w.phonetic}</div>
            <div class="word-sentence">"${w.sentence}"</div>
            <div style="margin-bottom:20px">
              <div class="chip chip-amber" style="display:inline-flex">⚠️ &nbsp;${w.common}</div>
            </div>
            <div class="mic-wrap">
              <div style="display:flex;gap:12px;margin-bottom:18px">
                <button class="btn btn-ghost btn-sm" id="hear-btn"><i class="fas fa-volume-up"></i> Hear it</button>
                <button class="btn btn-ghost btn-sm" id="prev-btn"><i class="fas fa-chevron-left"></i> Prev</button>
                <button class="btn btn-ghost btn-sm" id="next-btn">Next <i class="fas fa-chevron-right"></i></button>
              </div>
              <button class="mic-btn" id="pron-mic"><i class="fas fa-microphone"></i></button>
              <div class="mic-status" id="pron-status">Tap mic & say the word</div>
            </div>
          </div>
          <div id="pron-result" style="display:none" class="result-panel" style="margin-top:16px">
            <div class="result-label">Your Score</div>
            <div class="score-big" id="pron-score">—</div>
            <div style="color:var(--text2);font-size:13px;margin-top:6px" id="pron-feedback"></div>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">All Words</div>
            ${WORDS.map((word, i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border2);cursor:pointer;transition:var(--tr)" class="word-pick ${i === wordIdx ? 'word-pick-active' : ''}" data-i="${i}">
                <span style="font-size:13px;font-weight:${i === wordIdx ? '700' : '500'};color:${i === wordIdx ? 'var(--accent2)' : 'var(--text1)'}">${word.word}</span>
                <span style="font-size:11px;color:var(--text3);margin-left:auto">${word.phonetic}</span>
              </div>`).join('')}
          </div>
          <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.12)">
            <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">💡 Tip</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7">Record yourself, then listen back. We often don't hear our own errors until we play it back.</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('hear-btn').addEventListener('click', () => App.speak(w.word));
    document.getElementById('prev-btn').addEventListener('click', () => { if (wordIdx > 0) { wordIdx--; renderWords(); } });
    document.getElementById('next-btn').addEventListener('click', () => { if (wordIdx < WORDS.length - 1) { wordIdx++; renderWords(); } });
    document.querySelectorAll('.word-pick').forEach(el => {
      el.addEventListener('click', () => { wordIdx = parseInt(el.dataset.i); renderWords(); });
    });
    setupMic();
  }

  function setupMic() {
    const micBtn = document.getElementById('pron-mic');
    const status = document.getElementById('pron-status');
    const result = document.getElementById('pron-result');
    const scoreEl = document.getElementById('pron-score');
    const fbEl = document.getElementById('pron-feedback');
    if (!micBtn) return;
    let transcript = '';
    micBtn.addEventListener('click', () => {
      if (isRec) { App.SpeechRec.stop(); return; }
      if (!App.SpeechRec.isSupported) { App.toast('Use Chrome for voice features', 'error'); return; }
      isRec = true; transcript = '';
      micBtn.classList.add('recording');
      status.textContent = '🔴 Listening...';
      result.style.display = 'none';
      App.SpeechRec.listen(
        t => { transcript = t; status.textContent = `"${t}"`; },
        () => {
          isRec = false; micBtn.classList.remove('recording');
          if (!transcript) { status.textContent = 'Nothing heard. Try again.'; return; }
          const w = WORDS[wordIdx];
          const target = w.word.toLowerCase();
          const heard = transcript.toLowerCase().replace(/[^a-z\s]/g, '');
          let score = 0;
          if (heard.includes(target)) score = 95;
          else {
            let match = 0;
            for (let c of target) if (heard.includes(c)) match++;
            score = Math.round((match / Math.max(target.length, heard.length)) * 100);
          }
          scoreEl.textContent = score + '%';
          scoreEl.className = 'score-big ' + (score >= 80 ? 'good' : score >= 50 ? 'ok' : 'poor');
          fbEl.textContent = score >= 80 ? '✅ Excellent! Great pronunciation.' : score >= 50 ? '👍 Good effort! Try more clearly.' : '🔁 Practice more — focus on each syllable.';
          result.style.display = 'block';
          status.textContent = 'Done! Try again or move to next word.';
          if (score >= 80) App.addXP(10, 'Pronunciation Practice');
        },
        err => { isRec = false; micBtn.classList.remove('recording'); status.textContent = 'Error: ' + err; }
      );
    });
  }

  function renderPhonemes() {
    document.getElementById('pron-content').innerHTML = `
      <div class="page-hdr" style="margin-bottom:18px">
        <p style="margin-top:0">Click any sound to hear it spoken. Focus on the sounds that differ most from Indian languages.</p>
      </div>
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
      <div class="card" style="margin-top:20px">
        <div class="sec-title" style="font-size:13px">All Example Words</div>
        ${PHONEMES.map(p => `
          <div style="display:flex;gap:16px;padding:10px 0;border-bottom:1px solid var(--border2);align-items:center">
            <span style="font-family:var(--font2);font-size:18px;font-weight:800;color:var(--accent2);width:50px">[${p.sym}]</span>
            <span style="font-size:13px;color:var(--text2)">${p.words}</span>
          </div>
        `).join('')}
      </div>
    `;
    document.querySelectorAll('.phoneme-card').forEach(card => {
      card.addEventListener('click', () => App.speak(card.dataset.word));
    });
  }

  function renderTwisters() {
    document.getElementById('pron-content').innerHTML = `
      <div class="page-hdr" style="margin-bottom:18px"><p style="margin-top:0">Tongue twisters strengthen articulation, speed, and clarity.</p></div>
      <div style="display:flex;flex-direction:column;gap:14px">
        ${TWISTERS.map((t, i) => `
          <div class="card" style="display:flex;align-items:center;gap:18px">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;flex-shrink:0">${i + 1}</div>
            <div style="flex:1;font-size:16px;font-weight:600;line-height:1.6">"${t}"</div>
            <button class="btn btn-ghost btn-sm hear-twister" data-text="${t}"><i class="fas fa-volume-up"></i></button>
          </div>
        `).join('')}
      </div>
    `;
    document.querySelectorAll('.hear-twister').forEach(btn => {
      btn.addEventListener('click', () => App.speak(btn.dataset.text));
    });
  }

  return { render };
})();
window.Pronunciation = Pronunciation;
