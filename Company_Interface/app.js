/**
 * SkillBridge Royal Obsidian - Application Logic
 * Stitch Project ID: 17233478414363033427
 * Theme: Royal Obsidian
 */

// Global State
let currentSlide = 1;
const totalSlides = 4;
let velocityChartInstance = null;

// Candidate Data Store
const candidateData = {
  aarav: {
    name: "Aarav Patel",
    role: "Software Engineer Intern",
    university: "Stanford University / B.Tech CSE",
    gpa: "9.4 / 10.0 (Top 2%)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    matchScore: 98,
    badgeColor: "gold",
    status: "Shortlisted for Final Technical Round",
    skills: ["Distributed Systems", "Rust", "Go", "Kubernetes", "Kafka", "PostgreSQL"],
    assessmentScore: "99 / 100",
    codingChallenge: {
      algorithm: "100%",
      systemDesign: "97%",
      codeQuality: "99%"
    },
    bio: "Core contributor to open-source distributed cache engines. Author of 2 research papers on consensus algorithms and high-throughput microservice streaming.",
    github: "github.com/aarav-patel-core",
    appliedDate: "August 18, 2026"
  },
  priya: {
    name: "Priya Sharma",
    role: "AI Research Fellow / Data Science",
    university: "MIT / M.Sc Computational Data Science",
    gpa: "9.7 / 10.0 (Valedictorian Candidate)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    matchScore: 95,
    badgeColor: "amethyst",
    status: "Shortlisted for Research Directorate Interview",
    skills: ["LLM Alignment", "PyTorch", "FlashAttention", "Reinforcement Learning", "CUDA", "Python"],
    assessmentScore: "96 / 100",
    codingChallenge: {
      algorithm: "95%",
      systemDesign: "98%",
      codeQuality: "95%"
    },
    bio: "Published in NeurIPS 2025 on efficient transformer fine-tuning. Experienced with multi-GPU distributed training clusters and synthetic dataset curation.",
    github: "github.com/priya-sharma-ai",
    appliedDate: "August 20, 2026"
  },
  rohan: {
    name: "Rohan Verma",
    role: "Cloud Backend & Systems Engineer",
    university: "IIT Bombay / B.Tech Computer Science & AI",
    gpa: "9.1 / 10.0",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    matchScore: 94,
    badgeColor: "gold",
    status: "Shortlisted for Hiring Manager Review",
    skills: ["Edge Computing", "C++", "CUDA", "Linux Kernel", "gRPC", "Docker"],
    assessmentScore: "93 / 100",
    codingChallenge: {
      algorithm: "94%",
      systemDesign: "93%",
      codeQuality: "95%"
    },
    bio: "Built real-time telemetry processing pipelines handling 50k requests/sec. Passionate about low-latency systems and kernel network optimization.",
    github: "github.com/rohan-verma-sys",
    appliedDate: "August 22, 2026"
  }
};

// Pipeline Data Categories
const pipelineCategories = {
  swe: [
    { title: "SWE Intern", count: "45 apps", cohort: "Stanford & IIT Tech Cohort", updated: "2h ago", stage: "applied" },
    { title: "Distributed Systems Fellow", count: "28 apps", cohort: "Ivy League Pool", updated: "1h ago", stage: "applied" },
    { title: "Coding Track A", count: "20 pending", cohort: "Algo & System Architecture", updated: "3h ago", stage: "assessment" },
    { title: "Final Technical Interviews", count: "24 scheduled", cohort: "Panel: Engineering VP", updated: "Active", stage: "shortlisted" }
  ],
  data: [
    { title: "Data Analyst Intern", count: "83 apps", cohort: "Fall 2026 Batch 2", updated: "5h ago", stage: "applied" },
    { title: "Analytics Engineering Lead", count: "12 apps", cohort: "Masters Cohort", updated: "4h ago", stage: "applied" },
    { title: "SQL & ETL Benchmark", count: "16 pending", cohort: "Data Warehouse Track", updated: "6h ago", stage: "assessment" },
    { title: "Case Study Presentation", count: "10 scheduled", cohort: "Lead Data Scientist", updated: "Next Week", stage: "shortlisted" }
  ],
  ai: [
    { title: "AI Research Scientist", count: "34 apps", cohort: "PhD & Postgrad Hub", updated: "30m ago", stage: "applied" },
    { title: "ML Benchmark Assessment", count: "16 completed", cohort: "TensorFlow & PyTorch eval", updated: "2h ago", stage: "assessment" },
    { title: "Executive AI Pitch", count: "18 candidates", cohort: "Research Directorate", updated: "Slot confirmed", stage: "shortlisted" }
  ]
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initVelocityChart();
  initLiveClock();
  setupKeyboardNav();
  lucide.createIcons();
});

// View Mode Switcher: Dashboard Live Mode vs Slide Deck Mode
function switchViewMode(mode) {
  const dashboardView = document.getElementById("dashboard-view");
  const slideView = document.getElementById("slide-view");
  const btnDashboard = document.getElementById("btn-mode-dashboard");
  const btnSlide = document.getElementById("btn-mode-slide");

  if (mode === "slide") {
    dashboardView.classList.add("hidden");
    slideView.classList.remove("hidden");
    
    btnSlide.classList.add("bg-royal-gold", "text-obsidian-950", "font-semibold", "shadow-sm");
    btnSlide.classList.remove("text-on-surface-variant");
    btnDashboard.classList.remove("bg-royal-gold", "text-obsidian-950", "font-semibold", "shadow-sm");
    btnDashboard.classList.add("text-on-surface-variant");
    
    goToSlide(currentSlide);
    showToast("Switched to Royal Obsidian Slide Deck Mode");
  } else {
    slideView.classList.add("hidden");
    dashboardView.classList.remove("hidden");

    btnDashboard.classList.add("bg-royal-gold", "text-obsidian-950", "font-semibold", "shadow-sm");
    btnDashboard.classList.remove("text-on-surface-variant");
    btnSlide.classList.remove("bg-royal-gold", "text-obsidian-950", "font-semibold", "shadow-sm");
    btnSlide.classList.add("text-on-surface-variant");

    showToast("Switched to Live Dashboard Application");
  }
}

// Slide Deck Controller
function goToSlide(slideNum) {
  if (slideNum < 1 || slideNum > totalSlides) return;
  currentSlide = slideNum;

  // Hide all slide panes
  for (let i = 1; i <= totalSlides; i++) {
    const pane = document.getElementById(`slide-content-${i}`);
    if (pane) {
      pane.classList.add("hidden");
    }
  }

  // Show active slide pane
  const activePane = document.getElementById(`slide-content-${currentSlide}`);
  if (activePane) {
    activePane.classList.remove("hidden");
  }

  // Update slide counter
  document.getElementById("current-slide-num").innerText = currentSlide;

  // Update slide titles
  const titles = [
    "Company Dashboard – SkillBridge (Royal Obsidian)",
    "Four-Stage Recruitment Pipeline Velocity",
    "Priority AI Matches & Talent Ranking",
    "University Partnerships & Strategic Drives"
  ];
  document.getElementById("slide-title").innerText = titles[currentSlide - 1];

  // Update thumbnail buttons
  const thumbs = document.querySelectorAll(".slide-thumb");
  thumbs.forEach((thumb, idx) => {
    if (idx + 1 === currentSlide) {
      thumb.classList.add("border-royal-gold", "text-royal-gold", "font-semibold");
      thumb.classList.remove("border-white/10", "text-on-surface-variant");
    } else {
      thumb.classList.remove("border-royal-gold", "text-royal-gold", "font-semibold");
      thumb.classList.add("border-white/10", "text-on-surface-variant");
    }
  });
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    goToSlide(currentSlide + 1);
  } else {
    goToSlide(1); // loop back
  }
}

function prevSlide() {
  if (currentSlide > 1) {
    goToSlide(currentSlide - 1);
  } else {
    goToSlide(totalSlides);
  }
}

function setupKeyboardNav() {
  window.addEventListener("keydown", (e) => {
    const slideView = document.getElementById("slide-view");
    if (!slideView.classList.contains("hidden")) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevSlide();
      }
    }
  });
}

// Chart Initialization: Talent Acquisition Velocity
function initVelocityChart() {
  const ctx = document.getElementById("pipelineVelocityChart");
  if (!ctx) return;

  if (velocityChartInstance) {
    velocityChartInstance.destroy();
  }

  const gradientGold = ctx.getContext("2d").createLinearGradient(0, 0, 0, 200);
  gradientGold.addColorStop(0, "rgba(242, 202, 80, 0.35)");
  gradientGold.addColorStop(1, "rgba(242, 202, 80, 0.0)");

  const gradientAmethyst = ctx.getContext("2d").createLinearGradient(0, 0, 0, 200);
  gradientAmethyst.addColorStop(0, "rgba(119, 1, 208, 0.35)");
  gradientAmethyst.addColorStop(1, "rgba(119, 1, 208, 0.0)");

  velocityChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6 (Current)"],
      datasets: [
        {
          label: "Candidate Applications",
          data: [35, 62, 94, 110, 125, 128],
          borderColor: "#f2ca50",
          backgroundColor: gradientGold,
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#f2ca50",
          pointBorderColor: "#0f131f",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "Assessments Completed",
          data: [12, 24, 38, 52, 70, 84],
          borderColor: "#dcb8ff",
          backgroundColor: gradientAmethyst,
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#dcb8ff",
          pointBorderColor: "#0f131f",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(15, 19, 31, 0.95)",
          titleColor: "#f2ca50",
          bodyColor: "#dfe2f3",
          borderColor: "rgba(212, 175, 55, 0.3)",
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.04)"
          },
          ticks: {
            color: "#99907c",
            font: { family: "Inter", size: 11 }
          }
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.04)"
          },
          ticks: {
            color: "#99907c",
            font: { family: "Inter", size: 11 }
          }
        }
      }
    }
  });
}

// Pipeline Stage Filtering
function filterPipelineStage(category, buttonEl) {
  const tabs = document.querySelectorAll(".pipeline-tab");
  tabs.forEach(tab => {
    tab.classList.remove("active", "bg-royal-gold", "text-obsidian-950", "font-semibold");
    tab.classList.add("text-on-surface-variant");
  });

  if (buttonEl) {
    buttonEl.classList.add("active", "bg-royal-gold", "text-obsidian-950", "font-semibold");
    buttonEl.classList.remove("text-on-surface-variant");
  }

  showToast(`Filtering pipeline for: ${category.toUpperCase()}`);
}

// Candidate Dossier Modal
function openCandidateDossier(candidateKey) {
  const data = candidateData[candidateKey];
  if (!data) return;

  const modal = document.getElementById("modal-dossier");
  const content = document.getElementById("dossier-content");

  const badgeClass = data.badgeColor === "gold"
    ? "bg-royal-gold/15 text-royal-gold border-royal-gold/30"
    : "bg-royal-amethyst/20 text-royal-amethyst-bright border-royal-amethyst/40";

  content.innerHTML = `
    <div class="flex items-start gap-5 pb-6 border-b border-white/10">
      <div class="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-royal-gold shadow-gold-glow/40 flex-shrink-0">
        <img src="${data.avatar}" alt="${data.name}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-2xl font-bold text-white">${data.name}</h2>
          <span class="text-sm font-mono font-bold px-3 py-1 rounded-full border ${badgeClass} flex items-center gap-1">
            ${data.matchScore}% Match <span class="material-symbols-outlined text-[16px]">bolt</span>
          </span>
        </div>
        <p class="text-sm text-royal-slate font-medium mt-0.5">${data.role}</p>
        <p class="text-xs text-royal-muted mt-0.5">${data.university} &bull; <strong class="text-white">${data.gpa}</strong></p>
        <div class="mt-2.5 flex items-center gap-2">
          <span class="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
            ${data.status}
          </span>
        </div>
      </div>
    </div>

    <!-- Candidate Evaluation Matrix -->
    <div class="py-6 space-y-6">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-royal-slate mb-3">AI Skill & Benchmark Breakdown</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-obsidian-850 border border-white/10 text-center">
            <span class="text-[11px] text-royal-muted">Algorithm & Data Structures</span>
            <div class="text-xl font-bold font-mono text-royal-gold mt-1">${data.codingChallenge.algorithm}</div>
          </div>
          <div class="p-3 rounded-xl bg-obsidian-850 border border-white/10 text-center">
            <span class="text-[11px] text-royal-muted">System Architecture</span>
            <div class="text-xl font-bold font-mono text-royal-amethyst-light mt-1">${data.codingChallenge.systemDesign}</div>
          </div>
          <div class="p-3 rounded-xl bg-obsidian-850 border border-white/10 text-center">
            <span class="text-[11px] text-royal-muted">Code Quality & Docs</span>
            <div class="text-xl font-bold font-mono text-emerald-400 mt-1">${data.codingChallenge.codeQuality}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-royal-slate mb-2">Verified Skill Stack</h3>
        <div class="flex flex-wrap gap-2">
          ${data.skills.map(s => `<span class="px-2.5 py-1 rounded-lg bg-obsidian-750 border border-white/10 text-xs font-mono text-royal-slate">${s}</span>`).join("")}
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-royal-slate mb-1.5">Executive Summary</h3>
        <p class="text-sm text-on-surface-variant leading-relaxed">${data.bio}</p>
      </div>

      <div class="flex items-center justify-between text-xs text-royal-muted pt-3 border-t border-white/5">
        <span>Applied on: ${data.appliedDate}</span>
        <span class="font-mono text-royal-gold">${data.github}</span>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
      <button onclick="closeCandidateDossier()" class="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-white transition-colors">
        Close
      </button>
      <button onclick="scheduleInterview('${data.name}')" class="bg-royal-gold text-obsidian-950 px-6 py-2.5 rounded-xl font-bold text-xs shadow-gold-glow hover:scale-105 transition-all">
        Schedule Live Interview
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCandidateDossier() {
  const modal = document.getElementById("modal-dossier");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Opportunity Modal
function openOpportunityModal() {
  const modal = document.getElementById("modal-opportunity");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeOpportunityModal() {
  const modal = document.getElementById("modal-opportunity");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function handlePostOpportunity(e) {
  e.preventDefault();
  const title = document.getElementById("opp-title").value;
  const type = document.getElementById("opp-type").value;
  
  closeOpportunityModal();
  showToast(`Successfully published "${title}" (${type}) to SkillBridge partner network!`);
  
  // Add new item dynamically to applied pipeline
  const appliedContainer = document.getElementById("pipeline-applied");
  if (appliedContainer) {
    const newItem = document.createElement("div");
    newItem.className = "kanban-item bg-obsidian-750/90 p-3 rounded-xl border border-royal-gold/30 hover:border-royal-gold transition-all cursor-pointer group";
    newItem.innerHTML = `
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="font-semibold text-white group-hover:text-royal-gold transition-colors">${title}</span>
        <span class="text-[10px] font-mono text-royal-gold bg-royal-gold/10 px-1.5 py-0.5 rounded">Just now</span>
      </div>
      <p class="text-[11px] text-royal-muted line-clamp-1">Campus broadcast active</p>
      <div class="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant">
        <span>0 submissions</span>
        <span class="text-royal-gold flex items-center gap-0.5">Live <span class="material-symbols-outlined text-[12px]">chevron_right</span></span>
      </div>
    `;
    appliedContainer.prepend(newItem);
  }
}

// Actions & Handlers
function scheduleInterview(candidateName) {
  closeCandidateDossier();
  showToast(`Interview invite and calendar link sent to ${candidateName}!`);
}

function refreshDataFeed() {
  const icon = document.getElementById("refresh-icon");
  if (icon) {
    icon.classList.add("animate-spin");
    setTimeout(() => {
      icon.classList.remove("animate-spin");
      showToast("Live data feed synchronized with SkillBridge Network");
    }, 800);
  }
}

function downloadPipelineReport() {
  showToast("Exporting Royal Obsidian Pipeline Summary (PDF & CSV)...");
}

function openCandidateDrawer() {
  showToast("Displaying all 128 registered applicants from Stanford, MIT & IIT cohorts");
}

function openAssessmentsModal() {
  showToast("Opening Assessment Suite: 36 code challenges pending evaluation");
}

function openProfileModal() {
  showToast("Viewing ABC Technologies Enterprise Profile & University Accreditations");
}

function openWorkshopsModal() {
  showToast("Opening University Workshops & Industry Training Hub");
}

function openMessagesModal() {
  showToast("Connected to University Placement Officers & Faculty Coordinators");
}

function openSettingsModal() {
  showToast("Opening Portal Configuration & API Integrations");
}

function openOfferRateStats() {
  showToast("Placement Acceptance: 94.2% (Top 1% across partner networks)");
}

function openNewEventModal() {
  showToast("Creating new Academic Drive / Workshop schedule");
}

function filterPipeline(filterName) {
  showToast(`Filtering view for: ${filterName}`);
}

// Toast Helper
function showToast(message, icon = "check_circle") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");

  if (!toast) return;

  toastMsg.innerText = message;
  toastIcon.innerText = icon;

  toast.classList.remove("translate-y-24", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.add("translate-y-24", "opacity-0");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3200);
}

// Live Clock & Date
function initLiveClock() {
  const tsEl = document.getElementById("live-timestamp");
  if (!tsEl) return;

  function update() {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    tsEl.innerHTML = `${now.toLocaleDateString('en-US', options)} &bull; <span class="text-royal-gold">Live Synced</span>`;
  }
  update();
  setInterval(update, 60000);
}

// Fullscreen toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      showToast("Fullscreen not supported or blocked");
    });
  } else {
    document.exitFullscreen();
  }
}
