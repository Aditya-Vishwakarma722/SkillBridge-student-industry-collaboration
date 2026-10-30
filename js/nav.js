/**
 * SkillBridge — Unified Application Navigation v7.0
 * Refined Spacious Header with Architectural Vector Brand Mark & Role Locking
 * Enterprise Academic & Industry Collaboration Platform
 */
(function (window) {
  'use strict';

  function getRootPath() {
    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    if (path.includes('/student_interface') ||
      path.includes('/company_interface') ||
      path.includes('/institute_interface') ||
      path.includes('/opportunity_interface') ||
      path.includes('/assessment_interface')) {
      return '../';
    }
    return './';
  }

  function getBrandLogoSvg() {
    return `
      <div class="relative w-8 h-8 flex items-center justify-center bg-[#0d121f] border border-indigo-500/40 group-hover:border-indigo-400/80 shadow-xs shadow-indigo-500/25 transition-all">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 19H22" stroke="url(#sb-logo-grad)" stroke-width="2.2" stroke-linecap="square"/>
          <path d="M4 19V11C4 7.68629 6.68629 5 10 5H14C17.3137 5 20 7.68629 20 11V19" stroke="url(#sb-logo-grad)" stroke-width="2" stroke-linecap="square"/>
          <path d="M8 19V12M16 19V12" stroke="url(#sb-logo-grad)" stroke-width="1.6" stroke-dasharray="2 2"/>
          <circle cx="12" cy="5" r="2" fill="#38bdf8"/>
          <defs>
            <linearGradient id="sb-logo-grad" x1="2" y1="5" x2="22" y2="19" gradientUnits="userSpaceOnUse">
              <stop stop-color="#818cf8"/>
              <stop offset="0.5" stop-color="#c084fc"/>
              <stop offset="1" stop-color="#38bdf8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="text-[16px] font-bold tracking-tight text-white font-sans">Skill<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">Bridge</span></span>
    `;
  }

  function initHeader() {
    if (!window.SkillBridgeStore) return;

    // Suppress any legacy static headers
    document.querySelectorAll('body > header:not(#sb-global-header)').forEach(el => el.remove());

    let headerEl = document.getElementById('sb-global-header');
    if (!headerEl) {
      headerEl = document.createElement('header');
      headerEl.id = 'sb-global-header';
      headerEl.className = 'sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070a12]/90 backdrop-blur-md transition-all';
      if (document.body) document.body.prepend(headerEl);
    }

    const rootPath = getRootPath();
    const currentPath = window.location.pathname.toLowerCase().replace(/\\/g, '/');

    // Context-aware role detection: Lock persona to the active workspace directory
    let requiredRole = null;
    if (currentPath.includes('/student_interface/') || currentPath.includes('/opportunity_interface/') || currentPath.includes('/assessment_interface/')) {
      requiredRole = 'student';
    } else if (currentPath.includes('/company_interface/')) {
      requiredRole = 'company';
    } else if (currentPath.includes('/institute_interface/')) {
      requiredRole = 'institute';
    }

    let user = window.SkillBridgeStore.getCurrentUser();
    // If active workspace requires a specific persona and the stored persona does not match, auto-sync
    if (requiredRole && (!user || user.role !== requiredRole)) {
      user = window.SkillBridgeStore.setCurrentRole(requiredRole);
    }
    if (!user) {
      user = {
        id: 'std_rahul', name: 'Rahul Sharma', role: 'student', college: 'Apex Institute of Technology',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
      };
    }

    const isCurrent = (href) => {
      const cleanHref = href.toLowerCase().replace('../', '').replace('./', '');
      const currentFileName = currentPath.split('/').pop() || 'index.html';
      const targetFileName = cleanHref.split('/').pop() || '';
      return currentPath.includes(cleanHref) || currentFileName === targetFileName;
    };

    function linkHtml(href, label, icon) {
      const active = isCurrent(href);
      const activeClass = 'text-indigo-200 bg-indigo-500/15 border border-indigo-500/40 font-semibold shadow-xs';
      const inactiveClass = 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent font-medium';
      return `
        <a href="${rootPath}${href}" class="flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 text-xs transition-all tracking-tight ${active ? activeClass : inactiveClass}">
          ${icon ? `<span class="material-symbols-outlined text-[16px] ${active ? 'text-indigo-400' : 'text-slate-400'}">${icon}</span>` : ''}
          <span>${label}</span>
        </a>
      `;
    }

    let roleLinks = '';
    let roleBadge = '';
    let profileHref = `${rootPath}Student_Interface/Profile_Interface.html`;

    if (user.role === 'student') {
      profileHref = `${rootPath}Student_Interface/Profile_Interface.html`;
      roleBadge = `<span class="sb-badge sb-badge-blue text-[11px]"><span class="w-1.5 h-1.5 bg-blue-500 shadow-sm shadow-blue-500/50"></span>Student</span>`;
      roleLinks = `
        ${linkHtml('Student_Interface/Portal-Dashboard.html', 'Dashboard', 'space_dashboard')}
        ${linkHtml('Student_Interface/Skills_Overview.html', 'Skill Matrix', 'psychology')}
        ${linkHtml('Opportunity_Interface/Opportunities_Interface.html', 'Opportunities', 'work')}
        ${linkHtml('Assessment_Interface/index.html', 'Assessments', 'quiz')}
        ${linkHtml('Student_Interface/My_Applications.html', 'Applications', 'assignment')}
        ${linkHtml('Student_Interface/Activities_Interface.html', 'Activities', 'code_blocks')}
      `;
    } else if (user.role === 'company') {
      profileHref = `${rootPath}Company_Interface/profile.html`;
      roleBadge = `<span class="sb-badge sb-badge-emerald text-[11px]"><span class="w-1.5 h-1.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>Company</span>`;
      roleLinks = `
        ${linkHtml('Company_Interface/index.html', 'Dashboard', 'space_dashboard')}
        ${linkHtml('Company_Interface/opportunities.html', 'Listings', 'post_add')}
        ${linkHtml('Company_Interface/applicants.html', 'Candidates', 'groups')}
        ${linkHtml('Company_Interface/shortlisted.html', 'Shortlisted', 'verified')}
      `;
    } else if (user.role === 'institute') {
      profileHref = `${rootPath}Institute_Interface/profile.html`;
      roleBadge = `<span class="sb-badge sb-badge-amber text-[11px]"><span class="w-1.5 h-1.5 bg-amber-500 shadow-sm shadow-amber-500/50"></span>Institute</span>`;
      roleLinks = `
        ${linkHtml('Institute_Interface/index.html', 'Overview', 'bar_chart')}
        ${linkHtml('Institute_Interface/students.html', 'Student Cohort', 'school')}
        ${linkHtml('Institute_Interface/skill-overview.html', 'Skill Analytics', 'psychology')}
        ${linkHtml('Institute_Interface/department-performance.html', 'Departments', 'domain')}
      `;
    }

    const avatarUrl = user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80';

    headerEl.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 text-sm font-sans">
        
        <!-- Left: Brand Logo & Role Pill -->
        <div class="flex items-center gap-3.5 flex-shrink-0">
          <a href="${rootPath}index.html" class="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
            ${getBrandLogoSvg()}
          </a>
          <div class="hidden sm:block">${roleBadge}</div>
        </div>

        <!-- Center: Spacious Role Navigation Links -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2">
          ${roleLinks}
        </nav>

        <!-- Right: Active Identity Capsule & Logout (No Switch Role when logged in) -->
        <div class="flex items-center gap-3 flex-shrink-0">
          
          <!-- User Profile Identity Capsule -->
          <a href="${profileHref}" class="flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/40 transition group" title="View Your Profile (${user.name})">
            <img src="${avatarUrl}" alt="${user.name}" class="w-6 h-6 object-cover border border-indigo-500/40 group-hover:border-indigo-400">
            <span class="hidden lg:block text-xs font-medium text-slate-200 group-hover:text-white">${user.name}</span>
          </a>

          <!-- Exit / Logout -->
          <a href="${rootPath}index.html" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition flex items-center justify-center" title="Exit to Portal Gateway">
            <span class="material-symbols-outlined text-[19px]">logout</span>
          </a>

          <!-- Mobile Menu Trigger -->
          <button id="sb-mobile-toggle" class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent">
            <span class="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div id="sb-mobile-menu" class="hidden md:hidden border-t border-white/[0.08] bg-[#090d18]/95 backdrop-blur-md px-4 py-3 space-y-1">
        ${roleLinks}
        <div class="pt-2 mt-2 border-t border-white/[0.08]">
          <a href="${profileHref}" class="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white">
            <span class="material-symbols-outlined text-[18px]">account_circle</span>
            <span>Profile & Account</span>
          </a>
        </div>
      </div>
    `;

    injectRoleSwitcherModal(rootPath, user);

    const mobileToggle = document.getElementById('sb-mobile-toggle');
    const mobileMenu = document.getElementById('sb-mobile-menu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  function injectRoleSwitcherModal(rootPath, currentUser) {
    let modal = document.getElementById('sb-role-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'sb-role-modal';
    modal.className = 'sb-modal-backdrop hidden';
    modal.innerHTML = `
      <div class="sb-modal-content p-6 space-y-5" style="max-width: 520px;">
        <div class="flex items-center justify-between border-b border-white/[0.1] pb-3">
          <div>
            <h3 class="text-base font-bold text-white">Switch Active Workspace</h3>
            <p class="text-xs text-slate-400">Select any actor persona to explore the verified collaboration workflow.</p>
          </div>
          <button onclick="document.getElementById('sb-role-modal').classList.add('hidden')" class="text-slate-400 hover:text-white p-1">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="grid grid-cols-1 gap-2.5">
          <!-- Student: Rahul -->
          <button onclick="window.SkillBridgeNav.switchUser('student@gmail.com', 'student', '${rootPath}Student_Interface/Portal-Dashboard.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" class="w-10 h-10 object-cover border border-white/[0.1]" alt="Rahul Sharma">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">Rahul Sharma</span>
                <span class="sb-badge sb-badge-blue">Student (CSE)</span>
              </div>
              <p class="text-[11px] text-slate-400">Apex Institute of Technology &bull; Java &amp; Backend Track</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </button>

          <!-- Student: Priya -->
          <button onclick="window.SkillBridgeNav.switchUser('priya.patel@apexuniv.edu', 'student', '${rootPath}Student_Interface/Portal-Dashboard.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&auto=format&fit=crop&q=80" class="w-10 h-10 object-cover border border-white/[0.1]" alt="Priya Patel">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">Priya Patel</span>
                <span class="sb-badge sb-badge-blue">Student (IT)</span>
              </div>
              <p class="text-[11px] text-slate-400">Apex Institute of Technology &bull; Full Stack &amp; React Track</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </button>

          <!-- Company: ABC Tech -->
          <button onclick="window.SkillBridgeNav.switchUser('company@gmail.com', 'company', '${rootPath}Company_Interface/index.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <div class="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span class="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">ABC Tech Corp</span>
                <span class="sb-badge sb-badge-emerald">Hiring Partner</span>
              </div>
              <p class="text-[11px] text-slate-400">Corporate Recruitment &bull; Minimum Skill Gating</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </button>

          <!-- Institute: Apex Institute of Technology -->
          <button onclick="window.SkillBridgeNav.switchUser('institute@gmail.com', 'institute', '${rootPath}Institute_Interface/index.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <div class="w-10 h-10 bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span class="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">Apex Institute of Technology</span>
                <span class="sb-badge sb-badge-amber">Academic Institute</span>
              </div>
              <p class="text-[11px] text-slate-400">Placement Cell &bull; Cohort Skill Readiness</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </button>
        </div>

        <div class="pt-2 border-t border-white/[0.1] flex items-center justify-between text-xs text-slate-400">
          <span>Active Role: <strong class="text-white capitalize">${currentUser ? currentUser.role : 'Student'}</strong></span>
          <a href="${rootPath}index.html" class="text-indigo-400 hover:text-indigo-300 hover:underline">View Public Gateway</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  window.SkillBridgeNav = {
    init: initHeader,
    getBrandLogoSvg: getBrandLogoSvg,
    openSwitcher: function () {
      const modal = document.getElementById('sb-role-modal');
      if (modal) modal.classList.remove('hidden');
    },
    switchUser: function (email, role, redirectUrl) {
      if (window.SkillBridgeStore) {
        window.SkillBridgeStore.login(email, role);
      }
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.reload();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', initHeader);
  window.addEventListener('skillbridge-state-change', initHeader);
  window.addEventListener('skillbridge:update', initHeader);

})(window);