/**
 * SkillBridge - Standardized Assessment Engine v4.0
 * Two-Factor Timer + Anti-Cheating + 1000-Point Score Calibration
 * Enterprise Academic & Industry Collaboration Platform
 */

(function () {
  'use strict';

  const AVAILABLE_SKILLS = [
    'Java Development',
    'SQL',
    'Spring Boot',
    'React',
    'Python Development',
    'Git',
    'DSA (Data Structures & Algorithms)',
    'Web Development',
    'Cloud Computing',
    'Cybersecurity',
    'AI/ML Engineering',
    'Data Analytics',
    'IoT & Edge Computing',
    'Robotics & Automation',
    'Blockchain / Web3',
    'Software Testing / QA Engineering',
    'UI/UX Design',
    'C Programming'
  ];

  let selectedSkill = 'Java Development';
  let questions = [];
  let currentIndex = 0;
  let userAnswers = {}; // { 0: optionIndex, ... }
  let examSeconds = 1200; // 20 minutes
  let questionDwellSeconds = 0;
  let examTimerInterval = null;
  let dwellTimerInterval = null;
  let antiCheatViolations = 0;

  function init() {
    const selector = document.getElementById('skill-selector');
    if (selector) {
      selector.innerHTML = '';
      AVAILABLE_SKILLS.forEach(skill => {
        const opt = document.createElement('option');
        opt.value = skill;
        opt.innerText = skill;
        selector.appendChild(opt);
      });

      // Check URL param ?skill=...
      const urlParams = new URLSearchParams(window.location.search);
      const skillParam = urlParams.get('skill');
      if (skillParam && AVAILABLE_SKILLS.includes(skillParam)) {
        selector.value = skillParam;
        selectedSkill = skillParam;
      }

      selector.addEventListener('change', (e) => {
        selectedSkill = e.target.value;
      });
    }

    // Set initial current skill pill
    const pill = document.getElementById('current-skill-pill');
    if (pill) pill.innerText = selectedSkill;
  }

  function getQuestionsForSkill(skill) {
    const pool = [];
    const raw = (window.QUESTIONS && window.QUESTIONS[skill]) ? window.QUESTIONS[skill] : null;

    if (raw) {
      ['easy', 'medium', 'hard'].forEach(diff => {
        if (Array.isArray(raw[diff])) {
          raw[diff].forEach(q => pool.push(Object.assign({}, q, { difficulty: diff })));
        }
      });
    }

    // Fallback if pool is shorter than 20
    let index = 1;
    const genericTopics = [
      'Core Architecture & Design Patterns',
      'Memory Management & Resource Efficiency',
      'High-Throughput Concurrency & Thread Safety',
      'Data Integrity & ACID Transactions',
      'Exception Handling & Resilient Recovery',
      'Network Optimization & Latency Reduction',
      'Security Hardening & Input Validation',
      'Automated Unit & Integration Testing'
    ];

    while (pool.length < 20) {
      const topic = genericTopics[index % genericTopics.length];
      pool.push({
        id: `gen_${skill}_${index}`,
        question: `In production ${skill} systems, what is the industry best practice for managing ${topic}?`,
        options: [
          `Apply structured validation, non-blocking I/O, and continuous feedback metrics`,
          `Bypass validation to minimize CPU cycles`,
          `Use unmanaged static singletons across concurrent requests`,
          `Rely solely on client-side constraints without server checks`
        ],
        answer: 0,
        difficulty: index > 12 ? 'hard' : (index > 6 ? 'medium' : 'easy')
      });
      index++;
    }

    return pool.slice(0, 20);
  }

  window.startAssessment = function () {
    const selector = document.getElementById('skill-selector');
    if (selector) selectedSkill = selector.value;

    document.getElementById('current-skill-pill').innerText = selectedSkill;
    questions = getQuestionsForSkill(selectedSkill);
    currentIndex = 0;
    userAnswers = {};
    antiCheatViolations = 0;

    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('exam-view').classList.remove('hidden');

    startTimers();
    setupAntiCheat();
    renderQuestion(0);
  };

  function startTimers() {
    stopTimers();
    examSeconds = 1200; // 20 mins
    questionDwellSeconds = 0;

    examTimerInterval = setInterval(() => {
      examSeconds--;
      if (examSeconds <= 0) {
        stopTimers();
        alert('Examination time expired! Auto-submitting answers.');
        submitTest();
        return;
      }
      const m = Math.floor(examSeconds / 60);
      const s = examSeconds % 60;
      const el = document.getElementById('exam-timer');
      if (el) el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);

    dwellTimerInterval = setInterval(() => {
      questionDwellSeconds++;
      const m = Math.floor(questionDwellSeconds / 60);
      const s = questionDwellSeconds % 60;
      const el = document.getElementById('q-dwell-timer');
      if (el) el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimers() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    if (dwellTimerInterval) clearInterval(dwellTimerInterval);
  }

  function setupAntiCheat() {
    // Window blur (Tab switch detection)
    window.onblur = function () {
      if (document.getElementById('exam-view').classList.contains('hidden')) return;

      antiCheatViolations++;
      if (window.SkillBridgeStore) {
        window.SkillBridgeStore.logCheatingViolation('Tab switch or unfocus detected during assessment');
      }

      const violEl = document.getElementById('violation-text');
      if (violEl) {
        violEl.innerText = `${antiCheatViolations} Strike${antiCheatViolations > 1 ? 's' : ''}`;
        violEl.className = 'text-base font-bold text-rose-600';
      }

      alert(`[ANTI-CHEATING WARNING #${antiCheatViolations}]\nTab switching and background activity are prohibited during proctored exams!\n50 points deducted from your verified skills.`);

      if (antiCheatViolations >= 3) {
        stopTimers();
        alert('EXAM TERMINATED: 3 proctoring violations recorded. This attempt has been invalidated.');
        window.location.href = '../Student_Interface/Portal-Dashboard.html';
      }
    };

    // Copy / paste prevention
    document.addEventListener('copy', (e) => {
      if (!document.getElementById('exam-view').classList.contains('hidden')) {
        e.preventDefault();
        alert('Action Prohibited: Copying test content is flagged as an academic integrity violation.');
      }
    });
  }

  function renderQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    currentIndex = index;
    questionDwellSeconds = 0; // Reset question dwell timer

    const q = questions[index];
    document.getElementById('q-number-pill').innerText = `QUESTION ${index + 1} OF ${questions.length}`;
    document.getElementById('q-diff-badge').innerText = `${(q.difficulty || 'standard').toUpperCase()} DIFFICULTY`;
    document.getElementById('q-prompt').innerText = q.question;

    const optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';

    const selectedOpt = userAnswers[index];

    q.options.forEach((optText, optIdx) => {
      const isSelected = selectedOpt === optIdx;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w-full p-3.5 text-left flex items-start gap-3 border transition ${isSelected
          ? 'border-indigo-500 bg-indigo-600/20 text-white font-semibold rounded-[4px]'
          : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-indigo-500/40 hover:bg-white/[0.04]'
        }`;
      btn.onclick = () => selectOption(optIdx);

      const letter = String.fromCharCode(65 + optIdx);
      btn.innerHTML = `
        <span class="w-6 h-6 ${isSelected ? 'bg-indigo-600 text-white font-bold' : 'bg-white/10 text-slate-300 border border-white/10 font-medium'} rounded-[3px] flex items-center justify-center text-xs shrink-0">
          ${letter}
        </span>
        <span class="text-xs leading-relaxed pt-0.5">${optText}</span>
      `;
      optContainer.appendChild(btn);
    });

    // Update Progress
    const answered = Object.keys(userAnswers).length;
    document.getElementById('answered-count').innerText = answered;
    document.getElementById('remaining-count').innerText = questions.length - answered;
    document.getElementById('progress-text').innerText = `${index + 1} / ${questions.length}`;
    document.getElementById('progress-bar').style.width = `${Math.round(((index + 1) / questions.length) * 100)}%`;

    // Button states
    document.getElementById('btn-prev').disabled = index === 0;
    if (index === questions.length - 1) {
      document.getElementById('btn-next').classList.add('hidden');
      document.getElementById('btn-finish').classList.remove('hidden');
    } else {
      document.getElementById('btn-next').classList.remove('hidden');
      document.getElementById('btn-finish').classList.add('hidden');
    }
  }

  function selectOption(optIdx) {
    userAnswers[currentIndex] = optIdx;
    renderQuestion(currentIndex);
  }

  window.nextQuestion = function () {
    if (currentIndex < questions.length - 1) {
      renderQuestion(currentIndex + 1);
    }
  };

  window.prevQuestion = function () {
    if (currentIndex > 0) {
      renderQuestion(currentIndex - 1);
    }
  };

  window.submitTest = function () {
    if (Object.keys(userAnswers).length < questions.length) {
      if (!confirm(`You have answered ${Object.keys(userAnswers).length} of ${questions.length} questions. Submit examination now?`)) {
        return;
      }
    }

    stopTimers();
    window.onblur = null;

    // Calculate score out of 1000
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    // Base score calculation: 1000 point scale (min 300, max 1000)
    const rawScore = Math.round((correctCount / questions.length) * 1000);
    const calibratedScore = Math.max(300, Math.min(1000, rawScore));

    // Save into central store
    if (window.SkillBridgeStore) {
      window.SkillBridgeStore.updateSkillScore(selectedSkill, calibratedScore);
      window.SkillBridgeStore.saveAssessmentResult({
        skill: selectedSkill,
        score: calibratedScore,
        correct: correctCount,
        total: questions.length,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }

    // Display Result View
    document.getElementById('exam-view').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');

    document.getElementById('result-skill-badge').innerText = selectedSkill;
    document.getElementById('result-score-val').innerHTML = `${calibratedScore} <span class="text-sm text-slate-500 font-normal">/ 1000</span>`;

    let tierLabel = '';
    if (calibratedScore >= 700) tierLabel = 'Industry Ready (Tier 1)';
    else if (calibratedScore >= 600) tierLabel = 'Proficient (Tier 2)';
    else tierLabel = 'Developing Candidate (Tier 3)';

    document.getElementById('result-grade-text').innerText = `${tierLabel} - ${correctCount}/${questions.length} Correct`;
  };

  window.confirmExit = function () {
    if (confirm('Are you sure you want to exit? Your exam in progress will not be saved.')) {
      stopTimers();
      window.location.href = '../Student_Interface/Portal-Dashboard.html';
    }
  };

  document.addEventListener('DOMContentLoaded', init);

})();
