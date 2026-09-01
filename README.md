🌉 SkillBridge — Student Industry Collaboration

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.7-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4" />
  <img src="https://img.shields.io/badge/Spring_Security-RBAC-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven" />
</p>

A skill-based Academia–Industry Collaboration Portal built to connect students, companies, and institutions through measurable skill assessment, opportunity matching, skill-gap identification, and placement tracking.

Unlike a conventional job or internship portal, SkillBridge focuses on one central problem: the gap between what students know and what industry requires.

The platform follows a simple continuous workflow:

Assess → Score → Match → Identify Gaps → Improve → Re-assess → Apply → Recruit → Place

🎯 Project Objective

The objective of SkillBridge is to create a unified platform where:

Students can measure their skills instead of relying only on self-declared skills.

Companies can define required skills and minimum skill levels for opportunities.

A matching engine can compare student skill profiles with industry requirements.

Students who are not eligible can understand their exact skill gaps.

Students can use learning resources, improve, and re-assess themselves.

Companies can screen suitable candidates.

Institutions can monitor overall skill readiness and placement progress.

[!IMPORTANT]
SkillBridge is not intended to be another LinkedIn or generic job portal. Its core purpose is skill assessment, skill-based matching, and actionable skill-gap improvement.

🛠️ Technical Stack

Category

Technology

Description

☕ Language

Java 21

Modern LTS Java runtime and application development

🚀 Framework

Spring Boot 4.0.7

Core backend web framework and REST API layer

🗄️ Database

MySQL

Relational storage for users, skills, assessments, opportunities and applications

🔒 Security

Spring Security

Authentication and Role-Based Access Control (RBAC)

🔑 Password Security

BCrypt

Secure password hashing

📦 Build Tool

Maven

Dependency management and project build pipeline

🧩 API Style

REST

Communication between frontend and backend

🧪 Testing

JUnit / Spring Test

Backend unit and integration testing

✨ Core Features

👨‍🎓 Student Skill Assessment:

Student registration and profile creation.

Education, department, year, projects and interests.

Field-specific skill assessments.

Skill scores generated from assessment results.

Skill readiness overview.

Visibility into missing or weak skills.

🏢 Company & Opportunity Management:

Company profile creation.

Internship and job posting.

Required skill definition.

Minimum skill-score requirements.

Opportunity details such as duration, location, stipend and eligibility.

Candidate/application management.

⚙️ Skill-Based Matching Engine:

Compares assessed student skills with company requirements.

Determines opportunity eligibility.

Identifies individual skill gaps.

Provides an explainable match result.

Supports re-assessment after skill improvement.

📝 Application Workflow:

Apply only when the student satisfies the opportunity requirements.

Track application status.

Company screening after application.

Optional role-specific screening assessment.

Recruitment-stage tracking.

🏫 Institution Dashboard:

Student overview.

Overall skill readiness.

Skill proficiency distribution.

Application statistics.

Placement overview.

Identification of common skill gaps.

🛡️ Role-Based Access Control:

STUDENT

COMPANY

INSTITUTION

ADMIN

[!NOTE]
The initial implementation should prioritize skill assessment + matching + skill-gap identification + application workflow. Advanced AI recommendation, facial recognition, advanced proctoring, blockchain certificates and large-scale LMS integrations remain future-scope capabilities.

🔄 System Workflow

flowchart TD
    Student[Student] --> Assessment[Assessment]
    Assessment --> Score[Skill Score]
    Score --> Profile[Skill Profile]
    Profile --> Matching[Matching Engine]

    Company[Company] --> Requirements[Required Skills]
    Requirements --> Matching

    Matching --> Eligibility{Eligible?}

    Eligibility -->|YES| Apply[Apply]
    Eligibility -->|NO| Gap[Skill Gap]

    Gap --> Resources[Learning Resources]
    Resources --> Reassess[Re-assess]
    Reassess --> Matching

    Apply --> Screening[Company Screening]
    Screening --> Result{Pass?}

    Result -->|YES| Resume[Resume Submission]
    Result -->|NO| Rejected[Not Selected]

    Resume --> Recruitment[Recruitment]
    Recruitment --> Institution[Institution]
    Institution --> Placement[Placement Data]

🧠 How the Matching Engine Works

The matching engine is the heart of SkillBridge.

It compares the student's assessed skill scores against the minimum requirements defined by the company.

👨‍🎓 Student Skill Profile

Java          78
SQL           65
Spring Boot   42
Git           72

🏢 Company Requirements

Java          ≥ 70
SQL           ≥ 50
Spring Boot   ≥ 60
Git           ≥ 50

⚙️ Matching Result

Java          78 ≥ 70   ✓
SQL           65 ≥ 50   ✓
Spring Boot   42 < 60   ✗
Git           72 ≥ 50   ✓

The student is therefore not currently eligible.

But SkillBridge does not stop at rejection.

💡 Skill Gap Response

Missing Skill : Spring Boot
Current Score : 42
Required Score: 60
Skill Gap     : 18 points

The platform can then guide the student toward:

Learning Resources
        ↓
Practice
        ↓
Re-assessment
        ↓
Updated Skill Score
        ↓
Matching Again

[!TIP]
The most important principle of the matching engine is explainability. A student should understand why an opportunity is unavailable and what needs to improve.

📊 Skill Score

After completing an assessment, SkillBridge generates a measurable skill score.

Example:

JAVA
████████████████░░░░  78%

SQL
█████████████░░░░░░░  65%

SPRING BOOT
████████░░░░░░░░░░░░  42%

A possible initial classification is:

80–100 → Strong
60–79  → Good
40–59  → Developing
0–39   → Beginner

The exact score ranges can be configured as the assessment system evolves.

📝 Assessment Module

Assessments are used to convert broad skill claims into measurable results.

A basic assessment consists of:

Assessment
├── Skill
├── Questions
├── Answers
├── Attempt
├── Score
└── Result

The MVP can support:

Multiple-choice questions.

Skill-specific question sets.

Timed assessments.

Automatic scoring.

Assessment result storage.

Basic violation/event detection.

Re-assessment after improvement.

Example:

Java Assessment
────────────────────
Score : 78 / 100
Level : Good

👨‍🎓 Student Module

The student is the primary participant in the SkillBridge workflow.

STUDENT
│
├── Personal Profile
├── Education
├── Projects
├── Interests
├── Assessments
├── Skills Overview
├── Opportunities
└── My Applications

Personal Profile

The profile can contain:

Name

Email

Education

Department / Branch

Academic year

Resume

Projects

Interests

Skills Overview

The student should be able to immediately answer:

"What am I good at?"

and:

"What should I improve?"

Example:

Skill

Score

Status

Java

78

Good

SQL

65

Good

Spring Boot

42

Developing

Git

72

Good

🏢 Company Module

Companies define their requirements and publish opportunities.

COMPANY
│
├── Company Profile
├── Required Skills
├── Internships
└── Jobs

Company Profile

Contains information such as:

Company name

Description

Industry

Location

Website

Contact information

Creating an Opportunity

Example:

Position:
Java Backend Intern

Required Skills:
Java        ≥ 70
SQL         ≥ 50
Spring Boot ≥ 60
Git         ≥ 50

Additional opportunity information can include:

Duration

Location / Remote

Stipend

Number of positions

Description

Eligibility criteria

The most important part is the skill requirement definition, because it becomes the input for the matching engine.

📌 Application Workflow

Opportunity
     ↓
Profile Check
     ↓
Skill Matching
     ↓
Eligible?
   /     \
 YES      NO
 ↓        ↓
Apply   Skill Gap
 ↓        ↓
Screen  Resources
 ↓        ↓
Recruit Re-assess
          ↓
       Match Again

Application Status

A typical application can move through:

Applied
   ↓
Shortlisted
   ↓
Screening
   ↓
Selected / Rejected

The student should be able to track the current state of every application.

🧪 Company Screening

After an eligible student applies, the company can optionally initiate a role-specific screening assessment.

The screening can contain:

MCQs

Technical questions

Aptitude

Coding questions depending on the role

Example:

Screening Test
20 Questions

Score: 17 / 20
        ↓
     PASS
        ↓
Resume Submission

Advanced facial recognition and proctoring are not core requirements for the MVP and can be explored later.

🏫 Institution Module

The institution acts as the monitoring and analytics layer.

INSTITUTION
│
├── Students Overview
├── Skill Overview
├── Application Overview
└── Placement Overview

The institution can monitor:

Total students.

Active students.

Assessment participation.

Overall skill readiness.

Skill proficiency distribution.

Application progress.

Placement statistics.

Common skill gaps.

Example:

Skill Readiness

Java           ███████████████  65%
Python         █████████        40%
SQL            ███████████████  72%
Communication  █████████        45%

This allows institutions to identify where additional training may be required.

👑 Admin Module

The administrator provides platform-level management.

Possible responsibilities include:

User management.

Role management.

Skill/category management.

Assessment management.

Question-bank management.

Opportunity moderation.

Platform monitoring.

Primary roles:

STUDENT
COMPANY
INSTITUTION
ADMIN

🏗️ Architecture & Data Flow

graph TD
    Client[Web Client] --> Security[Spring Security]
    Security --> Controller[REST Controller Layer]
    Controller --> Service[Service Layer]
    Service --> Matching[Matching Engine]
    Service --> Assessment[Assessment Service]
    Service --> Application[Application Service]
    Matching --> Repository[Repository Layer]
    Assessment --> Repository
    Application --> Repository
    Repository --> Database[(MySQL)]

The backend follows a modular layered architecture:

Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL

Business-specific modules such as Matching, Assessment, and Application Management operate within the service layer.

🗄️ Data Models

1. User

Field

Type

Description

id

Long / UUID

Primary identifier

name

String

User's display name

email

String

Registered email

password

String

BCrypt-encoded password

role

Enum

STUDENT, COMPANY, INSTITUTION, ADMIN

2. Student

Field

Type

Description

id

Long / UUID

Student identifier

education

String

Degree / academic information

department

String

Department / branch

year

Integer

Current academic year

resume

String

Resume reference

projects

List

Student projects

interests

List

Preferred domains / roles

3. Skill

Field

Type

Description

id

Long / UUID

Skill identifier

name

String

Skill name

category

String

Skill category

4. StudentSkill

Field

Type

Description

studentId

Long / UUID

Student reference

skillId

Long / UUID

Skill reference

score

Integer

Assessed skill score

level

String

Skill proficiency level

5. Opportunity

Field

Type

Description

id

Long / UUID

Opportunity identifier

companyId

Long / UUID

Company reference

title

String

Job / internship title

description

String

Opportunity description

location

String

Location / remote

duration

String

Internship/job duration

6. OpportunitySkill

Field

Type

Description

opportunityId

Long / UUID

Opportunity reference

skillId

Long / UUID

Required skill

minimumScore

Integer

Minimum required score

required

Boolean

Required / preferred skill

7. Assessment

Field

Type

Description

id

Long / UUID

Assessment identifier

skillId

Long / UUID

Skill being assessed

title

String

Assessment title

duration

Integer

Time limit

8. Application

Field

Type

Description

id

Long / UUID

Application identifier

studentId

Long / UUID

Student reference

opportunityId

Long / UUID

Opportunity reference

matchScore

Double

Matching result

status

Enum

Current application status

🌐 API Endpoints

The API is organized around the major modules of the platform.

[!NOTE]
Endpoint names below represent the intended REST API structure. Keep this section synchronized with the actual controllers as implementation progresses.

1. Authentication & Registration

Method

Endpoint

Description



/api/auth/register

Register a new user



/api/auth/login

Authenticate a user



/api/auth/me

Retrieve authenticated user information

2. Student Endpoints

Method

Endpoint

Description



/api/students/profile

Fetch student profile



/api/students/profile

Update student profile



/api/students/skills

Fetch assessed skills



/api/students/applications

Fetch student's applications

3. Assessment Endpoints

Method

Endpoint

Description



/api/assessments

List available assessments



/api/assessments/{id}

Fetch an assessment



/api/assessments/{id}/submit

Submit assessment



/api/assessments/results

Fetch assessment results

4. Company Endpoints

Method

Endpoint

Description



/api/companies/profile

Fetch company profile



/api/companies/profile

Update company profile



/api/opportunities

Create an opportunity



/api/opportunities

List opportunities

5. Matching Endpoints

Method

Endpoint

Description



/api/matching/opportunities

Find suitable opportunities



/api/matching/{opportunityId}

Calculate student-opportunity match



/api/matching/{opportunityId}/gaps

Retrieve skill gaps

6. Application Endpoints

Method

Endpoint

Description



/api/applications

Submit an application



/api/applications

Fetch applications



/api/applications/{id}/status

Update application status

7. Institution Endpoints

Method

Endpoint

Description



/api/institutions/students

Student overview



/api/institutions/skills

Skill readiness overview



/api/institutions/placements

Placement overview

📥 Example Request

Create Student Profile

{
  "name": "Rahul",
  "email": "rahul@example.com",
  "education": "B.Tech CSE",
  "department": "Computer Science",
  "year": 3,
  "interests": [
    "Backend Development",
    "Cloud"
  ]
}

Example Assessment Result

{
  "skill": "Java",
  "score": 78,
  "level": "Good"
}

Example Opportunity

{
  "title": "Java Backend Intern",
  "requiredSkills": [
    {
      "skill": "Java",
      "minimumScore": 70
    },
    {
      "skill": "SQL",
      "minimumScore": 50
    },
    {
      "skill": "Spring Boot",
      "minimumScore": 60
    },
    {
      "skill": "Git",
      "minimumScore": 50
    }
  ]
}

📂 Project Structure

src/main/java/
└── .../
    ├── ⚙️ config/
    │   ├── SecurityConfig.java
    │   └── ApplicationConfig.java
    │
    ├── 🎮 controller/
    │   ├── AuthController.java
    │   ├── StudentController.java
    │   ├── CompanyController.java
    │   ├── AssessmentController.java
    │   ├── MatchingController.java
    │   ├── ApplicationController.java
    │   ├── InstitutionController.java
    │   └── AdminController.java
    │
    ├── 📦 entity/
    │   ├── User.java
    │   ├── Student.java
    │   ├── Company.java
    │   ├── Institution.java
    │   ├── Skill.java
    │   ├── Assessment.java
    │   ├── Opportunity.java
    │   └── Application.java
    │
    ├── 📋 dto/
    │   ├── StudentDTO.java
    │   ├── CompanyDTO.java
    │   ├── AssessmentDTO.java
    │   ├── OpportunityDTO.java
    │   └── ApplicationDTO.java
    │
    ├── 🗄️ repository/
    │   ├── UserRepository.java
    │   ├── StudentRepository.java
    │   ├── CompanyRepository.java
    │   ├── SkillRepository.java
    │   ├── AssessmentRepository.java
    │   ├── OpportunityRepository.java
    │   └── ApplicationRepository.java
    │
    └── 🧠 service/
        ├── AuthService.java
        ├── StudentService.java
        ├── CompanyService.java
        ├── AssessmentService.java
        ├── MatchingService.java
        ├── ApplicationService.java
        └── InstitutionService.java

🚀 Getting Started

📋 Prerequisites

Java Development Kit (JDK): Version 21 or higher

Maven: Version 3.8+

MySQL: Version 8.0+ or compatible server

Git: Latest stable version

An IDE such as IntelliJ IDEA, Eclipse, or VS Code

⚙️ Database Configuration

Create the database:

CREATE DATABASE skillbridge;

Configure the database connection in:

src/main/resources/application.properties

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/skillbridge
spring.datasource.username=<username>
spring.datasource.password=<password>

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

[!WARNING]
Never commit real database passwords, API keys, JWT secrets, or other credentials to GitHub. Use environment variables or a local configuration file that is excluded through .gitignore.

💻 Running the Application

Clone the repository:

git clone <repository-url>
cd skillbridge-student-industry-collaboration

Build the project:

mvn clean install

Run the application:

mvn spring-boot:run

The server will start on:

http://localhost:8080

🧪 Development Roadmap

Phase 1 — MVP

Student Profile
      ↓
Assessment
      ↓
Skill Score
      ↓
Skill Profile
      ↓
Matching
      ↓
Eligibility
      ↓
Application

Phase 2 — Improvement Loop

Skill Gap
    ↓
Learning Resources
    ↓
Practice
    ↓
Re-assessment
    ↓
Updated Skill Profile
    ↓
Matching Again

Phase 3 — Advanced Capabilities

Potential future additions:

Smarter opportunity recommendations.

Advanced assessment analytics.

Advanced proctoring.

LMS integration.

External certification integration.

Placement prediction.

Enterprise HR integrations.

Advanced institutional analytics.

[!IMPORTANT]
Complex AI recommendation models, facial recognition, advanced proctoring, blockchain certificates and large-scale integrations are intentionally kept outside the initial MVP. The first objective is to prove the skill assessment → skill matching → skill-gap improvement loop.

🧭 Complete Student Journey

Consider a student interested in backend development.

1. Create Profile
        ↓
2. Take Skill Assessment
        ↓
3. Receive Skill Scores
        ↓
4. View Skill Profile
        ↓
5. Explore Matching Opportunities
        ↓
6. Check Eligibility
        ↓
   ┌────┴────┐
   ↓         ↓
Eligible   Not Eligible
   ↓         ↓
 Apply    Skill Gap
             ↓
         Resources
             ↓
         Re-assess
             ↓
        Match Again
   ↓
7. Company Screening
        ↓
8. Resume Submission
        ↓
9. Recruitment
        ↓
10. Placement

🌱 Project Vision

SkillBridge is designed around a larger idea:

                    ACADEMIA
                       │
                       ▼
                   SKILL DATA
                       │
                       ▼
                  SKILL ENGINE
                  /          \
                 ▼            ▼
             STUDENTS       INDUSTRY
                 │            │
                 ▼            ▼
             TRAINING      REQUIREMENTS
                 │            │
                 └─────┬──────┘
                       ▼
                    MATCHING
                       │
                       ▼
                 JOB / INTERNSHIP
                       │
                       ▼
                   PLACEMENT

The long-term goal is to build a bridge between:

What students know → What industry needs → What students should learn next.

🔐 Security Principles

The platform is designed around role-aware access.

Authentication

Secure user registration.

Password hashing with BCrypt.

Authenticated API access.

Authorization

Access is separated by role:

STUDENT
   ↓
Own Profile + Assessments + Applications

COMPANY
   ↓
Company Profile + Opportunities + Applications

INSTITUTION
   ↓
Student / Skill / Placement Analytics

ADMIN
   ↓
Platform Management

Additional considerations

Input validation.

Ownership checks.

Restricted administrative operations.

Safe secret management.

Controlled access to student and company data.

🤝 Contributing

Contributions and improvements are welcome.

Fork
  ↓
Create Feature Branch
  ↓
Implement
  ↓
Test
  ↓
Commit
  ↓
Push
  ↓
Pull Request

Example:

git checkout -b feature/skill-matching
git add .
git commit -m "feat: implement skill matching"
git push origin feature/skill-matching

Please keep commits focused and use descriptive commit messages.

👥 Team

Role

Name

Project Lead

Your Name

Backend Developer

Team Member

Frontend Developer

Team Member

Database / API

Team Member

UI/UX

Team Member

Documentation

Team Member

📄 License

This project is currently developed as a prototype for student–industry collaboration and academic/hackathon purposes.

Add the appropriate open-source license when the repository's licensing decision is finalized.

<p align="center">
  <strong>🌉 SkillBridge</strong><br/>
  <sub>Bridging the gap between student skills and industry opportunities.</sub>
</p>

<p align="center">
  <code>Assess → Score → Match → Improve → Re-assess → Apply → Place</code>
</p>
