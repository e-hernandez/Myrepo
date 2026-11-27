# Shoreline Gateway 2607

Car-free neighborhood guide, measured floor plan, 3D room planner, shopping list and buy list for
unit 2607 (plan A7) at Shoreline Gateway, 777 E Ocean Blvd, Long Beach, CA. Built with Claude,
November 12–27, 2026, as a claude.ai artifact; this folder is the full source and research so the
project can continue elsewhere or become an app.

- Start with **HANDOFF.md** (what exists, how it was made, conventions, open items; section 9 is the 11/27 update).
- **PROMPT-FOR-NEXT-CLAUDE.md** is the paste-ready brief for a new Claude session.
- `artifact/` the published page and its scripts · `data/` app-ready JSON (grid, layouts, shopping cards, votes, buy list, tour index) · `images/` plans, renders, product photos, tour stills · `research/` findings, decisions, sources · `scripts/` the measurement, grid, texture, render and verification tools.

Quick start for the page: open `artifact/shoreline-gateway-guide.html` in a browser (wrap it in a
minimal html/body if viewing locally; it is written for the claude.ai artifact skeleton), or publish
it as an artifact with `capabilities: {db: {}}`.

Quick start for the data: `node -e "console.log(require('./data/planner-layouts.json').LDESK)"`.
