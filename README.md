# Kido Preston Portfolio Website

A free GitHub Pages-ready portfolio for Kido Preston: a dark, experimental, blue-accented personal freelance portfolio for graphic design, 3D visualization, AI concepts, VR tours, motion graphics, and concept-to-real environmental branding.

## What changed in this version

- Name updated to **Kido Preston**.
- Title updated to **Multidisciplinary Visual Designer & 3D Creator**.
- Dark creative experimental style with blue accents.
- Hero visual changed to a **rotating 3D portfolio gallery**.
- Added **English / Arabic language toggle**.
- Portfolio projects created from the uploaded PDF portfolio.
- Project modals support multiple-image galleries.
- Admin helper now supports category, thumbnail, main image, and gallery image paths.

## How to upload to GitHub

Upload all files and folders inside this folder into the root of your GitHub repository:

```text
index.html
admin.html
README.md
.nojekyll
css/
js/
data/
assets/
```

Your repository should look like this:

```text
kidopreston.github.io/
├── index.html
├── admin.html
├── README.md
├── css/
├── js/
├── data/
└── assets/
```

Do not upload the whole folder as one folder inside the repository. The `index.html` file must be directly visible in the repository root.

## How to edit your personal information

Edit:

```text
data/profile.json
```

Useful fields:

```json
"name": "Kido Preston",
"title": "Multidisciplinary Visual Designer & 3D Creator",
"email": "kido.preston@gmail.com",
"phone": "+201092847473",
"whatsapp": "https://wa.me/201092847473",
"behance": ""
```

Add your Behance URL when ready:

```json
"behance": "https://www.behance.net/yourusername"
```

## How to add project images

1. Upload images to:

```text
assets/projects/
```

2. Edit:

```text
data/projects.json
```

3. Use image paths like this:

```json
"thumbnail": "assets/projects/my-cover.jpg",
"image": "assets/projects/my-cover.jpg",
"gallery": [
  "assets/projects/my-cover.jpg",
  "assets/projects/my-detail-01.jpg",
  "assets/projects/my-detail-02.jpg"
]
```

## How to use the admin page

Open:

```text
https://kidopreston.github.io/admin.html
```

Use it to load existing projects, add/edit projects, then download a new `projects.json` file.

Because GitHub Pages is static hosting, the admin page cannot save directly into GitHub by itself. After downloading the new `projects.json`, upload it manually to replace:

```text
data/projects.json
```

## Categories included

- Graphic Design
- Event Design
- Concept to Real
- 3D Visualization
- VR Tours
- Motion & Video

## Important note

The current project images are rendered from the PDF portfolio you uploaded. Replace or add higher-resolution images anytime by uploading them to `assets/projects/` and updating `data/projects.json`.
