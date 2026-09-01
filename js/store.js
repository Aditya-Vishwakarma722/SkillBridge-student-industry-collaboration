/**
 * SkillBridge - Central Real-Time State Management Store
 * Manages reactive data across Student, Company, and Institute modules via localStorage and DOM event sync.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'skillbridge_app_state_v1';

  // Seed Data Initializer
  const defaultState = {
    currentUser: {
      id: 'std_rahul',
      name: 'Rahul Sharma',
      email: 'student@gmail.com',
      role: 'student', // 'student' | 'company' | 'institute'
      college: 'Aditya University',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
    },
    students: [
      {
        id: 'std_rahul',
        name: 'Rahul Sharma',
        email: 'student@gmail.com',
        college: 'Aditya University',
        department: 'CSE',
        year: '3rd Year',
        cgpa: '8.7',
        phone: '+91 98765 43210',
        bio: 'Passionate Backend Engineering student exploring microservices, Spring Boot, and cloud architecture.',
        resume: 'Rahul_Sharma_Resume.pdf',
        github: 'github.com/rahul-sharma',
        linkedin: 'linkedin.com/in/rahulsharma-dev',
        skills: {
          'Java': 78,
          'SQL': 65,
          'Spring Boot': 42,
          'Git': 72,
          'Python': 55,
          'React': 60
        },
        certificates: [
          { name: 'Java SE 17 Developer Certification', issuer: 'Oracle', date: 'Jan 2026' },
          { name: 'SQL & Database Design Foundations', issuer: 'Udemy', date: 'Nov 2025' }
        ]
      },
      {
        id: 'std_priya',
        name: 'Priya Patel',
        email: 'priya.patel@aditya.ac.in',
        college: 'Aditya University',
        department: 'CSE',
        year: '4th Year',
        cgpa: '9.1',
        phone: '+91 98123 45678',
        bio: 'Full Stack & Cloud developer specializing in React and Node.js.',
        resume: 'Priya_Patel_Resume.pdf',
        skills: {
          'Java': 82,
          'SQL': 78,
          'Spring Boot': 70,
          'React': 88,
          'Git': 80
        }
      },
      {
        id: 'std_ananya',
        name: 'Ananya Rao',
        email: 'ananya.rao@aditya.ac.in',
        college: 'Aditya University',
        department: 'ECE',
        year: '3rd Year',
        cgpa: '8.4',
        phone: '+91 97890 12345',
        bio: 'Embedded Systems & IoT enthusiast transitioning to Data Analytics.',
        resume: 'Ananya_Rao_Resume.pdf',
        skills: {
          'Python': 74,
          'SQL': 68,
          'Java': 58,
          'Git': 65,
          'Communication': 75
        }
      },
      {
        id: 'std_vikram',
        name: 'Vikram Verma',
        email: 'vikram@iith.ac.in',
        college: 'IIT Hyderabad',
        department: 'CSE',
        year: '4th Year',
        cgpa: '9.4',
        phone: '+91 96543 21098',
        bio: 'Algorithms & AI Systems developer.',
        resume: 'Vikram_Resume.pdf',
        skills: {
          'Java': 90,
          'Python': 88,
          'SQL': 82,
          'Spring Boot': 75,
          'Git': 85
        }
      }
    ],
    companies: [
      {
        id: 'comp_abc',
        name: 'ABC Tech',
        email: 'company@gmail.com',
        industry: 'Enterprise Software & Cloud',
        location: 'Hyderabad / Remote',
        website: 'https://abctech.example.com',
        description: 'Leading provider of enterprise backend systems and microservices.'
      },
      {
        id: 'comp_cyber',
        name: 'CyberDynamics Systems',
        email: 'recruitment@cyberdynamics.io',
        industry: 'Cybersecurity & Web Dev',
        location: 'Bangalore',
        website: 'https://cyberdynamics.io',
        description: 'Building secure web platforms and cloud-native solutions.'
      }
    ],
    institutions: [
      {
        id: 'inst_aditya',
        name: 'Aditya University',
        email: 'institute@gmail.com',
        location: 'Surampalem, Andhra Pradesh',
        website: 'https://aditya.ac.in',
        totalStudents: 1450,
        activePlacementRate: '78%'
      }
    ],
    opportunities: [
      {
        id: 'opp_1',
        companyId: 'comp_abc',
        companyName: 'ABC Tech',
        companyLogo: 'school',
        title: 'Java Backend Intern',
        type: 'Internship', // 'Internship' | 'Job' | 'Workshop'
        stipend: '₹25,000 / mo',
        duration: '6 Months',
        location: 'Remote',
        postedDate: '2 days ago',
        deadline: '15 Sep 2026',
        description: 'Build microservices, optimize SQL queries, and implement RESTful APIs using Java 17 and Spring Boot.',
        requiredSkills: {
          'Java': 70,
          'SQL': 50,
          'Spring Boot': 60,
          'Git': 50
        },
        openings: 5,
        category: 'internships'
      },
      {
        id: 'opp_2',
        companyId: 'comp_cyber',
        companyName: 'CyberDynamics Systems',
        companyLogo: 'shield',
        title: 'Full Stack Engineer',
        type: 'Job',
        stipend: '8.5 LPA',
        duration: 'Full-Time',
        location: 'Hyderabad',
        postedDate: '1 week ago',
        deadline: '20 Sep 2026',
        description: 'Develop frontend user interfaces using React and robust backend APIs with Spring Boot and PostgreSQL.',
        requiredSkills: {
          'React': 75,
          'Java': 75,
          'SQL': 65,
          'Git': 60
        },
        openings: 3,
        category: 'jobs'
      },
      {
        id: 'opp_3',
        companyId: 'comp_abc',
        companyName: 'ABC Tech',
        companyLogo: 'database',
        title: 'Data & SQL Analyst Intern',
        type: 'Internship',
        stipend: '₹20,000 / mo',
        duration: '3 Months',
        location: 'Bangalore',
        postedDate: '3 days ago',
        deadline: '25 Sep 2026',
        description: 'Perform query optimization, data modeling, and performance tuning for production enterprise databases.',
        requiredSkills: {
          'SQL': 60,
          'Python': 50,
          'Git': 40
        },
        openings: 4,
        category: 'internships'
      }
    ],
    applications: [
      {
        id: 'app_101',
        studentId: 'std_priya',
        studentName: 'Priya Patel',
        college: 'Aditya University',
        opportunityId: 'opp_1',
        opportunityTitle: 'Java Backend Intern',
        companyName: 'ABC Tech',
        appliedDate: '2026-08-28',
        matchScore: 92,
        status: 'Shortlisted', // 'Applied' | 'Under Review' | 'Screening' | 'Shortlisted' | 'Selected' | 'Rejected'
        screeningScore: 18,
        screeningTotal: 20,
        skillScoresAtApply: { 'Java': 82, 'SQL': 78, 'Spring Boot': 70, 'Git': 80 }
      }
    ]
  };

  class Store {
    constructor() {
      this.listeners = [];
      this.init();
    }

    init() {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        this.saveState(defaultState);
      }
    }

    getState() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : defaultState;
      } catch (e) {
        console.error('Error reading SkillBridge state:', e);
        return defaultState;
      }
    }

    saveState(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        this.notifyListeners(state);
      } catch (e) {
        console.error('Error saving SkillBridge state:', e);
      }
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notifyListeners(state) {
      this.listeners.forEach(fn => fn(state));
      window.dispatchEvent(new CustomEvent('skillbridge-state-change', { detail: state }));
    }

    // Role Auth
    login(email, password, role) {
      const state = this.getState();
      let user = null;

      if (email === 'student@gmail.com' || role === 'student') {
        const student = state.students.find(s => s.email === email) || state.students[0];
        user = {
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          college: student.college,
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
        };
      } else if (email === 'company@gmail.com' || role === 'company') {
        const company = state.companies.find(c => c.email === email) || state.companies[0];
        user = {
          id: company.id,
          name: company.name,
          email: company.email,
          role: 'company',
          industry: company.industry,
          avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'
        };
      } else if (email === 'institute@gmail.com' || role === 'institute') {
        const inst = state.institutions.find(i => i.email === email) || state.institutions[0];
        user = {
          id: inst.id,
          name: inst.name,
          email: inst.email,
          role: 'institute',
          location: inst.location,
          avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80'
        };
      }

      if (user) {
        state.currentUser = user;
        this.saveState(state);
        return { success: true, user };
      }
      return { success: false, message: 'Invalid credentials' };
    }

    logout() {
      const state = this.getState();
      state.currentUser = null;
      this.saveState(state);
    }

    getCurrentUser() {
      return this.getState().currentUser || defaultState.currentUser;
    }

    getCurrentStudent() {
      const state = this.getState();
      const user = state.currentUser;
      if (!user || user.role !== 'student') {
        return state.students[0];
      }
      return state.students.find(s => s.id === user.id) || state.students[0];
    }

    // Student Profile Operations
    updateStudentProfile(profileData) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const index = state.students.findIndex(s => s.id === currentStd.id);

      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...profileData };
        if (state.currentUser && state.currentUser.id === currentStd.id) {
          state.currentUser.name = state.students[index].name;
          state.currentUser.college = state.students[index].college;
        }
        this.saveState(state);
        return true;
      }
      return false;
    }

    // Skill Assessment & Re-assessment Operations
    updateSkillScore(skillName, newScore) {
      const state = this.getState();
      const currentStd = this.getCurrentStudent();
      const student = state.students.find(s => s.id === currentStd.id);

      if (student) {
        if (!student.skills) student.skills = {};
        student.skills[skillName] = Math.min(100, Math.max(0, parseInt(newScore, 10)));
        this.saveState(state);
        return true;
      }
      return false;
    }

    // Skill Gap & Eligibility Calculation Engine
    evaluateEligibility(studentSkills, requiredSkills) {
      if (!requiredSkills || Object.keys(requiredSkills).length === 0) {
        return { isEligible: true, gaps: [], matchPercentage: 100 };
      }

      let totalSkills = 0;
      let matchedSkills = 0;
      let totalRequiredScore = 0;
      let totalAttainedScore = 0;
      const gaps = [];

      for (const [skill, reqScore] of Object.entries(requiredSkills)) {
        totalSkills++;
        totalRequiredScore += reqScore;
        const studentScore = (studentSkills && studentSkills[skill]) !== undefined ? studentSkills[skill] : 0;
        totalAttainedScore += Math.min(studentScore, reqScore);

        if (studentScore >= reqScore) {
          matchedSkills++;
        } else {
          gaps.push({
            skill,
            currentScore: studentScore,
            requiredScore: reqScore,
            gap: reqScore - studentScore
          });
        }
      }

      const matchPercentage = Math.round((totalAttainedScore / totalRequiredScore) * 100);
      const isEligible = gaps.length === 0;

      return {
        isEligible,
        gaps,
        matchPercentage,
        matchedSkills,
        totalSkills
      };
    }

    // Application Operations
    applyToOpportunity(opportunityId) {
      const state = this.getState();
      const student = this.getCurrentStudent();
      const opp = state.opportunities.find(o => o.id === opportunityId);

      if (!opp || !student) return { success: false, message: 'Opportunity or student not found' };

      // Check if already applied
      const existing = state.applications.find(a => a.studentId === student.id && a.opportunityId === opportunityId);
      if (existing) {
        return { success: false, message: 'You have already applied for this position!' };
      }

      // Check eligibility
      const evalResult = this.evaluateEligibility(student.skills, opp.requiredSkills);
      if (!evalResult.isEligible) {
        return {
          success: false,
          message: 'Skill gap detected! Please complete the recommended assessment to upgrade your skills.',
          gaps: evalResult.gaps
        };
      }

      const newApp = {
        id: 'app_' + Date.now(),
        studentId: student.id,
        studentName: student.name,
        college: student.college,
        department: student.department || 'CSE',
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        companyName: opp.companyName,
        appliedDate: new Date().toISOString().split('T')[0],
        matchScore: evalResult.matchPercentage,
        status: 'Screening', // Automatically proceeds to company screening step
        screeningScore: null,
        screeningTotal: 20,
        skillScoresAtApply: { ...student.skills }
      };

      state.applications.unshift(newApp);
      this.saveState(state);
      return { success: true, application: newApp };
    }

    submitScreeningTest(applicationId, score) {
      const state = this.getState();
      const app = state.applications.find(a => a.id === applicationId);

      if (app) {
        app.screeningScore = parseInt(score, 10);
        if (app.screeningScore >= 15) {
          app.status = 'Shortlisted';
        } else {
          app.status = 'Under Review';
        }
        this.saveState(state);
        return true;
      }
      return false;
    }

    updateApplicationStatus(applicationId, newStatus) {
      const state = this.getState();
      const app = state.applications.find(a => a.id === applicationId);

      if (app) {
        app.status = newStatus;
        this.saveState(state);
        return true;
      }
      return false;
    }

    createOpportunity(oppData) {
      const state = this.getState();
      const currentUser = this.getCurrentUser();
      const newOpp = {
        id: 'opp_' + Date.now(),
        companyId: currentUser.id || 'comp_abc',
        companyName: currentUser.name || 'ABC Tech',
        companyLogo: 'work',
        title: oppData.title,
        type: oppData.type || 'Internship',
        stipend: oppData.stipend || 'Stipend Negotiable',
        duration: oppData.duration || '3-6 Months',
        location: oppData.location || 'Remote',
        postedDate: 'Just now',
        deadline: oppData.deadline || '30 Oct 2026',
        description: oppData.description || 'Exciting opportunity for high-skill candidates.',
        requiredSkills: oppData.requiredSkills || { 'Java': 70, 'SQL': 50 },
        openings: parseInt(oppData.openings || 3, 10),
        category: (oppData.type || 'internships').toLowerCase()
      };

      state.opportunities.unshift(newOpp);
      this.saveState(state);
      return newOpp;
    }

    // Institution Analytics Engine
    getInstitutionData(collegeName = 'Aditya University') {
      const state = this.getState();
      const students = state.students.filter(s => s.college && s.college.toLowerCase().trim() === collegeName.toLowerCase().trim());
      
      // Calculate skill readiness breakdown
      const skillTotals = {};

      students.forEach(s => {
        if (s.skills) {
          for (const [skill, score] of Object.entries(s.skills)) {
            if (!skillTotals[skill]) {
              skillTotals[skill] = { ready: 0, needImprovement: 0, totalScore: 0, count: 0 };
            }
            skillTotals[skill].count++;
            skillTotals[skill].totalScore += score;
            if (score >= 70) {
              skillTotals[skill].ready++;
            } else {
              skillTotals[skill].needImprovement++;
            }
          }
        }
      });

      const studentIds = new Set(students.map(s => s.id));
      const collegeApplications = state.applications.filter(a => studentIds.has(a.studentId) || (a.college && a.college.toLowerCase() === collegeName.toLowerCase()));

      const totalApplications = collegeApplications.length;
      const shortlistedCount = collegeApplications.filter(a => a.status === 'Shortlisted').length;
      const selectedCount = collegeApplications.filter(a => a.status === 'Selected').length;

      return {
        collegeName,
        totalStudents: students.length,
        students,
        skillTotals,
        totalApplications,
        shortlistedCount,
        selectedCount,
        placementRate: students.length > 0 ? Math.round(((shortlistedCount + selectedCount) / students.length) * 100) + '%' : '78%'
      };
    }
  }

  // Create global singleton
  window.SkillBridgeStore = new Store();

  // Listen for storage changes across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      window.SkillBridgeStore.notifyListeners(window.SkillBridgeStore.getState());
    }
  });

})(window);
