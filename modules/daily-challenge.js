// =============================================
//   MODULE: DAILY CHALLENGE
// =============================================
var DailyChallenge = (function () {
    const CHAL = [
        { icon: '📖', title: 'Read Aloud', desc: 'Read clearly & confidently', content: 'Technology is transforming the way we work and communicate. As a software engineer, the ability to explain complex systems in simple terms is just as valuable as writing efficient code. Good communication builds trust, accelerates projects, and opens doors to leadership opportunities.', instruction: 'Read slowly. Focus on: technology, communicate, efficient, opportunities.' },
        { icon: '🖼️', title: 'Describe a Scenario', desc: '60-second structured answer', content: 'You join a new team and discover the codebase is messy with no documentation. Your manager asks you to improve it. How would you approach this?', instruction: 'Use STAR method: Situation, Task, Action, Result. Speak for 60+ seconds.' },
        { icon: '✏️', title: 'Grammar Fix', desc: 'Spot and correct the errors', content: '1. "I am working here since 3 years."\n2. "She don\'t know the answer."\n3. "I have went to that conference yesterday."\n4. "The code is more better now."\n5. "He said me that the build was fail."', instruction: 'Speak the corrected version of each sentence aloud clearly.' },
        { icon: '🙋', title: 'Self Introduction', desc: '60-second elevator pitch', content: 'Introduce yourself as if appearing for your dream job at Google, Microsoft, or a top startup.', instruction: 'Cover: Name, College, Year, Key skills, One project, Why this role. Under 90 seconds!' },
        { icon: '💡', title: 'Express Opinion', desc: 'Give your view on a hot topic', content: '"AI will replace software engineers in the next 10 years." — Do you agree or disagree? Why?', instruction: 'Start with "In my opinion..." Use examples. 60-90 seconds. Be confident!' },
        { icon: '🎤', title: 'Pronunciation Challenge', desc: 'Technical paragraph — read aloud', content: 'The asynchronous architecture ensures scalability and resilience. Specifically, the distributed microservices communicate through RESTful APIs and message queues, providing approximately 99.9% uptime with particularly efficient throughput.', instruction: 'Read slowly. These are commonly mispronounced in interviews.' },
        { icon: '📊', title: 'Explain Your Project', desc: 'Explain to a non-technical person', content: 'Imagine your project is being presented to a non-tech VP. They want to know: What problem does it solve? How does it work? What was YOUR contribution? What was the impact?', instruction: 'Speak 60-90 seconds. Avoid jargon. Use analogies. Use "I built", "I designed".' },
    ];

    let isRec = false, elapsed = 0, interval = null;

    function render() {
        const st = App.getState();
        const today = new Date().toDateString();
        const ci = new Date().getDate() % CHAL.length;
        const c = CHAL[ci];
        const done = (st.challengesDone || []).includes(today);

        document.getElementById('page-daily-challenge').innerHTML = `
      <div class="page-hdr">
        <h1>⚡ Daily <span>Challenge</span></h1>
        <p>${done ? '✅ Today\'s challenge complete! Come back tomorrow.' : 'A new 5-minute exercise every day — earn +30 XP bonus!'}</p>
      </div>
      <div class="challenge-layout">
        <div>
          <div class="challenge-hero">
            <div class="ch-icon">${c.icon}</div>
            <div style="display:flex;justify-content:center;gap:8px;margin-bottom:10px">
              <span class="chip chip-teal">Today's Challenge</span>
              <span class="chip chip-amber">+30 XP Bonus</span>
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
          <div class="card" style="text-align:center;padding:28px;margin-bottom:14px">
            <div class="timer-num" id="ch-timer" style="display:none;margin-bottom:12px">00:00</div>
            <div style="display:flex;justify-content:center;margin-bottom:14px">
              <button class="mic-btn" id="ch-mic"><i class="fas fa-microphone"></i></button>
            </div>
            <div style="color:var(--text2);font-size:13px" id="ch-status">
              ${App.SpeechRec.isSupported ? 'Tap mic to start recording' : '⚠️ Use Chrome for voice features'}
            </div>
            <div id="ch-result" style="display:none;margin-top:14px;background:var(--bg3);border-radius:10px;padding:14px;text-align:left">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:6px">YOU SAID</div>
              <div id="ch-transcript" style="font-size:14px;color:var(--text2);line-height:1.7"></div>
            </div>
            <button class="btn btn-primary btn-full" id="ch-done" style="display:none;margin-top:14px">
              <i class="fas fa-check-circle"></i> Mark Complete (+30 XP)
            </button>
          </div>
          ` : `
          <div class="card" style="text-align:center;padding:40px">
            <div style="font-size:54px;margin-bottom:14px">🏆</div>
            <div style="font-family:var(--font2);font-size:24px;font-weight:800;color:var(--emerald)">Challenge Complete!</div>
            <div style="color:var(--text2);margin-top:8px">Great work! Come back tomorrow for a new challenge.</div>
          </div>`}
        </div>
        <div>
          <div class="card">
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
          <div class="card" style="margin-top:14px">
            <div class="sec-title" style="font-size:13px">Your Stats</div>
            <div style="font-size:38px;font-weight:900;font-family:var(--font2);color:var(--accent2)">${(st.challengesDone || []).length}</div>
            <div style="font-size:12px;color:var(--text2)">challenges completed</div>
            <div style="margin-top:10px"><span class="chip chip-amber"><i class="fas fa-fire"></i> ${st.streak} day streak</span></div>
          </div>
        </div>
      </div>
    `;

        if (!done) setupMic(today);
    }

    function setupMic(today) {
        const mic = document.getElementById('ch-mic');
        const status = document.getElementById('ch-status');
        const result = document.getElementById('ch-result');
        const transcript = document.getElementById('ch-transcript');
        const timer = document.getElementById('ch-timer');
        const doneBtn = document.getElementById('ch-done');
        if (!mic) return;

        mic.addEventListener('click', () => {
            if (isRec) { App.SpeechRec.stop(); clearInterval(interval); return; }
            if (!App.SpeechRec.isSupported) return;
            isRec = true; elapsed = 0;
            mic.classList.add('recording');
            timer.style.display = 'block';
            status.textContent = '🔴 Recording...';
            interval = setInterval(() => {
                elapsed++;
                const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
                const s = String(elapsed % 60).padStart(2, '0');
                timer.textContent = `${m}:${s}`;
            }, 1000);
            App.SpeechRec.listen(
                t => { transcript.textContent = t; result.style.display = 'block'; },
                () => { isRec = false; clearInterval(interval); mic.classList.remove('recording'); status.textContent = `✅ Recorded ${timer.textContent}`; doneBtn.style.display = 'flex'; },
                err => { isRec = false; clearInterval(interval); mic.classList.remove('recording'); status.textContent = 'Error: ' + err; doneBtn.style.display = 'flex'; }
            );
        });
        doneBtn?.addEventListener('click', () => {
            const st = App.getState();
            App.setState({ challengesDone: [...(st.challengesDone || []), today] });
            App.addXP(30, 'Daily Challenge');
            render();
        });
    }

    return { render };
})();
window.DailyChallenge = DailyChallenge;
