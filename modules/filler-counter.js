// =============================================
//   MODULE: FILLER WORD COUNTER
// =============================================
var FillerCounter = (function () {
    const FILLERS = ['um', 'uh', 'er', 'ah', 'like', 'basically', 'literally', 'actually',
        'you know', 'i mean', 'sort of', 'kind of', 'right', 'okay so', 'so yeah', 'and uh',
        'you see', 'honestly', 'obviously', 'clearly', 'just', 'very', 'really', 'stuff'];

    let isRec = false, sessionHistory = [];

    function countFillers(text) {
        const lower = text.toLowerCase();
        const result = {};
        let total = 0;
        FILLERS.forEach(f => {
            const re = new RegExp('\\b' + f.replace(/ /g, '\\s+') + '\\b', 'gi');
            const matches = lower.match(re);
            if (matches && matches.length > 0) { result[f] = matches.length; total += matches.length; }
        });
        return { counts: result, total };
    }

    function wpm(text, seconds) {
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return seconds > 0 ? Math.round((words / seconds) * 60) : 0;
    }

    function render() {
        const st = App.getState();
        const history = st.fillerHistory || [];

        document.getElementById('page-filler-counter').innerHTML = `
      <div class="page-hdr">
        <h1>🌊 Filler Word <span>Counter</span></h1>
        <p>Speak naturally for 1-2 minutes — AI counts every "um", "uh", "like", "basically" and shows your real speaking clarity score</p>
      </div>

      <div class="two-col" style="align-items:start">

        <!-- LEFT: Recording -->
        <div>
          <div class="card" style="text-align:center;padding:36px;margin-bottom:16px">
            <div style="font-size:60px;margin-bottom:14px">🎙️</div>
            <div class="timer-num" id="fc-timer" style="font-family:var(--font2);font-size:48px;font-weight:900;color:var(--accent2);margin-bottom:16px">00:00</div>
            <button class="mic-btn" id="fc-mic" style="width:72px;height:72px;font-size:28px;margin-bottom:16px">
              <i class="fas fa-microphone"></i>
            </button>
            <div id="fc-status" style="color:var(--text2);font-size:14px">Tap mic → speak for 1-2 minutes naturally</div>
            <div id="fc-live" style="margin-top:14px;min-height:40px;font-size:13px;color:var(--teal);font-style:italic;padding:10px;background:var(--bg2);border-radius:10px;display:none"></div>
          </div>

          <!-- Topic suggestions -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:12px">💡 What to speak about</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              ${['Tell me about yourself', 'Describe your best project', 'Why CSE? What do you love?',
                'Your opinion on AI replacing jobs', 'A difficult problem you solved', 'Your daily routine / goals'].map(t =>
                    `<div class="card" style="padding:10px;cursor:pointer;font-size:12px;color:var(--text2);background:var(--bg2);border-color:var(--border2)" class="topic-chip">${t}</div>`
                ).join('')}
            </div>
          </div>

          <!-- Results panel -->
          <div id="fc-results" style="display:none">
            <div class="card" style="margin-bottom:14px">
              <div class="sec-title" style="font-size:14px">📊 Your Analysis</div>
              <div id="fc-result-body"></div>
            </div>
            <button class="btn btn-primary btn-full" id="fc-retry">
              <i class="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>

        <!-- RIGHT: Tips + History -->
        <div>
          <!-- Target scores -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">🎯 Target Scores</div>
            ${[
                { label: 'Filler Rate', target: '< 5 per minute', good: 'green', icon: '🟢' },
                { label: 'Speaking Pace', target: '120–150 WPM', good: 'blue', icon: '🔵' },
                { label: 'Clarity Score', target: '> 80%', good: 'purple', icon: '🟣' },
            ].map(s => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border2)">
                <span style="font-size:20px">${s.icon}</span>
                <div>
                  <div style="font-size:13px;font-weight:600">${s.label}</div>
                  <div style="font-size:11px;color:var(--text3)">Target: ${s.target}</div>
                </div>
              </div>`).join('')}
          </div>

          <!-- Filler word reference -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:12px">Tracked Fillers</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
              ${FILLERS.map(f => `<span class="chip chip-amber" style="font-size:11px">${f}</span>`).join('')}
            </div>
          </div>

          <!-- Session history -->
          <div class="card">
            <div class="sec-title" style="font-size:12px">Recent Sessions</div>
            ${history.length === 0 ? '<div style="font-size:12px;color:var(--text3);text-align:center;padding:20px">No sessions yet — record your first!</div>' :
                history.slice(-5).reverse().map(h => `
              <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border2)">
                <div style="width:40px;height:40px;border-radius:50%;background:${h.fillerRate <= 5 ? 'rgba(16,185,129,0.15)' : h.fillerRate <= 10 ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.15)'};display:flex;align-items:center;justify-content:center;font-family:var(--font2);font-weight:900;color:${h.fillerRate <= 5 ? 'var(--emerald)' : h.fillerRate <= 10 ? 'var(--amber)' : 'var(--rose)'};font-size:13px">${h.clarity}%</div>
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:600">${h.totalFillers} fillers · ${h.wpm} WPM</div>
                  <div style="font-size:10px;color:var(--text3)">${h.date}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;

        setupRecording();
        document.getElementById('fc-retry')?.addEventListener('click', render);
    }

    function setupRecording() {
        const mic = document.getElementById('fc-mic');
        const status = document.getElementById('fc-status');
        const timerEl = document.getElementById('fc-timer');
        const liveEl = document.getElementById('fc-live');
        let elapsed = 0, interval = null, lastText = '';

        if (!mic) return;
        if (!App.SpeechRec.isSupported) {
            status.innerHTML = '⚠️ Voice recognition requires Chrome browser';
            mic.disabled = true; return;
        }

        mic.addEventListener('click', () => {
            if (isRec) { App.SpeechRec.stop(); clearInterval(interval); return; }
            isRec = true; elapsed = 0; lastText = '';
            mic.classList.add('recording');
            liveEl.style.display = 'block';
            status.innerHTML = '<span style="color:var(--rose)">🔴 Recording… speak naturally</span>';
            interval = setInterval(() => {
                elapsed++;
                const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
                const s = String(elapsed % 60).padStart(2, '0');
                timerEl.textContent = `${m}:${s}`;
                // Live filler count
                if (lastText) {
                    const { total } = countFillers(lastText);
                    const rate = elapsed > 0 ? (total / elapsed * 60).toFixed(1) : 0;
                    liveEl.innerHTML = `Fillers detected so far: <strong style="color:${total < 5 ? 'var(--emerald)' : total < 15 ? 'var(--amber)' : 'var(--rose)'}">
            ${total}</strong> &nbsp;·&nbsp; Rate: <strong>${rate}/min</strong>`;
                }
            }, 1000);

            App.SpeechRec.listen(
                t => { lastText = t; liveEl.textContent = t.slice(-120); },
                () => {
                    isRec = false; clearInterval(interval);
                    mic.classList.remove('recording');
                    status.innerHTML = '✅ Done! See your analysis below.';
                    showResults(lastText, elapsed);
                },
                err => {
                    isRec = false; clearInterval(interval);
                    mic.classList.remove('recording');
                    status.textContent = 'Mic error: ' + err;
                }
            );
        });
    }

    function showResults(text, seconds) {
        if (!text.trim()) { document.getElementById('fc-results').style.display = 'block'; document.getElementById('fc-result-body').innerHTML = '<div style="color:var(--rose)">No speech detected. Please try again.</div>'; return; }
        const { counts, total } = countFillers(text);
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const speed = wpm(text, seconds);
        const fillerRate = seconds > 0 ? (total / seconds * 60) : 0;
        const clarity = Math.max(0, Math.round(100 - (fillerRate * 10)));
        const speedOk = speed >= 110 && speed <= 160;
        const col = clarity >= 80 ? 'var(--emerald)' : clarity >= 60 ? 'var(--amber)' : 'var(--rose)';

        // Sort by count
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        document.getElementById('fc-result-body').innerHTML = `
      <!-- Main metrics -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
        <div style="background:var(--bg2);border-radius:12px;padding:14px;text-align:center">
          <div style="font-family:var(--font2);font-size:32px;font-weight:900;color:${col}">${clarity}%</div>
          <div style="font-size:11px;color:var(--text3)">Clarity Score</div>
        </div>
        <div style="background:var(--bg2);border-radius:12px;padding:14px;text-align:center">
          <div style="font-family:var(--font2);font-size:32px;font-weight:900;color:${total > 10 ? 'var(--rose)' : total > 5 ? 'var(--amber)' : 'var(--emerald)'}">${total}</div>
          <div style="font-size:11px;color:var(--text3)">Total Fillers</div>
        </div>
        <div style="background:var(--bg2);border-radius:12px;padding:14px;text-align:center">
          <div style="font-family:var(--font2);font-size:32px;font-weight:900;color:${speedOk ? 'var(--emerald)' : 'var(--amber)'}">${speed}</div>
          <div style="font-size:11px;color:var(--text3)">WPM</div>
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-bottom:14px;font-size:12px">
        <span class="chip ${clarity >= 80 ? 'chip-emerald' : clarity >= 60 ? 'chip-amber' : 'chip-rose'}">${clarity >= 80 ? '✅ Excellent' : clarity >= 60 ? '⚡ Good — keep improving' : '🔴 Needs Work'}</span>
        <span class="chip ${speedOk ? 'chip-teal' : 'chip-amber'}">${speedOk ? '✅ Good Pace' : speed < 110 ? '⬆️ Too Slow' : '⬇️ Too Fast'}</span>
        <span style="font-size:11px;color:var(--text3);align-self:center">${words} words · ${seconds}s</span>
      </div>

      ${sorted.length > 0 ? `
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;margin-bottom:8px">🔍 Fillers Found</div>
        ${sorted.map(([word, count]) => `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border2)">
            <span class="chip chip-amber" style="min-width:60px;text-align:center;font-family:var(--font2)">"${word}"</span>
            <div style="flex:1;height:6px;background:var(--bg2);border-radius:3px">
              <div style="height:100%;border-radius:3px;background:var(--amber);width:${Math.min(100, count * 20)}%"></div>
            </div>
            <span style="font-size:13px;font-weight:700;color:var(--amber);min-width:24px">${count}×</span>
          </div>`).join('')}
      </div>` : '<div style="color:var(--emerald);font-size:14px;font-weight:700;text-align:center;padding:10px">🎉 No fillers detected! Excellent clarity!</div>'}

      <div style="font-size:12px;color:var(--text2);background:rgba(108,99,255,0.06);border-radius:10px;padding:14px;line-height:1.7">
        💡 <strong>Tip:</strong> ${fillerRate > 10 ? 'You\'re using many fillers. Practice pausing silently instead of saying "um". Record again aiming for 0 fillers.' : fillerRate > 5 ? 'Getting better! Try pausing 1-2 seconds before answering instead of saying "uh"' : 'Great fluency! Next goal: keep this when answering complex interview questions.'}
        ${!speedOk ? (speed < 110 ? ' Speak a bit faster — aim for 130 WPM.' : ' Slow down slightly — rushing makes you harder to understand.') : ' Your pace is perfect!'}
      </div>
    `;
        document.getElementById('fc-results').style.display = 'block';

        // Save to history
        const st = App.getState();
        const history = st.fillerHistory || [];
        history.push({ clarity, totalFillers: total, wpm: speed, fillerRate: fillerRate.toFixed(1), date: new Date().toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) });
        App.setState({ fillerHistory: history.slice(-20) });
        App.addXP(Math.round(clarity / 10) * 5, 'Filler Counter Practice');
    }

    return { render };
})();
window.FillerCounter = FillerCounter;
