/**
 * SkillBridge - Unified Global Navigation v2.0
 * Fixed: duplicate event listener memory leak, missing nav links, proper padding injection
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

  function injectGlobalStyles() {
    if (document.getElementById('skillbridge-nav-global-css')) return;
    const style = document.createElement('style');
    style.id = 'skillbridge-nav-global-css';
    style.innerHTML = `
      body { animation: sbEntrance 0.22s ease-out forwards; }
      @keyframes sbEntrance { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      #skillbridge-global-nav ~ * { /* content flows below sticky nav */ }
      .sb-nav-content-offset { padding-top: 56px; }
    `;
    document.head.appendChild(style);
  }

  function initHeader() {
    if (!window.SkillBridgeStore) return;

    injectGlobalStyles();

    const user = window.SkillBridgeStore.getCurrentUser();
    const rootPath = getRootPath();

    // Hide any old static headers from legacy template files
    document.querySelectorAll('body > header').forEach(oldHeader => {
      if (oldHeader.id !== 'skillbridge-global-nav') oldHeader.style.display = 'none';
    });

    // Create or reuse the global nav container
    let headerEl = document.getElementById('skillbridge-global-nav');
    if (!headerEl) {
      headerEl = document.createElement('div');
      headerEl.id = 'skillbridge-global-nav';
      headerEl.className = 'w-full bg-[#0A0E1A]/97 backdrop-blur-xl border-b border-white/10 text-white sticky top-0 z-50 transition-all duration-300';
      if (document.body) document.body.prepend(headerEl);
    }

    // Add top padding to body so sticky nav doesn't overlap content
    if (document.body && !document.body.classList.contains('sb-nav-padded')) {
      document.body.style.paddingTop = '52px';
      document.body.classList.add('sb-nav-padded');
    }

    // Default to student view when no user logged in (demo mode)
    const effectiveUser = user || { role: 'student', name: 'Demo', avatar: '' };

    const roleBadgeColor = {
      student: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      company: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      institute: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }[effectiveUser.role] || 'bg-amber-500/20 text-amber-300 border-amber-500/30';

    const roleLabel = {
      student: '<span>&#127891;</span> Student Portal',
      company: '<span>&#127970;</span> Company Portal',
      institute: '<span>&#127963;</span> Institute Portal'
    }[effectiveUser.role] || '<span>&#127891;</span> Student Portal';

    const currentPath = window.location.pathname.toLowerCase();
    const isActive = (href) => currentPath.includes(href.toLowerCase().replace('../', '').replace('./', ''));

    function navLink(href, label, hoverColor) {
      const active = isActive(href);
      const base = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150';
      const activeClass = `${base} bg-white/10 text-white border border-white/15`;
      const inactiveClass = `${base} text-zinc-400 ${hoverColor || 'hover:text-white hover:bg-white/5'}`;
      return `<a href="${rootPath}${href}" class="${active ? activeClass : inactiveClass}">${label}</a>`;
    }

    let navLinks = '';
    if (effectiveUser.role === 'student') {
      navLinks = `
        ${navLink('Student_Interface/Portal-Dashboard.html', 'Dashboard', 'hover:text-amber-400')}
        ${navLink('Student_Interface/Profile_Interface.html', 'Profile', 'hover:text-amber-400')}
        ${navLink('Student_Interface/Skills_Overview.html', 'Skills', 'hover:text-amber-400')}
        ${navLink('Opportunity_Interface/index.html', 'Opportunities', 'hover:text-amber-400')}
        ${navLink('Student_Interface/My_Applications.html', 'Applications', 'hover:text-amber-400')}
        ${navLink('Assessment_Interface/index.html', 'Assessments', 'hover:text-amber-400')}
        ${navLink('Student_Interface/Certificates_Interface.html', 'Certificates', 'hover:text-amber-400')}
      `;
    } else if (effectiveUser.role === 'company') {
      navLinks = `
        ${navLink('Company_Interface/index.html', 'Dashboard', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/opportunities.html', 'Positions', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/applicants.html', 'Applicants', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/shortlisted.html', 'Shortlisted', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/assessments.html', 'Assessments', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/messages.html', 'Messages', 'hover:text-emerald-400')}
        ${navLink('Company_Interface/profile.html', 'Profile', 'hover:text-emerald-400')}
      `;
    } else if (effectiveUser.role === 'institute') {
      navLinks = `
        ${navLink('Institute_Interface/index.html', 'Overview', 'hover:text-indigo-400')}
        ${navLink('Institute_Interface/students.html', 'Students', 'hover:text-indigo-400')}
        ${navLink('Institute_Interface/skill-overview.html', 'Skill Analytics', 'hover:text-indigo-400')}
        ${navLink('Institute_Interface/department-performance.html', 'Departments', 'hover:text-indigo-400')}
        ${navLink('Institute_Interface/opportunities.html', 'Opportunities', 'hover:text-indigo-400')}
        ${navLink('Institute_Interface/profile.html', 'Profile', 'hover:text-indigo-400')}
      `;
    }

    const avatarUrl = effectiveUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80';

    headerEl.innerHTML = `
      <div class="max-w-[1440px] mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 text-xs font-sans">

        <!-- Left: Brand -->
        <a href="${rootPath}index.html" class="flex items-center gap-2.5 font-bold shrink-0 hover:opacity-90 transition-opacity group">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div class="w-full h-full bg-[#0A0E1A] rounded-[7px] flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19V16.5C4 14.567 5.567 13 7.5 13H16.5C18.433 13 20 14.567 20 16.5V19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M12 3.5L19.5 7.5L12 11.5L4.5 7.5L12 3.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <span class="text-sm font-black tracking-wider text-white hidden sm:block">SKILL<span class="text-amber-400 italic">BRIDGE</span></span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadgeColor} hidden md:inline-flex items-center gap-1">${roleLabel}</span>
        </a>

        <!-- Middle: Nav Links -->
        <nav class="hidden lg:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
          ${navLinks}
        </nav>

        <!-- Right: User + Logout -->
        <div class="flex items-center gap-2.5 shrink-0">
          ${user ? `
          <div class="flex items-center gap-2 pl-2 border-l border-white/15">
            <img src="${avatarUrl}" alt="${user.name}" class="w-7 h-7 rounded-full object-cover border border-amber-400/40 shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d4af37&color=000'">
            <span class="hidden sm:block font-semibold text-xs text-zinc-200 max-w-[120px] truncate">${user.name}</span>
            <button onclick="window.SkillBridgeStore.logout(); window.location.href='${rootPath}index.html';" class="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5" title="Sign Out">
              <span class="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
          ` : `
          <a href="${rootPath}index.html" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all">Sign In</a>
          `}
        </div>

      </div>
    `;
  }

  // FIXED: Register state-change listener only once using a module-level flag
  let _headerInitialized = false;

  function setupNav() {
    injectGlobalStyles();
    initHeader();
    if (!_headerInitialized) {
      _headerInitialized = true;
      // Use a named handler to avoid duplicate registration
      window.removeEventListener('skillbridge-state-change', initHeader);
      window.addEventListener('skillbridge-state-change', initHeader);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNav);
  } else {
    setupNav();
  }

})();
