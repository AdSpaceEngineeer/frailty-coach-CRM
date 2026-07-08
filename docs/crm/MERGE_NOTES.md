# CRM Merge Notes

This integration keeps the original Frailty Coach app intact and adds the CRM as a companion route.

## Additive CRM Files

- `crm.html`
- `crm.css`
- `src/crm.js`
- `docs/crm/README.md`
- `docs/crm/DEMO.md`
- `docs/crm/USER_GUIDE.md`
- `docs/crm/MERGE_NOTES.md`

## Existing Files Updated

- `.github/workflows/pages.yml`: includes `crm.html` and `crm.css` in the Pages artifact.
- `sw.js`: caches CRM runtime files.
- `README.md`: adds Kampong CRM link and feature summary.
- `DEMO.md`: adds CRM demo links.

## Full Duplicates Between Repos

These files were identical in `AdSpaceEngineeer/frailty-coach-CRM` and `cst-labs/frailty-coach`, so they are left unchanged:

- `.gitignore`
- `manifest.webmanifest`
- `styles.css`
- `src/app.js`
- `src/data.js`
- `src/logic.js`
- `tests/logic.test.mjs`
- `design-qa.md`
- `assets/illustrations/*.png`
- `design/mockups/**`
- `product-design-audit/**`

## Overwrite Avoided

The CRM fork had changed or replaced top-level docs and `index.html`. This integration avoids that risk:

- Original `/index.html` remains the elder-facing app.
- CRM is available at `/crm.html`.
- CRM docs are preserved under `docs/crm/`.
