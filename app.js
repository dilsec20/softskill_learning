// =============================================
//   SPEAKUP — CORE APP (DESKTOP LAYOUT)
// =============================================
(function () {
    'use strict';
    const _app = {};
    const DEFAULT_API_KEY = 'AIzaSyB5f6QCy4DVyGwRe4QyFXV3H_rMUlW0avc';

    // ---- STATE ----
    let state = {
        currentPage: 'dashboard',
        userName: 'CSE Student',
        apiKey: DEFAULT_API_KEY,
        difficulty: 'intermediate',
        xp: 0, level: 1, streak: 0, lastActive: null,
        lessonsCompleted: [], wordsLearned: 0, interviewsDone: 0,
        weeklyXP: [0, 0, 0, 0, 0, 0, 0], challengesDone: [],
        badges: [], vocabCardState: {},
    };
    const BREADCRUMBS = {
        'dashboard': 'Dashboard', 'learning-path': 'Learning Path',
        'pronunciation': 'Pronunciation', 'interview': 'Interview Simulator',
        'vocabulary': 'Vocabulary', 'conversation': 'Conversation AI',
        'daily-challenge': 'Daily Challenge', 'progress': 'My Progress',
        'filler-counter': '🌊 Filler Word Counter',
        'dsa-thinkaloud': '💻 DSA Think-Aloud',
        'cs-fundamentals': '🧠 CS Fundamentals Quiz',
        'speech-analytics': '📊 Speech Analytics',
    };
    const $ = id => document.getElementById(id);

    // ---- PERSISTENCE ----
    function loadState() {
        try {
            const s = localStorage.getItem('speakup_state');
            if (s) {
                const parsed = JSON.parse(s);
                // Inject default API key if none saved
                if (!parsed.apiKey) parsed.apiKey = DEFAULT_API_KEY;
                state = { ...state, ...parsed };
            }
        } catch (e) { }
    }
    function saveState() { localStorage.setItem('speakup_state', JSON.stringify(state)); }

    _app.saveState = saveState;
    _app.getState = () => state;
    _app.setState = function (u) { Object.assign(state, u); saveState(); updateUI(); };

    // ---- STREAK ----
    function checkStreak() {
        const today = new Date().toDateString();
        if (state.lastActive === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        state.streak = state.lastActive === yesterday ? state.streak + 1 : 1;
        state.lastActive = today;
        saveState();
    }

    // ---- UI UPDATE ----
    function updateUI() {
        const LEVELS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 10000];
        const NAMES = ['', 'Beginner', 'Explorer', 'Communicator', 'Confident', 'Fluent', 'Professional', 'Expert', 'Master', 'Champion', 'Legend'];
        let lvl = 1;
        for (let i = LEVELS.length - 1; i >= 0; i--) { if (state.xp >= LEVELS[i]) { lvl = i + 1; break; } }
        state.level = lvl;
        const nextXP = LEVELS[lvl] || LEVELS[LEVELS.length - 1];
        const prevXP = LEVELS[lvl - 1] || 0;
        const pct = Math.min(100, Math.round(((state.xp - prevXP) / (nextXP - prevXP)) * 100));

        // Sidebar
        const sName = $('sidebar-name'); if (sName) sName.textContent = state.userName;
        const sLvl = $('sidebar-level'); if (sLvl) sLvl.textContent = `Level ${lvl} · ${NAMES[lvl] || 'Legend'}`;
        const sXP = $('sidebar-xp-val'); if (sXP) sXP.textContent = `${state.xp} XP`;
        const sNext = $('sidebar-xp-next'); if (sNext) sNext.textContent = `/ ${nextXP} XP`;
        const sFill = $('sidebar-xp-fill'); if (sFill) sFill.style.width = pct + '%';
        const sStr = $('sidebar-streak-val'); if (sStr) sStr.textContent = state.streak;

        // Top bar
        const tXP = $('topbar-xp'); if (tXP) tXP.textContent = state.xp + ' XP';
        const tStr = $('topbar-streak'); if (tStr) tStr.textContent = state.streak;

        // Challenge badge
        const today = new Date().toDateString();
        const cb = $('challenge-badge');
        if (cb) cb.style.display = (state.challengesDone || []).includes(today) ? 'none' : 'inline';
    }

    // ---- NAV ----
    function navigateTo(page) {
        state.currentPage = page;
        saveState();
        // Pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const el = $('page-' + page);
        if (el) el.classList.add('active');
        // Nav items
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        // Breadcrumb
        const bc = $('page-breadcrumb');
        if (bc) bc.textContent = BREADCRUMBS[page] || page;
        // Close mobile sidebar
        closeMobileSidebar();
        // Render module
        switch (page) {
            case 'dashboard': try { Dashboard.render(); } catch (e) { } break;
            case 'learning-path': try { LearningPath.render(); } catch (e) { } break;
            case 'pronunciation': try { Pronunciation.render(); } catch (e) { } break;
            case 'interview': try { Interview.render(); } catch (e) { } break;
            case 'vocabulary': try { Vocabulary.render(); } catch (e) { } break;
            case 'conversation': try { Conversation.render(); } catch (e) { } break;
            case 'daily-challenge': try { DailyChallenge.render(); } catch (e) { } break;
            case 'progress': try { Progress.render(); } catch (e) { } break;
            case 'filler-counter': try { FillerCounter.render(); } catch (e) { } break;
            case 'dsa-thinkaloud': try { DSAThinkaloud.render(); } catch (e) { } break;
            case 'cs-fundamentals': try { CSFundamentals.render(); } catch (e) { } break;
            case 'speech-analytics': try { SpeechAnalytics.render(); } catch (e) { } break;
        }
        updateUI();
    }
    _app.navigateTo = navigateTo;

    // ---- MOBILE SIDEBAR ----
    function closeMobileSidebar() {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
        document.getElementById('mobile-overlay')?.classList.add('hidden');
    }
    function setupMobileSidebar() {
        $('mobile-menu-btn')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('mobile-open');
            document.getElementById('mobile-overlay').classList.toggle('hidden');
        });
        $('mobile-overlay')?.addEventListener('click', closeMobileSidebar);
    }

    // ---- SIDEBAR NAV ----
    function setupNav() {
        document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
            btn.addEventListener('click', () => navigateTo(btn.dataset.page));
        });
    }

    function setupSettings() {
        const modal = $('settings-modal');
        const openSettings = () => {
            $('user-name-input').value = state.userName;
            $('difficulty-select').value = state.difficulty;
            modal.classList.remove('hidden');
        };
        $('settings-btn')?.addEventListener('click', openSettings);
        $('topbar-settings-btn')?.addEventListener('click', openSettings);
        $('close-settings')?.addEventListener('click', () => modal.classList.add('hidden'));
        modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
        $('save-settings')?.addEventListener('click', () => {
            state.userName = $('user-name-input').value.trim() || 'CSE Student';
            state.difficulty = $('difficulty-select').value;
            saveState(); updateUI();
            modal.classList.add('hidden');
            _app.toast('Settings saved! ✅', 'success');
        });
        $('reset-progress')?.addEventListener('click', () => {
            if (confirm('Reset ALL progress? This cannot be undone!')) {
                localStorage.removeItem('speakup_state');
                location.reload();
            }
        });
    }

    // ---- XP ----
    _app.addXP = function (amount, label) {
        state.xp += amount;
        const d = new Date().getDay();
        state.weeklyXP = state.weeklyXP || [0, 0, 0, 0, 0, 0, 0];
        state.weeklyXP[d] = (state.weeklyXP[d] || 0) + amount;
        saveState(); updateUI();
        if (label) _app.toast(`+${amount} XP — ${label} 🎉`, 'success');
        checkBadges();
    };

    function checkBadges() {
        const add = (id, msg) => {
            if (!state.badges.includes(id)) { state.badges.push(id); _app.toast(`🏅 Badge: ${msg}`, 'success'); }
        };
        if (state.streak >= 7) add('streak7', '7-Day Streak!');
        if (state.streak >= 30) add('streak30', '30-Day Streak!');
        if (state.xp >= 100) add('xp100', 'First 100 XP!');
        if (state.xp >= 500) add('xp500', '500 XP Club!');
        if (state.xp >= 1000) add('xp1000', 'XP Champion!');
        if (state.interviewsDone >= 1) add('interview1', 'First Interview!');
        if (state.interviewsDone >= 10) add('interview10', 'Interview Pro!');
        if (state.wordsLearned >= 10) add('words10', 'Word Starter!');
        if (state.wordsLearned >= 50) add('words50', 'Word Wizard!');
        saveState();
    }

    // ---- GEMINI ----
    // Only Gemma 3 models have free quota (14,400 req/day each).
    // Cascade: 27B (best) → 12B → 4B → 1B (lightest)
    const GEMINI_MODELS = [
        'gemma-3-27b-it',   // 14,400 req/day, 30 RPM, 15K TPM
        'gemma-3-12b-it',   // 14,400 req/day, 30 RPM, 15K TPM
        'gemma-3-4b-it',    // 14,400 req/day, 30 RPM, 15K TPM
        'gemma-3-1b-it',    // 14,400 req/day, 30 RPM, 15K TPM
    ];

    async function callModel(model, key, prompt, systemPrompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const isGemma = model.startsWith('gemma');
        // Gemma models don't support systemInstruction — prepend into user message instead
        const fullPrompt = (systemPrompt && isGemma) ? `${systemPrompt}\n\n---\n\n${prompt}` : prompt;
        const body = {
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
        };
        if (systemPrompt && !isGemma) body.systemInstruction = { parts: [{ text: systemPrompt }] };
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw { status: res.status, message: data.error?.message || `API error (${res.status})`, data };
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    _app.callGemini = async function (prompt, systemPrompt) {
        const key = state.apiKey;
        if (!key) return { error: 'No API key. Click ⚙️ Settings to add your Gemini key.' };
        for (const model of GEMINI_MODELS) {
            try {
                const text = await callModel(model, key, prompt, systemPrompt);
                return { text };
            } catch (e) {
                // 429 = rate limited, 403 = model not available → try next model
                if (e.status === 429 || e.status === 403) {
                    console.warn(`${e.status} on ${model}, trying next...`);
                    continue;
                }
                // 400 = bad request (prompt issue, not model issue)
                if (e.status === 400) return { error: e.message };
                // Network / other errors
                if (!e.status) return { error: 'Network error — check your internet connection.' };
            }
        }
        // All models exhausted
        return { error: '⚠️ Daily free limit reached on ALL models. Try again in a few hours, or add a paid Gemini API key in Settings.' };
    };

    // ---- SPEECH REC ----
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let _rec = null;
    _app.SpeechRec = {
        isSupported: !!SR,
        listen(onResult, onEnd, onError) {
            if (!SR) { onError?.('Not supported. Use Chrome.'); return; }
            _rec = new SR();
            _rec.lang = 'en-US'; _rec.interimResults = true;
            _rec.onresult = e => {
                const t = Array.from(e.results).map(r => r[0].transcript).join('');
                onResult(t, e.results[e.results.length - 1].isFinal);
            };
            _rec.onerror = e => onError?.(e.error);
            _rec.onend = () => onEnd?.();
            try { _rec.start(); } catch (e) { onError?.(e.message); }
        },
        stop() { try { _rec?.stop(); } catch (e) { } }
    };

    // ---- TTS ----
    _app.speak = function (text) {
        if (!window.speechSynthesis) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.88;
        const v = speechSynthesis.getVoices().find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google'));
        if (v) u.voice = v;
        speechSynthesis.speak(u);
    };

    // ---- TOAST ----
    let _toastTimer = null;
    _app.toast = function (msg, type) {
        const t = $('toast');
        if (!t) return;
        t.textContent = msg;
        t.className = 'toast' + (type ? ' ' + type : '');
        t.classList.remove('hidden');
        clearTimeout(_toastTimer);
        _toastTimer = setTimeout(() => t.classList.add('hidden'), 3000);
    };

    _app.randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];

    function registerSW() {
        if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => { });
    }

    // ---- INIT ----
    function init() {
        loadState();
        checkStreak();
        setupMobileSidebar();
        setupNav();
        setupSettings();
        updateUI();
        registerSW();

        setTimeout(() => {
            const splash = $('splash-screen');
            const app = $('app');
            if (splash) { splash.style.opacity = '0'; splash.style.pointerEvents = 'none'; setTimeout(() => splash.remove(), 500); }
            if (app) app.classList.remove('hidden');
            navigateTo(state.currentPage || 'dashboard');
        }, 2400);
    }

    window.App = _app;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
