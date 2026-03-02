// =============================================
//   MODULE: CONVERSATION AI
// =============================================
var Conversation = (function () {
  const SCENARIOS = [
    { id: 'interview', icon: '💼', name: 'Job Interview', desc: 'HR interviewer asking interview questions', prompt: 'You are a friendly HR interviewer at a top tech company. Interview the student for a Software Engineer position. Ask one question at a time, respond naturally, and gently correct major grammar errors (say "Note: you could say X instead of Y"). Keep responses to 2-3 sentences.' },
    { id: 'explain', icon: '🖥️', name: 'Explain to Manager', desc: 'Non-technical manager needs simple explanations', prompt: 'You are a curious non-technical manager. The student must explain technical concepts in simple English. If they use jargon, ask them to simplify. Help them practice explaining tech to non-tech people. 2-3 sentences max.' },
    { id: 'standup', icon: '👥', name: 'Team Standup', desc: 'Daily standup meeting with your team', prompt: 'You are a project manager running a daily standup. Ask about yesterday\'s work, today\'s plan, and blockers. Have a casual professional conversation. 2-3 sentences max.' },
    { id: 'client', icon: '🤝', name: 'Client Call', desc: 'Professional call with a demanding client', prompt: 'You are a client who hired the student\'s company for a software project. Ask for updates, raise concerns professionally, discuss timelines. Be politely demanding. 2-3 sentences max.' },
    { id: 'casual', icon: '☕', name: 'Casual Chat', desc: 'Friendly coworker conversation', prompt: 'You are a friendly colleague. Chat casually about their day, tech interests, or college life. Gently note grammar errors once ("By the way, you might say..."). 2-3 sentences max.' },
  ];
  const SYS = 'You are a helpful English conversation partner. Always respond in English. Keep responses SHORT (2-4 sentences). Be encouraging. Correct grammar errors gently at most once per message. Be natural.';

  let scenario = SCENARIOS[0];
  let msgs = [];
  let thinking = false;
  let isRec = false;

  function render() {
    msgs = [];
    document.getElementById('page-conversation').innerHTML = `
      <div class="page-hdr">
        <h1>💬 Conversation <span>AI</span></h1>
        <p>Practice real English conversations with an AI partner in different scenarios</p>
      </div>
      <div class="chat-layout">
        <div class="chat-panel">
          <div class="chat-header">
            <div style="font-size:22px">${scenario.icon}</div>
            <div>
              <div class="chat-header-title">${scenario.name}</div>
              <div style="font-size:12px;color:var(--text3)">${scenario.desc}</div>
            </div>
          </div>
          <div class="chat-messages" id="chat-msgs">
            <div class="chat-bubble ai">
              👋 Hi! I'm your AI partner. We're practicing the <strong>${scenario.name}</strong> scenario. Type or speak anything to start — I'll respond naturally and help with your English!
            </div>
            ${!App.getState().apiKey ? `<div class="chat-bubble ai" style="border-color:rgba(245,158,11,0.3)">⚙️ No API key detected. Go to Settings to add your Gemini key.</div>` : ''}
          </div>
          <div class="chat-input-row">
            <button class="chat-mic" id="chat-mic" title="Voice input"><i class="fas fa-microphone"></i></button>
            <input type="text" class="chat-input" id="chat-input" placeholder="Type your message..." maxlength="500" />
            <button class="chat-send" id="chat-send"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <div class="sec-title" style="font-size:13px">Scenarios</div>
            <div class="scenario-list">
              ${SCENARIOS.map(s => `
                <div class="scenario-item ${s.id === scenario.id ? 'active' : ''}" data-id="${s.id}">
                  <div class="scenario-icon">${s.icon}</div>
                  <div class="scenario-name">${s.name}</div>
                  <div class="scenario-desc">${s.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card" style="background:rgba(108,99,255,0.05)">
            <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">💡 Tips</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.8">
              • Aim for 2-3 complete sentences<br>
              • Avoid fillers: um, uh, like<br>
              • Use "I believe / In my opinion"<br>
              • Listen to corrections actively
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll('.scenario-item').forEach(s => {
      s.addEventListener('click', () => { scenario = SCENARIOS.find(x => x.id === s.dataset.id); render(); });
    });
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const mic = document.getElementById('chat-mic');
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
    send.addEventListener('click', sendMsg);
    mic.addEventListener('click', () => {
      if (isRec) { App.SpeechRec.stop(); return; }
      if (!App.SpeechRec.isSupported) { App.toast('Use Chrome for voice', 'error'); return; }
      isRec = true; mic.classList.add('recording');
      App.SpeechRec.listen(
        t => input.value = t,
        () => { isRec = false; mic.classList.remove('recording'); if (input.value) sendMsg(); },
        err => { isRec = false; mic.classList.remove('recording'); App.toast('Mic: ' + err, 'error'); }
      );
    });
  }

  function addBubble(text, role, typing = false) {
    const wrap = document.getElementById('chat-msgs');
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + role;
    if (typing) { div.id = 'typing'; div.classList.add('typing'); div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>'; }
    else div.innerHTML = text;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return div;
  }

  async function sendMsg() {
    if (thinking) return;
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addBubble(text, 'user');
    msgs.push({ role: 'user', content: text });
    thinking = true;
    addBubble('', 'ai', true);
    const hist = msgs.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n');
    const prompt = `History:\n${hist}\n\nRespond as the AI in the ${scenario.name} scenario. Max 3 sentences.`;
    const res = await App.callGemini(prompt, SYS + '\n' + scenario.prompt);
    document.getElementById('typing')?.remove();
    if (res.error) addBubble('⚠️ ' + res.error, 'ai');
    else { msgs.push({ role: 'ai', content: res.text }); addBubble(res.text, 'ai'); }
    thinking = false;
    App.addXP(3, 'Conversation Practice');
  }

  return { render };
})();
window.Conversation = Conversation;
