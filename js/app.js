const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const fallbackProfile = {
  name: "Kido Preston",
  shortName: "Kido Preston",
  title: "Multidisciplinary Visual Designer & 3D Creator",
  intro: "I create bold visual systems across graphic design, 3D visualization, AI-driven concepts, VR tours, motion graphics, and event experiences.",
  focus: "Graphic Design · 3D Visuals · AI · VR · Motion",
  heroStyle: "Crazy Creative · Experimental · Trustworthy",
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
let currentLang = localStorage.getItem('portfolio-lang') || 'en';

const gradientSet = [
  "linear-gradient(135deg, #061527 0%, #0e6fff 42%, #00e0ff 100%)",
  "linear-gradient(135deg, #05080f 0%, #2a45ff 48%, #6bdcff 100%)",
  "linear-gradient(135deg, #020309 0%, #0743a5 38%, #00e0ff 100%)",
  "linear-gradient(135deg, #07101d 0%, #1d78ff 38%, #8bd8ff 100%)",
  "linear-gradient(135deg, #050505 0%, #0077ff 45%, #f6f7ff 100%)"
];

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;
}

function localizedObject(item) {
  if (currentLang === 'en') return item;
  return { ...item, ...(item.translations?.[currentLang] || {}) };
}

function localizedProfile(profile) {
  if (currentLang === 'en') return profile;
  return { ...profile, ...(profile.translations?.[currentLang] || {}) };
}

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

function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', currentLang === 'ar');
  $$('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $$('[data-i18n-placeholder]').forEach((node) => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  });
  const langToggle = $('#langToggle');
  if (langToggle) langToggle.textContent = currentLang === 'en' ? 'AR' : 'EN';
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
      <div class="stat"><strong>${item.value}</strong><span>${item.label}</span></div>
    `).join('');
  }

  const serviceGrid = $('#serviceGrid');
  if (serviceGrid) {
    serviceGrid.innerHTML = (localProfile.services || fallbackProfile.services).map((service) => `
      <article class="service-card reveal">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.text}</p>
      </article>
    `).join('');
  }

  const skillCloud = $('#skillCloud');
  if (skillCloud) {
    skillCloud.innerHTML = (localProfile.skills || []).map(skill => `<li>${skill}</li>`).join('');
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
      <a class="${item.primary ? 'primary-btn' : 'secondary-btn'}" href="${item.url}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${item.label}</a>
    `).join('');
  }

  $('#year').textContent = new Date().getFullYear();
}

function getProjectImage(project) {
  return project.thumbnail || project.image || (project.gallery && project.gallery[0]) || '';
}

function projectBackground(project, index) {
  const image = getProjectImage(project);
  if (image) return `url('${image}')`;
  return gradientSet[index % gradientSet.length];
}

function getCategories() {
  const categories = [...new Set(projects.map(project => localizedObject(project).category || 'Portfolio').filter(Boolean))].sort();
  return [t('all'), ...categories];
}

function renderFilters() {
  const filters = getCategories();
  const container = $('#filters');
  if (!container) return;
  container.innerHTML = filters.map(tag => `
    <button class="filter-btn ${tag === activeFilter || (activeFilter === 'All' && tag === t('all')) ? 'active' : ''}" type="button" data-filter="${tag}">${tag}</button>
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
  const gallery = $('#heroGallery');
  if (!gallery) return;
  const featured = projects.filter(project => getProjectImage(project)).slice(0, 6);
  gallery.innerHTML = featured.map((project, index) => {
    const localProject = localizedObject(project);
    return `<div class="hero-gallery-card hero-gallery-card-${index + 1}" style="background-image:url('${getProjectImage(project)}')"><span>${localProject.category || localProject.title}</span></div>`;
  }).join('');
}

function renderProjects() {
  const grid = $('#projectGrid');
  if (!grid) return;
  const visible = filteredProjects();
  if (!visible.length) {
    grid.innerHTML = `<div class="help-box">${t('noProjects')}</div>`;
    return;
  }
  grid.innerHTML = visible.map((project) => {
    const index = projects.indexOf(project);
    const localProject = localizedObject(project);
    return `
      <article class="project-card reveal" data-project-id="${project.id}">
        <div class="project-media" style="background:${projectBackground(project, index)}"></div>
        <div class="project-content">
          <div class="project-tags"><span class="tag category-tag">${localProject.category || 'Portfolio'}</span>${(project.tags || []).slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
          <h3>${localProject.title}</h3>
          <p>${localProject.subtitle || localProject.description || ''}</p>
        </div>
      </article>
    `;
  }).join('');

  $$('.project-card', grid).forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.projectId));
  });
  observeReveals();
}

function galleryMarkup(project) {
  const gallery = project.gallery || (project.image ? [project.image] : []);
  if (!gallery.length) return '';
  return `
    <div class="project-gallery-block">
      <h3>${t('gallery')}</h3>
      <div class="project-gallery">
        ${gallery.map(src => `<img src="${src}" alt="${project.title} portfolio image" loading="lazy">`).join('')}
      </div>
    </div>
  `;
}

function openProject(id) {
  const project = projects.find(item => String(item.id) === String(id));
  if (!project) return;
  const localProject = localizedObject(project);
  const modal = $('#projectModal');
  const modalBody = $('#modalBody');
  const index = projects.indexOf(project);
  const bg = projectBackground(project, index);
  modalBody.innerHTML = `
    <div class="modal-hero" style="background:${bg}">
      <div class="modal-copy">
        <div class="project-tags"><span class="tag category-tag">${localProject.category || 'Portfolio'}</span>${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <h2>${localProject.title}</h2>
        <p>${localProject.subtitle || ''}</p>
      </div>
    </div>
    <div class="modal-details">
      <div>
        <h3>${t('projectStory')}</h3>
        <p>${localProject.description || 'Add a full project description here.'}</p>
        ${project.highlights?.length ? `<h3>${t('highlights')}</h3><ul>${project.highlights.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
      </div>
      <aside class="modal-meta">
        <strong>${t('role')}</strong><span>${localProject.role || 'Designer / Artist'}</span>
        <strong>${t('year')}</strong><span>${localProject.year || 'Portfolio work'}</span>
        <strong>${t('tools')}</strong><span>${(project.tools || []).join(', ') || 'Photoshop, Illustrator, 3D, AI'}</span>
        ${project.link ? `<strong>${t('link')}</strong><span><a href="${project.link}" target="_blank" rel="noreferrer">${t('openProject')}</a></span>` : ''}
      </aside>
    </div>
    ${galleryMarkup(project)}
  `;
  modal.showModal();
}

function setupModal() {
  const modal = $('#projectModal');
  const close = $('#modalClose');
  if (!modal || !close) return;
  close.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

function setupTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') document.body.classList.add('light');
  const toggle = $('#themeToggle');
  if (!toggle) return;
  toggle.textContent = document.body.classList.contains('light') ? '☀' : '☾';
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const mode = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', mode);
    toggle.textContent = mode === 'light' ? '☀' : '☾';
  });
}

function setupLanguage() {
  const toggle = $('#langToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    applyStaticLanguage();
    applyProfile(profileData);
    activeFilter = 'All';
    renderFilters();
    renderProjects();
    renderHeroGallery();
    observeReveals();
  });
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

function setupSearch() {
  const input = $('#projectSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    searchTerm = input.value;
    renderProjects();
  });
  window.addEventListener('keydown', event => {
    if (event.key === '/' && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
    }
  });
}

function setupStarfield() {
  const canvas = $('#starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;
  const resize = () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    stars = Array.from({ length: Math.min(140, Math.floor(window.innerWidth / 9)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + .3,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      alpha: Math.random() * .55 + .12
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  resize();
  draw();
  window.addEventListener('resize', resize);
}

async function init() {
  setupTheme();
  setupLanguage();
  setupModal();
  setupSearch();
  setupStarfield();
  const [profile, projectData] = await Promise.all([
    getJSON('data/profile.json', fallbackProfile),
    getJSON('data/projects.json', [])
  ]);
  profileData = profile;
  projects = projectData;
  applyStaticLanguage();
  applyProfile(profileData);
  renderHeroGallery();
  renderFilters();
  renderProjects();
  observeReveals();
}

init();
