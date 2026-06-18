const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const fallbackProfile = {
  name: "Your Name",
  shortName: "YN",
  title: "Graphic Designer & 3D Artist",
  intro: "I build cinematic visual identities, immersive event worlds, 3D characters, and creative campaigns that feel bold, premium, and memorable.",
  focus: "Creative portfolio systems",
  about: "I combine graphic design, 3D composition, event storytelling, and AI visual workflows to turn ideas into polished visual systems.",
  contactText: "For branding, 3D visual concepts, portfolio reviews, event campaign visuals, or motion design storyboards.",
  email: "yourmail@example.com",
  phone: "",
  behance: "",
  instagram: "",
  linkedin: "",
  stats: [
    { value: "30+", label: "Visual concepts" },
    { value: "7+", label: "Creative styles" },
    { value: "3D", label: "Design focus" }
  ],
  skills: ["Brand Identity", "3D Environments", "Event Visuals", "AI Image Direction", "Motion Prompts", "Campaign Design"],
  services: [
    { icon: "◆", title: "Brand Identity", text: "Logo systems, visual language, social templates, and campaign look & feel." },
    { icon: "◐", title: "3D Art Direction", text: "Stylized scenes, character concepts, claymation worlds, and cinematic compositions." },
    { icon: "✦", title: "Event Concepts", text: "Immersive corporate event themes, activations, venue design, and print-ready ideas." },
    { icon: "▣", title: "Motion Storyboards", text: "Start/end frames, AI-video prompts, transitions, and scene-by-scene storytelling." }
  ]
};

let projects = [];
let activeFilter = "All";
let searchTerm = "";

const gradientSet = [
  "linear-gradient(135deg, #0f1020 0%, #8a5cff 42%, #00e0ff 100%)",
  "linear-gradient(135deg, #140d22 0%, #ff4ecd 48%, #ffb86c 100%)",
  "linear-gradient(135deg, #061a22 0%, #00e0ff 38%, #57ffb7 100%)",
  "linear-gradient(135deg, #1b0b16 0%, #ff4e7a 38%, #8a5cff 100%)",
  "linear-gradient(135deg, #0b1229 0%, #375cff 45%, #00e0ff 100%)",
  "linear-gradient(135deg, #141414 0%, #8a5cff 45%, #f6f7ff 100%)"
];

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

function applyProfile(profile) {
  $$('[data-profile]').forEach((node) => {
    const key = node.dataset.profile;
    if (profile[key]) node.textContent = profile[key];
  });

  const stats = $('#stats');
  if (stats) {
    stats.innerHTML = (profile.stats || []).map((item) => `
      <div class="stat"><strong>${item.value}</strong><span>${item.label}</span></div>
    `).join('');
  }

  const serviceGrid = $('#serviceGrid');
  if (serviceGrid) {
    serviceGrid.innerHTML = (profile.services || fallbackProfile.services).map((service) => `
      <article class="service-card reveal">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.text}</p>
      </article>
    `).join('');
  }

  const skillCloud = $('#skillCloud');
  if (skillCloud) {
    skillCloud.innerHTML = (profile.skills || []).map(skill => `<li>${skill}</li>`).join('');
  }

  const contactActions = $('#contactActions');
  if (contactActions) {
    const contacts = [
      profile.email && { label: 'Email Me', url: `mailto:${profile.email}`, primary: true },
      profile.behance && { label: 'Behance', url: profile.behance },
      profile.instagram && { label: 'Instagram', url: profile.instagram },
      profile.linkedin && { label: 'LinkedIn', url: profile.linkedin },
      profile.phone && { label: 'WhatsApp / Call', url: `tel:${profile.phone}` }
    ].filter(Boolean);
    contactActions.innerHTML = contacts.map((item) => `
      <a class="${item.primary ? 'primary-btn' : 'secondary-btn'}" href="${item.url}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${item.label}</a>
    `).join('');
  }

  $('#year').textContent = new Date().getFullYear();
}

function projectBackground(project, index) {
  if (project.image) return `url('${project.image}')`;
  return gradientSet[index % gradientSet.length];
}

function renderFilters() {
  const tags = [...new Set(projects.flatMap(project => project.tags || []))].sort();
  const filters = ['All', ...tags];
  const container = $('#filters');
  if (!container) return;
  container.innerHTML = filters.map(tag => `
    <button class="filter-btn ${tag === activeFilter ? 'active' : ''}" type="button" data-filter="${tag}">${tag}</button>
  `).join('');
  $$('.filter-btn', container).forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function filteredProjects() {
  return projects.filter(project => {
    const matchesFilter = activeFilter === 'All' || (project.tags || []).includes(activeFilter);
    const haystack = `${project.title} ${project.subtitle} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderProjects() {
  const grid = $('#projectGrid');
  if (!grid) return;
  const visible = filteredProjects();
  if (!visible.length) {
    grid.innerHTML = `<div class="help-box">No projects match this filter yet. Add more projects in <strong>data/projects.json</strong>.</div>`;
    return;
  }
  grid.innerHTML = visible.map((project, index) => `
    <article class="project-card reveal" data-project-id="${project.id}">
      <div class="project-media" style="background:${projectBackground(project, index)}"></div>
      <div class="project-content">
        <div class="project-tags">${(project.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <h3>${project.title}</h3>
        <p>${project.subtitle || project.description || ''}</p>
      </div>
    </article>
  `).join('');

  $$('.project-card', grid).forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.projectId));
  });
  observeReveals();
}

function openProject(id) {
  const project = projects.find(item => String(item.id) === String(id));
  if (!project) return;
  const modal = $('#projectModal');
  const modalBody = $('#modalBody');
  const index = projects.indexOf(project);
  const bg = projectBackground(project, index);
  modalBody.innerHTML = `
    <div class="modal-hero" style="background:${bg}">
      <div class="modal-copy">
        <div class="project-tags">${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <h2>${project.title}</h2>
        <p>${project.subtitle || ''}</p>
      </div>
    </div>
    <div class="modal-details">
      <div>
        <h3>Project Story</h3>
        <p>${project.description || 'Add a full project description here.'}</p>
        ${project.highlights?.length ? `<h3>Highlights</h3><ul>${project.highlights.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
      </div>
      <aside class="modal-meta">
        <strong>Role</strong><span>${project.role || 'Designer / Artist'}</span>
        <strong>Year</strong><span>${project.year || '2026'}</span>
        <strong>Tools</strong><span>${(project.tools || []).join(', ') || 'Photoshop, Illustrator, 3D, AI'}</span>
        ${project.link ? `<strong>Link</strong><span><a href="${project.link}" target="_blank" rel="noreferrer">Open project ↗</a></span>` : ''}
      </aside>
    </div>
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
    stars = Array.from({ length: Math.min(120, Math.floor(window.innerWidth / 10)) }, () => ({
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
  setupModal();
  setupSearch();
  setupStarfield();
  const [profile, projectData] = await Promise.all([
    getJSON('data/profile.json', fallbackProfile),
    getJSON('data/projects.json', [])
  ]);
  projects = projectData;
  applyProfile({ ...fallbackProfile, ...profile });
  renderFilters();
  renderProjects();
  observeReveals();
}

init();
