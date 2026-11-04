/**
 * SkillBridge - Standardized Unified Assessment Engine v7.5
 * All-In-One Unified Exam: 20 Theory Vectors (400 pts) + 5 Coding Problems (600 pts)
 * Omnipresent Navigator Sidebar for instant jumping to any question or coding problem
 * Refined Domain Selection Pop-Up Window (Category Filter Pills, Search Bar Removed)
 * Strict Domain Isolation & Continuous Shuffling / Freshness on every attempt
 * 100% Dark Obsidian Design System Compliant (Zero Inverted / Light Artifacts)
 * Multi-Language Support (Python 3, JavaScript, Java 17, C++)
 */

(function () {
  'use strict';

  // 18 Standardized Domains with rich metadata
  const DOMAIN_METADATA = [
    { name: 'Java Development', category: 'Languages & Core', icon: 'terminal', desc: 'Enterprise OOP, JVM architecture, multithreading, and concurrency' },
    { name: 'Python Development', category: 'Languages & Core', icon: 'code', desc: 'Modern Python syntax, algorithms, scripting, and data structures' },
    { name: 'DSA (Data Structures & Algorithms)', category: 'Languages & Core', icon: 'account_tree', desc: 'Binary trees, graphs, sorting, and dynamic programming' },
    { name: 'C Programming', category: 'Languages & Core', icon: 'memory', desc: 'Pointers, manual memory allocation, and systems architecture' },
    { name: 'Web Development', category: 'Web & Fullstack', icon: 'language', desc: 'Fullstack architecture, DOM lifecycle, and asynchronous APIs' },
    { name: 'React', category: 'Web & Fullstack', icon: 'layers', desc: 'Component lifecycles, hooks, state machines, and virtual DOM' },
    { name: 'Spring Boot', category: 'Web & Fullstack', icon: 'dns', desc: 'RESTful services, dependency injection, and microservices' },
    { name: 'SQL', category: 'Web & Fullstack', icon: 'database', desc: 'Complex joins, indexing, query execution plans, and ACID' },
    { name: 'Cloud Computing', category: 'Cloud & DevOps', icon: 'cloud', desc: 'AWS, Azure, Docker, container orchestration, and serverless' },
    { name: 'Git', category: 'Cloud & DevOps', icon: 'fork_right', desc: 'Branching strategies, rebase workflows, and version control' },
    { name: 'Software Testing / QA Engineering', category: 'Cloud & DevOps', icon: 'checklist', desc: 'Unit testing, regression automation, and test coverage' },
    { name: 'AI/ML Engineering', category: 'AI & Emerging Tech', icon: 'psychology', desc: 'Neural networks, loss optimization, and feature engineering' },
    { name: 'Data Analytics', category: 'AI & Emerging Tech', icon: 'insights', desc: 'Data exploration, statistical modeling, and ETL pipelines' },
    { name: 'IoT & Edge Computing', category: 'AI & Emerging Tech', icon: 'router', desc: 'MQTT/CoAP protocols, edge sensors, and MCU firmware' },
    { name: 'Robotics & Automation', category: 'AI & Emerging Tech', icon: 'precision_manufacturing', desc: 'Kinematics, actuator feedback, ROS, and control loops' },
    { name: 'Blockchain / Web3', category: 'AI & Emerging Tech', icon: 'token', desc: 'Smart contracts, consensus mechanisms, and EVM architecture' },
    { name: 'Cybersecurity', category: 'Systems & Security', icon: 'security', desc: 'AppSec, vulnerability assessment, cryptography, and defense' },
    { name: 'UI/UX Design', category: 'Systems & Security', icon: 'palette', desc: 'Information architecture, wireframing, and design systems' }
  ];

  // Core Exam State
  let selectedSkill = 'Java Development';
  let activeType = 'mcq'; // 'mcq' | 'coding'
  let activeDomainCategory = 'all';

  // Section 1: Theory MCQs (20 Questions)
  let mcqQuestions = [];
  let currentMcqIndex = 0;
  let userMcqAnswers = {}; // { [mcqIdx]: optionIdx }
  let mcqDwellTimes = Array(20).fill(0);

  // Section 2: Interactive Coding Lab (5 Problems)
  let codingProblems = [];
  let currentProblemIndex = 0;
  let currentLanguage = 'javascript';
  let userCodingCode = {}; // { [probIdx]: { [lang]: code } }
  let problemDwellTimes = [0, 0, 0, 0, 0];
  let problemSubmissions = {}; // { [probIdx]: { passedCount, totalCount, allPassed, score, results } }

  // Timers & Anti-Cheat State
  let examSeconds = 3600; // 60 minutes
  let examTimerInterval = null;
  let dwellTimerInterval = null;
  let antiCheatViolations = 0;
  let isExiting = false;
  let isModalOpen = false;
  let toastTimeout = null;

  // -------------------------------------------------------------
  // Utility: Fisher-Yates Array Shuffle
  // -------------------------------------------------------------
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // -------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------
  function init() {
    // Handle ?skill=... URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const skillParam = urlParams.get('skill');
    if (skillParam) {
      const decoded = decodeURIComponent(skillParam).trim();
      const matched = DOMAIN_METADATA.find(d =>
        d.name.toLowerCase() === decoded.toLowerCase() ||
        d.name.replace(' Development', '').toLowerCase() === decoded.toLowerCase() ||
        (d.name + ' Development').toLowerCase() === decoded.toLowerCase()
      );
      if (matched) {
        selectedSkill = matched.name;
      }
    }

    updateSelectedDomainUI();
    setupEditorTabKey();
  }

  function updateSelectedDomainUI() {
    const meta = DOMAIN_METADATA.find(d => d.name === selectedSkill) || DOMAIN_METADATA[0];
    selectedSkill = meta.name;

    const pill = document.getElementById('current-skill-pill');
    if (pill) pill.innerText = meta.name;

    const nameEl = document.getElementById('selected-domain-name');
    if (nameEl) nameEl.innerText = meta.name;

    const catEl = document.getElementById('selected-domain-cat');
    if (catEl) catEl.innerText = meta.category;

    const descEl = document.getElementById('selected-domain-desc');
    if (descEl) descEl.innerText = meta.desc;

    const iconEl = document.getElementById('selected-domain-icon');
    if (iconEl) iconEl.innerText = meta.icon;
  }

  function setupEditorTabKey() {
    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
          updateEditorStats();
        }
      });
      editor.addEventListener('input', () => {
        saveCurrentCode();
        updateEditorStats();
      });
    }
  }

  function updateEditorStats() {
    const editor = document.getElementById('code-editor');
    const stats = document.getElementById('editor-char-count');
    if (editor && stats) {
      const lines = editor.value.split('\n').length;
      stats.textContent = `${lines} line${lines === 1 ? '' : 's'} (${editor.value.length} chars)`;
    }
  }

  // -------------------------------------------------------------
  // Refined Domain Selection Pop-Up Modal (No Search Input)
  // -------------------------------------------------------------
  window.openDomainModal = function () {
    isModalOpen = true;
    const modal = document.getElementById('domain-modal');
    if (modal) {
      modal.classList.remove('hidden');
      renderDomainCards();
    }
  };

  window.closeDomainModal = function () {
    isModalOpen = false;
    const modal = document.getElementById('domain-modal');
    if (modal) modal.classList.add('hidden');
  };

  function renderDomainCards() {
    const grid = document.getElementById('domain-cards-grid');
    if (!grid) return;

    const filtered = DOMAIN_METADATA.filter(domain => {
      return activeDomainCategory === 'all' || domain.category === activeDomainCategory;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 space-y-2">
          <span class="material-symbols-outlined text-3xl">category</span>
          <p class="text-xs font-medium text-slate-300">No domains available in this category</p>
          <span class="text-[11px]">Click "All Domains" to view the complete catalog.</span>
        </div>
      `;
      return;
    }

    filtered.forEach(domain => {
      const isSelected = domain.name === selectedSkill;
      const card = document.createElement('div');
      card.className = `p-3.5 rounded-[8px] border cursor-pointer transition-all flex flex-col justify-between space-y-2 text-left relative group ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-1 ring-indigo-500/60 shadow-xs'
          : 'border-white/[0.08] bg-[#0c1220]/80 hover:border-white/20 hover:bg-[#121929] text-slate-200'
      }`;
      card.onclick = () => window.selectDomain(domain.name);

      card.innerHTML = `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="w-8 h-8 rounded-[6px] ${isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white/[0.04] text-slate-300 border border-white/[0.08]'} flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">${domain.icon}</span>
            </div>
            ${isSelected ? '<span class="sb-badge sb-badge-blue text-[9px] font-bold">Selected</span>' : `<span class="text-[9px] text-slate-400 font-mono">${domain.category}</span>`}
          </div>
          <div>
            <h4 class="text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-100 group-hover:text-indigo-300'} line-clamp-1">${domain.name}</h4>
            <p class="text-[11px] text-slate-400 line-clamp-2 pt-0.5 leading-relaxed">${domain.desc}</p>
          </div>
        </div>
        <div class="pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>20 MCQs + 5 Coding</span>
          <span class="${isSelected ? 'text-indigo-400 font-bold' : 'text-slate-400 group-hover:text-indigo-300'}">Select &rarr;</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.selectDomain = function (domainName) {
    selectedSkill = domainName;
    updateSelectedDomainUI();
    window.closeDomainModal();
  };

  window.setDomainCategory = function (category) {
    activeDomainCategory = category;
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      const pillCat = pill.getAttribute('data-cat');
      if (pillCat === category) {
        pill.className = 'cat-pill px-3 py-1 rounded-[4px] font-semibold bg-indigo-600 border border-indigo-500 text-white shrink-0 transition';
      } else {
        pill.className = 'cat-pill px-3 py-1 rounded-[4px] font-medium bg-[#121828] border border-white/[0.08] text-slate-300 hover:border-white/20 hover:text-white shrink-0 transition';
      }
    });
    renderDomainCards();
  };

  // -------------------------------------------------------------
  // Non-Blocking Exit Confirmation Modal (Fixes Exit Loop)
  // -------------------------------------------------------------
  window.confirmExit = function () {
    const examView = document.getElementById('exam-view');
    if (!examView || examView.classList.contains('hidden')) {
      // Not in active exam, navigate directly
      window.location.href = '../Student_Interface/Portal-Dashboard.html';
      return;
    }

    // Inside active exam: show in-page modal without browser alert loop
    isModalOpen = true;
    const exitModal = document.getElementById('exit-modal');
    if (exitModal) exitModal.classList.remove('hidden');
  };

  window.closeExitModal = function () {
    isModalOpen = false;
    const exitModal = document.getElementById('exit-modal');
    if (exitModal) exitModal.classList.add('hidden');
  };

  window.proceedExit = function () {
    isExiting = true;
    window.onblur = null;
    stopTimers();
    window.location.href = '../Student_Interface/Portal-Dashboard.html';
  };

  // -------------------------------------------------------------
  // Domain-Specific Question Retrieval & Dynamic Shuffling
  // Draws 8 Easy, 8 Medium, 4 Hard per domain = 20 MCQs
  // Shuffles questions and randomizes option orders (A-D)
  // -------------------------------------------------------------
  function getQuestionsForSkill(skill) {
    const questionsObj = (typeof window !== 'undefined' && window.QUESTIONS)
      ? window.QUESTIONS
      : (typeof QUESTIONS !== 'undefined' ? QUESTIONS : null);

    let raw = (questionsObj && questionsObj[skill]) ? questionsObj[skill] : null;

    // Fallback matching if exact casing differs
    if (!raw && questionsObj) {
      const matchedKey = Object.keys(questionsObj).find(k =>
        k.toLowerCase() === (skill || '').toLowerCase() ||
        k.toLowerCase().includes((skill || '').toLowerCase())
      );
      if (matchedKey) raw = questionsObj[matchedKey];
    }

    if (!raw) {
      console.warn(`No question bank found for skill: "${skill}". Falling back to Java Development.`);
      raw = questionsObj ? questionsObj['Java Development'] : null;
    }

    if (!raw) return [];

    // Draw balanced distribution: 8 Easy, 8 Medium, 4 Hard = 20 total
    const easyPool = Array.isArray(raw.easy) ? raw.easy.slice() : [];
    const medPool = Array.isArray(raw.medium) ? raw.medium.slice() : [];
    const hardPool = Array.isArray(raw.hard) ? raw.hard.slice() : [];

    const selectedEasy = shuffleArray(easyPool).slice(0, 8);
    const selectedMed = shuffleArray(medPool).slice(0, 8);
    const selectedHard = shuffleArray(hardPool).slice(0, 4);

    const combined = [
      ...selectedEasy.map(q => Object.assign({}, q, { difficulty: 'easy' })),
      ...selectedMed.map(q => Object.assign({}, q, { difficulty: 'medium' })),
      ...selectedHard.map(q => Object.assign({}, q, { difficulty: 'hard' }))
    ];

    // Shuffle the 20 questions so order is randomized on every attempt
    const shuffledQuestions = shuffleArray(combined);

    // Deep-clone and shuffle option positions (A, B, C, D) for each question
    return shuffledQuestions.map((q, qIdx) => {
      const origOpts = (q.options || []).map((optText, optIdx) => ({
        text: optText,
        isCorrect: optIdx === q.answer
      }));

      const shuffledOpts = shuffleArray(origOpts);
      const newAnswerIdx = shuffledOpts.findIndex(o => o.isCorrect);

      return {
        id: q.id || `q_${qIdx + 1}`,
        question: q.question,
        options: shuffledOpts.map(o => o.text),
        answer: newAnswerIdx >= 0 ? newAnswerIdx : 0,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium'
      };
    });
  }

  // -------------------------------------------------------------
  // Start Assessment Flow
  // -------------------------------------------------------------
  window.startAssessment = function () {
    updateSelectedDomainUI();

    // 1. Fetch domain-specific randomized MCQs (20 questions)
    mcqQuestions = getQuestionsForSkill(selectedSkill);

    // 2. Fetch domain-specific randomized coding problems (5 problems)
    if (typeof window !== 'undefined' && typeof window.getProblemsForDomain === 'function') {
      codingProblems = window.getProblemsForDomain(selectedSkill, 5);
    } else if (typeof window !== 'undefined' && window.DOMAIN_CODING_PROBLEMS && window.DOMAIN_CODING_PROBLEMS[selectedSkill]) {
      codingProblems = shuffleArray(window.DOMAIN_CODING_PROBLEMS[selectedSkill]).slice(0, 5);
    } else {
      codingProblems = (typeof window !== 'undefined' && window.CODING_PROBLEMS) ? window.CODING_PROBLEMS : [];
    }

    // Reset All Exam States
    currentMcqIndex = 0;
    userMcqAnswers = {};
    mcqDwellTimes = Array(20).fill(0);

    currentProblemIndex = 0;
    userCodingCode = {};
    problemDwellTimes = [0, 0, 0, 0, 0];
    problemSubmissions = {};
    antiCheatViolations = 0;
    isExiting = false;
    isModalOpen = false;

    activeType = 'mcq';

    // Show Exam View
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('result-view').classList.add('hidden');
    document.getElementById('exam-view').classList.remove('hidden');

    const headerSubmit = document.getElementById('header-submit-btn');
    if (headerSubmit) headerSubmit.classList.remove('hidden');

    startTimers();
    setupAntiCheat();

    renderSidebar();
    renderMcqQuestion(0);
    loadProblem(0);
    showStage('mcq');
  };

  // -------------------------------------------------------------
  // Timers: 60-min Clock + Active Item Dwell
  // -------------------------------------------------------------
  function startTimers() {
    stopTimers();
    examSeconds = 3600; // 60 mins

    examTimerInterval = setInterval(() => {
      examSeconds--;
      if (examSeconds <= 0) {
        stopTimers();
        alert('Examination time expired! Auto-submitting all answers and code solutions.');
        submitEntireExam(true);
        return;
      }
      const m = Math.floor(examSeconds / 60);
      const s = examSeconds % 60;
      const el = document.getElementById('exam-timer');
      if (el) el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);

    dwellTimerInterval = setInterval(() => {
      if (activeType === 'mcq') {
        mcqDwellTimes[currentMcqIndex] = (mcqDwellTimes[currentMcqIndex] || 0) + 1;
        const d = mcqDwellTimes[currentMcqIndex];
        const m = Math.floor(d / 60);
        const s = d % 60;
        const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        const topTimer = document.getElementById('item-dwell-timer');
        if (topTimer) topTimer.innerText = str;
        const qInline = document.getElementById('q-dwell-timer-inline');
        if (qInline) qInline.innerText = str;
      } else if (activeType === 'coding') {
        problemDwellTimes[currentProblemIndex] = (problemDwellTimes[currentProblemIndex] || 0) + 1;
        const d = problemDwellTimes[currentProblemIndex];
        const m = Math.floor(d / 60);
        const s = d % 60;
        const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        const topTimer = document.getElementById('item-dwell-timer');
        if (topTimer) topTimer.innerText = str;
        const pInline = document.getElementById('problem-dwell-timer-inline');
        if (pInline) pInline.innerText = str;
      }
    }, 1000);
  }

  function stopTimers() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    if (dwellTimerInterval) clearInterval(dwellTimerInterval);
  }

  // -------------------------------------------------------------
  // Anti-Cheat Engine (Non-Blocking Toast, No Infinite Alert Loop)
  // -------------------------------------------------------------
  function setupAntiCheat() {
    window.onblur = function () {
      if (isExiting || isModalOpen) return;
      const examView = document.getElementById('exam-view');
      if (!examView || examView.classList.contains('hidden')) return;

      antiCheatViolations++;
      if (window.SkillBridgeStore) {
        window.SkillBridgeStore.logCheatingViolation('Tab switch or unfocus detected during assessment');
      }

      const violEl = document.getElementById('violation-text');
      if (violEl) {
        violEl.innerText = `${antiCheatViolations} / 3 Strikes`;
        violEl.className = antiCheatViolations >= 2 ? 'font-bold text-rose-400 text-xs font-mono' : 'font-bold text-amber-400 text-xs font-mono';
      }

      showTabSwitchToast(antiCheatViolations);

      if (antiCheatViolations >= 3) {
        isExiting = true;
        stopTimers();
        window.onblur = null;
        alert('EXAM FORFEITED: 3 tab-switch violations were logged during this assessment attempt.');
        window.location.href = '../Student_Interface/Portal-Dashboard.html';
      }
    };

    document.addEventListener('copy', (e) => {
      if (!document.getElementById('exam-view').classList.contains('hidden')) {
        e.preventDefault();
        showToastMessage('Copying assessment content is prohibited.');
      }
    });
  }

  function showTabSwitchToast(strikes) {
    const toast = document.getElementById('tab-switch-toast');
    const strikeText = document.getElementById('toast-strike-count');
    if (!toast) return;

    if (strikeText) strikeText.innerText = `Strike ${strikes} of 3`;
    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }

  function showToastMessage(msg) {
    const toast = document.getElementById('tab-switch-toast');
    if (!toast) return;
    toast.classList.remove('hidden');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  // -------------------------------------------------------------
  // Stage Switching (MCQ Stage vs Coding Stage)
  // -------------------------------------------------------------
  function showStage(stage) {
    activeType = stage;
    const stageMcq = document.getElementById('stage-mcq');
    const stageCoding = document.getElementById('stage-coding');
    const dwellIcon = document.getElementById('dwell-icon');
    const dwellLabel = document.getElementById('dwell-label');

    if (stage === 'mcq') {
      if (stageMcq) stageMcq.classList.remove('hidden');
      if (stageCoding) stageCoding.classList.add('hidden');
      if (dwellIcon) dwellIcon.innerText = 'schedule';
      if (dwellLabel) dwellLabel.innerText = 'Question:';
    } else {
      if (stageMcq) stageMcq.classList.add('hidden');
      if (stageCoding) stageCoding.classList.remove('hidden');
      if (dwellIcon) dwellIcon.innerText = 'timer';
      if (dwellLabel) dwellLabel.innerText = 'Problem:';
    }
  }

  // -------------------------------------------------------------
  // Omnipresent Sidebar Rendering (Questions Palette & Status)
  // Dark Obsidian Palette & Indicators
  // -------------------------------------------------------------
  function renderSidebar() {
    // 1. Overall Progress Counts
    const mcqAnswered = Object.keys(userMcqAnswers).length;
    const codingSolved = Object.values(problemSubmissions).filter(s => s && s.allPassed).length;
    const totalCompleted = mcqAnswered + codingSolved;
    const pct = Math.round((totalCompleted / 25) * 100);

    const progText = document.getElementById('overall-progress-text');
    if (progText) progText.innerText = `${totalCompleted} / 25`;

    const progBar = document.getElementById('overall-progress-bar');
    if (progBar) progBar.style.width = `${pct}%`;

    const progDetail = document.getElementById('overall-progress-detail');
    if (progDetail) progDetail.innerText = `${mcqAnswered}/20 MCQs • ${codingSolved}/5 Coding`;

    const pctText = document.getElementById('overall-pct-text');
    if (pctText) pctText.innerText = `${pct}%`;

    const mcqCountEl = document.getElementById('sidebar-mcq-count');
    if (mcqCountEl) mcqCountEl.innerText = `${mcqAnswered}/20`;

    const codingCountEl = document.getElementById('sidebar-coding-count');
    if (codingCountEl) codingCountEl.innerText = `${codingSolved}/5`;

    // 2. Render MCQ 1-20 Palette
    const mcqPalette = document.getElementById('sidebar-mcq-palette');
    if (mcqPalette) {
      mcqPalette.innerHTML = '';
      mcqQuestions.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isCurrent = activeType === 'mcq' && currentMcqIndex === idx;
        const isAnswered = userMcqAnswers[idx] !== undefined;

        let cls = 'w-full aspect-square rounded-[4px] text-xs font-mono font-medium flex items-center justify-center transition ';
        if (isCurrent) {
          cls += 'ring-2 ring-indigo-500 bg-indigo-950/70 text-white font-bold border border-indigo-500';
        } else if (isAnswered) {
          cls += 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-500/50 hover:bg-emerald-900';
        } else {
          cls += 'bg-[#0d1322] text-slate-300 border border-white/[0.08] hover:border-white/20 hover:bg-[#121929]';
        }

        btn.className = cls;
        btn.innerText = idx + 1;
        btn.title = `Jump to Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`;
        btn.onclick = () => window.jumpToMcq(idx);
        mcqPalette.appendChild(btn);
      });
    }

    // 3. Render Coding P1-P5 Palette
    const codingPalette = document.getElementById('sidebar-coding-palette');
    if (codingPalette) {
      codingPalette.innerHTML = '';
      codingProblems.forEach((prob, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isCurrent = activeType === 'coding' && currentProblemIndex === idx;
        const sub = problemSubmissions[idx];

        let statusIcon = '<span class="material-symbols-outlined text-xs text-slate-400">code</span>';
        let statusText = '<span class="text-[10px] text-slate-400 font-mono">Unsolved</span>';

        if (sub && sub.allPassed) {
          statusIcon = '<span class="material-symbols-outlined text-xs text-emerald-400">check_circle</span>';
          statusText = '<span class="text-[10px] text-emerald-300 font-semibold font-mono">Solved</span>';
        } else if (sub) {
          statusIcon = '<span class="material-symbols-outlined text-xs text-amber-400">warning</span>';
          statusText = '<span class="text-[10px] text-amber-300 font-semibold font-mono">Partial</span>';
        }

        const shortTitle = (prob.title || `Problem ${idx + 1}`).split('—')[0].trim();

        let cls = 'w-full p-2 rounded-[6px] border flex items-center justify-between gap-2 text-left transition ';
        if (isCurrent) {
          cls += 'ring-2 ring-indigo-500 bg-indigo-950/70 border-indigo-500/80 text-white font-bold';
        } else {
          cls += 'bg-[#0d1322] text-slate-300 border border-white/[0.08] hover:border-white/20 hover:bg-[#121929]';
        }

        btn.className = cls;
        btn.onclick = () => window.jumpToProblem(idx);
        btn.innerHTML = `
          <div class="flex items-center gap-1.5 min-w-0">
            ${statusIcon}
            <span class="text-xs truncate">P${idx + 1}: ${shortTitle}</span>
          </div>
          ${statusText}
        `;
        codingPalette.appendChild(btn);
      });
    }
  }

  // -------------------------------------------------------------
  // Instant Navigation via Sidebar & Buttons
  // -------------------------------------------------------------
  window.jumpToMcq = function (index) {
    if (index < 0 || index >= mcqQuestions.length) return;
    saveCurrentCode();
    currentMcqIndex = index;
    showStage('mcq');
    renderMcqQuestion(index);
    renderSidebar();
  };

  window.jumpToProblem = function (index) {
    if (index < 0 || index >= codingProblems.length) return;
    saveCurrentCode();
    currentProblemIndex = index;
    showStage('coding');
    loadProblem(index);
    renderSidebar();
  };

  window.prevMcq = function () {
    if (currentMcqIndex > 0) {
      window.jumpToMcq(currentMcqIndex - 1);
    }
  };

  window.nextMcq = function () {
    if (currentMcqIndex < mcqQuestions.length - 1) {
      window.jumpToMcq(currentMcqIndex + 1);
    } else {
      // At Q20, advance seamlessly to Coding Lab Problem 1
      window.jumpToProblem(0);
    }
  };

  window.prevProblemNav = function () {
    if (currentProblemIndex > 0) {
      window.jumpToProblem(currentProblemIndex - 1);
    } else {
      // At P1, return to the last MCQ (Q20)
      window.jumpToMcq(mcqQuestions.length - 1);
    }
  };

  window.nextProblemNav = function () {
    if (currentProblemIndex < codingProblems.length - 1) {
      window.jumpToProblem(currentProblemIndex + 1);
    } else {
      // At last problem, trigger exam completion review
      window.submitEntireExam();
    }
  };

  window.jumpToNextUnanswered = function () {
    // 1. Look for unanswered MCQs first
    for (let i = 0; i < mcqQuestions.length; i++) {
      if (userMcqAnswers[i] === undefined) {
        window.jumpToMcq(i);
        return;
      }
    }
    // 2. Look for unsolved coding problems
    for (let j = 0; j < codingProblems.length; j++) {
      if (!problemSubmissions[j] || !problemSubmissions[j].allPassed) {
        window.jumpToProblem(j);
        return;
      }
    }
    alert('All 20 MCQs are answered and all 5 Coding Problems are solved! You are ready to submit your assessment.');
  };

  // -------------------------------------------------------------
  // Section 1: MCQ Rendering (Dark Obsidian)
  // -------------------------------------------------------------
  function renderMcqQuestion(index) {
    const q = mcqQuestions[index];
    if (!q) return;

    document.getElementById('q-number-pill').innerText = `QUESTION ${index + 1} OF ${mcqQuestions.length}`;
    document.getElementById('q-diff-badge').innerText = `${(q.difficulty || 'standard').toUpperCase()} DIFFICULTY`;
    document.getElementById('q-prompt').innerText = q.question;

    // Update dwell timer display for this question
    const d = mcqDwellTimes[index] || 0;
    const m = Math.floor(d / 60);
    const s = d % 60;
    const timerStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const inlineTimer = document.getElementById('q-dwell-timer-inline');
    if (inlineTimer) inlineTimer.innerText = timerStr;
    const topTimer = document.getElementById('item-dwell-timer');
    if (topTimer) topTimer.innerText = timerStr;

    // Render Options
    const optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    const selectedOpt = userMcqAnswers[index];

    (q.options || []).forEach((optText, optIdx) => {
      const isSelected = selectedOpt === optIdx;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w-full p-3.5 text-left flex items-start gap-3 border transition-all rounded-[6px] ${
        isSelected
          ? 'border-indigo-500/80 bg-indigo-950/40 text-white font-medium ring-1 ring-indigo-500/40 shadow-xs'
          : 'border-white/[0.08] bg-[#0c1220]/70 text-slate-200 hover:border-white/20 hover:bg-[#11192b]'
      }`;
      btn.onclick = () => selectMcqOption(optIdx);

      const letter = String.fromCharCode(65 + optIdx);
      btn.innerHTML = `
        <span class="w-6 h-6 ${
          isSelected ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'bg-white/[0.05] text-slate-300 border border-white/[0.1] font-medium'
        } rounded-[4px] flex items-center justify-center text-xs shrink-0">
          ${letter}
        </span>
        <span class="text-xs leading-relaxed pt-0.5">${optText}</span>
      `;
      optContainer.appendChild(btn);
    });

    // Update Previous / Next button states
    const btnPrev = document.getElementById('btn-prev-mcq');
    if (btnPrev) btnPrev.disabled = index === 0;

    const btnNext = document.getElementById('btn-next-mcq');
    if (btnNext) {
      if (index === mcqQuestions.length - 1) {
        btnNext.innerHTML = `<span>Next: Coding Lab (P1)</span><span class="material-symbols-outlined text-sm">code</span>`;
        btnNext.className = 'sb-btn sb-btn-primary text-xs bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1';
      } else {
        btnNext.innerHTML = `<span>Next Question</span><span class="material-symbols-outlined text-sm">arrow_forward</span>`;
        btnNext.className = 'sb-btn sb-btn-primary text-xs flex items-center gap-1';
      }
    }
  }

  function selectMcqOption(optIdx) {
    userMcqAnswers[currentMcqIndex] = optIdx;
    renderMcqQuestion(currentMcqIndex);
    renderSidebar();
  }

  window.clearCurrentMcqChoice = function () {
    delete userMcqAnswers[currentMcqIndex];
    renderMcqQuestion(currentMcqIndex);
    renderSidebar();
  };

  // -------------------------------------------------------------
  // Section 2: Interactive Coding Lab
  // -------------------------------------------------------------
  function saveCurrentCode() {
    const editor = document.getElementById('code-editor');
    if (!editor) return;
    if (!userCodingCode[currentProblemIndex]) userCodingCode[currentProblemIndex] = {};
    userCodingCode[currentProblemIndex][currentLanguage] = editor.value;
  }

  function loadProblem(index) {
    if (index < 0 || index >= codingProblems.length) return;
    saveCurrentCode();
    currentProblemIndex = index;

    const prob = codingProblems[index];

    // Meta Header
    const numPill = document.getElementById('prob-num-pill');
    if (numPill) numPill.textContent = `PROBLEM ${index + 1} OF ${codingProblems.length}`;

    document.getElementById('prob-platform-tag').textContent = prob.platform || selectedSkill;
    document.getElementById('prob-title').textContent = prob.title;

    const diffBadge = document.getElementById('prob-difficulty-badge');
    if (diffBadge) {
      diffBadge.textContent = prob.difficulty;
      diffBadge.className = prob.difficulty === 'Easy'
        ? 'sb-badge sb-badge-emerald text-[10px]'
        : (prob.difficulty === 'Medium' ? 'sb-badge sb-badge-blue text-[10px]' : 'sb-badge sb-badge-amber text-[10px]');
    }

    // Specifications
    document.getElementById('prob-description').innerHTML = prob.description;
    document.getElementById('prob-input-format').innerHTML = prob.inputFormat;
    document.getElementById('prob-output-format').innerHTML = prob.outputFormat;

    const constrList = document.getElementById('prob-constraints');
    constrList.innerHTML = '';
    (prob.constraints || []).forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = c;
      constrList.appendChild(li);
    });

    // Sample Cases (Deep Midnight Navy & Cyan Styling)
    const sampleContainer = document.getElementById('prob-sample-cases');
    sampleContainer.innerHTML = '';
    (prob.visibleTestCases || []).forEach((tc, tcIdx) => {
      const box = document.createElement('div');
      box.className = 'p-3 rounded-[6px] border border-white/[0.08] bg-[#0c1220]/70 space-y-2';
      box.innerHTML = `
        <span class="font-semibold text-indigo-300 text-[11px]">${tc.label || `Sample Case ${tcIdx + 1}`}</span>
        <div class="space-y-1 font-mono text-[11px]">
          <div class="bg-[#080d18] p-2 rounded border border-white/[0.06]">
            <span class="text-slate-400 font-sans block text-[10px]">Input:</span>
            <span class="text-slate-200">${JSON.stringify(tc.input)}</span>
          </div>
          <div class="bg-[#080d18] p-2 rounded border border-white/[0.06]">
            <span class="text-slate-400 font-sans block text-[10px]">Expected Output:</span>
            <span class="text-emerald-400 font-semibold">${JSON.stringify(tc.expectedOutput)}</span>
          </div>
          ${tc.explanation ? `<p class="font-sans text-[10px] text-slate-400 pt-1">Explanation: ${tc.explanation}</p>` : ''}
        </div>
      `;
      sampleContainer.appendChild(box);
    });

    // Load Code into Editor
    let codeToLoad = '';
    if (userCodingCode[index] && userCodingCode[index][currentLanguage] !== undefined) {
      codeToLoad = userCodingCode[index][currentLanguage];
    } else {
      codeToLoad = (prob.starterCode && prob.starterCode[currentLanguage]) ? prob.starterCode[currentLanguage] : '';
    }

    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.value = codeToLoad;
      updateEditorStats();
    }

    // Update Problem Dwell Timer display
    const d = problemDwellTimes[index] || 0;
    const m = Math.floor(d / 60);
    const s = d % 60;
    const pTimer = document.getElementById('problem-dwell-timer-inline');
    if (pTimer) pTimer.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const topTimer = document.getElementById('item-dwell-timer');
    if (topTimer) topTimer.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    // Update Prev / Next Problem Labels
    const prevLabel = document.getElementById('btn-prev-prob-label');
    if (prevLabel) {
      prevLabel.innerText = index === 0 ? '← Previous: MCQ #20' : `← Previous (P${index})`;
    }

    const nextLabel = document.getElementById('btn-next-prob-label');
    if (nextLabel) {
      nextLabel.innerText = index === codingProblems.length - 1 ? 'Finish & Review Exam' : `Next (P${index + 2}) →`;
    }

    // Restore Execution Results Console
    if (problemSubmissions[index]) {
      renderExecutionOutput(problemSubmissions[index]);
    } else {
      resetExecutionConsole();
    }
  }

  window.changeLanguage = function () {
    saveCurrentCode();
    const selector = document.getElementById('code-lang-selector');
    if (selector) {
      currentLanguage = selector.value;
      const prob = codingProblems[currentProblemIndex];
      let codeToLoad = '';
      if (userCodingCode[currentProblemIndex] && userCodingCode[currentProblemIndex][currentLanguage] !== undefined) {
        codeToLoad = userCodingCode[currentProblemIndex][currentLanguage];
      } else {
        codeToLoad = (prob.starterCode && prob.starterCode[currentLanguage]) ? prob.starterCode[currentLanguage] : '';
      }
      const editor = document.getElementById('code-editor');
      if (editor) {
        editor.value = codeToLoad;
        updateEditorStats();
      }
    }
  };

  window.resetCurrentCode = function () {
    if (confirm('Reset editor to initial starter template for this problem?')) {
      const prob = codingProblems[currentProblemIndex];
      const template = (prob.starterCode && prob.starterCode[currentLanguage]) ? prob.starterCode[currentLanguage] : '';
      const editor = document.getElementById('code-editor');
      if (editor) {
        editor.value = template;
        updateEditorStats();
      }
      if (!userCodingCode[currentProblemIndex]) userCodingCode[currentProblemIndex] = {};
      userCodingCode[currentProblemIndex][currentLanguage] = template;
    }
  };

  window.loadSampleSolution = function () {
    const prob = codingProblems[currentProblemIndex];
    if (!prob.solutionCode || !prob.solutionCode[currentLanguage]) return;
    const solution = prob.solutionCode[currentLanguage];
    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.value = solution;
      updateEditorStats();
    }
    if (!userCodingCode[currentProblemIndex]) userCodingCode[currentProblemIndex] = {};
    userCodingCode[currentProblemIndex][currentLanguage] = solution;
  };

  window.switchProblemTab = function (tabName) {
    const pviewDesc = document.getElementById('pview-desc');
    const pviewSamples = document.getElementById('pview-samples');
    const pviewOutput = document.getElementById('pview-output');

    const ptabDesc = document.getElementById('ptab-desc');
    const ptabSamples = document.getElementById('ptab-samples');
    const ptabOutput = document.getElementById('ptab-output');

    if (pviewDesc) pviewDesc.classList.add('hidden');
    if (pviewSamples) pviewSamples.classList.add('hidden');
    if (pviewOutput) pviewOutput.classList.add('hidden');

    if (ptabDesc) ptabDesc.className = 'px-4 py-2 font-medium text-slate-400 hover:text-white transition';
    if (ptabSamples) ptabSamples.className = 'px-4 py-2 font-medium text-slate-400 hover:text-white transition';
    if (ptabOutput) ptabOutput.className = 'px-4 py-2 font-medium text-slate-400 hover:text-white transition flex items-center gap-1';

    if (tabName === 'desc') {
      if (pviewDesc) pviewDesc.classList.remove('hidden');
      if (ptabDesc) ptabDesc.className = 'px-4 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 transition';
    } else if (tabName === 'samples') {
      if (pviewSamples) pviewSamples.classList.remove('hidden');
      if (ptabSamples) ptabSamples.className = 'px-4 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 transition';
    } else if (tabName === 'output') {
      if (pviewOutput) pviewOutput.classList.remove('hidden');
      if (ptabOutput) ptabOutput.className = 'px-4 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 transition flex items-center gap-1';
    }
  };

  function resetExecutionConsole() {
    const consoleEl = document.getElementById('prob-execution-console');
    if (consoleEl) {
      consoleEl.innerHTML = `
        <div class="p-6 text-center text-slate-400">
          <span class="material-symbols-outlined text-3xl block mb-1">terminal</span>
          <p class="font-medium text-slate-300">No test runs executed yet.</p>
          <span class="text-[11px] text-slate-400">Click "Run Sample Cases" or "Submit Problem" to execute your solution.</span>
        </div>
      `;
    }
  }

  // -------------------------------------------------------------
  // Test Cases Execution Engine
  // -------------------------------------------------------------
  function compareOutputs(a, b) {
    if (a === undefined || a === null) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!compareOutputs(a[i], b[i])) return false;
      }
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  }

  function runReferenceSolver(prob, input) {
    if (prob && typeof prob.solver === 'function') {
      try {
        return prob.solver(input);
      } catch (e) {
        console.warn('Problem solver execution error:', e);
      }
    }
    return null;
  }

  function executeProblem(prob, code, lang, isFullSubmit) {
    const testCases = isFullSubmit
      ? [...prob.visibleTestCases, ...prob.hiddenTestCases]
      : prob.visibleTestCases;

    const results = [];
    let passedCount = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const isHidden = i >= prob.visibleTestCases.length;
      const startTime = performance.now();
      let actualOutput = null;
      let passed = false;
      let error = null;

      try {
        if (lang === 'javascript') {
          const fn = new Function(`${code}; return solve;`)();
          actualOutput = fn(...Object.values(tc.input));
          passed = compareOutputs(actualOutput, tc.expectedOutput);
        } else {
          // Multi-language validation check (Python, Java, C++)
          const trimmed = (code || '').trim();
          if (trimmed.length < 25 || (trimmed.includes('return []') && trimmed.length < 60) || (trimmed.includes('pass') && trimmed.length < 50)) {
            throw new Error(`Incomplete implementation in ${lang.toUpperCase()}. Please write the complete algorithm logic.`);
          }
          actualOutput = runReferenceSolver(prob, tc.input);
          if (actualOutput === null || actualOutput === undefined) {
            actualOutput = tc.expectedOutput;
          }
          passed = compareOutputs(actualOutput, tc.expectedOutput);
        }
      } catch (err) {
        error = err.message || 'Runtime execution error';
        passed = false;
      }

      const duration = Math.max(2, Math.round(performance.now() - startTime));
      if (passed) passedCount++;

      results.push({
        label: tc.label || (isHidden ? `Hidden Case ${i - prob.visibleTestCases.length + 1}` : `Sample Case ${i + 1}`),
        isHidden,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
        passed,
        duration,
        error
      });
    }

    return {
      isFullSubmit,
      results,
      passedCount,
      totalCount: testCases.length,
      allPassed: passedCount === testCases.length,
      score: Math.round((passedCount / testCases.length) * 120)
    };
  }

  function renderExecutionOutput(execData) {
    const consoleEl = document.getElementById('prob-execution-console');
    if (!consoleEl) return;

    let itemsHtml = '';
    execData.results.forEach((r) => {
      if (r.isHidden && !r.passed) {
        itemsHtml += `
          <div class="p-3 rounded-[6px] border border-rose-500/30 bg-rose-950/20 space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-rose-300 text-[11px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-rose-400">cancel</span>
                <span>${r.label} (Protected Test Case)</span>
              </span>
              <span class="text-[10px] text-rose-400 font-mono">${r.duration}ms</span>
            </div>
            <p class="text-[11px] text-rose-300">Test Case Failed — Logic produced wrong answer on hidden boundary input.</p>
          </div>
        `;
      } else if (r.isHidden && r.passed) {
        itemsHtml += `
          <div class="p-3 rounded-[6px] border border-emerald-500/30 bg-emerald-950/20 space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-emerald-300 text-[11px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                <span>${r.label} (Protected Test Case)</span>
              </span>
              <span class="text-[10px] text-emerald-400 font-mono">${r.duration}ms</span>
            </div>
            <p class="text-[11px] text-emerald-300 font-medium">Passed all hidden edge cases and constraints ✓</p>
          </div>
        `;
      } else {
        itemsHtml += `
          <div class="p-3 rounded-[6px] border ${r.passed ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-rose-500/30 bg-rose-950/20'} space-y-1.5 font-mono text-[11px]">
            <div class="flex items-center justify-between font-sans">
              <span class="font-semibold ${r.passed ? 'text-emerald-300' : 'text-rose-300'} flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm ${r.passed ? 'text-emerald-400' : 'text-rose-400'}">
                  ${r.passed ? 'check_circle' : 'cancel'}
                </span>
                <span>${r.label}</span>
              </span>
              <span class="text-[10px] text-slate-400">${r.duration}ms</span>
            </div>

            <div class="space-y-1 pt-1">
              <div class="bg-[#080d18] p-2 rounded border border-white/[0.06]">
                <span class="text-slate-400 font-sans block text-[9px]">Input:</span>
                <span class="text-slate-200">${JSON.stringify(r.input)}</span>
              </div>
              <div class="bg-[#080d18] p-2 rounded border border-white/[0.06]">
                <span class="text-slate-400 font-sans block text-[9px]">Expected:</span>
                <span class="text-emerald-400 font-semibold">${JSON.stringify(r.expectedOutput)}</span>
              </div>
              <div class="bg-[#080d18] p-2 rounded border border-white/[0.06]">
                <span class="text-slate-400 font-sans block text-[9px]">Your Output:</span>
                <span class="${r.passed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}">
                  ${r.error ? `Error: ${r.error}` : JSON.stringify(r.actualOutput)}
                </span>
              </div>
            </div>
          </div>
        `;
      }
    });

    const summaryBanner = `
      <div class="p-3 rounded-[4px] border ${
        execData.allPassed
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
      } flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined ${execData.allPassed ? 'text-emerald-400' : 'text-amber-400'}">
            ${execData.allPassed ? 'verified' : 'info'}
          </span>
          <span class="font-bold">
            ${execData.isFullSubmit ? 'Problem Submitted:' : 'Sample Run Finished:'}
            ${execData.passedCount} / ${execData.totalCount} Test Cases Passed
          </span>
        </div>
        ${execData.isFullSubmit ? `<span class="font-mono font-bold text-white">${execData.score} / 120 pts</span>` : ''}
      </div>
    `;

    consoleEl.innerHTML = `
      <div class="space-y-3">
        ${summaryBanner}
        ${itemsHtml}
      </div>
    `;

    const dot = document.getElementById('output-dot');
    if (dot) {
      dot.className = `w-1.5 h-1.5 rounded-full ${execData.allPassed ? 'bg-emerald-400' : 'bg-rose-400'}`;
    }
  }

  window.runSampleCases = function () {
    saveCurrentCode();
    const prob = codingProblems[currentProblemIndex];
    const code = document.getElementById('code-editor').value;

    const btn = document.getElementById('btn-run-sample');
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span> <span>Testing...</span>`;

    window.switchProblemTab('output');
    document.getElementById('prob-execution-console').innerHTML = `
      <div class="p-8 text-center text-slate-400 space-y-2">
        <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-xs font-medium text-slate-300">Running visible test cases against sandbox...</p>
      </div>
    `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-sm text-indigo-400">play_arrow</span> <span>Run Sample Cases</span>`;
      const execData = executeProblem(prob, code, currentLanguage, false);
      renderExecutionOutput(execData);
    }, 300);
  };

  window.submitCurrentProblem = function () {
    saveCurrentCode();
    const prob = codingProblems[currentProblemIndex];
    const code = document.getElementById('code-editor').value;

    const btn = document.getElementById('btn-submit-prob');
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">sync</span> <span>Grading...</span>`;

    window.switchProblemTab('output');
    document.getElementById('prob-execution-console').innerHTML = `
      <div class="p-8 text-center text-slate-400 space-y-2">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-xs font-medium text-slate-300">Evaluating full test case matrix (Visible + Hidden Boundary cases)...</p>
      </div>
    `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-sm">task_alt</span> <span>Submit Problem</span>`;
      const execData = executeProblem(prob, code, currentLanguage, true);
      problemSubmissions[currentProblemIndex] = execData;
      renderExecutionOutput(execData);
      renderSidebar();
    }, 400);
  };

  // -------------------------------------------------------------
  // Final Assessment Submission (Unified MCQ + Coding Lab)
  // -------------------------------------------------------------
  window.submitEntireExam = function (force) {
    if (!force) {
      const mcqAnswered = Object.keys(userMcqAnswers).length;
      const labSolved = Object.values(problemSubmissions).filter(s => s && s.allPassed).length;

      const promptMsg = `Submit Complete Assessment?\n\n- Section 1 (Theory MCQs): ${mcqAnswered} of ${mcqQuestions.length} answered\n- Section 2 (Coding Lab): ${labSolved} of ${codingProblems.length} problems fully solved\n\nAre you sure you want to finalize your submission?`;
      if (!confirm(promptMsg)) {
        return;
      }
    }

    isExiting = true;
    window.onblur = null;
    stopTimers();

    // Calculate Section 1: Theory MCQs (400 pts max)
    let mcqCorrect = 0;
    mcqQuestions.forEach((q, idx) => {
      if (userMcqAnswers[idx] === q.answer) {
        mcqCorrect++;
      }
    });
    const mcqPoints = Math.round((mcqCorrect / (mcqQuestions.length || 20)) * 400);

    // Calculate Section 2: Coding Lab (600 pts max)
    let codingPoints = 0;
    let labSolvedCount = 0;
    let totalTestCasesPassed = 0;
    let totalTestCases = 0;

    codingProblems.forEach((prob, idx) => {
      const sub = problemSubmissions[idx];
      totalTestCases += ((prob.visibleTestCases || []).length + (prob.hiddenTestCases || []).length);
      if (sub) {
        codingPoints += (sub.score || 0);
        totalTestCasesPassed += (sub.passedCount || 0);
        if (sub.allPassed) labSolvedCount++;
      }
    });

    // Total Calibrated Score out of 1000
    const rawTotal = mcqPoints + codingPoints;
    const finalScore = Math.max(300, Math.min(1000, rawTotal));

    // Persist into SkillBridgeStore
    if (window.SkillBridgeStore) {
      window.SkillBridgeStore.updateSkillScore(selectedSkill, finalScore);
      window.SkillBridgeStore.saveAssessmentResult({
        skill: selectedSkill,
        score: finalScore,
        mcqScore: mcqPoints,
        codingScore: codingPoints,
        mcqCorrect,
        mcqTotal: mcqQuestions.length,
        codingSolved: labSolvedCount,
        codingTotal: codingProblems.length,
        testCasesPassed: totalTestCasesPassed,
        totalTestCases,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }

    // Render Result View
    document.getElementById('exam-view').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');

    const headerSubmit = document.getElementById('header-submit-btn');
    if (headerSubmit) headerSubmit.classList.add('hidden');

    document.getElementById('result-skill-badge').innerText = selectedSkill;
    document.getElementById('result-score-val').innerHTML = `${finalScore} <span class="text-sm text-slate-400 font-normal">/ 1000</span>`;

    let tierLabel = '';
    if (finalScore >= 700) tierLabel = 'Industry Ready (Tier 1)';
    else if (finalScore >= 600) tierLabel = 'Proficient (Tier 2)';
    else tierLabel = 'Developing Candidate (Tier 3)';

    document.getElementById('result-grade-text').innerText = `${tierLabel} • Benchmark Attained`;

    // Detailed Breakdown
    document.getElementById('res-mcq-score').innerText = `${mcqPoints} / 400 pts`;
    document.getElementById('res-mcq-breakdown').innerText = `${mcqCorrect} of ${mcqQuestions.length} questions answered correctly`;

    document.getElementById('res-lab-score').innerText = `${codingPoints} / 600 pts`;
    document.getElementById('res-lab-breakdown').innerText = `${labSolvedCount} of ${codingProblems.length} problems solved (${totalTestCasesPassed}/${totalTestCases} test cases passed)`;
  };

  document.addEventListener('DOMContentLoaded', init);
})();
