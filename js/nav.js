/**
 * SkillBridge — Unified Application Navigation v6.0
 * Vibey Dark Interactive Header with Context-Aware Role Locking & Profile Routing
 * Problem Statement ID: SIH 26044 (Smart India Hackathon 2026)
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

  function initHeader() {
    if (!window.SkillBridgeStore) return;

    // Suppress any legacy static headers
    document.querySelectorAll('body > header:not(#sb-global-header)').forEach(el => el.remove());

    let headerEl = document.getElementById('sb-global-header');
    if (!headerEl) {
      headerEl = document.createElement('header');
      headerEl.id = 'sb-global-header';
      headerEl.className = 'sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070a12]/85 backdrop-blur-md transition-all';
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
    // If the active workspace requires a specific persona and the stored persona does not match, auto-sync
    if (requiredRole && (!user || user.role !== requiredRole)) {
      user = window.SkillBridgeStore.setCurrentRole(requiredRole);
    }
    if (!user) {
      user = {
        id: 'std_rahul', name: 'Rahul Sharma', role: 'student', college: 'Aditya University',
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
      const activeClass = 'text-indigo-200 bg-indigo-600/20 border border-indigo-500/40 font-semibold shadow-xs';
      const inactiveClass = 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent font-medium';
      return `
        <a href="${rootPath}${href}" class="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all ${active ? activeClass : inactiveClass}">
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
      roleBadge = `<span class="sb-badge sb-badge-blue"><span class="w-1.5 h-1.5 bg-blue-500 shadow-sm shadow-blue-500/50"></span>Student</span>`;
      roleLinks = `
        ${linkHtml('Student_Interface/Portal-Dashboard.html', 'Dashboard', 'space_dashboard')}
        ${linkHtml('Student_Interface/Skills_Overview.html', 'Skill Matrix', 'psychology')}
        ${linkHtml('Opportunity_Interface/Opportunities_Interface.html', 'Opportunities', 'work')}
        ${linkHtml('Assessment_Interface/index.html', 'Assessments', 'quiz')}
        ${linkHtml('Student_Interface/My_Applications.html', 'Applications', 'assignment')}
        ${linkHtml('Student_Interface/Activities_Interface.html', 'Activities', 'code_blocks')}
        ${linkHtml('Student_Interface/Profile_Interface.html', 'Profile', 'account_circle')}
      `;
    } else if (user.role === 'company') {
      profileHref = `${rootPath}Company_Interface/profile.html`;
      roleBadge = `<span class="sb-badge sb-badge-emerald"><span class="w-1.5 h-1.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>Company</span>`;
      roleLinks = `
        ${linkHtml('Company_Interface/index.html', 'Dashboard', 'space_dashboard')}
        ${linkHtml('Company_Interface/opportunities.html', 'Listings', 'post_add')}
        ${linkHtml('Company_Interface/applicants.html', 'Candidates', 'groups')}
        ${linkHtml('Company_Interface/shortlisted.html', 'Shortlisted', 'verified')}
        ${linkHtml('Company_Interface/profile.html', 'Profile', 'business')}
      `;
    } else if (user.role === 'institute') {
      profileHref = `${rootPath}Institute_Interface/profile.html`;
      roleBadge = `<span class="sb-badge sb-badge-amber"><span class="w-1.5 h-1.5 bg-amber-500 shadow-sm shadow-amber-500/50"></span>Institute</span>`;
      roleLinks = `
        ${linkHtml('Institute_Interface/index.html', 'Overview', 'bar_chart')}
        ${linkHtml('Institute_Interface/students.html', 'Student Cohort', 'school')}
        ${linkHtml('Institute_Interface/skill-overview.html', 'Skill Analytics', 'psychology')}
        ${linkHtml('Institute_Interface/department-performance.html', 'Departments', 'domain')}
        ${linkHtml('Institute_Interface/profile.html', 'Profile', 'account_balance')}
      `;
    }

    const avatarUrl = user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80';

    headerEl.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 text-sm font-sans">
        
        <!-- Left: Brand Logo & Role Pill -->
        <div class="flex items-center gap-3">
          <a href="${rootPath}index.html" class="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
            <div class="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
              <span class="material-symbols-outlined text-[17px]">hub</span>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-bold tracking-tight text-white leading-tight">Skill<span class="text-indigo-400">Bridge</span></span>
                <span class="text-[10px] text-indigo-300 font-mono px-1.5 py-0.2 bg-indigo-950/60 border border-indigo-500/30">SIH 26044</span>
              </div>
            </div>
          </a>
          <div class="hidden sm:block">${roleBadge}</div>
        </div>

        <!-- Center: Role Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          ${roleLinks}
        </nav>

        <!-- Right: Role Switcher & User Account -->
        <div class="flex items-center gap-2.5">
          <!-- Quick Role Switcher Button -->
          <button id="sb-role-switcher-btn" class="sb-btn sb-btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5" title="Switch between Student, Company, and Institute roles">
            <span class="material-symbols-outlined text-[15px] text-indigo-400">swap_horiz</span>
            <span class="hidden sm:inline">Switch Role</span>
          </button>

          <!-- User Profile & Sign Out -->
          <div class="flex items-center gap-2 pl-2 border-l border-white/[0.1]">
            <a href="${profileHref}" class="flex items-center gap-2 p-1 hover:bg-white/[0.05] transition" title="View Your Profile (${user.name})">
              <img src="${avatarUrl}" alt="${user.name}" class="w-7 h-7 object-cover border border-indigo-500/30">
              <span class="hidden lg:block text-xs font-medium text-slate-200">${user.name}</span>
            </a>
            <a href="${rootPath}index.html" class="p-1 text-slate-400 hover:text-white hover:bg-white/10 transition" title="Exit to Portal Selector">
              <span class="material-symbols-outlined text-[18px]">logout</span>
            </a>
          </div>

          <!-- Mobile Menu Trigger -->
          <button id="sb-mobile-toggle" class="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10">
            <span class="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div id="sb-mobile-menu" class="hidden md:hidden border-t border-white/[0.08] bg-[#090d18]/95 backdrop-blur-md px-4 py-3 space-y-1">
        ${roleLinks}
      </div>
    `;

    injectRoleSwitcherModal(rootPath, user);

    const switcherBtn = document.getElementById('sb-role-switcher-btn');
    if (switcherBtn) {
      switcherBtn.addEventListener('click', () => {
        const modal = document.getElementById('sb-role-modal');
        if (modal) modal.classList.remove('hidden');
      });
    }

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
              <p class="text-[11px] text-slate-400">Aditya University &bull; Java &amp; Backend Track</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </button>

          <!-- Student: Priya -->
          <button onclick="window.SkillBridgeNav.switchUser('priya.patel@aditya.ac.in', 'student', '${rootPath}Student_Interface/Portal-Dashboard.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&auto=format&fit=crop&q=80" class="w-10 h-10 object-cover border border-white/[0.1]" alt="Priya Patel">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">Priya Patel</span>
                <span class="sb-badge sb-badge-blue">Student (IT)</span>
              </div>
              <p class="text-[11px] text-slate-400">Aditya University &bull; Full Stack &amp; React Track</p>
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

          <!-- Institute: Aditya University -->
          <button onclick="window.SkillBridgeNav.switchUser('institute@gmail.com', 'institute', '${rootPath}Institute_Interface/index.html')" class="sb-card p-3.5 flex items-center gap-3 text-left hover:border-indigo-500/50 transition">
            <div class="w-10 h-10 bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span class="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-white">Aditya University</span>
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
