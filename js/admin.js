const $ = (selector, scope = document) => scope.querySelector(selector);
let projects = [];


function fileToProjectPath(file) {
  const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
  return `assets/projects/${safeName}`;
}

function previewFiles(previewEl, files) {
  if (!previewEl) return;
  previewEl.innerHTML = '';
  Array.from(files).forEach(file => {
    const img = document.createElement('img');
    img.alt = file.name;
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);
    previewEl.appendChild(img);
  });
}

function setupImageHelpers() {
  const thumbFile = $('#thumbnailFile');
  if (thumbFile) {
    thumbFile.addEventListener('change', () => {
      const file = thumbFile.files[0];
      if (!file) return;
      $('#thumbnail').value = fileToProjectPath(file);
      previewFiles($('#thumbnailPreview'), [file]);
    });
  }

  const imageFile = $('#imageFile');
  if (imageFile) {
    imageFile.addEventListener('change', () => {
      const file = imageFile.files[0];
      if (!file) return;
      $('#image').value = fileToProjectPath(file);
      previewFiles($('#imagePreview'), [file]);
    });
  }

  const galleryFiles = $('#galleryFiles');
  if (galleryFiles) {
    galleryFiles.addEventListener('change', () => {
      const files = Array.from(galleryFiles.files || []);
      if (!files.length) return;
      const existing = $('#gallery').value.trim();
      const newLines = files.map(fileToProjectPath).join('\n');
      $('#gallery').value = existing ? `${existing}\n${newLines}` : newLines;
      previewFiles($('#galleryPreview'), files);
    });
  }
}

function uid() {
  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function splitComma(value) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function splitLines(value) {
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

function formToProject() {
  return {
    id: $('#projectId').value || uid(),
    title: $('#title').value.trim(),
    category: $('#category').value.trim(),
    subtitle: $('#subtitle').value.trim(),
    description: $('#description').value.trim(),
    thumbnail: $('#thumbnail').value.trim(),
    image: $('#image').value.trim(),
    gallery: splitLines($('#gallery').value),
    tags: splitComma($('#tags').value),
    tools: splitComma($('#tools').value),
    role: $('#role').value.trim(),
    year: $('#yearInput').value.trim(),
    highlights: splitLines($('#highlights').value)
  };
}

function projectToForm(project) {
  $('#projectId').value = project.id || '';
  $('#title').value = project.title || '';
  $('#category').value = project.category || '';
  $('#subtitle').value = project.subtitle || '';
  $('#description').value = project.description || '';
  $('#thumbnail').value = project.thumbnail || '';
  $('#image').value = project.image || '';
  $('#gallery').value = (project.gallery || []).join('\n');
  $('#tags').value = (project.tags || []).join(', ');
  $('#tools').value = (project.tools || []).join(', ');
  $('#role').value = project.role || '';
  $('#yearInput').value = project.year || '';
  $('#highlights').value = (project.highlights || []).join('\n');
  window.scrollTo({ top: $('#projectForm').offsetTop - 120, behavior: 'smooth' });
}

function clearForm() {
  $('#projectForm').reset();
  $('#projectId').value = '';
}

function renderList() {
  const list = $('#adminList');
  if (!projects.length) {
    list.innerHTML = `<div class="help-box">No projects loaded yet.</div>`;
    return;
  }
  list.innerHTML = projects.map((project, index) => `
    <div class="admin-item">
      <div>
        <strong>${project.title || 'Untitled project'}</strong>
        <small>${project.category || 'No category'} · ${(project.tags || []).join(', ') || 'No tags'} · ${project.year || 'No year'}</small>
      </div>
      <div class="admin-actions" style="margin:0">
        <button class="admin-btn" type="button" data-action="edit" data-index="${index}">Edit</button>
        <button class="admin-btn danger" type="button" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      if (button.dataset.action === 'edit') projectToForm(projects[index]);
      if (button.dataset.action === 'delete') {
        projects.splice(index, 1);
        renderList();
      }
    });
  });
}

async function loadFromSite() {
  try {
    const response = await fetch('data/projects.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load projects.json');
    projects = await response.json();
    renderList();
    alert('Loaded projects from the site.');
  } catch (error) {
    alert('Could not load automatically. Open this page through a local server or use Import JSON instead.');
  }
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function prettyJSON() {
  return JSON.stringify(projects, null, 2);
}

function setupStarfield() {
  const canvas = $('#starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dots = [];
  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    dots = Array.from({ length: 90 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + .4, a: Math.random() * .4 + .1 }));
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dots.forEach(dot => {
      ctx.fillStyle = `rgba(255,255,255,${dot.a})`;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize', resize);
}

$('#projectForm').addEventListener('submit', event => {
  event.preventDefault();
  const project = formToProject();
  if (!project.title) return alert('Please add a title.');
  const index = projects.findIndex(item => item.id === project.id);
  if (index >= 0) projects[index] = project;
  else projects.unshift(project);
  renderList();
  clearForm();
});

$('#clearForm').addEventListener('click', clearForm);
$('#loadFromSite').addEventListener('click', loadFromSite);
$('#downloadJson').addEventListener('click', () => download('projects.json', prettyJSON()));
$('#copyJson').addEventListener('click', async () => {
  await navigator.clipboard.writeText(prettyJSON());
  alert('JSON copied.');
});
$('#importFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  projects = JSON.parse(await file.text());
  renderList();
});

setupImageHelpers();
setupStarfield();
renderList();
