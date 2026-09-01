/**
 * SkillBridge - Unified Header Navigation
 */

(function () {
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

  function injectSmoothTransitionStyles() {
    if (document.getElementById('skillbridge-smooth-transition-css')) return;
    const style = document.createElement('style');
    style.id = 'skillbridge-smooth-transition-css';
    style.innerHTML = `
      body {
        animation: skillbridgeEntrance 0.2s ease-out forwards;
      }
      @keyframes skillbridgeEntrance {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  function initHeader() {
    if (!window.SkillBridgeStore) return;

    injectSmoothTransitionStyles();

    const user = window.SkillBridgeStore.getCurrentUser();
    const rootPath = getRootPath();

    // Hide any static duplicate headers from legacy template files
    document.querySelectorAll('body > header').forEach(oldHeader => {
      if (oldHeader.id !== 'skillbridge-global-nav') {
        oldHeader.style.display = 'none';
      }
    });

    // Check if global navigation container already exists
    let headerEl = document.getElementById('skillbridge-global-nav');
    if (!headerEl) {
      headerEl = document.createElement('div');
      headerEl.id = 'skillbridge-global-nav';
      headerEl.className = 'w-full bg-[#0A0E1A]/95 backdrop-blur-xl border-b border-amber-500/20 text-white sticky top-0 z-50 px-4 sm:px-6 py-2.5 transition-all duration-300';
      if (document.body) {
        document.body.prepend(headerEl);
      }
    }

    const roleBadgeColor = {
      student: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      company: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      institute: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }[user.role] || 'bg-amber-500/20 text-amber-300 border-amber-500/30';

    const roleLabel = {
      student: '🎓 Student Portal',
      company: '🏢 Company Portal',
      institute: '🏛️ Institute Portal'
    }[user.role] || '🎓 Student Portal';

    headerEl.innerHTML = `
      <div class="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-sans">
        
        <!-- Left: Brand Logo & Current Mode -->
        <div class="flex items-center gap-3">
          <a href="${rootPath}index.html" class="flex items-center gap-2.5 font-bold text-base hover:opacity-90 transition-all group">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div class="w-full h-full bg-[#0A0E1A] rounded-[7px] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19V16.5C4 14.567 5.567 13 7.5 13H16.5C18.433 13 20 14.567 20 16.5V19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M12 3.5L19.5 7.5L12 11.5L4.5 7.5L12 3.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <span class="text-sm font-black font-sans tracking-wider text-white">SKILL<span class="text-amber-400 font-serif font-extrabold italic">BRIDGE</span></span>
          </a>
          <span class="hidden sm:inline-block w-px h-4 bg-white/20"></span>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeColor}">
            ${roleLabel}
          </span>
        </div>

        <!-- Middle: Nav Links based on Role -->
        <nav class="hidden lg:flex items-center space-x-5 font-medium text-zinc-300">
          ${user.role === 'student' ? `
            <a href="${rootPath}Student_Interface/Portal-Dashboard.html" class="hover:text-amber-400 transition-colors">Dashboard</a>
            <a href="${rootPath}Student_Interface/Profile_Interface.html" class="hover:text-amber-400 transition-colors">Profile</a>
            <a href="${rootPath}Student_Interface/Skills_Overview.html" class="hover:text-amber-400 transition-colors">Skills</a>
            <a href="${rootPath}Opportunity_Interface/index.html" class="hover:text-amber-400 transition-colors">Opportunities</a>
            <a href="${rootPath}Student_Interface/My_Applications.html" class="hover:text-amber-400 transition-colors">Applications</a>
            <a href="${rootPath}Assessment_Interface/index.html" class="hover:text-amber-400 transition-colors">Assessments</a>
          ` : ''}

          ${user.role === 'company' ? `
            <a href="${rootPath}Company_Interface/index.html" class="hover:text-emerald-400 transition-colors">Dashboard</a>
            <a href="${rootPath}Company_Interface/opportunities.html" class="hover:text-emerald-400 transition-colors">Positions</a>
            <a href="${rootPath}Company_Interface/applicants.html" class="hover:text-emerald-400 transition-colors">Applicants</a>
            <a href="${rootPath}Company_Interface/shortlisted.html" class="hover:text-emerald-400 transition-colors">Shortlisted</a>
          ` : ''}

          ${user.role === 'institute' ? `
            <a href="${rootPath}Institute_Interface/index.html" class="hover:text-indigo-400 transition-colors">Overview</a>
            <a href="${rootPath}Institute_Interface/students.html" class="hover:text-indigo-400 transition-colors">Students Directory</a>
            <a href="${rootPath}Institute_Interface/skill-overview.html" class="hover:text-indigo-400 transition-colors">Skill Readiness</a>
            <a href="${rootPath}Institute_Interface/department-performance.html" class="hover:text-indigo-400 transition-colors">Departments</a>
          ` : ''}
        </nav>

        <!-- Right: User Avatar & Logout -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 border-l border-white/15 pl-3">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'}" alt="${user.name}" class="w-7 h-7 rounded-full object-cover border border-amber-400/40">
            <span class="hidden sm:inline font-semibold text-xs text-zinc-200">${user.name}</span>
            <a href="${rootPath}index.html" onclick="window.SkillBridgeStore.logout()" class="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors" title="Logout">
              <span class="material-symbols-outlined text-base">logout</span>
            </a>
          </div>
        </div>

      </div>
    `;
  }

  // Inject transition styles immediately when script is executed
  injectSmoothTransitionStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }

  window.addEventListener('skillbridge-state-change', initHeader);

})();
