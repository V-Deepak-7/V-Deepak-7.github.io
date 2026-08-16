# Deploying to GitHub Pages

1. Create (or reuse) a repo, e.g. `V-Deepak-7.github.io` for a root-level personal site,
   or any repo name with Pages enabled for a project site.
2. Copy `index.html`, `style.css`, `script.js`, `data.js`, and the `assets/` folder into
   the repo root.
3. Add your resume PDF at `assets/Deepak_Vungarala_CV.pdf` (the CV section's "Download PDF"
   button points here — swap in the real file, or ask me to generate a polished PDF version
   of the CV and I'll drop it in).
4. Push to `main`, then in the repo: **Settings → Pages → Source → Deploy from branch →
   main / (root)**.
5. Site goes live at `https://v-deepak-7.github.io/<repo-name>/` (or
   `https://v-deepak-7.github.io/` if the repo is named `V-Deepak-7.github.io`).

## Editing content later
- New paper → add one object to the `PUBLICATIONS` array in `data.js`.
- New role/internship → add one object to `TIMELINE`.
- CV blocks (education, awards, skills, service) → edit `CV_DATA` in `data.js`.
No HTML editing needed for routine updates.

## Notes
- Pure HTML/CSS/JS, no build step, no dependencies beyond Google Fonts.
- Theme (light/dark) is remembered per-visitor via `localStorage`.
- All entrance animations respect `prefers-reduced-motion`.
