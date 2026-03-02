// =============================================
//   MODULE: DASHBOARD
// =============================================
var Dashboard = (function () {
    function render() {
        const st = App.getState();
        const LEVELS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 10000];
        const NAMES = ['', 'Beginner', 'Explorer', 'Communicator', 'Confident', 'Fluent', 'Professional', 'Expert', 'Master', 'Champion', 'Legend'];
        const nextXP = LEVELS[st.level] || LEVELS[LEVELS.length - 1];
        const prevXP = LEVELS[st.level - 1] || 0;
        const pct = Math.min(100, Math.round(((st.xp - prevXP) / (nextXP - prevXP)) * 100));
        const todayDone = (st.challengesDone || []).includes(new Date().toDateString());
        const quote = App.randomFrom([
            '"The only way to do great work is to love what you do." — Steve Jobs',
            '"Every expert was once a beginner. Keep speaking!"',
            '"Confidence is not the absence of fear — it\'s deciding something else matters more."',
            '"Your accent is a sign of bravery — you communicate in another language!"',
            '"The limits of my language are the limits of my world." — Wittgenstein',
            '"Practice is the best master." Speak 10 minutes every day!',
        ]);
        const quickLinks = [
            { page: 'pronunciation', icon: '🎤', color: '#6c63ff', title: 'Pronunciation', desc: 'Record & practice speaking aloud' },
            { page: 'interview', icon: '💼', color: '#00d4b1', title: 'Interview Sim', desc: 'AI-powered mock interviews' },
            { page: 'vocabulary', icon: '📚', color: '#f59e0b', title: 'Vocabulary', desc: 'Flashcards & word quizzes' },
            { page: 'daily-challenge', icon: '⚡', color: '#f43f5e', title: 'Daily Challenge', desc: '5-min daily exercise' },
            { page: 'conversation', icon: '💬', color: '#10b981', title: 'Conversation AI', desc: 'Chat with AI in scenarios' },
            { page: 'learning-path', icon: '🗺️', color: '#8b84ff', title: 'Learning Path', desc: '12-week structured course' },
        ];

        document.getElementById('page-dashboard').innerHTML = `
      <div class="dash-hero">
        <div class="dash-hero-name">Hey, ${st.userName} 👋</div>
        <div class="dash-hero-sub">Ready to level up your English today? Keep the streak going!</div>
        <div class="dash-hero-meta">
          <span class="dash-hero-badge streak-badge"><i class="fas fa-fire"></i> ${st.streak} Day Streak${st.streak >= 7 ? ' 🔥' : ''}</span>
          <span class="dash-hero-badge level-badge"><i class="fas fa-star"></i> Level ${st.level} · ${NAMES[st.level] || 'Legend'}</span>
          <span class="dash-hero-badge level-badge" style="border-color:rgba(245,158,11,0.3);color:var(--amber);background:rgba(245,158,11,0.1)">
            <i class="fas fa-bolt"></i> ${st.xp} XP
          </span>
        </div>
        <div style="margin-top:18px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:7px">
            <span>Progress to Level ${st.level + 1}</span><span style="color:var(--accent2)">${pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div style="font-size:11px;color:var(--text3);margin-top:5px">${nextXP - st.xp} XP to next level</div>
        </div>
      </div>

      ${!todayDone ? `
      <div class="card" style="background:linear-gradient(135deg,rgba(0,212,177,0.08),rgba(108,99,255,0.06));border-color:rgba(0,212,177,0.2);display:flex;align-items:center;gap:18px;cursor:pointer;margin-bottom:24px" id="daily-cta">
        <div style="font-size:40px">⚡</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:16px">Daily Challenge Ready!</div>
          <div style="color:var(--text2);font-size:13px;margin-top:3px">Complete today's 5-minute exercise — earn +30 XP bonus</div>
        </div>
        <button class="btn btn-teal btn-sm">Start Now <i class="fas fa-arrow-right"></i></button>
      </div>` : ''}

      <div class="sec-title">Quick Access</div>
      <div class="quick-grid" style="margin-bottom:28px">
        ${quickLinks.map(q => `
          <button class="quick-card" data-page="${q.page}">
            <div class="qc-icon" style="background:${q.color}22">
              <span style="font-size:22px">${q.icon}</span>
            </div>
            <div>
              <div class="qc-title">${q.title}</div>
              <div class="qc-desc">${q.desc}</div>
            </div>
            <div class="qc-arrow"><i class="fas fa-chevron-right"></i></div>
          </button>
        `).join('')}
      </div>

      <div class="sec-title">Your Stats</div>
      <div class="four-col" style="margin-bottom:28px">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-num" style="color:var(--accent2)">${st.xp}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-num" style="color:var(--teal)">${st.interviewsDone || 0}</div>
          <div class="stat-label">Interviews Done</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-num" style="color:var(--amber)">${st.wordsLearned || 0}</div>
          <div class="stat-label">Words Learned</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-num" style="color:var(--emerald)">${(st.lessonsCompleted || []).length}</div>
          <div class="stat-label">Lessons Done</div>
        </div>
      </div>

      <div class="sec-title">Learning Path Progress</div>
      <div class="card" style="margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:14px;font-weight:600">12-Week Course</span>
          <span style="color:var(--accent2);font-weight:700">${(st.lessonsCompleted || []).length} / 24 lessons</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${Math.round(((st.lessonsCompleted || []).length / 24) * 100)}%"></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="go-path" style="margin-top:14px">
          <i class="fas fa-route"></i> Continue Learning Path
        </button>
      </div>

      <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.12)">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--accent2);margin-bottom:8px">💡 Daily Motivation</div>
        <div style="font-size:14px;font-style:italic;color:var(--text2);line-height:1.75">${quote}</div>
      </div>
    `;

        document.querySelectorAll('.quick-card[data-page]').forEach(btn =>
            btn.addEventListener('click', () => App.navigateTo(btn.dataset.page))
        );
        document.getElementById('daily-cta')?.addEventListener('click', () => App.navigateTo('daily-challenge'));
        document.getElementById('go-path')?.addEventListener('click', () => App.navigateTo('learning-path'));
    }
    return { render };
})();
window.Dashboard = Dashboard;
