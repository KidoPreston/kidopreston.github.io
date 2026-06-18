# Kido Preston Portfolio — Interactive Experience Version

A GitHub Pages-ready portfolio for Kido Preston.

## Main improvements in this version

- Rebuilt hero visual into a cleaner Visual OS / portfolio lab.
- Added a sticky interactive scroll showcase where project cards move in depth while scrolling.
- Removed text-over-image overlap from project cards.
- Fixed Back to top button and footer link.
- Improved project modal scrolling.
- Kept editable structure using `data/profile.json` and `data/projects.json`.

## Upload to GitHub Pages

Upload the contents of this folder directly into your `kidopreston.github.io` repository:

- `index.html`
- `admin.html`
- `README.md`
- `css/`
- `js/`
- `data/`
- `assets/`
- `.nojekyll`

Do not upload the folder itself.

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
kidopreston.github.io/kido-preston-portfolio-experience/index.html
```

## Editing profile

Edit:

```text
data/profile.json
```

## Editing projects

Edit:

```text
data/projects.json
```

Images should be uploaded to:

```text
assets/projects/
```

Then reference them in `data/projects.json` using paths like:

```json
"thumbnail": "assets/projects/my-cover.jpg"
```

## Important

After uploading a new version to GitHub, hard refresh the website:

- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

This prevents your browser from showing cached old CSS/JS.
