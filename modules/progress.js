// =============================================
//   MODULE: PROGRESS TRACKER
// =============================================
var Progress = (function () {
  const BADGES = [
    { id: 'streak7', emoji: '🔥', name: '7-Day Streak', desc: 'Practice 7 days in a row' },
    { id: 'streak30', emoji: '⚡', name: '30-Day Streak', desc: 'Practice 30 days in a row' },
    { id: 'xp100', emoji: '⭐', name: 'First 100 XP', desc: 'Earn your first 100 XP' },
    { id: 'xp500', emoji: '🌟', name: '500 XP Club', desc: 'Reach 500 XP total' },
    { id: 'xp1000', emoji: '💫', name: 'XP Champion', desc: 'Reach 1000 XP total' },
    { id: 'interview1', emoji: '💼', name: 'First Interview', desc: 'Complete first mock interview' },
    { id: 'interview10', emoji: '🏆', name: 'Interview Pro', desc: 'Complete 10 mock interviews' },
    { id: 'words10', emoji: '📖', name: 'Word Starter', desc: 'Learn 10 new words' },
    { id: 'words50', emoji: '📚', name: 'Word Wizard', desc: 'Learn 50 new words' },
    { id: 'path_done', emoji: '🗺️', name: 'Path Complete', desc: 'Complete the full 12-week path' },
  ];
  let chart = null;

  function render() {
    const st = App.getState();
    const LEVELS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 10000];
    const NAMES = ['', 'Beginner', 'Explorer', 'Communicator', 'Confident', 'Fluent', 'Professional', 'Expert', 'Master', 'Champion', 'Legend'];
    const nextXP = LEVELS[st.level] || LEVELS[LEVELS.length - 1];
    const prevXP = LEVELS[st.level - 1] || 0;
    const pct = Math.min(100, Math.round(((st.xp - prevXP) / (nextXP - prevXP)) * 100));
    const earned = new Set(st.badges || []);
    const weeklyXP = st.weeklyXP || [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    document.getElementById('page-progress').innerHTML = `
      <div class="page-hdr">
        <h1>📈 My <span>Progress</span></h1>
        <p>Track your English learning journey and achievements</p>
      </div>

      <div class="card" style="margin-bottom:24px;display:flex;gap:28px;align-items:center">
        <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-family:var(--font2);font-size:28px;font-weight:900;color:#fff;flex-shrink:0">${st.level}</div>
        <div style="flex:1">
          <div style="font-family:var(--font2);font-size:22px;font-weight:800">${NAMES[st.level] || 'Legend'}</div>
          <div style="color:var(--text2);font-size:13px;margin:4px 0">Level ${st.level} · ${st.xp} XP total</div>
          <div class="progress-track" style="margin:10px 0 6px">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <div style="font-size:11px;color:var(--text3)">${nextXP - st.xp} XP to Level ${st.level + 1} · ${NAMES[st.level + 1] || ''}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:36px;font-weight:900;font-family:var(--font2);color:var(--amber)">${st.streak}</div>
          <div style="font-size:11px;color:var(--text2)"><i class="fas fa-fire" style="color:var(--amber)"></i> Day Streak</div>
        </div>
      </div>

      <div class="four-col" style="margin-bottom:24px">
        <div class="stat-card"><div class="stat-num" style="color:var(--accent2)">${st.xp || 0}</div><div class="stat-label">Total XP</div></div>
        <div class="stat-card"><div class="stat-num" style="color:var(--teal)">${st.interviewsDone || 0}</div><div class="stat-label">Interviews Done</div></div>
        <div class="stat-card"><div class="stat-num" style="color:var(--amber)">${st.wordsLearned || 0}</div><div class="stat-label">Words Learned</div></div>
        <div class="stat-card"><div class="stat-num" style="color:var(--emerald)">${(st.lessonsCompleted || []).length}</div><div class="stat-label">Lessons Done</div></div>
      </div>

      <div class="two-col" style="margin-bottom:24px">
        <div class="chart-panel">
          <div class="chart-title">📊 Weekly XP (Last 7 Days)</div>
          <canvas id="xp-chart" height="180"></canvas>
        </div>
        <div class="card">
          <div class="sec-title" style="font-size:13px">Learning Path</div>
          <div style="text-align:center;padding:16px 0">
            <div style="font-size:46px;font-weight:900;font-family:var(--font2);color:var(--accent2)">${(st.lessonsCompleted || []).length}</div>
            <div style="color:var(--text2);font-size:13px">of 24 lessons</div>
          </div>
          <div class="progress-track" style="margin-bottom:12px">
            <div class="progress-fill" style="width:${Math.round(((st.lessonsCompleted || []).length / 24) * 100)}%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-bottom:16px">
            <span>${Math.round(((st.lessonsCompleted || []).length / 24) * 100)}% complete</span>
            <span>${24 - (st.lessonsCompleted || []).length} remaining</span>
          </div>
          <button class="btn btn-ghost btn-sm btn-full" id="goto-path"><i class="fas fa-route"></i> Continue Path</button>
          <div class="divider"></div>
          <div class="sec-title" style="font-size:13px">Challenges Done</div>
          <div style="font-size:36px;font-weight:900;font-family:var(--font2);color:var(--rose)">${(st.challengesDone || []).length}</div>
          <div style="font-size:12px;color:var(--text2)">daily challenges</div>
        </div>
      </div>

      <div class="sec-title">Achievements</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:16px">${earned.size} / ${BADGES.length} badges earned</div>
      <div class="badge-grid" style="margin-bottom:24px">
        ${BADGES.map(b => `
          <div class="badge-card ${earned.has(b.id) ? 'earned' : 'locked'}">
            <div class="badge-em">${b.emoji}</div>
            <div class="badge-name">${b.name}</div>
            <div style="font-size:10px;color:var(--text3);margin-top:3px">${b.desc}</div>
            ${!earned.has(b.id) ? '<div style="font-size:9px;color:var(--text3);margin-top:4px">🔒 Locked</div>' : '<div style="font-size:9px;color:var(--emerald);margin-top:4px">✅ Earned</div>'}
          </div>`).join('')}
      </div>

      <div class="card" style="background:rgba(108,99,255,0.05)">
        <div class="sec-title" style="font-size:13px">💡 How to Improve Faster</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
          ${[
        ['⏱️', 'Practice 10 min daily', 'Consistency beats intensity'],
        ['🎙️', 'Record & replay yourself', 'You\'ll hear errors you miss live'],
        ['💼', '1 mock interview per week', 'Real interview practice matters'],
        ['📖', '3 new words per day', 'Builds professional vocabulary'],
        ['🧠', 'Think in English', 'Avoid mental translation'],
        ['📱', 'Use the Daily Challenge', '5 min to stay sharp every day'],
      ].map(([icon, title, desc]) => `
            <div class="card" style="padding:16px">
              <div style="font-size:22px;margin-bottom:8px">${icon}</div>
              <div style="font-size:13px;font-weight:700">${title}</div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px">${desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.getElementById('goto-path')?.addEventListener('click', () => App.navigateTo('learning-path'));
    renderChart(weeklyXP, dayNames);
  }

  function renderChart(weeklyXP, dayNames) {
    const canvas = document.getElementById('xp-chart');
    if (!canvas) return;
    if (chart) { chart.destroy(); chart = null; }
    const today = new Date().getDay();
    const labels = [], data = [];
    for (let i = 6; i >= 0; i--) {
      labels.push(dayNames[(today - i + 7) % 7]);
      data.push(weeklyXP[(today - i + 7) % 7] || 0);
    }
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels, datasets: [{
          label: 'XP', data,
          backgroundColor: labels.map((_, i) => i === 6 ? 'rgba(108,99,255,0.85)' : 'rgba(108,99,255,0.2)'),
          borderColor: 'rgba(108,99,255,0.8)', borderWidth: 1, borderRadius: 6
        }]
      },
      options: {
        responsive: true, plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4f5a72', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4f5a72', font: { size: 11 } }, beginAtZero: true }
        }
      }
    });
  }

  return { render };
})();
window.Progress = Progress;
