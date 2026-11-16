# Shoreline Gateway 2607 — project handoff

Everything a new Claude (or a developer) needs to pick this up and turn it into an app.
Written 2026-11-16 at the end of a multi-day session. Read this file first, then
`PROMPT-FOR-NEXT-CLAUDE.md`.

## 1. What this is
Eduardo signed a lease for unit 2607 at Shoreline Gateway, 777 E Ocean Blvd, Long Beach,
CA 90802 (plan A7: 1 bed + den, 1 bath, 1,010 sq ft listed, 26th floor). Move-in is
January 7, 2027. He has no car for the first months.

Over the session we built one published Claude artifact with four tabs:
1. **Neighborhood** — car-free guide: transit (Metro A Line, LBT, free Passport and LB Circuit
   shuttles, bike share) and 32 places with walk times and Google Maps links.
2. **Unit 2607** — measured floor plan, room table, move-in logistics, door/elevator fit table.
3. **3D planner** — draggable 2D plan + three.js dollhouse view built from a 0.25 ft wall grid
   measured off the building's own plan drawing. Furniture as shaped meshes, free rotation,
   collision against walls, five saved layouts, add-from-shopping, localStorage persistence.
4. **Shopping** — 65 product cards (links, prices, dims, fit notes, Add-to-planner, thumbs up/down).
   Votes persist in the artifact's shared `db` (collection `votes`).

Live artifact (owner's account): https://claude.ai/artifact/Y5EjeENEeky1ortTU7CzBK
(`#guide`, `#unit`, `#planner`, `#shop`). To republish elsewhere, publish
`artifact/shoreline-gateway-guide.html` with `capabilities: {db: {}}`.

## 2. Repository map
```
shoreline-gateway/
  HANDOFF.md                      this file
  PROMPT-FOR-NEXT-CLAUDE.md       paste-ready brief for the next session
  README.md                       short index
  artifact/
    shoreline-gateway-guide.html  the complete published page (1.5 MB, images inlined as data URIs)
    planner.js                    planner script as embedded in the page (2D canvas, 3D scene, layouts, presets)
    furniture.js                  shared buildFurniture(it, THREE) mesh builder (bed, sofa, sectional, table, chair, desk, storage, rug, plant, stool)
  data/
    unit3d.json                   0.25 ft occupancy grid of the unit: walls, glass, rail, floor, balcony runs; wallgrid strings; origin_px; px_per_ft=58.7
    planner-layouts.json/.js      PRESETS (39), DEFAULT, WALLSOFA, VIEWDESK, LDESK, BEDONLY layouts; DEN wall line; FIXED built-ins (counter, island)
    shopping-cards.json           all 65 shopping cards: id, section, vendor, name, price, dims, note, url, planner {n,k,w,d,h,c}, has_image
    shopitems.json                the first 36 cards' source data (earlier format)
    votes-2026-11-16.json         the owner's thumbs votes exported from the artifact db (8 downs, 0 ups)
    places.json                   32 neighborhood places (n,c,t,a,mi,note,verify)
    den.json                      first (superseded) den-wall fit; the live one is DEN in planner-layouts.json
  images/
    plan/A7-plan-original-4958px.jpg   the building's architectural drawing of plan A7 ("UNIT 1C-3")
    plan/A7-plan-2d-900px.jpg, A7-plan-furnished-render-900px.jpg   SightMap 2D and 3D marketing images
    plan/A7-measured-dimensions.png    our dimensioned overlay
    plan/floor-texture-materials.jpg   1200 px floor texture (wood/carpet/tile/concrete) aligned to the grid extent
    plan/floor-texture-plan.jpg        same extent, the plan drawing itself (used by the 2D canvas)
    plan/A7-building-render-user-upload.webp   the furnished render the user sent as the look reference
    unit-2607-dollhouse-jessica-king.png       our headless three.js render, bed only
    products/*.jpg                     product photos (800 px) keyed by card image id
  research/
    measurements.md                room sizes, clearances, grid coordinates, how they were derived
    move-in-and-building.md        building facts, move-in email, fit-through-the-door table
    decisions-and-shopping.md      user decisions, vendor/delivery notes, price snapshot, known gaps
    sources.md                     every URL used
    vendor-catalogs/               Caravana (961 products) and Secretlab catalog JSON (gzipped), HIDEit, Floativa, Caravana shortlist with dims
  scripts/
    measure_plan.py                plan → scale + room measurements (+ interior.npy)
    build_grid.py                  plan + interior.npy → data/unit3d.json
    gen_floor_texture.py           → floor-color.jpg
    render-dollhouse.js            Playwright + three.js headless render (needs unit3d.json, floor texture, furniture.js)
    verify-page.js                 Playwright smoke test of the page (layouts clear of walls, no JS errors)
    fetch_caravana.sh              catalog pull notes; which vendor sites answer plain fetches
```

## 3. Coordinate system (important for the app)
- Units: feet, origin at the top-left of the grid; +x right, +y DOWN the plan (north is up). Furniture sizes are inches (w = along local x, d = along local y, h). `r` is rotation in degrees, clockwise on screen; local −y is the item's "back" (headboard, sofa back).
- Pixel ↔ feet: `x_ft = (px − origin_px[0]) / 58.7` (origin_px in unit3d.json). Grid cell = 0.25 ft.
- three.js mapping: plan x → scene x, plan y → scene z, height → scene y; `rotation.y = −r·π/180`.
- Collision: an item overlaps if any sample point of its rotated footprint (0.2 ft spacing, 0.1 ft inset) lands on a `wallgrid` '1' cell, a non-floor/non-balcony cell, or inside a FIXED built-in rect. Same math in `planner.js` (`collides`) and `scripts/verify-page.js`.
- Door/den facts in grid ft are in `research/measurements.md`.

## 4. How the numbers were made (so you can trust or redo them)
1. The building publishes no room dimensions. Its floor-plans page embeds a SightMap unit map; the map's JSON (`https://sightmap.com/app/api/v1/960p7ngdw7n/sightmaps/13981`) lists plans with image URLs; plan A7 (id 167696) has a 4958 px architectural drawing (`images/plan/A7-plan-original-4958px.jpg`).
2. `scripts/measure_plan.py`: color-classify, flood-fill, scale from the listed 1,010 sq ft measured to about the wall centerline → 58.7 px/ft; cross-checked on doors (36"), counter depth (25.5"), island (6'×3'), tub (~5'). ±3%.
3. `scripts/build_grid.py`: wall mask with thin door-leaf lines removed (13 px opening), 0.25 ft cells, runs for walls/glass/rail/floor/balcony.
4. Room table and overlay image from component extents (see measurements.md).
5. Furniture fit decisions were checked numerically against the grid (node snippets, same `collides` logic) before being stated to the user.

## 5. Product data conventions
Card `planner` object: `{n, k, w, d, h, c}`; `k` ∈ bed, sofa, sectional, table, roundtable, chair, stool, desk, storage, rug, plant, generic. Card `id` is a slug of the URL + 6-char md5 (stable key for votes). Sections: shop-picked, shop-ns, shop-beds, shop-sect, shop-office, shop-lift, shop-console. Prices are strings as displayed, snapshot 2026-11-16.

## 6. Artifact runtime notes
- The page is written for the claude.ai Artifact page contract: no html/head/body wrapper, `<title>` and `<style>` first, theme tokens on `:root` with dark overrides, CDN scripts only from cdnjs/jsdelivr (three r128 + OrbitControls 0.128.0), everything else inline/data-URI.
- Capabilities declared: `db` (default rules; owner writes). Votes: `db.doc('votes/'+cardId).set({vote, n, v, price, url, sec, at})`; page subscribes with `onSnapshot`, mirrors to localStorage `sg2607-votes`. Layouts persist in localStorage `sg2607-layout-v1`.
- Tabs are hash-routed (`#guide|#unit|#planner|#shop`); the 3D view initializes lazily when its tab is first shown (`window.__plannerShow`). `window.__plannerAdd(item)` adds a card to the planner.
- Verified with Playwright (chromium, swiftshader WebGL): all five layouts "0 of N items overlap a wall", no page errors, no horizontal scroll at 400 px.

## 7. Suggested app architecture (if you build it)
- Data layer: `unit3d.json` + `planner-layouts.json` + `shopping-cards.json` + `votes` are already app-shaped. Keep the ft/inch conventions above.
- Keep `furniture.js` as the mesh library; replace the inline 2D canvas with a proper editor (snap to walls using the DEN/glass line formulas; add arbitrary wall snapping by fitting lines from `wallgrid`).
- Vendor sync: Shopify stores (`/products.json`) are easy; Home Depot product pages are fetchable; Wayfair/Amazon/Target/Walmart/Living Spaces/Bob's/IKEA need a real browser.
- Owner votes → "find similar" is the next feature the user asked for: filter by liked cards' vendor/style/dims and re-query.

## 8. Open items the user still owes
- The lease PDF (TV mounting and delivery COI terms). Ask again; PDFs were being dropped by the chat surface, so request screenshots or pasted text.
- Which PS5 (original/Pro vs Slim) — decides the HIDEit mount and shelf depth.
- Thumbs-up votes (none yet) to drive "find similar".
