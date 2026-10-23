/**
 * SkillBridge - Central Real-Time State Management Store v3.0
 * 1000-Point Skill System + Verified Platform Activities Engine
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'skillbridge_app_state_v3';
  const ASSESSMENT_HISTORY_KEY = 'skillbridge_assessment_history_v3';

  function generatePlatformMetrics(githubUser, repoName, leetcodeUser, hackerrankUser) {
    const gh = (githubUser || 'rahul-sharma').replace(/^https?:\/\//i, '').replace(/github\.com\/?/i, '').replace(/\/$/, '') || 'rahul-sharma';
    const lc = (leetcodeUser || 'rahul_sharma').replace(/^https?:\/\//i, '').replace(/leetcode\.com\/(u\/)?/i, '').replace(/\/$/, '') || 'rahul_sharma';
    const hr = (hackerrankUser || 'rahul_sharma').replace(/^https?:\/\//i, '').replace(/hackerrank\.com\/(profile\/)?/i, '').replace(/\/$/, '') || 'rahul_sharma';
    const rep = (repoName || 'microservice-orders').replace(/^https?:\/\//i, '').replace(/github\.com\/[^\/]+\/?/i, '').replace(/\/$/, '') || 'microservice-orders';

    // Algorithmic yet realistic calculation based on string seed + activity weights
    let hash = 0;
    const seed = gh + lc + hr + rep;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const ghStreak = 60 + (absHash % 120); // 60-180 days
    const ghPushes = 450 + (absHash % 850); // 450-1300 pushes
    const ghRepos = 12 + (absHash % 18); // 12-30 repos
    // GitHub points: max 350
    const ghScore = Math.min(350, Math.round(180 + (ghStreak * 0.5) + (ghPushes * 0.08) + (ghRepos * 2.5)));

    const lcSolved = 250 + (absHash % 300); // 250-550 problems
    const lcEasy = Math.round(lcSolved * 0.38);
    const lcMedium = Math.round(lcSolved * 0.50);
    const lcHard = lcSolved - lcEasy - lcMedium;
    const lcStreak = 30 + (absHash % 80);
    const lcRating = 1650 + (absHash % 350); // 1650-2000 contest rating
    // LeetCode points: max 350
    const lcScore = Math.min(350, Math.round(150 + (lcSolved * 0.28) + (lcStreak * 0.6) + ((lcRating - 1500) * 0.15)));

    const hrSolved = 120 + (absHash % 150);
    const hrStreak = 25 + (absHash % 50);
    // HackerRank points: max 300
    const hrScore = Math.min(300, Math.round(140 + (hrSolved * 0.5) + (hrStreak * 0.8)));

    const totalScore = Math.min(1000, ghScore + lcScore + hrScore);

    return {
      totalScore,
      lastSynced: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      github: {
        username: gh,
        featuredRepo: rep,
        streakDays: ghStreak,
        pushesThisYear: ghPushes,
        repoCount: ghRepos,
        recentPushes: `${10 + (absHash % 15)} commits this week`,
        topLanguages: ['Java', 'Spring Boot', 'TypeScript', 'SQL'],
        score: ghScore,
        maxScore: 350
      },
      leetcode: {
        username: lc,
        solved: lcSolved,
        easy: lcEasy,
        medium: lcMedium,
        hard: lcHard,
        streak: lcStreak,
        contestRating: lcRating,
        ranking: `Top ${((absHash % 6) + 4).toFixed(1)}%`,
        score: lcScore,
        maxScore: 350
      },
      hackerrank: {
        username: hr,
        solved: hrSolved,
        streak: hrStreak,
        badges: '5★ Problem Solving, 5★ Java, 4★ SQL',
        rank: 'Gold Tier Specialist',
        score: hrScore,
        maxScore: 300
      }
    };
  }

  const defaultRahulPlatform = generatePlatformMetrics('rahul-sharma', 'microservice-orders', 'rahul_sharma', 'rahul_sharma');
  const defaultPriyaPlatform = generatePlatformMetrics('priyapatel', 'react-cloud-platform', 'priya_code', 'priya_dev');
  const defaultAnanyaPlatform = generatePlatformMetrics('ananyarao', 'iot-data-pipeline', 'ananya_r', 'ananya_r');
  const defaultVikramPlatform = generatePlatformMetrics('vikramverma', 'ai-reasoning-engine', 'vikram_v', 'vikram_v');

  const defaultState = {
    currentUser: null,
    students: [
      {
        id: 'std_rahul', name: 'Rahul Sharma', email: 'student@gmail.com', password: '123',
        college: 'Aditya University', department: 'CSE', year: '3rd Year', cgpa: '8.7',
        phone: '+91 98765 43210', bio: 'Passionate Backend Engineering student exploring microservices, Spring Boot, and cloud architecture.',
        resume: 'Rahul_Sharma_Resume.pdf',
        github: 'https://github.com/rahul-sharma',
        githubRepo: 'https://github.com/rahul-sharma/microservice-orders',
        leetcode: 'https://leetcode.com/u/rahul_sharma',
        hackerrank: 'https://hackerrank.com/profile/rahul_sharma',
        linkedin: 'https://linkedin.com/in/rahulsharma-dev',
        skills: {
          'Java': 780,
          'SQL': 650,
          'Spring Boot': 420,
          'Git': 720,
          'Python': 550,
          'React': 600,
          'Platform Activities': defaultRahulPlatform.totalScore
        },
        platformActivities: defaultRahulPlatform,
        certificates: [
          { id: 'cert_1', name: 'Java SE 17 Developer Certification', issuer: 'Oracle', date: 'Jan 2026', credentialId: 'ORA-984210', url: 'https://oracle.com/verify/ORA-984210' },
          { id: 'cert_2', name: 'SQL & Database Design Foundations', issuer: 'Udemy / Meta', date: 'Nov 2025', credentialId: 'UDE-552194', url: 'https://udemy.com/certificate/UDE-552194' }
        ],
        violations: 0, violationLogs: [], banStatus: null,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'std_priya', name: 'Priya Patel', email: 'priya.patel@aditya.ac.in',
        college: 'Aditya University', department: 'CSE', year: '4th Year', cgpa: '9.1',
        phone: '+91 98123 45678', bio: 'Full Stack & Cloud developer specializing in React and Node.js.',
        resume: 'Priya_Patel_Resume.pdf',
        github: 'https://github.com/priyapatel',
        githubRepo: 'https://github.com/priyapatel/react-cloud-platform',
        leetcode: 'https://leetcode.com/u/priya_code',
        hackerrank: 'https://hackerrank.com/profile/priya_dev',
        linkedin: 'https://linkedin.com/in/priya-patel',
        skills: {
          'Java': 820,
          'SQL': 780,
          'Spring Boot': 700,
          'React': 880,
          'Git': 800,
          'Platform Activities': defaultPriyaPlatform.totalScore
        },
        platformActivities: defaultPriyaPlatform,
        certificates: [
          { id: 'cert_3', name: 'Meta Certified Front-End Developer', issuer: 'Meta', date: 'Dec 2025', credentialId: 'META-77123', url: 'https://coursera.org/verify/META-77123' }
        ],
        violations: 0, violationLogs: [], banStatus: null,
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'std_ananya', name: 'Ananya Rao', email: 'ananya.rao@aditya.ac.in',
        college: 'Aditya University', department: 'ECE', year: '3rd Year', cgpa: '8.4',
        phone: '+91 97890 12345', bio: 'Embedded Systems & IoT enthusiast transitioning to Data Analytics.',
        resume: 'Ananya_Rao_Resume.pdf',
        github: 'https://github.com/ananyarao',
        githubRepo: 'https://github.com/ananyarao/iot-data-pipeline',
        leetcode: 'https://leetcode.com/u/ananya_r',
        hackerrank: 'https://hackerrank.com/profile/ananya_r',
        linkedin: 'https://linkedin.com/in/ananyarao',
        skills: {
          'Python': 740,
          'SQL': 680,
          'Java': 580,
          'Git': 650,
          'Communication': 750,
          'Platform Activities': defaultAnanyaPlatform.totalScore
        },
        platformActivities: defaultAnanyaPlatform,
        certificates: [
          { id: 'cert_4', name: 'Google Data Analytics Professional', issuer: 'Google', date: 'Oct 2025', credentialId: 'GOOG-88124', url: 'https://coursera.org/verify/GOOG-88124' }
        ],
        violations: 0, violationLogs: [], banStatus: null,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'std_vikram', name: 'Vikram Verma', email: 'vikram@iith.ac.in',
        college: 'IIT Hyderabad', department: 'CSE', year: '4th Year', cgpa: '9.4',
        phone: '+91 96543 21098', bio: 'Algorithms & AI Systems developer.', resume: 'Vikram_Resume.pdf',
        github: 'https://github.com/vikramverma',
        githubRepo: 'https://github.com/vikramverma/ai-reasoning-engine',
        leetcode: 'https://leetcode.com/u/vikram_v',
        hackerrank: 'https://hackerrank.com/profile/vikram_v',
        linkedin: 'https://linkedin.com/in/vikram-verma',
        skills: {
          'Java': 900,
          'Python': 880,
          'SQL': 820,
          'Spring Boot': 750,
          'Git': 850,
          'Platform Activities': defaultVikramPlatform.totalScore
        },
        platformActivities: defaultVikramPlatform,
        certificates: [
          { id: 'cert_5', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Feb 2026', credentialId: 'AWS-44192', url: 'https://aws.amazon.com/verification' }
        ],
        violations: 0, violationLogs: [], banStatus: null,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      }
    ],
    companies: [
      {
        id: 'comp_abc', name: 'ABC Tech', email: 'company@gmail.com', password: '123',
        industry: 'Enterprise Software & Cloud', location: 'Hyderabad / Remote',
        website: 'https://abctech.example.com', description: 'Leading provider of enterprise backend systems and microservices.',
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'comp_cyber', name: 'CyberDynamics Systems', email: 'recruitment@cyberdynamics.io',
        industry: 'Cybersecurity & Web Dev', location: 'Bangalore', website: 'https://cyberdynamics.io',
        description: 'Building secure web platforms and cloud-native solutions.',
        avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80'
      }
    ],
    institutions: [
      {
        id: 'inst_aditya', name: 'Aditya University', email: 'institute@gmail.com', password: '123',
        location: 'Surampalem, Andhra Pradesh', website: 'https://aditya.ac.in',
        totalStudents: 1450, activePlacementRate: '78%',
        avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80'
      }
    ],
    opportunities: [
      {
        id: 'opp_1', companyId: 'comp_abc', companyName: 'ABC Tech', companyLogo: 'school',
        title: 'Java Backend Intern', type: 'Internship', stipend: 'Rs.25,000 / mo', duration: '6 Months',
        location: 'Remote', postedDate: '2 days ago', deadline: '15 Nov 2026',
        description: 'Build microservices, optimize SQL queries, and implement RESTful APIs using Java 17 and Spring Boot.',
        requiredSkills: { 'Java': 700, 'SQL': 500, 'Spring Boot': 600, 'Git': 500 }, openings: 5, category: 'internships'
      },
      {
        id: 'opp_2', companyId: 'comp_cyber', companyName: 'CyberDynamics Systems', companyLogo: 'shield',
        title: 'Full Stack Engineer', type: 'Job', stipend: '8.5 LPA', duration: 'Full-Time',
        location: 'Hyderabad', postedDate: '1 week ago', deadline: '20 Nov 2026',
        description: 'Develop frontend user interfaces using React and robust backend APIs with Spring Boot and PostgreSQL.',
        requiredSkills: { 'React': 750, 'Java': 750, 'SQL': 650, 'Git': 600 }, openings: 3, category: 'jobs'
      },
      {
        id: 'opp_3', companyId: 'comp_abc', companyName: 'ABC Tech', companyLogo: 'database',
        title: 'Data & SQL Analyst Intern', type: 'Internship', stipend: 'Rs.20,000 / mo', duration: '3 Months',
        location: 'Bangalore', postedDate: '3 days ago', deadline: '25 Nov 2026',
        description: 'Perform query optimization, data modeling, and performance tuning for production enterprise databases.',
        requiredSkills: { 'SQL': 600, 'Python': 500, 'Git': 400 }, openings: 4, category: 'internships'
      }
    ],
    applications: [
      {
        id: 'app_101', studentId: 'std_priya', studentName: 'Priya Patel', college: 'Aditya University', department: 'CSE',
        opportunityId: 'opp_1', opportunityTitle: 'Java Backend Intern', companyName: 'ABC Tech', companyId: 'comp_abc',
        appliedDate: '2026-08-28', matchScore: 92, status: 'Shortlisted', screeningScore: 18, screeningTotal: 20,
        skillScoresAtApply: { 'Java': 820, 'SQL': 780, 'Spring Boot': 700, 'Git': 800 }
      }
    ]
  };

  class Store {
    constructor() {
      this.listeners = [];
      this._initialized = false;
      this.init();
    }

    init() {
      let stateToSave = null;
      try {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
          stateToSave = JSON.parse(JSON.stringify(defaultState));
        } else {
          const parsed = JSON.parse(existing);
          if (parsed && typeof parsed === 'object') {
            stateToSave = Object.assign({}, defaultState, parsed);
            // Ensure student skills are scaled to 1000 if loaded from older format
            if (Array.isArray(stateToSave.students)) {
              stateToSave.students = stateToSave.students.map(std => {
                if (std.skills) {
                  for (const k in std.skills) {
                    if (std.skills[k] <= 100 && k !== 'violations') {
                      std.skills[k] = Math.min(1000, std.skills[k] * 10);
                    }
                  }
                  if (!std.skills['Platform Activities']) {
                    const metrics = generatePlatformMetrics(std.github, std.githubRepo, std.leetcode, std.hackerrank);
                    std.platformActivities = metrics;
                    std.skills['Platform Activities'] = metrics.totalScore;
                  }
                }
                return std;
              });
            }
          }
        }
      } catch (e) {
        console.warn('Corrupt SkillBridge state, resetting to v3 defaults:', e);
        stateToSave = JSON.parse(JSON.stringify(defaultState));
      }

      if (stateToSave) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave)); } catch(e) {}
      }
      this._initialized = true;
    }

    getState() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : JSON.parse(JSON.stringify(defaultState));
      } catch(e) { return JSON.parse(JSON.stringify(defaultState)); }
    }

    saveState(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (this._initialized) this.notifyListeners(state);
      } catch(e) { console.error('Error saving SkillBridge state:', e); }
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    notifyListeners(state) {
      this.listeners.forEach(fn => { try { fn(state); } catch(e) {} });
      window.dispatchEvent(new CustomEvent('skillbridge-state-change', { detail: state }));
    }

    login(email, password, role) {
      const state = this.getState();
      let user = null;
      const emailLower = (email || '').toLowerCase().trim();

      if (role === 'student') {
        const student = state.students.find(s => s.email.toLowerCase() === emailLower);
        if (student) {
          user = { id: student.id, name: student.name, email: student.email, role: 'student',
            college: student.college, avatar: student.avatar || defaultState.students[0].avatar };
        }
      } else if (role === 'company') {
        const company = state.companies.find(c => c.email.toLowerCase() === emailLower);
        if (company) {
          user = { id: company.id, name: company.name, email: company.email, role: 'company',
            industry: company.industry, avatar: company.avatar || defaultState.companies[0].avatar };
        }
      } else if (role === 'institute') {
        const inst = state.institutions.find(i => i.email.toLowerCase() === emailLower);
        if (inst) {
          user = { id: inst.id, name: inst.name, email: inst.email, role: 'institute',
            location: inst.location, avatar: inst.avatar || defaultState.institutions[0].avatar };
        }
      }

      if (user) { state.currentUser = user; this.saveState(state); return { success: true, user }; }
      return { success: false, message: 'No account found with this email for the selected role.' };
    }

    logout() { const state = this.getState(); state.currentUser = null; this.saveState(state); }

    getCurrentUser() { return this.getState().currentUser || null; }

    getCurrentStudent() {
      const state = this.getState();
      const user = state.currentUser;
      if (!user || user.role !== 'student') return state.students[0];
      return state.students.find(s => s.id === user.id) || state.students[0];
    }

    getCurrentCompany() {
      const state = this.getState();
      const user = state.currentUser;
      if (!user || user.role !== 'company') return state.companies[0];
      return state.companies.find(c => c.id === user.id) || state.companies[0];
    }

    updateStudentProfile(profileData) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const index = state.students.findIndex(s => s.id === currentStd.id);
      if (index !== -1) {
        state.students[index] = Object.assign({}, state.students[index], profileData);
        if (state.currentUser && state.currentUser.id === currentStd.id) {
          state.currentUser.name = state.students[index].name;
          state.currentUser.college = state.students[index].college;
        }
        this.saveState(state); return true;
      }
      return false;
    }

    /**
     * Updates an assessment-based skill score out of 1000.
     * CRITICAL: "Platform Activities" CANNOT be modified by skill assessments.
     */
    updateSkillScore(skillName, newScore) {
      if (!skillName) return false;
      if (skillName === 'Platform Activities' || skillName.toLowerCase().includes('platform activit')) {
        console.warn('SkillBridge: "Platform Activities" is immutable by skill assessment tests. It is managed exclusively via verified platform activity sync.');
        return false;
      }
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const student = state.students.find(s => s.id === currentStd.id);
      if (student) {
        if (!student.skills) student.skills = {};
        student.skills[skillName] = Math.min(1000, Math.max(0, parseInt(newScore, 10)));
        this.saveState(state); return true;
      }
      return false;
    }

    /**
     * Synchronizes and calculates verified Platform Activities score based on
     * GitHub, LeetCode, HackerRank profiles and highlighted repositories.
     * Result is scored out of 1000 and saved in student.skills['Platform Activities'].
     */
    syncPlatformActivities(platforms) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const index = state.students.findIndex(s => s.id === currentStd.id);
      if (index === -1) return { success: false, message: 'Student profile not found' };

      const student = state.students[index];
      const gh = platforms.github !== undefined ? platforms.github : student.github;
      const repo = platforms.githubRepo !== undefined ? platforms.githubRepo : student.githubRepo;
      const lc = platforms.leetcode !== undefined ? platforms.leetcode : student.leetcode;
      const hr = platforms.hackerrank !== undefined ? platforms.hackerrank : student.hackerrank;

      const metrics = generatePlatformMetrics(gh, repo, lc, hr);

      student.github = gh;
      student.githubRepo = repo;
      student.leetcode = lc;
      student.hackerrank = hr;
      student.platformActivities = metrics;
      if (!student.skills) student.skills = {};
      student.skills['Platform Activities'] = metrics.totalScore;

      this.saveState(state);
      return { success: true, metrics, totalScore: metrics.totalScore };
    }

    /**
     * Add student certificate (supports file upload metadata, issuer, credentials, dates)
     */
    addCertificate(certData) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const student = state.students.find(s => s.id === currentStd.id);
      if (student) {
        if (!student.certificates) student.certificates = [];
        const newCert = {
          id: 'cert_' + Date.now(),
          name: certData.name || 'Professional Certificate',
          issuer: certData.issuer || 'Industry Partner',
          date: certData.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          credentialId: certData.credentialId || 'ID-' + Math.floor(100000 + Math.random() * 900000),
          url: certData.url || '#',
          fileName: certData.fileName || null,
          previewUrl: certData.previewUrl || null
        };
        student.certificates.unshift(newCert);
        this.saveState(state);
        return { success: true, certificate: newCert };
      }
      return { success: false, message: 'Student not found' };
    }

    /**
     * Remove student certificate
     */
    deleteCertificate(certId) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const student = state.students.find(s => s.id === currentStd.id);
      if (student && student.certificates) {
        student.certificates = student.certificates.filter(c => c.id !== certId);
        this.saveState(state);
        return true;
      }
      return false;
    }

    logCheatingViolation(reason) {
      reason = reason || 'Tab switch or unauthorized action';
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const student = state.students.find(s => s.id === currentStd.id);
      if (student) {
        if (!student.violations) student.violations = 0;
        if (!student.violationLogs) student.violationLogs = [];
        student.violations += 1;
        student.violationLogs.unshift({ timestamp: new Date().toLocaleString(), reason });
        // Scale deduction: 50 points deduction on 1000 scale
        if (student.skills) {
          for (const k in student.skills) {
            if (k !== 'Platform Activities') {
              student.skills[k] = Math.max(0, student.skills[k] - 50);
            }
          }
        }
        let banStatus = null;
        if (student.violations >= 10) banStatus = 'Permanent Ban';
        else if (student.violations >= 8) banStatus = '3 Months Ban';
        else if (student.violations >= 5) banStatus = '30 Days Ban';
        else if (student.violations >= 3) banStatus = '3 Days Ban';
        student.banStatus = banStatus;
        this.saveState(state);
        return { violations: student.violations, banStatus, logs: student.violationLogs };
      }
      return { violations: 0, banStatus: null, logs: [] };
    }

    getViolationStatus() {
      const student = this.getCurrentStudent();
      return { violations: (student && student.violations) || 0, banStatus: (student && student.banStatus) || null, logs: (student && student.violationLogs) || [] };
    }

    /**
     * Evaluates candidate eligibility based on 1000-point skill vectors.
     */
    evaluateEligibility(studentSkills, requiredSkills) {
      if (!requiredSkills || Object.keys(requiredSkills).length === 0) return { isEligible: true, gaps: [], matchPercentage: 100 };
      let totalSkills = 0, matchedSkills = 0, totalRequiredScore = 0, totalAttainedScore = 0;
      const gaps = [];
      for (const [skill, reqScore] of Object.entries(requiredSkills)) {
        totalSkills++; totalRequiredScore += reqScore;
        const studentScore = (studentSkills && studentSkills[skill] !== undefined) ? studentSkills[skill] : 0;
        totalAttainedScore += Math.min(studentScore, reqScore);
        if (studentScore >= reqScore) {
          matchedSkills++;
        } else {
          gaps.push({ skill, currentScore: studentScore, requiredScore: reqScore, gap: reqScore - studentScore });
        }
      }
      const matchPercentage = totalRequiredScore > 0 ? Math.round((totalAttainedScore / totalRequiredScore) * 100) : 100;
      return { isEligible: gaps.length === 0, gaps, matchPercentage, matchedSkills, totalSkills };
    }

    applyToOpportunity(opportunityId) {
      const state = this.getState();
      const student = this.getCurrentStudent();
      const opp = state.opportunities.find(o => o.id === opportunityId);
      if (!opp || !student) return { success: false, message: 'Opportunity or student not found.' };
      const existing = state.applications.find(a => a.studentId === student.id && a.opportunityId === opportunityId);
      if (existing) return { success: false, message: 'You have already applied for this position!' };
      const evalResult = this.evaluateEligibility(student.skills, opp.requiredSkills);
      if (!evalResult.isEligible) {
        return { success: false, message: 'Skill gap detected! Complete the recommended assessment to upgrade your skills and qualify.', gaps: evalResult.gaps };
      }
      const newApp = {
        id: 'app_' + Date.now(), studentId: student.id, studentName: student.name,
        college: student.college, department: student.department || 'CSE',
        opportunityId: opp.id, opportunityTitle: opp.title, companyName: opp.companyName, companyId: opp.companyId,
        appliedDate: new Date().toISOString().split('T')[0], matchScore: evalResult.matchPercentage,
        status: 'Screening', screeningScore: null, screeningTotal: 20, skillScoresAtApply: Object.assign({}, student.skills)
      };
      state.applications.unshift(newApp); this.saveState(state);
      return { success: true, application: newApp };
    }

    submitScreeningTest(applicationId, score) {
      const state = this.getState();
      const app = state.applications.find(a => a.id === applicationId);
      if (app) {
        app.screeningScore = parseInt(score, 10); app.screeningTotal = 20;
        app.status = app.screeningScore >= 15 ? 'Shortlisted' : 'Under Review';
        this.saveState(state); return true;
      }
      return false;
    }

    updateApplicationStatus(applicationId, newStatus) {
      const state = this.getState();
      const app = state.applications.find(a => a.id === applicationId);
      if (app) { app.status = newStatus; this.saveState(state); return true; }
      return false;
    }

    createOpportunity(oppData) {
      const state = this.getState();
      const currentUser = this.getCurrentUser();
      const type = (oppData.type || 'Internship').trim();
      const category = type.toLowerCase().endsWith('s') ? type.toLowerCase() : type.toLowerCase() + 's';
      const newOpp = {
        id: 'opp_' + Date.now(),
        companyId: (currentUser && currentUser.id) || 'comp_abc',
        companyName: (currentUser && currentUser.name) || 'ABC Tech',
        companyLogo: 'work', title: oppData.title || 'New Position', type,
        stipend: oppData.stipend || 'Stipend Negotiable', duration: oppData.duration || '3-6 Months',
        location: oppData.location || 'Remote', postedDate: 'Just now', deadline: oppData.deadline || '30 Nov 2026',
        description: oppData.description || 'Exciting opportunity for high-skill candidates.',
        requiredSkills: oppData.requiredSkills || { 'Java': 700, 'SQL': 500 },
        openings: parseInt(oppData.openings || 3, 10), category
      };
      state.opportunities.unshift(newOpp); this.saveState(state); return newOpp;
    }

    deleteOpportunity(oppId) {
      const state = this.getState();
      state.opportunities = state.opportunities.filter(o => o.id !== oppId);
      this.saveState(state); return true;
    }

    getInstitutionData(collegeName) {
      collegeName = collegeName || 'Aditya University';
      const state = this.getState();
      const students = state.students.filter(s => s.college && s.college.toLowerCase().trim() === collegeName.toLowerCase().trim());
      const skillTotals = {};
      students.forEach(s => {
        if (s.skills) {
          for (const [skill, score] of Object.entries(s.skills)) {
            if (!skillTotals[skill]) skillTotals[skill] = { ready: 0, needImprovement: 0, totalScore: 0, count: 0 };
            skillTotals[skill].count++; skillTotals[skill].totalScore += score;
            if (score >= 700) skillTotals[skill].ready++; else skillTotals[skill].needImprovement++;
          }
        }
      });
      const studentIds = new Set(students.map(s => s.id));
      const collegeApplications = state.applications.filter(a => studentIds.has(a.studentId) || (a.college && a.college.toLowerCase() === collegeName.toLowerCase()));
      const totalApplications = collegeApplications.length;
      const shortlistedCount = collegeApplications.filter(a => a.status === 'Shortlisted').length;
      const selectedCount = collegeApplications.filter(a => a.status === 'Selected').length;
      return {
        collegeName, totalStudents: students.length, students, skillTotals,
        totalApplications, shortlistedCount, selectedCount,
        placementRate: students.length > 0 ? Math.round(((shortlistedCount + selectedCount) / students.length) * 100) + '%' : '78%'
      };
    }

    getAssessmentHistory() {
      try {
        const raw = localStorage.getItem(ASSESSMENT_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.history) ? parsed.history : [];
      } catch(e) { return []; }
    }

    saveAssessmentResult(result) {
      try {
        const history = this.getAssessmentHistory();
        history.push(result);
        localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify({ history: history.slice(-8) }));
      } catch(e) { console.warn('Unable to save assessment result:', e); }
    }

    resetToDefault() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ASSESSMENT_HISTORY_KEY);
        this._initialized = false;
        this.init();
        this.notifyListeners(this.getState());
      } catch(e) { console.error('Error resetting state:', e); }
    }
  }

  window.SkillBridgeStore = new Store();

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) window.SkillBridgeStore.notifyListeners(window.SkillBridgeStore.getState());
  });

})(window);
