# Kido Preston Portfolio — Final Version

A GitHub Pages-ready portfolio for Kido Preston.

## What is included

- `index.html` — the public portfolio website
- `admin.html` — local helper page for editing/exporting `projects.json`
- `css/styles.css` — full visual style and responsive layout
- `js/app.js` — interactions, filters, modal, language toggle, scroll experience
- `data/profile.json` — profile, services, contact links, text and Arabic translation
- `data/projects.json` — project categories, covers, galleries and metadata
- `assets/projects/` — portfolio images and cover images
- `.nojekyll` — keeps GitHub Pages from ignoring files/folders

## Upload to GitHub

Upload the contents of this folder directly into `kidopreston.github.io`.

Correct:

```text
kidopreston.github.io/index.html
kidopreston.github.io/css/
kidopreston.github.io/js/
kidopreston.github.io/data/
kidopreston.github.io/assets/
```

Wrong:

```text
kidopreston.github.io/kido-preston-portfolio-final/index.html
```

## Updating your profile

Edit:

```text
data/profile.json
```

Change name, title, intro, email, WhatsApp, Behance, services and skills.

## Updating projects

Edit:

```text
data/projects.json
```

For each project, you can add:

- `thumbnail` for the card cover
- `image` for the main modal hero image
- `gallery` for multiple project images
- `category`, `tags`, `description`, `tools`, `year`, `role`

Upload images to:

```text
assets/projects/
```

Then reference them like:

```json
"thumbnail": "assets/projects/my-cover.jpg"
```

## Important note

GitHub Pages is static hosting. It cannot save uploaded images directly from the website itself. Use `admin.html` to prepare/export data, then replace `data/projects.json` on GitHub and upload any images to `assets/projects/`.
