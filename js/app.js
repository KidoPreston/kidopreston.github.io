const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const fallbackProfile = {
  name: "Kido Preston",
  shortName: "Kido Preston",
  title: "Multidisciplinary Visual Designer & 3D Creator",
  intro: "I create bold visual systems across graphic design, 3D visualization, AI-driven concepts, VR tours, motion graphics, and event experiences.",
  focus: "Graphic Design · 3D Visualization · AI Concepts · VR Tours · Motion",
  heroStyle: "Bold · Experimental · Modern · Trustworthy",
  about: "I combine design, 3D, AI, VR, and motion into complete visual directions for freelance clients.",
  contactText: "Available for freelance collaborations, event visuals, brand campaigns, 3D visualization, AI concept development, VR tours, and motion-ready visual systems.",
  email: "kido.preston@gmail.com",
  phone: "+201092847473",
  whatsapp: "https://wa.me/201092847473",
  behance: "",
  stats: [
    { value: "2D+3D", label: "Visual systems" },
    { value: "VR", label: "Interactive tours" },
    { value: "AI", label: "Concept workflow" }
  ],
  skills: ["Graphic Design", "3D Visualization", "VR Tours", "Motion Graphics", "AI Visual Direction"],
  services: []
};

const i18n = {
  en: {
    navWork: "Work",
    navServices: "Services",
    navAbout: "About",
    navContact: "Contact",
    updateBtn: "Update",
    heroEyebrow: "Graphic Design · 3D Visualization · AI · VR · Motion",
    viewPortfolio: "View Portfolio",
    letsCollaborate: "Let’s Collaborate",
    currentFocus: "Current Focus",
    styleLabel: "Style",
    selectedWork: "Selected work",
    portfolioProjects: "Portfolio Categories",
    workIntro: "Filter by category, open a project, and explore selected work from graphic design, 3D visualization, VR tours, motion, and concept-to-real projects.",
    searchPlaceholder: "Search projects...",
    whatIDo: "What I do",
    creativeServices: "Creative Services",
    servicesIntro: "A flexible visual practice built for freelance clients who need design, 3D, AI concepts, VR, and motion from one creative partner.",
    aboutEyebrow: "About",
    aboutHeading: "Designing visual worlds, not just single images.",
    contactEyebrow: "Available for freelance / collaborations",
    contactHeading: "Let’s create something that people remember.",
    backToTop: "Back to top ↑",
    all: "All",
    emailMe: "Email Me",
    whatsApp: "WhatsApp",
    behance: "Behance",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    projectStory: "Project Story",
    highlights: "Highlights",
    role: "Role",
    year: "Year",
    tools: "Tools",
    link: "Link",
    openProject: "Open project ↗",
    gallery: "Gallery",
    noProjects: "No projects match this filter yet. Add more projects in data/projects.json."
  },
  ar: {
    navWork: "الأعمال",
    navServices: "الخدمات",
    navAbout: "عني",
    navContact: "تواصل",
    updateBtn: "تحديث",
    heroEyebrow: "تصميم جرافيك · 3D · ذكاء اصطناعي · VR · موشن",
    viewPortfolio: "شاهد الأعمال",
    letsCollaborate: "لنتعاون",
    currentFocus: "التركيز الحالي",
    styleLabel: "الأسلوب",
    selectedWork: "أعمال مختارة",
    portfolioProjects: "تصنيفات البورتفوليو",
    workIntro: "فلتر حسب التصنيف وشاهد أعمال التصميم الجرافيكي، 3D، جولات VR، الموشن، ومشاريع من الفكرة للتنفيذ.",
    searchPlaceholder: "ابحث في الأعمال...",
    whatIDo: "ماذا أقدم",
    creativeServices: "الخدمات الإبداعية",
    servicesIntro: "خبرة بصرية مرنة لعملاء فريلانس يحتاجون تصميم، 3D، AI، VR، وموشن من شخص واحد.",
    aboutEyebrow: "عني",
    aboutHeading: "أصمم عوالم بصرية كاملة، وليس مجرد صورة واحدة.",
    contactEyebrow: "متاح للفريلانس والتعاون",
    contactHeading: "لنعمل شيئًا يتذكره الناس.",
    backToTop: "العودة للأعلى ↑",
    all: "الكل",
    emailMe: "إيميل",
    whatsApp: "واتساب",
    behance: "بيهانس",
    instagram: "إنستجرام",
    linkedin: "لينكدإن",
    projectStory: "قصة المشروع",
    highlights: "النقاط المهمة",
    role: "الدور",
    year: "السنة",
    tools: "الأدوات",
    link: "الرابط",
    openProject: "افتح المشروع ↗",
    gallery: "المعرض",
    noProjects: "لا توجد أعمال مطابقة لهذا الفلتر حاليًا. أضف أعمالًا أكثر في data/projects.json."
  }
};

let projects = [];
let profileData = fallbackProfile;
let activeFilter = "All";
let searchTerm = "";
let currentLang = localStorage.getItem("portfolio-lang") || "en";
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);
}
function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }
function localizedObject(item) { return currentLang === "en" ? item : { ...item, ...(item.translations?.[currentLang] || {}) }; }
function localizedProfile(profile) { return currentLang === "en" ? profile : { ...profile, ...(profile.translations?.[currentLang] || {}) }; }
async function getJSON(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path} failed`);
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return fallback;
  }
}
function getProjectImage(project) { return project.thumbnail || project.image || (project.gallery && project.gallery[0]) || ""; }

function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", currentLang === "ar");
  $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach((node) => { node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder)); });
  const langToggle = $('#langToggle');
  if (langToggle) langToggle.textContent = currentLang === "en" ? "AR" : "EN";
}

function applyProfile(profile) {
  const localProfile = localizedProfile({ ...fallbackProfile, ...profile });
  $$('[data-profile]').forEach((node) => {
    const key = node.dataset.profile;
    if (localProfile[key]) node.textContent = localProfile[key];
  });

  const stats = $('#stats');
  if (stats) {
    stats.innerHTML = (localProfile.stats || []).map((item) => `
      <div class="stat"><strong>${escapeHTML(item.value)}</strong><span>${escapeHTML(item.label)}</span></div>
    `).join('');
  }

  const services = localProfile.services?.length ? localProfile.services : fallbackProfile.services;
  const serviceGrid = $('#serviceGrid');
  if (serviceGrid) {
    serviceGrid.innerHTML = services.map((service) => `
      <article class="service-card reveal">
        <div class="service-icon">${escapeHTML(service.icon || "✦")}</div>
        <h3>${escapeHTML(service.title)}</h3>
        <p>${escapeHTML(service.text)}</p>
      </article>
    `).join('');
  }

  const skillCloud = $('#skillCloud');
  if (skillCloud) {
    skillCloud.innerHTML = (localProfile.skills || []).map(skill => `<li>${escapeHTML(skill)}</li>`).join('');
  }

  const contactActions = $('#contactActions');
  if (contactActions) {
    const contacts = [
      localProfile.email && { label: t('emailMe'), url: `mailto:${localProfile.email}`, primary: true },
      localProfile.whatsapp && { label: t('whatsApp'), url: localProfile.whatsapp },
      localProfile.behance && { label: t('behance'), url: localProfile.behance },
      localProfile.instagram && { label: t('instagram'), url: localProfile.instagram },
      localProfile.linkedin && { label: t('linkedin'), url: localProfile.linkedin },
      !localProfile.whatsapp && localProfile.phone && { label: t('whatsApp'), url: `https://wa.me/${localProfile.phone.replace(/\D/g, '')}` }
    ].filter(Boolean);
    contactActions.innerHTML = contacts.map((item) => `
      <a class="${item.primary ? 'primary-btn' : 'secondary-btn'} magnetic" href="${escapeHTML(item.url)}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${escapeHTML(item.label)}</a>
    `).join('');
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

function getCategories() {
  const categories = [...new Set(projects.map(project => localizedObject(project).category || 'Portfolio').filter(Boolean))].sort();
  return [t('all'), ...categories];
}

function renderFilters() {
  const container = $('#filters');
  if (!container) return;
  container.innerHTML = getCategories().map(tag => `
    <button class="filter-btn ${tag === activeFilter || (activeFilter === 'All' && tag === t('all')) ? 'active' : ''}" type="button" data-filter="${escapeHTML(tag)}">${escapeHTML(tag)}</button>
  `).join('');

  $$('.filter-btn', container).forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter === t('all') ? 'All' : button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function filteredProjects() {
  return projects.filter(project => {
    const localProject = localizedObject(project);
    const category = localProject.category || 'Portfolio';
    const matchesFilter = activeFilter === 'All' || category === activeFilter;
    const haystack = `${localProject.title} ${localProject.subtitle} ${localProject.description} ${category} ${(project.tags || []).join(' ')}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderHeroGallery() {
  const stage = $('#heroGallery');
  if (!stage) return;
  const featured = projects.filter(project => getProjectImage(project)).slice(0, 4);
  stage.innerHTML = `
    <div class="lab-core" aria-hidden="true"></div>
    ${featured.map((project, index) => {
      const local = localizedObject(project);
      return `<div class="lab-card card-${index + 1}" style="background-image:url('${escapeHTML(getProjectImage(project))}')" data-title="${escapeHTML(local.category || local.title)}"></div>`;
    }).join('')}
    <div class="lab-badge badge-1">2D</div>
    <div class="lab-badge badge-2">3D</div>
    <div class="lab-badge badge-3">AI</div>
  `;
}

function renderRunway() {
  const runway = $('#runway');
  const tabs = $('#showcaseTabs');
  if (!runway || !tabs) return;
  const featured = projects.filter(project => getProjectImage(project)).slice(0, 5);
  tabs.innerHTML = featured.map((project, index) => `<li class="${index === 0 ? 'active' : ''}" data-index="${index}">${escapeHTML(localizedObject(project).category || localizedObject(project).title)}</li>`).join('');
  runway.innerHTML = featured.map((project, index) => {
    const local = localizedObject(project);
    return `
      <article class="runway-card" data-index="${index}">
        <img src="${escapeHTML(getProjectImage(project))}" alt="${escapeHTML(local.title)}" loading="lazy" />
        <div class="runway-body">
          <small>${escapeHTML(local.category || 'Portfolio')}</small>
          <h3>${escapeHTML(local.title)}</h3>
          <p>${escapeHTML(local.subtitle || local.description || '')}</p>
        </div>
      </article>
    `;
  }).join('');
  updateShowcase();
}

function renderProjects() {
  const grid = $('#projectGrid');
  if (!grid) return;
  const items = filteredProjects();
  if (!items.length) {
    grid.innerHTML = `<p class="empty-state">${escapeHTML(t('noProjects'))}</p>`;
    return;
  }

  grid.innerHTML = items.map((project, index) => {
    const local = localizedObject(project);
    const image = getProjectImage(project);
    const tags = (project.tags || []).slice(0, 3);
    return `
      <article class="project-card reveal" style="--i:${index}">
        <button class="project-btn" type="button" data-project-id="${escapeHTML(project.id)}" aria-label="Open ${escapeHTML(local.title)}">
          <div class="project-cover">
            ${image ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(local.title)}" loading="lazy" />` : ''}
          </div>
          <div class="project-body">
            <div class="project-topline">
              <span class="project-category">${escapeHTML(local.category || 'Portfolio')}</span>
              <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3>${escapeHTML(local.title)}</h3>
            <p>${escapeHTML(local.subtitle || local.description || '')}</p>
            <div class="card-tags">${tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
          </div>
          <div class="project-footer"><span>${escapeHTML(project.year || '')}</span><strong>${escapeHTML(t('openProject'))}</strong></div>
        </button>
      </article>
    `;
  }).join('');

  $$('.project-btn', grid).forEach(button => {
    button.addEventListener('click', () => openProject(button.dataset.projectId));
  });

  $$('.project-card', grid).forEach(card => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  observeReveals();
}

function openProject(id) {
  const project = projects.find(item => item.id === id);
  const modal = $('#projectModal');
  const body = $('#modalBody');
  if (!project || !modal || !body) return;

  const local = localizedObject(project);
  const hero = project.image || getProjectImage(project);
  const gallery = (project.gallery || []).filter(Boolean);
  body.innerHTML = `
    <section class="modal-hero" style="background-image:url('${escapeHTML(hero)}')">
      <div class="modal-copy">
        <p class="eyebrow">${escapeHTML(local.category || 'Portfolio')}</p>
        <h2>${escapeHTML(local.title)}</h2>
        <p>${escapeHTML(local.subtitle || '')}</p>
      </div>
    </section>
    <section class="modal-details">
      <div>
        <h3>${escapeHTML(t('projectStory'))}</h3>
        <p>${escapeHTML(local.description || local.subtitle || '')}</p>
        ${(project.highlights || []).length ? `<h3>${escapeHTML(t('highlights'))}</h3><ul>${project.highlights.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}
        ${gallery.length ? `<h3>${escapeHTML(t('gallery'))}</h3><div class="modal-gallery">${gallery.map(src => `<img src="${escapeHTML(src)}" alt="${escapeHTML(local.title)} gallery image" loading="lazy" />`).join('')}</div>` : ''}
      </div>
      <aside class="modal-meta">
        ${project.role ? `<strong>${escapeHTML(t('role'))}</strong><span>${escapeHTML(project.role)}</span>` : ''}
        ${project.year ? `<strong>${escapeHTML(t('year'))}</strong><span>${escapeHTML(project.year)}</span>` : ''}
        ${(project.tools || []).length ? `<strong>${escapeHTML(t('tools'))}</strong><span>${project.tools.map(escapeHTML).join(' · ')}</span>` : ''}
        ${project.link ? `<strong>${escapeHTML(t('link'))}</strong><span><a href="${escapeHTML(project.link)}" target="_blank" rel="noreferrer">Open link ↗</a></span>` : ''}
      </aside>
    </section>
  `;
  document.body.classList.add('modal-open');
  modal.showModal();
  modal.scrollTop = 0;
}

function closeProject() {
  const modal = $('#projectModal');
  if (modal?.open) modal.close();
  document.body.classList.remove('modal-open');
}

let revealObserver;
function observeReveals() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(node => revealObserver.observe(node));
}

function setupStarfield() {
  const canvas = $('#starfield');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const particles = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), s: Math.random() * 1.7 + .25 }));
  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(190, 235, 255, .68)';
    const scroll = window.scrollY * .00006;
    particles.forEach(point => {
      const x = ((point.x + scroll * (0.35 + point.z)) % 1) * window.innerWidth;
      const y = ((point.y + scroll * (0.18 + point.z)) % 1) * window.innerHeight;
      context.globalAlpha = .25 + point.z * .65;
      context.beginPath();
      context.arc(x, y, point.s, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

function updateShowcase() {
  const section = $('#experience');
  const cards = $$('.runway-card');
  const meter = $('#showcaseMeter');
  const text = $('#showcaseText');
  const tabs = $$('.showcase-tabs li');
  if (!section || !cards.length) return;

  const rect = section.getBoundingClientRect();
  const total = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / total));
  if (meter) meter.style.transform = `scaleX(${progress})`;

  const activeIndex = Math.min(cards.length - 1, Math.max(0, Math.round(progress * (cards.length - 1))));
  tabs.forEach((tab, index) => tab.classList.toggle('active', index === activeIndex));
  const activeProject = projects.filter(project => getProjectImage(project)).slice(0, 5)[activeIndex];
  if (text && activeProject) {
    const local = localizedObject(activeProject);
    text.textContent = local.subtitle || local.description || text.textContent;
  }

  cards.forEach((card, index) => {
    const step = progress * (cards.length - 1) - index;
    const abs = Math.abs(step);
    const x = step * -360;
    const y = Math.sin((index + progress) * 2.1) * 38;
    const z = 260 - abs * 210;
    const rot = step * 16;
    const scale = Math.max(.72, 1 - abs * .12);
    const opacity = Math.max(.12, 1 - abs * .34);
    const blur = Math.min(8, abs * 2.8);
    card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rot}deg) rotateZ(${rot * .25}deg) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.filter = `blur(${blur}px) saturate(${1 + Math.max(0, 1 - abs) * .18})`;
    card.style.zIndex = String(20 - Math.round(abs * 5));
  });
}

function setupScrollExperience() {
  const root = document.documentElement;
  const progressEl = $('#scrollProgress');
  const railLinks = $$('.scroll-rail a');
  const sections = ['top', 'experience', 'work', 'services', 'about', 'contact'].map(id => ({ id, el: document.getElementById(id) })).filter(item => item.el);
  let ticking = false;

  function update() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty('--scrollProgress', ratio.toFixed(4));
    if (progressEl) progressEl.style.transform = `scaleX(${ratio})`;
    document.body.classList.toggle('is-scrolled', window.scrollY > 20);
    document.body.classList.toggle('show-back-top', window.scrollY > Math.min(760, window.innerHeight * .75));

    const offset = window.innerHeight * .34;
    let active = 'top';
    sections.forEach(({ id, el }) => {
      const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY + offset >= top) active = id;
    });
    railLinks.forEach(link => link.classList.toggle('active', link.dataset.section === active));
    $$('.main-nav a').forEach(link => {
      const target = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', target === active);
    });

    updateShowcase();
    ticking = false;
  }
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

function scrollToTarget(hash) {
  const target = hash === '#top' ? document.body : document.querySelector(hash);
  if (!target) return;
  const offset = hash === '#top' ? 0 : 92;
  const y = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: prefersReduced ? 'auto' : 'smooth' });
}

function setupInteractions() {
  $('#modalClose')?.addEventListener('click', closeProject);
  $('#projectModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'projectModal') closeProject();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProject();
  });

  $$('[data-scroll-link]').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      event.preventDefault();
      scrollToTarget(href);
    });
  });
  $('#backTop')?.addEventListener('click', () => scrollToTarget('#top'));

  $('#themeToggle')?.addEventListener('click', () => document.body.classList.toggle('light'));
  $('#langToggle')?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    applyStaticLanguage();
    applyProfile(profileData);
    renderFilters();
    renderHeroGallery();
    renderRunway();
    renderProjects();
  });

  $('#projectSearch')?.addEventListener('input', (event) => {
    searchTerm = event.target.value.trim();
    renderProjects();
  });

  const aura = $('#cursorAura');
  if (aura && !prefersReduced) {
    window.addEventListener('pointermove', (event) => {
      aura.style.left = `${event.clientX}px`;
      aura.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const heroLab = $('#heroLab');
  if (heroLab && !prefersReduced) {
    heroLab.addEventListener('pointermove', (event) => {
      const rect = heroLab.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroLab.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    heroLab.addEventListener('pointerleave', () => { heroLab.style.transform = ''; });
  }

  $$('.magnetic').forEach(node => {
    node.addEventListener('pointermove', (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .12;
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
    node.addEventListener('pointerleave', () => { node.style.transform = ''; });
  });
}

async function init() {
  applyStaticLanguage();
  const [loadedProfile, loadedProjects] = await Promise.all([
    getJSON('data/profile.json', fallbackProfile),
    getJSON('data/projects.json', [])
  ]);
  profileData = loadedProfile;
  projects = loadedProjects;
  applyProfile(profileData);
  renderFilters();
  renderHeroGallery();
  renderRunway();
  renderProjects();
  setupInteractions();
  setupScrollExperience();
  setupStarfield();
  observeReveals();
}

init();
