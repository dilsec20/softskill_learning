// =============================================
//   MODULE: DSA THINK-ALOUD PRACTICE
// =============================================
var DSAThinkaloud = (function () {
    const PROBLEMS = [
        {
            id: 'p1', tag: 'Array', diff: 'Easy', xp: 20,
            title: 'Two Sum',
            problem: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume each input would have exactly one solution.',
            example: 'Input: nums=[2,7,11,15], target=9 → Output: [0,1] (because nums[0]+nums[1]=9)',
            hints: ['Think about what complement you need for each number', 'A HashMap can check existence in O(1)', 'Space-Time tradeoff: O(n) time, O(n) space'],
            checklist: ['Did you restate the problem?', 'Did you mention brute force first?', 'Did you explain the HashMap approach?', 'Did you state O(n) time and O(n) space?', 'Did you mention the edge case (no solution)?']
        },
        {
            id: 'p2', tag: 'Array', diff: 'Medium', xp: 30,
            title: 'Maximum Subarray (Kadane\'s)',
            problem: 'Given an array of integers, find the contiguous subarray with the largest sum and return its sum.',
            example: 'Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6 (subarray [4,-1,2,1])',
            hints: ['Think: should we include previous elements or start fresh?', 'Kadane\'s algorithm: maxEndingHere = max(num, maxEndingHere + num)', 'What happens when all numbers are negative?'],
            checklist: ['Did you explain the subproblem: include or restart?', 'Did you walk through the array step by step?', 'Did you say the time complexity is O(n)?', 'Did you mention the all-negative edge case?', 'Did you give the correct answer for the example?']
        },
        {
            id: 'p3', tag: 'LinkedList', diff: 'Easy', xp: 20,
            title: 'Reverse a Linked List',
            problem: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
            example: 'Input: 1→2→3→4→5→NULL → Output: 5→4→3→2→1→NULL',
            hints: ['You need 3 pointers: prev, curr, next', 'Update next, then change curr.next to prev, advance all pointers', 'Both iterative and recursive solutions exist'],
            checklist: ['Did you explain the 3-pointer approach?', 'Did you trace through the first 1-2 steps?', 'Did you say O(n) time, O(1) space?', 'Did you mention the null base case?', 'Was your explanation clear enough for a non-programmer?']
        },
        {
            id: 'p4', tag: 'Binary Search', diff: 'Medium', xp: 30,
            title: 'Search in Rotated Sorted Array',
            problem: 'An integer array sorted in ascending order is rotated at an unknown pivot. Given the rotated array and a target, return the index if target is found, else -1. Must be O(log n).',
            example: 'Input: nums=[4,5,6,7,0,1,2], target=0 → Output: 4',
            hints: ['At least one half is always sorted', 'Check which half is sorted, then check if target lies in that half', 'Standard binary search with an extra condition check'],
            checklist: ['Did you identify this needs modified binary search?', 'Did you explain which half is always sorted?', 'Did you trace mid, left, right for each step?', 'Did you state O(log n) complexity?', 'Did you handle the no-element edge case?']
        },
        {
            id: 'p5', tag: 'Tree', diff: 'Medium', xp: 30,
            title: 'Level Order Traversal (BFS)',
            problem: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
            example: 'Input: Tree root=3, left=9, right=20(left=15,right=7) → Output: [[3],[9,20],[15,7]]',
            hints: ['Use a Queue data structure', 'Process all nodes at current level before moving to next', 'Track when a level ends using queue size'],
            checklist: ['Did you mention BFS (Breadth First Search)?', 'Did you explain using a Queue?', 'Did you say add null or track level by queue size?', 'Did you trace the first 2 levels?', 'Did you state O(n) time and O(n) space?']
        },
        {
            id: 'p6', tag: 'DP', diff: 'Hard', xp: 50,
            title: 'Longest Common Subsequence',
            problem: 'Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.',
            example: 'Input: text1="abcde", text2="ace" → Output: 3 (LCS = "ace")',
            hints: ['Build a 2D DP table', 'If characters match: dp[i][j] = dp[i-1][j-1] + 1', 'If they don\'t match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])'],
            checklist: ['Did you define the DP subproblem clearly?', 'Did you draw/describe the DP table?', 'Did you explain the recurrence relation?', 'Did you trace through the first 2-3 cells?', 'Did you state O(m×n) time and space?']
        },
        {
            id: 'p7', tag: 'Graph', diff: 'Medium', xp: 35,
            title: 'Number of Islands',
            problem: 'Given an m×n grid of \'1\' (land) and \'0\' (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
            example: 'Input: grid with 3 disconnected groups of 1s → Output: 3',
            hints: ['DFS/BFS from each unvisited land cell', 'Mark visited cells to avoid counting twice', 'Time complexity O(m×n)'],
            checklist: ['Did you explain the algorithm (DFS or BFS)?', 'Did you explain how to mark visited cells?', 'Did you trace through at least one island discovery?', 'Did you state O(m×n) complexity?', 'Did you mention both DFS and BFS as options?']
        },
        {
            id: 'p8', tag: 'Stack', diff: 'Easy', xp: 20,
            title: 'Valid Parentheses',
            problem: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\', \']\', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
            example: 'Input: "()[]{}" → true | Input: "([)]" → false | Input: "{[]}" → true',
            hints: ['Use a Stack', 'Push opening brackets, pop and compare for closing brackets', 'If stack is empty at the end → valid'],
            checklist: ['Did you explain the stack approach?', 'Did you explain push on open, pop/compare on close?', 'Did you trace through one valid and one invalid example?', 'Did you state O(n) time?', 'Did you mention the empty stack check at end?']
        },
    ];

    let mode = 'list'; // 'list' | 'practice' | 'result'
    let currentProblem = null;
    let isRec = false, transcript = '';

    function render() { mode = 'list'; renderList(); }

    function renderList() {
        document.getElementById('page-dsa-thinkaloud').innerHTML = `
      <div class="page-hdr">
        <h1>💻 DSA <span>Think-Aloud</span></h1>
        <p>Choose a problem → speak your solution aloud as you would in a real interview → AI scores your explanation</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px">
        ${PROBLEMS.map(p => `
          <div class="card dsa-problem-card" data-id="${p.id}" style="cursor:pointer;transition:var(--tr)" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor=''">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span class="chip ${p.diff === 'Easy' ? 'chip-emerald' : p.diff === 'Medium' ? 'chip-amber' : 'chip-rose'}">${p.diff}</span>
              <span class="chip chip-teal" style="font-size:10px">${p.tag}</span>
              <span class="chip chip-accent" style="margin-left:auto">+${p.xp} XP</span>
            </div>
            <div style="font-weight:700;font-size:15px;margin-bottom:8px">${p.title}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:12px">${p.problem.substring(0, 120)}...</div>
            <button class="btn btn-primary btn-sm btn-full start-problem-btn" data-id="${p.id}">
              <i class="fas fa-microphone"></i> Start Think-Aloud
            </button>
          </div>`).join('')}
      </div>
    `;
        document.querySelectorAll('.start-problem-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const p = PROBLEMS.find(x => x.id === btn.dataset.id);
                if (p) openProblem(p);
            });
        });
    }

    function openProblem(p) {
        currentProblem = p; mode = 'practice'; isRec = false; transcript = '';
        document.getElementById('page-dsa-thinkaloud').innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <button class="btn btn-ghost btn-sm" id="dsa-back"><i class="fas fa-arrow-left"></i> All Problems</button>
        <span class="chip ${p.diff === 'Easy' ? 'chip-emerald' : p.diff === 'Medium' ? 'chip-amber' : 'chip-rose'}">${p.diff}</span>
        <span class="chip chip-teal">${p.tag}</span>
        <span class="chip chip-amber" style="margin-left:auto">+${p.xp} XP</span>
      </div>

      <div class="two-col" style="align-items:start">
        <div>
          <!-- Problem -->
          <div class="card" style="margin-bottom:16px">
            <div style="font-size:18px;font-weight:800;margin-bottom:12px">${p.title}</div>
            <div style="font-size:14px;color:var(--text2);line-height:1.8;margin-bottom:14px">${p.problem}</div>
            <div style="background:var(--bg2);border-radius:10px;padding:12px;font-family:monospace;font-size:13px;color:var(--teal)">${p.example}</div>
          </div>

          <!-- Record -->
          <div class="card" style="text-align:center;padding:28px;margin-bottom:14px">
            <div style="font-size:13px;color:var(--text2);margin-bottom:16px">🎙️ Explain your approach aloud — just like a real interview. Think loud!</div>
            <button class="mic-btn" id="dsa-mic" style="width:64px;height:64px;font-size:24px;margin-bottom:14px"><i class="fas fa-microphone"></i></button>
            <div id="dsa-status" style="font-size:13px;color:var(--text2);margin-bottom:10px">Tap mic to start your explanation</div>
            <div id="dsa-transcript-box" style="display:none;background:var(--bg2);border-radius:10px;padding:14px;text-align:left;font-size:13px;line-height:1.7;max-height:150px;overflow-y:auto"></div>
            <div id="dsa-actions" style="display:none;margin-top:14px">
              <button class="btn btn-primary btn-full" id="dsa-eval-btn"><i class="fas fa-robot"></i> Get AI Score</button>
            </div>
          </div>

          <!-- AI Result -->
          <div id="dsa-result" style="display:none">
            <div class="ai-feedback-panel">
              <div id="dsa-result-body" style="color:var(--text3);text-align:center;padding:20px">
                <div class="spinner" style="margin:0 auto 12px"></div>
                Scoring your explanation...
              </div>
            </div>
          </div>
        </div>

        <div style="position:sticky;top:calc(var(--topbar-h) + 20px)">
          <!-- Hints -->
          <div class="card" style="margin-bottom:14px;background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.15)">
            <div class="sec-title" style="font-size:12px;color:var(--amber)">💡 Hints (use only if stuck)</div>
            ${p.hints.map((h, i) => `<div style="font-size:12px;color:var(--text2);padding:8px 0;border-bottom:1px solid var(--border2);line-height:1.6"><span style="color:var(--amber);font-weight:700">${i + 1}.</span> ${h}</div>`).join('')}
          </div>

          <!-- What to cover checklist -->
          <div class="card">
            <div class="sec-title" style="font-size:12px">✅ Must Cover (self-check)</div>
            ${p.checklist.map(c => `
              <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border2)">
                <div style="width:18px;height:18px;border-radius:4px;border:2px solid var(--border2);flex-shrink:0;margin-top:1px"></div>
                <div style="font-size:12px;color:var(--text2);line-height:1.5">${c}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;

        document.getElementById('dsa-back').addEventListener('click', render);
        setupDSAMic(p);
    }

    function setupDSAMic(p) {
        const mic = document.getElementById('dsa-mic');
        const status = document.getElementById('dsa-status');
        const tbox = document.getElementById('dsa-transcript-box');
        const actions = document.getElementById('dsa-actions');

        mic.addEventListener('click', () => {
            if (isRec) { App.SpeechRec.stop(); return; }
            if (!App.SpeechRec.isSupported) { status.textContent = '⚠️ Chrome required for voice'; return; }
            isRec = true; transcript = '';
            mic.classList.add('recording');
            status.innerHTML = '<span style="color:var(--rose)">🔴 Listening... explain your approach step by step</span>';
            App.SpeechRec.listen(
                t => { transcript = t; tbox.style.display = 'block'; tbox.textContent = t; },
                () => { isRec = false; mic.classList.remove('recording'); status.innerHTML = '✅ Done! Ready to score.'; actions.style.display = 'block'; },
                err => { isRec = false; mic.classList.remove('recording'); status.textContent = 'Error: ' + err; }
            );
        });

        document.getElementById('dsa-eval-btn')?.addEventListener('click', () => evaluateDSA(p, transcript));
    }

    async function evaluateDSA(p, text) {
        const result = document.getElementById('dsa-result');
        const body = document.getElementById('dsa-result-body');
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth' });

        const prompt = `You are a FAANG-level interviewer evaluating a candidate's VERBAL explanation of a DSA problem.

Problem: "${p.title}"
Problem Statement: "${p.problem}"
Expected approach checklist: ${p.checklist.join(' | ')}

Candidate's verbal explanation: "${text}"

Evaluate if they clearly communicated their approach as they would in an interview. 
Score each area from 1-10.

Return ONLY valid JSON:
{
  "overallScore": 1-10,
  "scores": { "problemUnderstanding": 1-10, "approachClarity": 1-10, "complexity": 1-10, "edgeCases": 1-10 },
  "checklistCovered": [true/false for each item in the checklist, in order],
  "summary": "2-3 sentences honest assessment",
  "strengths": ["what they said well"],
  "improvements": ["specific things missing or unclear"],
  "modelExplanation": "How a top candidate would explain this in 3-4 sentences"
}`;

        const res = await App.callGemini(prompt);
        if (res.error) { body.innerHTML = `<div style="color:var(--rose)">${res.error}</div>`; return; }
        try {
            const m = res.text.match(/\{[\s\S]*\}/);
            const d = JSON.parse(m?.[0] || res.text);
            const col = n => n >= 8 ? 'var(--emerald)' : n >= 6 ? 'var(--teal)' : n >= 4 ? 'var(--amber)' : 'var(--rose)';
            const ov = d.overallScore || 5;
            body.innerHTML = `
        <div style="text-align:center;margin-bottom:18px">
          <div style="font-family:var(--font2);font-size:54px;font-weight:900;color:${col(ov)};line-height:1">${ov}</div>
          <div style="font-size:13px;color:var(--text3)">out of 10</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
          ${[['Understanding', d.scores?.problemUnderstanding], ['Clarity', d.scores?.approachClarity], ['Complexity', d.scores?.complexity], ['Edge Cases', d.scores?.edgeCases]].map(([l, v]) => `
            <div style="background:var(--bg2);border-radius:10px;padding:10px;text-align:center">
              <div style="font-family:var(--font2);font-size:22px;font-weight:900;color:${col(v || 0)}">${v || 0}</div>
              <div style="font-size:10px;color:var(--text3)">${l}</div>
            </div>`).join('')}
        </div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:14px;background:var(--bg2);border-radius:10px;padding:12px">${d.summary}</div>
        ${d.checklistCovered ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">Checklist Coverage</div>
          ${p.checklist.map((c, i) => `<div style="display:flex;gap:8px;padding:6px 0;font-size:12px;color:${d.checklistCovered[i] ? 'var(--emerald)' : 'var(--rose)'}">
            <i class="fas fa-${d.checklistCovered[i] ? 'check-circle' : 'times-circle'}"></i>${c}</div>`).join('')}
        </div>`: ''}
        ${d.strengths?.length ? `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--emerald);text-transform:uppercase;margin-bottom:6px">✅ Strengths</div>${d.strengths.map(s => `<div class="tip-row"><i class="fas fa-check" style="color:var(--emerald)"></i>${s}</div>`).join('')}</div>` : ''}
        ${d.improvements?.length ? `<div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;margin-bottom:6px">💡 Missing / Improve</div>${d.improvements.map(s => `<div class="tip-row"><i class="fas fa-plus" style="color:var(--amber)"></i>${s}</div>`).join('')}</div>` : ''}
        ${d.modelExplanation ? `<div class="model-answer"><strong style="color:var(--teal);font-size:11px;text-transform:uppercase">🏆 Model Explanation</strong><br><br>${d.modelExplanation}</div>` : ''}
        <button class="btn btn-ghost btn-full" style="margin-top:14px" id="try-again-dsa"><i class="fas fa-redo"></i> Try Again</button>
      `;
            document.getElementById('try-again-dsa')?.addEventListener('click', () => openProblem(p));
            App.addXP(Math.round(ov * p.xp / 10), 'DSA Think-Aloud: ' + p.title);
        } catch (e) { body.innerHTML = `<div style="color:var(--text2)">${res.text}</div>`; }
    }

    return { render };
})();
window.DSAThinkaloud = DSAThinkaloud;
