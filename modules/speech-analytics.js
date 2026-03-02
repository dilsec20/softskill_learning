// =============================================
//   MODULE: SPEECH ANALYTICS DASHBOARD
// =============================================
var SpeechAnalytics = (function () {

    function render() {
        const st = App.getState();
        const fillerHistory = st.fillerHistory || [];
        const interviewsDone = st.interviewsDone || 0;
        const challengesDone = (st.challengesDone || []).length;
        const lessonsCompleted = (st.lessonsCompleted || []).length;
        const weeklyXP = st.weeklyXP || [0, 0, 0, 0, 0, 0, 0];
        const totalXP = st.xp || 0;
        const level = st.level || 1;

        // Compute filler trends
        const avgClarity = fillerHistory.length > 0
            ? Math.round(fillerHistory.reduce((a, h) => a + h.clarity, 0) / fillerHistory.length)
            : null;
        const avgWPM = fillerHistory.length > 0
            ? Math.round(fillerHistory.reduce((a, h) => a + h.wpm, 0) / fillerHistory.length)
            : null;
        const lastSession = fillerHistory.length > 0 ? fillerHistory[fillerHistory.length - 1] : null;

        // Trend: improving, worsening, stable?
        let clarityTrend = null;
        if (fillerHistory.length >= 2) {
            const recent = fillerHistory.slice(-3).map(h => h.clarity);
            const older = fillerHistory.slice(-6, -3).map(h => h.clarity);
            if (older.length > 0) {
                const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
                const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
                clarityTrend = recentAvg - olderAvg;
            }
        }

        // Level names
        const LEVEL_NAMES = ['', 'Beginner', 'Explorer', 'Communicator', 'Confident', 'Fluent', 'Professional', 'Expert', 'Master', 'Champion', 'Legend'];
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const maxXP = Math.max(...weeklyXP, 1);

        document.getElementById('page-speech-analytics').innerHTML = `
      <div class="page-hdr">
        <h1>📊 Speech <span>Analytics</span></h1>
        <p>Your complete communication progress — track clarity, fluency, XP, and improvement trends over time</p>
      </div>

      <!-- Overview stats row -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">
        ${[
                { label: 'Total XP', val: totalXP, icon: '⭐', col: 'var(--accent2)', sub: 'Level ' + level + ' · ' + LEVEL_NAMES[level] },
                { label: 'Avg Clarity', val: avgClarity !== null ? (avgClarity + '%') : '—', icon: '🎯', col: avgClarity >= 80 ? 'var(--emerald)' : avgClarity >= 60 ? 'var(--amber)' : 'var(--rose)', sub: avgClarity !== null ? 'Over ' + fillerHistory.length + ' sessions' : 'No sessions yet' },
                { label: 'Avg WPM', val: avgWPM || '—', icon: '⚡', col: avgWPM >= 110 && avgWPM <= 160 ? 'var(--teal)' : 'var(--amber)', sub: avgWPM ? 'Target: 120–150' : 'Start Filler Counter' },
                { label: 'Sessions', val: fillerHistory.length, icon: '📅', col: 'var(--accent)', sub: challengesDone + ' challenges · ' + interviewsDone + ' interviews' },
            ].map(s => `
          <div class="card" style="text-align:center;padding:20px">
            <div style="font-size:28px;margin-bottom:8px">${s.icon}</div>
            <div style="font-family:var(--font2);font-size:32px;font-weight:900;color:${s.col}">${s.val}</div>
            <div style="font-size:11px;font-weight:600;color:var(--text2);margin:4px 0">${s.label}</div>
            <div style="font-size:10px;color:var(--text3)">${s.sub}</div>
          </div>`).join('')}
      </div>

      <div class="two-col" style="align-items:start">

        <!-- LEFT: Charts and history -->
        <div>
          <!-- Weekly XP bar chart -->
          <div class="card" style="margin-bottom:18px">
            <div class="sec-title" style="font-size:14px">📅 Weekly XP Activity</div>
            <div style="display:flex;align-items:flex-end;gap:10px;height:100px;margin-top:14px">
              ${weeklyXP.map((xp, i) => {
                const today = new Date().getDay();
                const pct = Math.round((xp / maxXP) * 100);
                return `
                  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
                    <div style="font-size:10px;color:var(--accent2);font-weight:${xp > 0 ? '700' : '400'}">${xp > 0 ? xp : ''}</div>
                    <div style="width:100%;height:${Math.max(4, pct)}px;background:${i === today ? 'var(--accent)' : xp > 0 ? 'var(--accent2)' : 'var(--border2)'};border-radius:4px 4px 0 0;transition:height 0.5s"></div>
                    <div style="font-size:10px;color:${i === today ? 'var(--accent2)' : 'var(--text3)'; font - weight: i === today ? '700' : '400'">${DAYS[i]}</div>
                  </div > `;
              }).join('')}
            </div>
          </div>

          <!-- Clarity trend -->
          <div class="card" style="margin-bottom:18px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <div class="sec-title" style="font-size:14px">🌊 Clarity Score History</div>
              ${clarityTrend !== null ? `<span class="chip ${clarityTrend > 5 ? 'chip-emerald' : clarityTrend > -5 ? 'chip-amber' : 'chip-rose'}">
                ${clarityTrend > 5 ? '📈 Improving' : clarityTrend > -5 ? '➡️ Stable' : '📉 Declining'}
              </span>`: ''}
            </div>
            ${fillerHistory.length === 0 ?
        `<div style="text-align:center;padding:30px;color:var(--text3);font-size:13px">
                <div style="font-size:40px;margin-bottom:12px;opacity:0.3">📊</div>
                No sessions yet — go to <strong>Filler Counter</strong> to record your first session!
              </div>` :
        `<div style="display:flex;align-items:flex-end;gap:6px;height:80px;margin-bottom:10px">
                ${fillerHistory.slice(-10).map(h => `
                  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px" title="${h.clarity}% clarity">
                    <div style="width:100%;height:${h.clarity}px;max-height:80px;background:${h.clarity >= 80 ? 'var(--emerald)' : h.clarity >= 60 ? 'var(--teal)' : 'var(--rose)'};border-radius:3px 3px 0 0;opacity:0.8"></div>
                  </div>`).join('')}
              </div>
              <div style="font-size:11px;color:var(--text3);text-align:center">Last ${Math.min(10, fillerHistory.length)} sessions (higher = better)</div>`}
          </div>

          <!-- Recent filler sessions -->
          <div class="card">
            <div class="sec-title" style="font-size:14px">🕐 Recent Filler Counter Sessions</div>
            ${fillerHistory.length === 0 ?
        '<div style="text-align:center;padding:20px;color:var(--text3);font-size:13px">No sessions yet</div>' :
        fillerHistory.slice(-8).reverse().map((h, i) => `
                <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border2)">
                  <div style="width:44px;height:44px;border-radius:50%;background:${h.clarity >= 80 ? 'rgba(16,185,129,0.15)' : h.clarity >= 60 ? 'rgba(0,212,177,0.15)' : h.clarity >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.15)'};display:flex;align-items:center;justify-content:center;font-family:var(--font2);font-weight:900;font-size:14px;color:${h.clarity >= 80 ? 'var(--emerald)' : h.clarity >= 60 ? 'var(--teal)' : h.clarity >= 40 ? 'var(--amber)' : 'var(--rose)'}">${h.clarity}%</div>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:600">${h.totalFillers} fillers · ${h.wpm} WPM</div>
                    <div style="font-size:11px;color:var(--text3)">${h.date || 'Session ' + (fillerHistory.length - i)}</div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:12px;font-weight:700;color:${h.clarity >= 80 ? 'var(--emerald)' : h.clarity >= 60 ? 'var(--teal)' : h.clarity >= 40 ? 'var(--amber)' : 'var(--rose)'}">${h.clarity >= 80 ? 'Excellent' : h.clarity >= 60 ? 'Good' : h.clarity >= 40 ? 'Average' : 'Needs Work'}</div>
                    <div style="font-size:10px;color:var(--text3)">${h.fillerRate}/min</div>
                  </div>
                </div>`).join('')}
          </div>
        </div>

        <!-- RIGHT: Goals and tips -->
        <div>
          <!-- Speaking targets -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">🎯 Your Speaking Targets</div>
            ${[
        { label: 'Clarity Score', current: avgClarity, target: 80, unit: '%', color: 'var(--emerald)' },
        { label: 'Speech Pace', current: avgWPM, target: 135, unit: ' WPM', color: 'var(--teal)' },
        { label: 'Fillers/min', current: lastSession?.fillerRate, target: 5, unit: '/min', color: 'var(--accent2)', lower: true },
    ].map(g => {
        const has = g.current !== null && g.current !== undefined;
        const met = has && (g.lower ? parseFloat(g.current) <= g.target : parseFloat(g.current) >= g.target);
        return `
                <div style="padding:12px 0;border-bottom:1px solid var(--border2)">
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                    <span style="font-size:13px;font-weight:600">${g.label}</span>
                    <span style="font-size:12px;color:${met ? 'var(--emerald)' : 'var(--text3)'}">
                      ${has ? (g.current + g.unit + ' / target: ' + (g.lower ? '<' : '>=') + g.target + g.unit) : 'No data'}
                      ${met ? ' ✅' : ''}
                    </span>
                  </div>
                  <div class="progress-track" style="height:5px">
                    <div class="progress-fill" style="width:${has ? Math.min(100, Math.round((parseFloat(g.current) / g.target) * 100)) + '%' : '0%'};background:${met ? g.color : 'var(--accent)'}"></div>
                  </div>
                </div>`;
    }).join('')}
          </div>

          <!-- Activity summary -->
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">🏆 Activity Summary</div>
            ${[
        { icon: '📚', label: 'Lessons Completed', val: lessonsCompleted, total: 24 },
        { icon: '💼', label: 'Interview Sessions', val: interviewsDone, total: '∞' },
        { icon: '⚡', label: 'Daily Challenges', val: challengesDone, total: '∞' },
        { icon: '🌊', label: 'Filler Sessions', val: fillerHistory.length, total: '∞' },
        { icon: '🔥', label: 'Day Streak', val: st.streak || 0, total: '∞' },
    ].map(a => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border2)">
                <span style="font-size:20px">${a.icon}</span>
                <div style="flex:1"><div style="font-size:13px;font-weight:600">${a.label}</div></div>
                <div style="font-family:var(--font2);font-size:18px;font-weight:900;color:var(--accent2)">${a.val}</div>
                ${typeof a.total === 'number' ? `<div style="font-size:11px;color:var(--text3)">/${a.total}</div>` : ''}
              </div>`).join('')}
          </div>

          <!-- Personalized tips based on data -->
          <div class="card" style="background:rgba(108,99,255,0.06);border-color:rgba(108,99,255,0.15)">
            <div class="sec-title" style="font-size:13px;color:var(--accent2)">💡 Personalized Tips</div>
            ${fillerHistory.length === 0 ? `
              <div class="tip-row"><i class="fas fa-arrow-right" style="color:var(--accent)"></i>Start with the <strong>Filler Counter</strong> to get your baseline clarity score</div>
              <div class="tip-row"><i class="fas fa-arrow-right" style="color:var(--accent)"></i>Try the <strong>Daily Challenge</strong> every day for consistent practice</div>
              <div class="tip-row"><i class="fas fa-arrow-right" style="color:var(--accent)"></i>Use <strong>DSA Think-Aloud</strong> to practice coding interview communication</div>
            ` : `
              ${avgClarity < 60 ? '<div class="tip-row"><i class="fas fa-exclamation-circle" style="color:var(--rose)"></i>Your clarity is low — focus on <strong>pausing instead of using fillers</strong></div>' : avgClarity < 80 ? '<div class="tip-row"><i class="fas fa-lightbulb" style="color:var(--amber)"></i>Good progress! Replace "um" with a <strong>2-second confident pause</strong></div>' : '<div class="tip-row"><i class="fas fa-star" style="color:var(--emerald)"></i>Excellent clarity! Focus now on <strong>pace variation and emphasis</strong></div>'}
              ${avgWPM && avgWPM < 110 ? '<div class="tip-row"><i class="fas fa-tachometer-alt" style="color:var(--amber)"></i>You speak slowly — practice <strong>reading aloud faster</strong> in Pronunciation</div>' : avgWPM > 160 ? '<div class="tip-row"><i class="fas fa-tachometer-alt" style="color:var(--rose)"></i>You speak too fast — <strong>slow down and pause</strong> after key points</div>' : '<div class="tip-row"><i class="fas fa-check-circle" style="color:var(--emerald)"></i>Your pace is good! Now work on <strong>stress and intonation</strong></div>'}
              ${interviewsDone < 3 ? '<div class="tip-row"><i class="fas fa-briefcase" style="color:var(--accent2)"></i>Practice more <strong>Interview Simulator</strong> sessions to build confidence</div>' : ''}
              ${challengesDone < 5 ? '<div class="tip-row"><i class="fas fa-bolt" style="color:var(--teal)"></i>Complete the <strong>Daily Challenge</strong> every day — it builds consistency</div>' : ''}
            `}
          </div>
        </div>
      </div>
    `;
  }

return { render };
}) ();
window.SpeechAnalytics = SpeechAnalytics;
