// =============================================
//   MODULE: CS FUNDAMENTALS VERBAL QUIZ
// =============================================
var CSFundamentals = (function () {
    const TOPICS = {
        oop: {
            label: 'OOP', icon: '🧩', color: '#6c63ff',
            questions: [
                {
                    q: 'What is Object-Oriented Programming? Explain its 4 pillars with a real-life example.',
                    key: ['Encapsulation — hiding data inside class (car engine)', 'Abstraction — hiding complexity (drive pedal)', 'Inheritance — base + derived classes (Vehicle → Car)', 'Polymorphism — same method, different behavior (speak() for Dog/Cat)']
                },
                {
                    q: 'What is the difference between a class and an object?',
                    key: ['Class is a blueprint/template', 'Object is an instance of a class', 'Class has no memory; object has memory', 'Example: Car class → myCar object']
                },
                {
                    q: 'Explain Polymorphism with a code example.',
                    key: ['Same interface, different implementations', 'Runtime polymorphism — method overriding', 'Compile-time — method overloading', 'Example: shape.area() for Circle vs Rectangle']
                },
                {
                    q: 'What is the difference between abstract class and interface?',
                    key: ['Abstract class can have method implementations; interface cannot (pre-Java 8)', 'Class can extend one abstract class but implement multiple interfaces', 'Abstract class has constructor; interface does not', 'Use interface for capability, abstract class for is-a relationship']
                },
                {
                    q: 'Explain SOLID principles briefly.',
                    key: ['S — Single Responsibility: one class, one reason to change', 'O — Open/Closed: open for extension, closed for modification', 'L — Liskov: subclass should work wherever parent works', 'I — Interface Segregation: small focused interfaces', 'D — Dependency Inversion: depend on abstractions']
                },
            ]
        },
        os: {
            label: 'Operating Systems', icon: '💾', color: '#00d4b1',
            questions: [
                {
                    q: 'What is the difference between a process and a thread?',
                    key: ['Process: independent program with its own memory', 'Thread: lightweight unit within a process, shares memory', 'Processes are isolated; threads share address space', 'Context switching between processes is expensive vs threads']
                },
                {
                    q: 'What is a deadlock? What are the 4 Coffman conditions?',
                    key: ['Deadlock: circular waiting where no process can proceed', 'Mutual Exclusion: resource held exclusively', 'Hold and Wait: holding one resource while waiting for another', 'No Preemption: resources cannot be forcibly taken', 'Circular Wait: circular chain of processes waiting']
                },
                {
                    q: 'What is virtual memory and paging?',
                    key: ['Virtual memory: illusion of larger RAM using disk', 'Paging: divide memory into fixed-size pages', 'Page table maps virtual address to physical address', 'Page fault: page not in RAM, load from disk']
                },
                {
                    q: 'Explain different CPU scheduling algorithms.',
                    key: ['FCFS: first come first served, simple but convoy effect', 'SJF: shortest job first, optimal but needs future knowledge', 'Round Robin: time quantum, good for time-sharing', 'Priority Scheduling: higher priority runs first, starvation']
                },
                {
                    q: 'What is a semaphore? How is it different from a mutex?',
                    key: ['Semaphore: integer counter for signaling between processes', 'Mutex: binary lock, only owner can release (lock/unlock)', 'Semaphore can be used by multiple processes', 'Mutex is for mutual exclusion, semaphore for signaling/counting']
                },
            ]
        },
        dbms: {
            label: 'DBMS', icon: '🗄️', color: '#f59e0b',
            questions: [
                {
                    q: 'What is ACID in databases? Explain each property.',
                    key: ['Atomicity: transaction all-or-nothing (bank transfer)', 'Consistency: DB remains valid before and after transaction', 'Isolation: concurrent transactions don\'t interfere', 'Durability: committed data persists even after crash']
                },
                {
                    q: 'What is database normalization? Explain 1NF, 2NF, 3NF.',
                    key: ['1NF: atomic values, no repeating groups', '2NF: 1NF + no partial dependency (non-key attribute depends on full PK)', '3NF: 2NF + no transitive dependency', 'Goal: reduce redundancy and anomalies']
                },
                {
                    q: 'What is the difference between SQL JOIN types?',
                    key: ['INNER JOIN: only matching rows in both tables', 'LEFT JOIN: all rows from left + matching right', 'RIGHT JOIN: all from right + matching left', 'FULL OUTER JOIN: all rows from both tables', 'CROSS JOIN: Cartesian product of both tables']
                },
                {
                    q: 'What is indexing and when should you use it?',
                    key: ['Index speeds up SELECT queries on indexed columns', 'Creates a separate data structure (B-tree usually)', 'Use on frequently searched, filtered, or joined columns', 'Downside: slows INSERT/UPDATE, takes extra storage']
                },
                {
                    q: 'What is the difference between SQL and NoSQL?',
                    key: ['SQL: structured, relational, schema-based (MySQL, PostgreSQL)', 'NoSQL: unstructured, flexible schema (MongoDB, Redis, Cassandra)', 'SQL: ACID transactions; NoSQL: eventual consistency (BASE)', 'Use SQL for financial data; NoSQL for high-scale, flexible data']
                },
            ]
        },
        networks: {
            label: 'Networks', icon: '🌐', color: '#f43f5e',
            questions: [
                {
                    q: 'Explain what happens when you type "google.com" in your browser.',
                    key: ['DNS lookup: domain → IP address', 'TCP connection (3-way handshake: SYN, SYN-ACK, ACK)', 'HTTP/HTTPS request sent to web server', 'Server responds with HTML/CSS/JS', 'Browser renders the page']
                },
                {
                    q: 'What is the difference between TCP and UDP?',
                    key: ['TCP: reliable, ordered, connection-oriented (3-way handshake)', 'UDP: unreliable, connectionless, faster', 'TCP: file transfer, email, web browsing', 'UDP: video streaming, gaming, DNS queries', 'TCP has flow control and error recovery; UDP does not']
                },
                {
                    q: 'What is REST API? What are the HTTP methods?',
                    key: ['REST: architectural style for web services', 'GET: retrieve data', 'POST: create resource', 'PUT: update (full replacement)', 'PATCH: partial update', 'DELETE: remove resource', 'Stateless: each request is independent']
                },
                {
                    q: 'What is the OSI model and its 7 layers?',
                    key: ['Physical: bits, cables, hardware', 'Data Link: MAC address, frames (Ethernet)', 'Network: IP routing, packets', 'Transport: TCP/UDP, ports', 'Session: session management', 'Presentation: encryption, compression', 'Application: HTTP, FTP, SMTP']
                },
                {
                    q: 'What is the difference between HTTP and HTTPS?',
                    key: ['HTTP: HyperText Transfer Protocol, plain text', 'HTTPS: HTTP + TLS/SSL encryption', 'HTTPS prevents man-in-the-middle attacks', 'Uses port 443 vs HTTP port 80', 'Certificate Authority verifies server identity']
                },
            ]
        },
        dsa_concepts: {
            label: 'DSA Concepts', icon: '⚡', color: '#8b5cf6',
            questions: [
                {
                    q: 'Explain Big O notation and give examples of O(1), O(log n), O(n), O(n log n), O(n²).',
                    key: ['Big O: worst-case time complexity', 'O(1): array access by index', 'O(log n): binary search', 'O(n): linear scan', 'O(n log n): merge sort, heap sort', 'O(n²): bubble sort, nested loops']
                },
                {
                    q: 'What is the difference between a Stack and a Queue? When to use each?',
                    key: ['Stack: LIFO — Last In First Out', 'Queue: FIFO — First In First Out', 'Stack: function call stack, undo/redo, DFS', 'Queue: BFS, print queue, task scheduling', 'Stack operations: push, pop, peek. Queue: enqueue, dequeue']
                },
                {
                    q: 'Explain Hash Map. How does collision handling work?',
                    key: ['HashMap: key-value pairs, O(1) average access', 'Hash function maps key to bucket index', 'Collision: two keys same bucket', 'Chaining: linked list at each bucket', 'Open Addressing: find next empty slot (linear/quadratic probing)']
                },
                {
                    q: 'When do you use DFS vs BFS?',
                    key: ['DFS: goes deep first, uses Stack/recursion', 'BFS: level by level, uses Queue', 'DFS: cycle detection, topological sort, finding paths', 'BFS: shortest path (unweighted), level order traversal', 'BFS finds shortest path; DFS is better for maze solving']
                },
                {
                    q: 'What is Dynamic Programming? How do you identify a DP problem?',
                    key: ['DP: break into subproblems, store results (memoization/tabulation)', 'Identify: overlapping subproblems + optimal substructure', 'Signs: "minimum/maximum number of ways", "longest", "count paths"', 'Top-down: recursion + memo. Bottom-up: fill table iteratively', 'Examples: Fibonacci, LCS, 0/1 Knapsack, Coin Change']
                },
            ]
        },
        system_design: {
            label: 'System Design', icon: '🏗️', color: '#06b6d4',
            questions: [
                {
                    q: 'What are microservices? How are they different from monolithic architecture?',
                    key: ['Monolith: single deployable unit, all features together', 'Microservices: independent services, each with own DB and deployment', 'Microservices: easier to scale individual services, technology flexibility', 'Monolith: simpler to develop initially, harder to scale', 'Microservices challenge: network calls, data consistency, increased complexity']
                },
                {
                    q: 'What is load balancing? What are different strategies?',
                    key: ['Load balancer: distributes traffic across multiple servers', 'Round Robin: requests go to each server in turn', 'Least Connections: goes to server with fewest active connections', 'IP Hash: same client always goes to same server', 'Benefit: high availability, horizontal scalability, no single point of failure']
                },
                {
                    q: 'What is caching? When would you use Redis?',
                    key: ['Cache: fast in-memory storage to avoid repeated expensive operations', 'Redis: in-memory key-value store, supports strings, lists, sets, sorted sets', 'Use Redis for: session storage, rate limiting, leaderboards, pub/sub messaging', 'Cache invalidation: TTL, LRU eviction, explicit invalidation', 'Trade-off: data might be stale, requires cache-aside or write-through patterns']
                },
                {
                    q: 'What is CAP theorem?',
                    key: ['CAP: Consistency, Availability, Partition Tolerance — can only guarantee 2', 'Consistency: all nodes see same data at same time', 'Availability: every request gets a response', 'Partition Tolerance: system works despite network partition', 'CA: relational DBs (no partition tolerance) | CP: MongoDB | AP: Cassandra, DynamoDB']
                },
                {
                    q: 'How would you design a URL shortener like bit.ly?',
                    key: ['Encode long URL with a short hash (base62 encoding)', 'Store mapping: short_code → original_url in database', 'On redirect: lookup short code, 301/302 redirect to original', 'Scale: cache popular URLs in Redis', 'Handle: custom aliases, expiry, click tracking, analytics']
                },
            ]
        }
    };

    let currentTopic = null, currentQIdx = 0, isRec = false, transcript = '';

    function render() { currentTopic = null; renderTopics(); }

    function renderTopics() {
        document.getElementById('page-cs-fundamentals').innerHTML = `
      <div class="page-hdr">
        <h1>🧠 CS Fundamentals <span>Quiz</span></h1>
        <p>Pick a topic — get a random question — explain it verbally — AI scores your technical accuracy and communication clarity</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
        ${Object.entries(TOPICS).map(([key, t]) => `
          <div class="card" data-topic="${key}" style="cursor:pointer;border-color:${t.color}33;background:linear-gradient(135deg,${t.color}10,${t.color}05);transition:var(--tr)" onmouseover="this.style.borderColor='${t.color}'" onmouseout="this.style.borderColor='${t.color}33'">
            <div style="font-size:36px;margin-bottom:12px">${t.icon}</div>
            <div style="font-weight:700;font-size:16px;margin-bottom:6px;color:${t.color}">${t.label}</div>
            <div style="font-size:12px;color:var(--text2);margin-bottom:14px">${t.questions.length} questions — interview-level</div>
            <button class="btn btn-sm btn-full topic-start-btn" data-topic="${key}" style="background:${t.color}22;color:${t.color};border:1px solid ${t.color}44">
              <i class="fas fa-play"></i> Start Quiz
            </button>
          </div>`).join('')}
      </div>
    `;
        document.querySelectorAll('.topic-start-btn').forEach(btn => {
            btn.addEventListener('click', e => { e.stopPropagation(); openTopic(btn.dataset.topic); });
        });
    }

    function openTopic(topicKey) {
        currentTopic = TOPICS[topicKey];
        currentQIdx = Math.floor(Math.random() * currentTopic.questions.length);
        isRec = false; transcript = '';
        renderQuestion();
    }

    function renderQuestion() {
        const t = currentTopic;
        const q = t.questions[currentQIdx];
        document.getElementById('page-cs-fundamentals').innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <button class="btn btn-ghost btn-sm" id="cs-back"><i class="fas fa-arrow-left"></i> Topics</button>
        <span class="chip" style="background:${t.color}20;color:${t.color};border:1px solid ${t.color}30">${t.icon} ${t.label}</span>
        <span style="color:var(--text3);font-size:13px;margin-left:auto">Q${currentQIdx + 1} of ${t.questions.length}</span>
        <button class="btn btn-ghost btn-sm" id="cs-next-q"><i class="fas fa-shuffle"></i> Random Q</button>
      </div>

      <div class="two-col" style="align-items:start">
        <div>
          <!-- Question card -->
          <div class="question-panel" style="margin-bottom:18px">
            <div class="q-num">CS Fundamentals · ${t.label}</div>
            <div class="q-text">"${q.q}"</div>
          </div>

          <!-- Record area -->
          <div class="card" style="text-align:center;padding:28px;margin-bottom:16px">
            <button class="mic-btn" id="cs-mic" style="width:64px;height:64px;font-size:24px;margin-bottom:14px"><i class="fas fa-microphone"></i></button>
            <div id="cs-status" style="font-size:13px;color:var(--text2);margin-bottom:12px">Tap mic and explain the concept clearly</div>
            <div id="cs-transcript-box" style="display:none;background:var(--bg2);border-radius:10px;padding:12px;text-align:left;font-size:13px;line-height:1.7;max-height:150px;overflow-y:auto"></div>
            <div id="cs-actions" style="display:none;margin-top:14px;display:flex;gap:8px;justify-content:center">
              <button class="btn btn-primary" id="cs-eval-btn" style="display:none"><i class="fas fa-robot"></i> Score My Answer</button>
            </div>
          </div>

          <!-- AI result -->
          <div id="cs-result" style="display:none">
            <div class="ai-feedback-panel"><div id="cs-result-body"></div></div>
          </div>
        </div>

        <!-- Sidebar: Key points to cover -->
        <div style="position:sticky;top:calc(var(--topbar-h) + 20px)">
          <div class="card" style="margin-bottom:14px;background:${t.color}08;border-color:${t.color}25">
            <div class="sec-title" style="font-size:12px;color:${t.color}">📋 Key Points to Cover</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.8">
              ${q.key.map((k, i) => `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--border2)">
                <span style="color:${t.color};font-weight:700;flex-shrink:0">${i + 1}.</span>${k}</div>`).join('')}
            </div>
          </div>
          <div class="card" style="background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.15)">
            <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:8px">💡 Interview Tips</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.7">• Start with the definition<br>• Give a real-life example<br>• Compare with an alternative<br>• Mention pros/cons<br>• Keep it under 90 seconds</div>
          </div>
        </div>
      </div>
    `;
        document.getElementById('cs-back').addEventListener('click', render);
        document.getElementById('cs-next-q').addEventListener('click', () => { currentQIdx = (currentQIdx + 1) % currentTopic.questions.length; renderQuestion(); });
        setupCSMic(q);
    }

    function setupCSMic(q) {
        const mic = document.getElementById('cs-mic');
        const status = document.getElementById('cs-status');
        const tbox = document.getElementById('cs-transcript-box');
        const evalBtn = document.getElementById('cs-eval-btn');
        mic.addEventListener('click', () => {
            if (isRec) { isRec = false; App.SpeechRec.stop(); return; }
            if (!App.SpeechRec.isSupported) { status.textContent = '⚠️ Chrome required'; return; }
            isRec = true; transcript = '';
            let lastText = '';
            mic.classList.add('recording');
            status.innerHTML = '<span style="color:var(--rose)">🔴 Listening… explain the concept</span>';

            function startListening() {
                App.SpeechRec.listen(
                    t => { lastText = t; tbox.style.display = 'block'; tbox.textContent = transcript + (transcript ? ' ' : '') + t; },
                    () => {
                        transcript += (transcript ? ' ' : '') + lastText;
                        lastText = '';
                        if (isRec) {
                            startListening();
                        } else {
                            mic.classList.remove('recording');
                            status.innerHTML = '✅ Done!';
                            evalBtn.style.display = 'inline-flex';
                        }
                    },
                    err => {
                        if (err === 'no-speech' && isRec) {
                            startListening();
                        } else {
                            isRec = false; mic.classList.remove('recording'); status.textContent = 'Error: ' + err;
                        }
                    }
                );
            }
            startListening();
        });
        evalBtn.addEventListener('click', () => evalCS(q));
    }

    async function evalCS(q) {
        const result = document.getElementById('cs-result');
        const body = document.getElementById('cs-result-body');
        result.style.display = 'block';
        body.innerHTML = '<div style="text-align:center;padding:20px"><div class="spinner" style="margin:0 auto 12px"></div>Scoring...</div>';
        result.scrollIntoView({ behavior: 'smooth' });
        const t = currentTopic;
        const prompt = `You are a technical interviewer at a top tech company. A CS student verbally explained this concept.

Topic: ${t.label}
Question: "${q.q}"
Expected key points: ${q.key.join(' | ')}
Student's answer: "${transcript}"

Evaluate technical accuracy and communication quality.

Return ONLY valid JSON:
{
  "overallScore": 1-10,
  "scores": {"technicalAccuracy": 1-10, "clarity": 1-10, "examples": 1-10, "depth": 1-10},
  "keyPointsCovered": [true/false for each key point in order],
  "summary": "2 sentence assessment",
  "strengths": ["what they got right"],
  "improvements": ["missing points or unclear explanations"],
  "modelAnswer": "Ideal 3-4 sentence answer"
}`;
        const res = await App.callGemini(prompt);
        if (res.error) { body.innerHTML = `<div style="color:var(--rose)">${res.error}</div>`; return; }
        try {
            const m = res.text.match(/\{[\s\S]*\}/);
            const d = JSON.parse(m?.[0] || res.text);
            const col = n => n >= 8 ? 'var(--emerald)' : n >= 6 ? 'var(--teal)' : n >= 4 ? 'var(--amber)' : 'var(--rose)';
            const ov = d.overallScore || 5;
            body.innerHTML = `
        <div style="font-size:14px;font-weight:700;margin-bottom:14px"><i class="fas fa-robot" style="color:${t.color}"></i> AI Evaluation — ${t.label}</div>
        <div style="text-align:center;margin-bottom:16px"><div style="font-family:var(--font2);font-size:48px;font-weight:900;color:${col(ov)}">${ov}</div><div style="font-size:12px;color:var(--text3)">/ 10</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
          ${[['Technical', d.scores?.technicalAccuracy], ['Clarity', d.scores?.clarity], ['Examples', d.scores?.examples], ['Depth', d.scores?.depth]].map(([l, v]) => `<div style="background:var(--bg2);border-radius:10px;padding:10px;text-align:center"><div style="font-family:var(--font2);font-size:22px;font-weight:900;color:${col(v || 0)}">${v || 0}</div><div style="font-size:10px;color:var(--text3)">${l}</div></div>`).join('')}
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:12px;background:var(--bg2);border-radius:10px;padding:12px">${d.summary}</div>
        ${d.keyPointsCovered ? `<div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:6px">Key Points</div>${q.key.map((k, i) => `<div style="display:flex;gap:8px;padding:5px 0;font-size:12px;color:${d.keyPointsCovered[i] ? 'var(--emerald)' : 'var(--rose)'}"><i class="fas fa-${d.keyPointsCovered[i] ? 'check-circle' : 'times-circle'}"></i>${k}</div>`).join('')}</div>` : ''}
        ${d.strengths?.length ? `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;margin-bottom:6px">✅ Good</div>${d.strengths.map(s => `<div class="tip-row"><i class="fas fa-check" style="color:var(--emerald)"></i>${s}</div>`).join('')}</div>` : ''}
        ${d.improvements?.length ? `<div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;margin-bottom:6px">💡 Add This</div>${d.improvements.map(s => `<div class="tip-row"><i class="fas fa-plus" style="color:var(--amber)"></i>${s}</div>`).join('')}</div>` : ''}
        ${d.modelAnswer ? `<div class="model-answer"><strong style="color:${t.color};font-size:11px;text-transform:uppercase">🏆 Model Answer</strong><br><br>${d.modelAnswer}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn btn-ghost btn-sm" id="cs-retry-btn"><i class="fas fa-redo"></i> Retry</button>
          <button class="btn btn-primary btn-sm" id="cs-next-btn"><i class="fas fa-forward"></i> Next Question</button>
        </div>
      `;
            document.getElementById('cs-retry-btn')?.addEventListener('click', renderQuestion);
            document.getElementById('cs-next-btn')?.addEventListener('click', () => { currentQIdx = (currentQIdx + 1) % currentTopic.questions.length; renderQuestion(); });
            App.addXP(ov * 3, 'CS Fundamentals: ' + t.label);
        } catch (e) { body.innerHTML = `<div style="color:var(--text2)">${res.text}</div>`; }
    }

    return { render };
})();
window.CSFundamentals = CSFundamentals;
