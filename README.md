# ASF Visualizer

[Open the app](https://sauravnrai.github.io/ASF-visualizer/) · [ASF hub](https://sauravnrai.github.io/ASF/) · [Analytics](https://sauravnrai.github.io/ASF-analytics/)

A dependency-free CSV/JSON chart explorer. Select bar, line, or scatter; choose fields; inspect point tooltips; view the accessible data table; export SVG charts or the dataset.

## Chart behavior
Bar charts show the first 24 valid rows, lines the first 200, scatter the first 500. Bars are per record, **not grouped aggregates**. Lines preserve input order; use sorted input for time series. Scatter requires numeric X and Y; bar/line require numeric Y. Missing and nonnumeric points are excluded and counted. Y axes include zero. Sampling and skipped-point counts are displayed; full data remains available in Analytics/export.

## Input and privacy
CSV must have unique nonempty headers; quoted commas, escaped quotes, multiline fields and CRLF are supported. JSON must be an array of flat scalar-valued objects. Limits: 2 MiB, 10,000 rows, 50 columns. Null and empty strings are missing; booleans are not numeric. The monthly demo is synthetic.

No backend, telemetry, API keys, CDNs, or external fonts. Data stays in the browser, with same-tab sessionStorage for cross-app handoff. Other apps on the same `sauravnrai.github.io` origin can technically access it; avoid sensitive data. Clear saved workspace when finished. Session restoration is browser-dependent. If storage is blocked, use export/import to transfer between apps. CSV exports neutralize formula-prefixed text cells.

## Development / Pages
Serve `docs/` with `python3 -m http.server 8080 --directory docs`. Pages source is `main` → `/docs`, with `.nojekyll`. All runtime assets are local, copied from the hub so this repository deploys independently. Keep `assets/data.js`, `navigation.js`, `styles.css`, and `data/sample.csv` synchronized with [ASF](https://github.com/sauravnrai/ASF). Shared schema: `asf.workspace.v1`. Cross-app links use explicit project paths and should be opened in the same tab.

## App Network & new guide

[App Network Hub](https://sauravnrai.github.io/) · [Discovery](https://sauravnrai.github.io/discovery/) · [Read the new guide](https://sauravnrai.github.io/ASF-visualizer/guide.html) · [Source-project catalog](https://sauravnrai.github.io/projects.html)

Choose the chart that answers the question — Bar, line, or scatter—with the limitations visible. Global navigation connects every browser app in both directions. Runtime assets remain bundled locally; Discovery email links only open drafts and never claim background delivery. `assets/network.css` keeps the expanded navigation responsive.
