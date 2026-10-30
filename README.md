# SkillBridge - Portal for Academic & Industry Collaboration

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Enterprise%20Edition-4F46E5?style=for-the-badge" alt="Enterprise Edition" />
  <img src="https://img.shields.io/badge/Theme-Smart%20Automation-059669?style=for-the-badge" alt="Theme: Smart Automation" />
  <img src="https://img.shields.io/badge/Architecture-Standardized%201000--Point%20Vector-7C3AED?style=for-the-badge" alt="1000-Point Vector" />
  <img src="https://img.shields.io/badge/Status-Fully%20Rebuilt%20%26%20Operational-10B981?style=for-the-badge" alt="Status: Operational" />
</p>

<p align="center">
  <strong>Standardized Skill Vectors &bull; Proctored Integrity Engine &bull; Corporate Matchmaking Gate &bull; Institutional Analytics</strong>
</p>

---

## 1. Executive Summary & Architecture Overview

**SkillBridge** is an enterprise-grade academic and industry collaboration platform engineered for transparent talent discovery and competency-based matching.

Traditional job portals rely on self-reported resumes and unverified keyword matching, leading to high noise, resume fraud, and severe mismatches between academic curricula and industry hiring thresholds.

SkillBridge solves this challenge with an automated, multi-stakeholder ecosystem:
1. **Standardized 1000-Point Skill Vector System**: Every technical competency (Java, SQL, Spring Boot, React, Python, Git, DSA, Cloud, etc.) is quantified on a normalized 0 to 1000 point scale calibrated through anti-cheated assessments and verified platform footprints.
2. **Academic Integrity & AI Proctoring Engine**: Enforces two-factor timers (visible exam countdown + background dwell tracker), real-time face orientation simulation, window-blur / tab-switch detection (-50 pt deduction per violation, auto-termination on 3 strikes), and copy-paste blocking.
3. **Automated Matchmaking Gate**: Direct 1-click eligibility calculation comparing candidate vectors against company-mandated minimum thresholds. If eligible, candidates take a proctored company screening test (&ge; 15/20) to deliver verified resumes directly to employers. If a deficit exists, an actionable point gap breakdown and curated learning sprint are generated.
4. **Institutional Analytics Console**: Academic placement cells track cohort competency distributions, department performance comparisons (CSE vs IT vs ECE), placement conversion rates, and student intervention requirements.
5. **Verifiable Credential Portfolio**: Tamper-proof, cryptographically verifiable certificate registry with unique credential identifiers.

---

## 2. Platform Architecture & Tri-Actor Workspaces

```
+-----------------------------------------------------------------------------------+
|                                SkillBridge Gateway                                |
|                 (index.html - Live Role Switcher & Pipeline Tour)                 |
+-----------------------------------------------------------------------------------+
             |                                 |                                 |
             v                                 v                                 v
+------------------------+        +------------------------+        +------------------------+
|   Student Workspace    |        |    Corporate Console   |        |   Institute Console    |
|   (Rahul Sharma)       |        |    (ABC Tech Corp)     |        | (Apex Inst of Tech)    |
+------------------------+        +------------------------+        +------------------------+
| - Skill Vector Matrix  |        | - Post Opportunity     |        | - Cohort Registry      |
| - Proctored Assessment |        | - Set Skill Thresholds |        | - Skill Gap Analytics  |
| - Activity Sync (Git)  |        | - Review Candidates    |        | - Department Benchmarks|
| - Matchmaking Catalog  |        | - 1-Click Shortlist    |        | - Placement Tracking   |
| - Screening Simulator  |        | - Release Offer Letters|        | - Academic Profiles    |
+------------------------+        +------------------------+        +------------------------+
             |                                 |                                 |
             +---------------------------------+---------------------------------+
                                               |
                                               v
                             +-----------------------------------+
                             |     Reactive Central Store        |
                             |   (js/store.js - Single Source)   |
                             +-----------------------------------+
```

---

## 3. Directory Structure

```text
SkillBridge/
├── index.html                               # Modern Portal Gateway & Evaluator Switcher
├── README.md                                # System Architecture & Workflow Documentation
├── Presentation.pptx                         # Platform Architecture & Idea Pitch Deck
├── Unique Ideas.txt                         # Innovative Feature Breakdown & Algorithms
│
├── css/
│   └── design-system.css                    # Modern Slate Design System Tokens & Components
│
├── js/
│   ├── store.js                             # Reactive State Store & LocalStorage Engine
│   └── nav.js                               # Global Header & Live Role Switcher Modal
│
├── Student_Interface/
│   ├── Portal-Dashboard.html                # Student Command Center & Metrics
│   ├── Skills_Overview.html                 # 1000-Point Vector Matrix & Career Gate
│   ├── Activities_Interface.html            # Verified GitHub & LeetCode Sync Engine
│   ├── Certificates_Interface.html          # Verifiable Credential Portfolio
│   ├── My_Applications.html                 # Hiring Pipeline & Proctored Screening Modal
│   └── Profile_Interface.html              # Academic Background & Skill Overview
│
├── Opportunity_Interface/
│   ├── Opportunities_Interface.html         # Unified Catalog (Jobs, Internships, Workshops)
│   ├── opportunity-details.html             # Role Deep Dive & Candidate Vector Comparison
│   └── index.html                           # Curated Career Tracks (Java, Full Stack, Data)
│
├── Assessment_Interface/
│   ├── index.html                           # Proctored Examination Suite & Results View
│   ├── app.js                               # Two-Factor Timer & Anti-Cheat Engine
│   └── questions.js                         # 89 KB Comprehensive Multi-Domain Question Bank
│
├── Company_Interface/
│   ├── index.html                           # Corporate Recruitment Command Center
│   ├── opportunities.html                   # Position Management & Custom Vector Thresholds
│   ├── applicants.html                      # Candidate Pipeline with Match % & Screening Scores
│   ├── shortlisted.html                     # Pre-Vetted Finalist Pool & 1-Click Offer Release
│   ├── jobs.html                            # Full-Time Engineering Jobs Directory
│   ├── internships.html                     # Campus Internship Programs
│   ├── workshops.html                       # Corporate Upskilling & Hackathons
│   ├── assessments.html                     # Screening Assessment Rules & Proctoring Settings
│   ├── offers.html                          # Released Offer Letters & Acceptances
│   ├── messages.html                        # Candidate Technical Interview Communications
│   ├── settings.html                        # ATS Webhook Synchronization & Verification
│   └── profile.html                         # Corporate Employer Profile
│
└── Institute_Interface/
    ├── index.html                           # Academic Placement Cell Console
    ├── students.html                        # Enrolled Student Cohort Directory & Search
    ├── skill-overview.html                  # Institutional Skill Gap & Intervention Analytics
    ├── department-performance.html          # Comparative Benchmarks (CSE vs IT vs ECE)
    ├── opportunities.html                   # Active Placement Drives & Submissions
    └── profile.html                         # Accredited University Profile
```

---

## 4. Key Workflows & Features

### A. The 1000-Point Skill Vector Standard
- **Tier 1 (700 - 1000 pts)**: Industry Ready. Direct qualification for top-tier corporate drives without skill bridge requirements.
- **Tier 2 (600 - 699 pts)**: Proficient / Near Threshold. Minor point deficit (50-80 pts). Enrolled in targeted sprint modules.
- **Tier 3 (< 600 pts)**: Upskill Required. Enrolled in academic laboratory bridge programs.

### B. Two-Factor Timer & Proctoring Protocol
- **Factor 1 (Exam Clock)**: Visible 20:00 countdown timer with warnings.
- **Factor 2 (Question Dwell)**: Background per-question dwell monitoring. Flags rapid-guessing or bot automation.
- **Academic Integrity Safeguards**:
  - Tab switch / window blur triggers immediate strike and -50 points deduction.
  - 3 strikes automatically terminates and invalidates the exam attempt.
  - Copy-paste prevention across question and answer elements.
  - Webcam face alignment verification.

### C. Automated Matchmaking Gate
- Real-time comparison: Candidate Vector vs Employer Required Vector.
- Example: Java Backend Engineer requires `Java >= 700` and `SQL >= 500`. Candidate with `Java: 820` and `SQL: 760` passes gate with 92% match score.
- Direct 1-click Proctored Screening Test (&ge; 15/20) forwards verified profile and resume to employer.

### D. Verified Platform Activity Integration
- Automated algorithmic calibration for GitHub (commits, pull requests, repositories) and LeetCode (problems solved, acceptance rate) into verified platform boost points.

---

## 5. Running the Application

SkillBridge is built as a zero-dependency, ultra-fast client-side web application.

1. Clone or download the repository.
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Use the **Role Switcher** in the top navigation bar or the quick demo buttons on `index.html` to toggle between:
   - **Student**: Rahul Sharma (`student@gmail.com`)
   - **Company**: ABC Tech Corp (`company@gmail.com`)
   - **Institute**: Apex Institute of Technology (`institute@gmail.com`)
