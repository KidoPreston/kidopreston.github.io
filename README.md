# Dark Creative Portfolio Website

A free GitHub Pages-ready portfolio website for a graphic designer / 3D artist.

## What is included

- `index.html` — the public portfolio website
- `admin.html` — a helper editor for creating a new `projects.json`
- `css/styles.css` — all visual styling and responsive layout
- `js/app.js` — dynamic project loading, filters, search, modal, dark/light mode
- `js/admin.js` — the local content editor
- `data/profile.json` — your personal information, services, skills, and contact links
- `data/projects.json` — your portfolio projects
- `assets/projects/` — put your portfolio images here

## Important note about “dynamic” editing

GitHub Pages is static hosting. That means there is no real backend database or private admin dashboard unless you connect an external CMS/backend. This website is dynamic on the visitor side because it loads content from JSON files, filters work live, search works live, and projects open in a modal.

To update the live site, replace files in the GitHub repository:

- Change profile details in `data/profile.json`
- Add/edit projects in `data/projects.json`
- Upload images into `assets/projects/`

You can use `admin.html` to create/export an updated `projects.json` file.

## How to publish on GitHub Pages for free

1. Create a GitHub account or sign in.
2. Create a new repository named exactly:

   `yourusername.github.io`

   Replace `yourusername` with your GitHub username.

3. Upload all files from this folder into that repository.
4. Go to repository `Settings` → `Pages`.
5. Under “Build and deployment,” choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save.
7. Your site should publish at:

   `https://yourusername.github.io`

## How to customize your name and contact

Open `data/profile.json` and replace:

```json
"name": "Your Name",
"email": "yourmail@example.com",
"behance": "",
"instagram": "",
"linkedin": ""
```

Add your real links between the quotation marks.

## How to add a new project manually

1. Put the image in `assets/projects/`, for example:

   `assets/projects/my-project-cover.jpg`

2. Open `data/projects.json`.
3. Add a new project object:

```json
{
  "id": "my-project",
  "title": "My Project",
  "subtitle": "Short project description.",
  "description": "Longer project story here.",
  "image": "assets/projects/my-project-cover.jpg",
  "tags": ["3D", "Branding"],
  "tools": ["Photoshop", "Illustrator", "Blender"],
  "role": "Designer / 3D Artist",
  "year": "2026",
  "highlights": [
    "Main highlight one",
    "Main highlight two"
  ]
}
```

## How to update using admin.html

1. Open your published website and go to `/admin.html`.
2. Click “Load from data/projects.json”.
3. Add/edit/delete project cards.
4. Click “Download projects.json”.
5. In GitHub, replace the old `data/projects.json` with the downloaded file.
6. Upload any new images into `assets/projects/`.

## Recommended image settings

- Best cover size: 1600 × 1100 px or larger
- Format: JPG or WebP
- Keep each image under 1–2 MB for faster loading
- Use short lowercase file names, for example:

  `tp-summer-journey.jpg`

## Optional next upgrade

If you later want a true login-based admin panel that saves instantly from the browser, the best next step is connecting a CMS such as Decap CMS or hosting the site on Netlify. For the free GitHub Pages version, this JSON workflow is the simplest and safest.
