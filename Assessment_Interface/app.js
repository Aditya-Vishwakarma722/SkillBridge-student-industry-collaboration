/* ----------- GENERIC UNIQUE QUESTION GENERATION ----------- */
function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'skill';
}

function createUniqueQuestion(skill, difficulty, index) {
  const topics = [
    'system reliability', 'data quality', 'performance optimization', 'secure design', 'scalable architecture',
    'debugging workflows', 'team collaboration', 'deployment readiness', 'maintainability', 'risk management',
    'testing coverage', 'technical documentation', 'user experience', 'access control', 'monitoring',
    'resource efficiency', 'integration strategy', 'iterative improvement', 'feature validation', 'error handling'
  ];

  const topic = topics[index % topics.length];
  const genericOptions = [
    'Use structured validation and continuous feedback loops',
    'Ignore edge cases and optimize only for the happy path',
    'Deploy without documentation or testing',
    'Minimize monitoring and assume systems will remain stable'
  ];

  const questionTextByDifficulty = {
    easy: `Which practice most directly improves ${topic} in ${skill}?`,
    medium: `In a practical ${skill} project, which strategy most improves ${topic} while keeping the solution maintainable?`,
    hard: `For a production-grade ${skill} implementation, which decision best addresses ${topic} under realistic scale and uncertainty?`
  };

  const correctIndex = 0;
  const answerOptions = [
    genericOptions[0],
    genericOptions[(index + 1) % genericOptions.length],
    genericOptions[(index + 2) % genericOptions.length],
    genericOptions[(index + 3) % genericOptions.length]
  ];

  return {
    id: `${slugify(skill)}_${difficulty}_${index + 1}`,
    question: questionTextByDifficulty[difficulty] || questionTextByDifficulty.medium,
    options: answerOptions,
    answer: correctIndex,
    explanation: `Strong ${skill} work emphasizes measurable validation, clear architecture, and thoughtful trade-offs to improve ${topic} and reduce risk.`
  };
}

function expandQuestionsTo25(skill) {
  try {
    if (!QUESTIONS[skill]) return { easy: [], medium: [], hard: [] };

    const expanded = { easy: [], medium: [], hard: [] };
    const difficulties = ['easy', 'medium', 'hard'];

    difficulties.forEach((difficulty) => {
      const original = (QUESTIONS[skill][difficulty] || []).map(item => ({ ...item, skill, difficulty }));
      const seen = new Set();
      const uniqueQuestions = [];

      original.forEach(item => {
        const key = String(item.question || '').trim().toLowerCase();
        if (!key) return;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueQuestions.push(item);
        }
      });

      const needed = 25;
      let generatedIndex = 0;

      while (uniqueQuestions.length < needed) {
        const candidate = createUniqueQuestion(skill, difficulty, generatedIndex++);
        const key = candidate.question.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueQuestions.push(candidate);
        }
      }

      expanded[difficulty] = uniqueQuestions.slice(0, needed);
    });

    return expanded;
  } catch (error) {
    console.error('Error generating question pool:', error);
    return { easy: [], medium: [], hard: [] };
  }
}

function getExpandedQuestions(skill) {
  return expandQuestionsTo25(skill);
}

const SKILLS = [
  'IoT & Edge Computing',
  'Robotics & Automation',
  'Blockchain / Web3',
  'AR/VR & Mixed Reality',
  'Quantum Computing',
  'Software Testing / QA Engineering',
  'UI/UX Design',
  'DSA (Data Structures & Algorithms)',
  'C Programming',
  'Java Development',
  'Python Development',
  'Web Development',
  'AI/ML Engineering',
  'Data Analytics',
  'Cloud Computing',
  'Cybersecurity',
  'Game Development',
  'Software Development'
];

const DOMAIN_DETAILS = {
  'AI/ML Engineering': { label: 'AI / Machine Learning', description: 'Modeling, prediction pipelines, and intelligent decision systems.', questions: 25 },
  'Data Analytics': { label: 'Data Science', description: 'Statistics, insights, experimentation, and business analytics.', questions: 25 },
  'Web Development': { label: 'Web Development', description: 'Modern front-end, back-end, and scalable user experiences.', questions: 25 },
  'DSA (Data Structures & Algorithms)': { label: 'DSA', description: 'Problem-solving patterns, algorithmic thinking, and optimization.', questions: 25 },
  'Cloud Computing': { label: 'Cloud Computing', description: 'Distributed systems, infrastructure, and deployment strategy.', questions: 25 },
  'Cybersecurity': { label: 'Cybersecurity', description: 'Security fundamentals, attack vectors, and defense controls.', questions: 25 },
  'UI/UX Design': { label: 'UI/UX Design', description: 'Usability, interaction flows, and design systems.', questions: 25 },
  'Software Testing / QA Engineering': { label: 'Software Testing', description: 'Testing strategy, automation, and quality assurance.', questions: 25 },
  'AR/VR & Mixed Reality': { label: 'AR / VR', description: 'Spatial interfaces, 3D interaction, and immersive experiences.', questions: 25 }
};

const COURSES = {
  'IoT & Edge Computing': { name: 'Embedded Edge Systems & Microcontrollers', provider: 'Edge Tech Institute · 4 wks' },
  'Robotics & Automation': { name: 'Autonomous Navigation & ROS 2 Dynamics', provider: 'Robotics Motion Lab · 5 wks' },
  'Blockchain / Web3': { name: 'Smart Contract Architecture & EVM Security', provider: 'Decentralized Systems Track · 4 wks' },
  'AR/VR & Mixed Reality': { name: 'Spatial Computing & OpenXR Architecture', provider: 'XR Development Academy · 4 wks' },
  'Quantum Computing': { name: 'Quantum Algorithms & Qubit Simulation', provider: 'Quantum Physics Lab · 6 wks' },
  'Software Testing / QA Engineering': { name: 'Automated Testing & CI/CD QA Pipelines', provider: 'Quality Engineering Track · 3 wks' },
  'UI/UX Design': { name: 'Design Systems & Spatial Interaction UX', provider: 'Design System Studio · 3 wks' },
  'DSA (Data Structures & Algorithms)': { name: 'Advanced Data Structures & Dynamic Programming', provider: 'Algorithm Mastery Track · 5 wks' },
  'C Programming': { name: 'Systems Programming & Low-Level Memory Management', provider: 'Systems Engineering Track · 4 wks' },
  'Java Development': { name: 'Enterprise Java & OOP Architecture Patterns', provider: 'Backend Development Academy · 5 wks' },
  'Python Development': { name: 'Python Mastery & Modern Framework Development', provider: 'Python Excellence Institute · 4 wks' },
  'Web Development': { name: 'Full-Stack Web Architecture & Modern Frameworks', provider: 'Web Dev Bootcamp · 8 wks' },
  'AI/ML Engineering': { name: 'Deep Learning & Production ML Systems', provider: 'AI Research Lab · 6 wks' },
  'Data Analytics': { name: 'Data Pipeline & Advanced Analytics', provider: 'Data Science Academy · 5 wks' },
  'Cloud Computing': { name: 'Cloud Architecture & Infrastructure as Code', provider: 'Cloud Engineering Institute · 4 wks' },
  'Cybersecurity': { name: 'Penetration Testing & Security Architecture', provider: 'Security Operations Center · 6 wks' },
  'Game Development': { name: 'Game Engine & 3D Graphics Programming', provider: 'Game Dev Academy · 5 wks' },
  'Software Development': { name: 'SDLC & Software Engineering Best Practices', provider: 'Engineering Excellence Track · 4 wks' }
};

const STORAGE_KEY = 'skillbridge_assessment_history';
const app = document.getElementById('app');
const rail = document.getElementById('rail');

let step = 1;
let quizStarted = false;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let ratings = Object.fromEntries(SKILLS.map(skill => [skill, 1]));
let selectedDomains = new Set();

const DOMAIN_META = {
  'IoT & Edge Computing': { num: 1, icon: '🌐', label: 'IoT & Edge' },
  'Robotics & Automation': { num: 2, icon: '🤖', label: 'Robotics' },
  'Blockchain / Web3': { num: 3, icon: '⛓️', label: 'Blockchain' },
  'AR/VR & Mixed Reality': { num: 4, icon: '🥽', label: 'AR / VR' },
  'Quantum Computing': { num: 5, icon: '⚛️', label: 'Quantum' },
  'Software Testing / QA Engineering': { num: 6, icon: '🧪', label: 'QA' },
  'UI/UX Design': { num: 7, icon: '🎨', label: 'UI/UX' },
  'DSA (Data Structures & Algorithms)': { num: 8, icon: '🧩', label: 'DSA' },
  'C Programming': { num: 9, icon: '🔧', label: 'C' },
  'Java Development': { num: 10, icon: '☕', label: 'Java' },
  'Python Development': { num: 11, icon: '🐍', label: 'Python' },
  'Web Development': { num: 12, icon: '💻', label: 'Web' },
  'AI/ML Engineering': { num: 13, icon: '🧠', label: 'AI/ML' },
  'Data Analytics': { num: 14, icon: '📊', label: 'Data' },
  'Cloud Computing': { num: 15, icon: '☁️', label: 'Cloud' },
  'Cybersecurity': { num: 16, icon: '🔒', label: 'Security' },
  'Game Development': { num: 17, icon: '🎮', label: 'Game' },
  'Software Development': { num: 18, icon: '💾', label: 'Software' }
};

function getLatestHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: [] };
    return JSON.parse(raw);
  } catch {
    return { history: [] };
  }
}

function saveAssessmentResult(result) {
  try {
    const previous = getLatestHistory();
    const history = Array.isArray(previous.history) ? previous.history : [];
    history.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: history.slice(-8) }));
  } catch (error) {
    console.warn('Unable to save results:', error);
  }
}

function getSkillLevel(score) {
  if (score >= 90) return 'Industry Ready';
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Intermediate';
  if (score >= 40) return 'Developing';
  return 'Beginner';
}

function getDifficultySummary() {
  const summary = { easy: 0, medium: 0, hard: 0 };
  const byDifficulty = { easy: [], medium: [], hard: [] };

  quizQuestions.forEach(question => {
    byDifficulty[question.difficulty].push(question);
  });

  Object.keys(byDifficulty).forEach(key => {
    const total = byDifficulty[key].length || 1;
    const correct = byDifficulty[key].filter(q => userAnswers[q.id] === q.answer).length;
    summary[key] = Math.round((correct / total) * 100);
  });

  return summary;
}

function getDomainScores() {
  const scores = {};
  const selected = selectedDomains.size > 0 ? [...selectedDomains] : SKILLS;

  selected.forEach(skill => {
    const questions = quizQuestions.filter(q => q.skill === skill);
    const total = questions.length || 1;
    const correct = questions.filter(q => userAnswers[q.id] === q.answer).length;
    scores[skill] = Math.round((correct / total) * 100);
  });

  return scores;
}

function getStrongDomains(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

function getWeakDomains(scores) {
  return Object.entries(scores).filter(([_, score]) => score < 60).sort((a, b) => a[1] - b[1]);
}

function buildCareerRecommendations(scores) {
  const candidatePool = [
    { title: 'AI / Machine Learning Engineer', skill: 'AI/ML Engineering', reason: 'Strong model reasoning and decision-making base.', focus: ['Deep Learning', 'MLOps', 'Advanced Statistics'] },
    { title: 'Software Engineer', skill: 'Software Development', reason: 'Solid engineering practices and application design ability.', focus: ['Distributed Systems', 'Testing', 'System Design'] },
    { title: 'Full-Stack Developer', skill: 'Web Development', reason: 'Strong web fundamentals and product delivery skills.', focus: ['Backend APIs', 'Security', 'Database Design'] },
    { title: 'Data Scientist', skill: 'Data Analytics', reason: 'Strong analysis and interpretation mindset.', focus: ['Experiment Design', 'Visualization', 'Statistical Modeling'] },
    { title: 'Cloud Engineer', skill: 'Cloud Computing', reason: 'Good infrastructure, deployment, and architecture instincts.', focus: ['Kubernetes', 'Networking', 'IaC'] },
    { title: 'Cybersecurity Analyst', skill: 'Cybersecurity', reason: 'Good security and risk awareness foundation.', focus: ['Threat Modeling', 'Pen Testing', 'Forensics'] }
  ];

  return candidatePool
    .map(item => ({
      ...item,
      match: Math.max(35, Math.min(95, (scores[item.skill] || 45) + 20))
    }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
}

function getLearningRoadmap() {
  const scores = getDomainScores();
  const weakDomains = getWeakDomains(scores);
  const focusDomain = weakDomains[0]?.[0] || 'AI/ML Engineering';

  const roadmapMap = {
    'AI/ML Engineering': ['Python Advanced', 'Statistics', 'Machine Learning', 'Deep Learning', 'MLOps', 'Real-World Project'],
    'Web Development': ['Frontend Foundations', 'Backend APIs', 'Authentication', 'Database Design', 'Testing', 'Full-Stack Project'],
    'DSA (Data Structures & Algorithms)': ['Arrays & Strings', 'Hashing', 'Graphs', 'Dynamic Programming', 'Trees', 'System Design'],
    'Cloud Computing': ['Linux Fundamentals', 'Networking', 'Containers', 'Cloud Services', 'IaC', 'Production Deployment'],
    'Cybersecurity': ['Networking Basics', 'Linux Security', 'Threat Modeling', 'Web Security', 'Penetration Testing', 'SOC Practice'],
    'Data Analytics': ['Statistics', 'SQL', 'Visualization', 'Data Cleaning', 'Modeling', 'Dashboard Project'],
    'Software Development': ['OOP', 'Design Patterns', 'APIs', 'Testing', 'Architecture', 'Case Study Project']
  };

  return roadmapMap[focusDomain] || ['Core Concepts', 'Applied Practice', 'Project Build', 'Optimization', 'Portfolio Review', 'Career Readiness'];
}

function getRecommendedProjects(scores) {
  const weak = getWeakDomains(scores);
  const focusDomain = weak[0]?.[0] || 'AI/ML Engineering';
  const projectMap = {
    'AI/ML Engineering': [
      { name: 'Student Performance Predictor', difficulty: 'Beginner', skills: ['Feature engineering', 'Model evaluation'], description: 'Build a regression model that predicts student outcomes using academic metrics.' },
      { name: 'Customer Churn Prediction', difficulty: 'Intermediate', skills: ['Classification', 'Feature selection'], description: 'Model churn risk using behavioral and customer data from a SaaS product.' },
      { name: 'AI Recommendation System', difficulty: 'Advanced', skills: ['Collaborative filtering', 'Ranking'], description: 'Create a personalized recommendation engine for products, content, or learning paths.' }
    ],
    'Web Development': [
      { name: 'Task Management SaaS', difficulty: 'Beginner', skills: ['Authentication', 'CRUD APIs'], description: 'Create a multi-user workspace for planning and delivering tasks.' },
      { name: 'Analytics Dashboard', difficulty: 'Intermediate', skills: ['Charts', 'API integration'], description: 'Visualize live business metrics with dashboards and filters.' },
      { name: 'E-commerce Platform', difficulty: 'Advanced', skills: ['Payments', 'Inventory', 'Security'], description: 'Create a real-world shopping experience with scaling concerns.' }
    ],
    'DSA (Data Structures & Algorithms)': [
      { name: 'Graph Route Optimizer', difficulty: 'Beginner', skills: ['Graph traversal', 'Shortest path'], description: 'Solve route and connectivity problems using graph algorithms.' },
      { name: 'Planner & Scheduler', difficulty: 'Intermediate', skills: ['Greedy solutions', 'Priority queues'], description: 'Design an algorithmic scheduler for tasks with resource constraints.' },
      { name: 'Dynamic Programming Solver', difficulty: 'Advanced', skills: ['DP optimization', 'Complexity analysis'], description: 'Tackle optimization problems with memoization and cost modeling.' }
    ],
    'Cloud Computing': [
      { name: 'Containerized Web App', difficulty: 'Beginner', skills: ['Docker', 'Networking'], description: 'Containerize and run an application across multiple services.' },
      { name: 'Infrastructure as Code', difficulty: 'Intermediate', skills: ['Terraform', 'Provisioning'], description: 'Deploy a cloud infrastructure stack using declarative configs.' },
      { name: 'Multi-Service Platform', difficulty: 'Advanced', skills: ['Kubernetes', 'Scaling'], description: 'Design resilient deployment patterns for a production application.' }
    ],
    'Cybersecurity': [
      { name: 'Secure Login Portal', difficulty: 'Beginner', skills: ['Auth flows', 'Encryption'], description: 'Build a secure login system with session handling and validation.' },
      { name: 'Vulnerability Scanner', difficulty: 'Intermediate', skills: ['Threat analysis', 'Input validation'], description: 'Create a lightweight scanner for common web app weaknesses.' },
      { name: 'Security Operations Lab', difficulty: 'Advanced', skills: ['Logging', 'Monitoring'], description: 'Model security monitoring and incident response workflows.' }
    ]
  };

  return projectMap[focusDomain] || projectMap['AI/ML Engineering'];
}

function buildSkillGapList() {
  const scores = getDomainScores();
  const weaknesses = getWeakDomains(scores);

  const gapMap = {
    'AI/ML Engineering': ['Model evaluation', 'Feature engineering', 'Bias and variance trade-offs'],
    'Web Development': ['REST APIs', 'Authentication', 'Database design'],
    'DSA (Data Structures & Algorithms)': ['Dynamic programming', 'Graph algorithms', 'Advanced trees'],
    'Cloud Computing': ['Containers', 'CI/CD', 'Observability'],
    'Cybersecurity': ['Threat modeling', 'Identity checks', 'Secure networking'],
    'Data Analytics': ['Data cleaning', 'Experiment design', 'Statistical modeling'],
    'Software Development': ['System design', 'Testing strategy', 'Debugging'],
    'Python Development': ['Advanced syntax', 'Data structures', 'Automation flows'],
    'Java Development': ['Concurrency', 'Microservices', 'OOP structure']
  };

  const entries = weaknesses.map(([skill, score]) => ({
    skill,
    score,
    gaps: gapMap[skill] || ['Core concepts', 'Applied practice', 'Project execution']
  }));

  return entries.slice(0, 3);
}

function shouldUseMultiSelect() {
  return true;
}

function calculateAssessmentStats() {
  const totalQuestions = quizQuestions.length || 1;
  const totalCorrect = quizQuestions.filter(q => userAnswers[q.id] === q.answer).length;
  const score = Math.round((totalCorrect / totalQuestions) * 100);
  const level = getSkillLevel(score);
  return { totalQuestions, totalCorrect, score, level };
}

function toggleSkillSelection(skill) {
  if (selectedDomains.has(skill)) selectedDomains.delete(skill);
  else selectedDomains.add(skill);
}

function generateQuizQuestions() {
  const list = [];
  const domains = selectedDomains.size > 0 ? [...selectedDomains] : SKILLS;

  domains.forEach(skill => {
    if (!QUESTIONS[skill]) return;

    const expanded = expandQuestionsTo25(skill);
    const allQuestions = [...expanded.easy, ...expanded.medium, ...expanded.hard];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(30, shuffled.length));

    selectedQuestions.forEach(question => {
      list.push({
        skill,
        difficulty: question.difficulty || 'medium',
        ...question
      });
    });
  });

  return list;
}

function startQuiz() {
  if (selectedDomains.size === 0) {
    selectedDomains.add(SKILLS[0]);
  }

  quizQuestions = generateQuizQuestions();
  userAnswers = {};
  currentQuestionIndex = 0;
  quizStarted = true;
  step = 1;
  render();
}

function renderLanding() {
  const totalDomains = SKILLS.length;
  const questionCount = 25;
  const estimatedMinutes = Math.max(15, Math.min(40, Math.round(totalDomains * 3 + 10)));

  const domainCards = SKILLS.map((skill, index) => {
    const meta = DOMAIN_META[skill];
    const details = DOMAIN_DETAILS[skill] || { label: skill, description: 'Targeted learning and career readiness.', questions: 25 };
    const selected = selectedDomains.has(skill);

    return `
      <button class="domain-card ${selected ? 'domain-selected' : ''}" data-skill="${skill}" type="button" aria-pressed="${selected}">
        <div class="domain-row">
          <div class="domain-label">
            <span class="domain-index">${meta.num}.</span>
            <span class="domain-icon">${meta.icon}</span>
            <span>${details.label}</span>
          </div>
          <span class="domain-check">${selected ? '✓' : ''}</span>
        </div>
        <p>${details.description}</p>
        <div class="domain-meta">
          <span>${details.questions} questions</span>
          <strong>${selected ? 'Selected' : 'Select'}</strong>
        </div>
      </button>
    `;
  }).join('');

  app.innerHTML = `
    <div class="card glass-panel">
      <div class="score-header">
        <div>
          <div class="tagline" style="margin-bottom: 12px;">SkillBridge</div>
          <h1 class="hero">AI-Powered Skill Assessment & <em>Career Roadmap</em></h1>
          <p class="lead">Discover your strengths, identify skill gaps, and get a personalized roadmap for your career.</p>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Domains</span>
          <span class="stat-value">${totalDomains}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Questions</span>
          <span class="stat-value">${questionCount}+</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Time</span>
          <span class="stat-value">${estimatedMinutes} min</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Levels</span>
          <span class="stat-value">Easy / Medium / Hard</span>
        </div>
      </div>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🧠</div>
          <h3>Skill Assessment</h3>
          <p>Measure practical understanding across core learning domains.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📉</div>
          <h3>Skill Gap Analysis</h3>
          <p>Identify weak areas and map them to real improvement opportunities.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Career Recommendation</h3>
          <p>Match your strengths to realistic career paths and learning clusters.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧭</div>
          <h3>Learning Roadmap</h3>
          <p>Follow a structured plan from foundation to project execution.</p>
        </div>
      </div>

      <div class="actions" style="margin-top: 26px; justify-content: flex-start;">
        <button class="btn" id="startAssessmentBtn">Start Assessment</button>
      </div>
    </div>

    <div class="card glass-panel">
      <h2 class="section-title">Choose Your Focus Areas</h2>
      <p class="sub">Select one or more skills to benchmark your readiness and receive a personalized roadmap.</p>
      <div class="domain-grid">${domainCards}</div>
      <div class="actions" style="margin-top: 22px; justify-content: flex-start;">
        <button class="btn" id="launchAssessmentBtn" ${selectedDomains.size === 0 ? 'disabled' : ''}>Launch Assessment</button>
        <button class="btn ghost" id="clearDomainsBtn" type="button">Clear</button>
      </div>
    </div>
  `;

  document.querySelectorAll('.domain-card').forEach(card => {
    card.addEventListener('click', () => {
      const skill = card.dataset.skill;
      toggleSkillSelection(skill);
      renderLanding();
    });
  });

  const startBtn = document.getElementById('startAssessmentBtn');
  startBtn?.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

  document.getElementById('launchAssessmentBtn')?.addEventListener('click', () => {
    if (selectedDomains.size === 0) return;
    startQuiz();
  });

  document.getElementById('clearDomainsBtn')?.addEventListener('click', () => {
    selectedDomains.clear();
    renderLanding();
  });
}

function renderAssessment() {
  const q = quizQuestions[currentQuestionIndex];
  if (!q) {
    renderLanding();
    return;
  }

  const progress = Math.round((currentQuestionIndex / quizQuestions.length) * 100);
  const selectedAnswer = userAnswers[q.id];
  const options = q.options.map((option, index) => {
    const letters = ['A', 'B', 'C', 'D'];
    const isSelected = selectedAnswer === index;
    return `
      <button class="option-btn ${isSelected ? 'selected' : ''}" data-index="${index}" type="button">
        <span class="option-prefix">${letters[index]}</span>
        <span>${escapeHtml(option)}</span>
      </button>
    `;
  }).join('');

  app.innerHTML = `
    <div class="card glass-panel">
      <div class="quiz-header">
        <div>
          <div class="tagline">${q.skill}</div>
          <div class="question-meta">
            <span>Question ${currentQuestionIndex + 1} / ${quizQuestions.length}</span>
            <span>Progress: ${progress}%</span>
          </div>
        </div>
        <span class="badge">${q.difficulty}</span>
      </div>

      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
      </div>

      <div class="question-card">
        <div class="question-meta">
          <span>Difficulty: ${q.difficulty.toUpperCase()}</span>
          <span>${selectedDomains.size > 1 ? 'Multi-domain assessment' : 'Single-domain assessment'}</span>
        </div>
        <h2 class="question-text">${escapeHtml(q.question)}</h2>
        <div class="options-grid">${options}</div>
      </div>

      <div class="actions" style="margin-top: 28px; justify-content: space-between;">
        <button class="btn ghost" id="prevQuestionBtn" ${currentQuestionIndex === 0 ? 'disabled' : ''} type="button">Previous</button>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn ghost" id="exitAssessmentBtn" type="button">Exit Assessment</button>
          <button class="btn" id="nextQuestionBtn" ${selectedAnswer === undefined ? 'disabled' : ''} type="button">
            ${currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Assessment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', () => {
      userAnswers[q.id] = Number(button.dataset.index);
      renderAssessment();
    });
  });

  document.getElementById('prevQuestionBtn')?.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex -= 1;
      render();
    }
  });

  document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
    if (selectedAnswer === undefined) return;

    if (currentQuestionIndex === quizQuestions.length - 1) {
      const stats = calculateAssessmentStats();
      const history = getLatestHistory();
      const result = {
        date: new Date().toISOString(),
        score: stats.score,
        skillLevel: stats.level,
        selectedDomains: [...selectedDomains],
        domains: getDomainScores(),
        difficulty: getDifficultySummary()
      };

      saveAssessmentResult(result);
      ratings = Object.fromEntries(SKILLS.map(skill => [skill, getDomainScores()[skill] ? getDomainScores()[skill] / 100 * 5 : 1]));
      step = 2;
      render();
      return;
    }

    currentQuestionIndex += 1;
    render();
  });

  document.getElementById('exitAssessmentBtn')?.addEventListener('click', () => {
    step = 1;
    quizStarted = false;
    selectedDomains.clear();
    renderLanding();
  });
}

function renderReport() {
  const summary = calculateAssessmentStats();
  const domainScores = getDomainScores();
  const difficultyScores = getDifficultySummary();
  const strongPairs = getStrongDomains(domainScores);
  const weakPairs = buildSkillGapList();
  const careerRecommendations = buildCareerRecommendations(domainScores);
  const roadmap = getLearningRoadmap();
  const projects = getRecommendedProjects(domainScores);
  const history = getLatestHistory();
  const previousResult = history.history[history.history.length - 2] || null;

  const skillBars = Object.entries(domainScores).map(([skill, score]) => {
    const isWeak = score < 60;
    return `
      <div class="skillbar">
        <div class="skillbar-top">
          <strong>${DOMAIN_DETAILS[skill]?.label || skill}</strong>
          <span class="mono">${score}% ${isWeak ? '<span class="gap-tag">Gap</span>' : ''}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" data-width="${score}" style="width:${score}%"></div>
        </div>
      </div>
    `;
  }).join('');

  const strengthsHtml = strongPairs.map(([skill, score]) => `<li>${DOMAIN_DETAILS[skill]?.label || skill}: ${score}% strong performance</li>`).join('');

  const gapsHtml = weakPairs.map(({ skill, gaps }) => `
    <li>
      <strong>${DOMAIN_DETAILS[skill]?.label || skill}</strong>
      <ul>
        ${gaps.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </li>
  `).join('');

  const careerHtml = careerRecommendations.map((career, index) => `
    <div class="career-card">
      <div class="match-score">Match Score: ${Math.round(career.match)}%</div>
      <h3>${index + 1}. ${career.title}</h3>
      <p>${career.reason}</p>
      <p><strong>Skills to improve:</strong> ${career.focus.join(', ')}</p>
    </div>
  `).join('');

  const roadmapHtml = roadmap.map((step, index) => `
    <div class="roadmap-step">
      <div class="step-tag">${index === 0 ? 'Current Focus' : index === roadmap.length - 1 ? 'Future Skill' : 'Next'}</div>
      <strong>${step}</strong>
    </div>
  `).join('');

  const projectCards = projects.map(project => `
    <div class="project-card">
      <div class="match-score">${project.difficulty}</div>
      <h3>${project.name}</h3>
      <p><strong>Skills practiced:</strong> ${project.skills.join(', ')}</p>
      <p>${project.description}</p>
    </div>
  `).join('');

  const reviewHtml = quizQuestions.map((question, index) => {
    const isCorrect = userAnswers[question.id] === question.answer;
    const selectedIndex = userAnswers[question.id];
    const letters = ['A', 'B', 'C', 'D'];
    return `
      <div class="review-item">
        <div class="review-top">
          <span>${question.skill}</span>
          <span class="${isCorrect ? 'review-good' : 'review-bad'}">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
        </div>
        <p class="review-question">Q${index + 1}. ${escapeHtml(question.question)}</p>
        <div class="review-detail">
          <div>Your answer: ${selectedIndex === undefined ? 'No answer' : `${letters[selectedIndex]}. ${escapeHtml(question.options[selectedIndex])}`}</div>
          <div>Correct answer: ${letters[question.answer]}. ${escapeHtml(question.options[question.answer])}</div>
          <div>Explanation: ${escapeHtml(question.explanation)}</div>
        </div>
      </div>
    `;
  }).join('');

  // Sync score into SkillBridgeStore
  if (window.SkillBridgeStore) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeSkill = urlParams.get('skill') || 'Spring Boot';
    window.SkillBridgeStore.updateSkillScore(activeSkill, summary.score);
    if (domainScores) {
      for (const [s, sc] of Object.entries(domainScores)) {
        window.SkillBridgeStore.updateSkillScore(s, sc);
      }
    }
  }

  const previousScore = previousResult ? previousResult.score : null;
  const improvement = previousScore !== null ? summary.score - previousScore : null;

  app.innerHTML = `
    <div class="report-shell">
      <div class="card glass-panel">
        <div class="score-header">
          <div>
            <div class="tagline">Assessment Report</div>
            <h1 class="hero" style="font-size: clamp(2rem, 3vw, 3.2rem);">Your Skill Assessment <em>Report</em></h1>
          </div>
          <div class="score-badge ${summary.score >= 75 ? 'green' : summary.score < 40 ? 'coral' : ''}">
            <span class="pct">${summary.score}%</span>
            <span class="label">Overall</span>
          </div>
        </div>
        <div class="level-chip">${summary.level}</div>
        
        <div style="margin-top: 15px; padding: 12px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; text-align: center;">
          <strong style="color: #f2ca50; display: block; margin-bottom: 6px;">🎉 Skill Score Updated Live to ${summary.score}/100!</strong>
          <a href="../Opportunity_Interface/index.html" style="display: inline-block; padding: 8px 18px; background: #f2ca50; color: #000; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 13px;">🎯 Check Unlocked Opportunities Now</a>
        </div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Your Skill Profile</h2>
        <div class="skillbar-list">${skillBars}</div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Difficulty-Level Performance</h2>
        <div class="metric-grid">
          <div class="metric-card"><span class="metric-value">${difficultyScores.easy}%</span><span class="metric-label">Easy</span></div>
          <div class="metric-card"><span class="metric-value">${difficultyScores.medium}%</span><span class="metric-label">Medium</span></div>
          <div class="metric-card"><span class="metric-value">${difficultyScores.hard}%</span><span class="metric-label">Hard</span></div>
        </div>
        <p class="lead" style="margin-top: 18px; margin-bottom: 0;">
          ${difficultyScores.easy >= 80 ? 'Your fundamentals are strong' : 'Your fundamentals need a bit more reinforcement'}${difficultyScores.medium < 70 ? ', but mid-level concepts need more consistency.' : ', and your mid-level understanding is solid.'}
          ${difficultyScores.hard < 50 ? ' Advanced concepts need more practice.' : ' Advanced topics are trending in the right direction.'}
        </p>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Your Strengths</h2>
        <div class="analysis-box">
          <ul>${strengthsHtml || '<li>No major strengths detected yet. Keep building practice.</li>'}</ul>
        </div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Your Skill Gaps</h2>
        <div class="analysis-box">
          <ul>${gapsHtml || '<li>No critical gaps detected. Your foundation is strong.</li>'}</ul>
        </div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Recommended Career Path</h2>
        <div class="career-grid">${careerHtml}</div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Your Learning Roadmap</h2>
        <div class="roadmap-grid">${roadmapHtml}</div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Projects to Strengthen Your Skills</h2>
        <div class="project-grid">${projectCards}</div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Review Your Answers</h2>
        <div class="review-list">${reviewHtml}</div>
      </div>

      <div class="card glass-panel">
        <h2 class="section-title">Your Progress</h2>
        <div class="analysis-grid">
          <div class="analysis-box">
            <h3>Current vs Previous</h3>
            <p class="sub">${previousScore !== null ? `Previous Score: ${previousScore}% | Current Score: ${summary.score}%` : `Current Score: ${summary.score}%`}</p>
            ${improvement !== null ? `<p class="sub">${improvement >= 0 ? '+' : ''}${improvement}% Improvement 📈</p>` : '<p class="sub">This is your first assessment result.</p>'}
          </div>
          <div class="analysis-box">
            <h3>Domain Progress</h3>
            <ul>
              ${Object.entries(domainScores).slice(0, 4).map(([skill, score]) => `<li>${DOMAIN_DETAILS[skill]?.label || skill}: ${score}%</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="card glass-panel">
        <div class="print-actions">
          <button class="btn" type="button" onclick="window.print()">Download Skill Report</button>
          <a href="../Opportunity_Interface/index.html" class="btn btn-gold" style="text-decoration: none; padding: 10px 16px; background: #f2ca50; color: #000; font-weight: bold; border-radius: 8px;">Apply for Matching Opportunities</a>
          <button class="btn ghost" type="button" id="retakeAssessmentBtn">Retake Assessment</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('retakeAssessmentBtn')?.addEventListener('click', () => {
    step = 1;
    quizStarted = false;
    selectedDomains.clear();
    currentQuestionIndex = 0;
    userAnswers = {};
    renderLanding();
  });
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderRail() {
  const items = ['Diagnostic Quiz', 'Skill Benchmark'];
  rail.innerHTML = items.map((label, index) => {
    const number = index + 1;
    const status = index + 1 === step ? 'active' : index + 1 < step ? 'done' : '';
    return `<div class="module ${status}"><span class="mnum">${number}.</span>${label}</div>`;
  }).join('');
}

function render() {
  renderRail();
  if (step === 1 && !quizStarted) {
    renderLanding();
    return;
  }

  if (step === 1 && quizStarted) {
    renderAssessment();
    return;
  }

  renderReport();
}

render();