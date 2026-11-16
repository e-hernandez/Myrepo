# Paste this to the next Claude session (after cloning this repo)

I'm Eduardo. I signed a lease for unit 2607 at Shoreline Gateway, 777 E Ocean Blvd, Long Beach, CA 90802, move-in January 7, 2027. A previous Claude session built a four-tab artifact (neighborhood guide, measured floor plan, 3D room planner, shopping list with votes) and did the research. Everything is in the `shoreline-gateway/` folder of this repo.

Start by reading `shoreline-gateway/HANDOFF.md`, then `research/measurements.md` and `research/decisions-and-shopping.md`. Do not re-derive the room dimensions or re-research the furniture unless I ask; the numbers there were measured from the building's own plan drawing and checked against the wall grid in `data/unit3d.json`.

What I want next: turn this into an app. Keep these conventions:
- Feet for positions (grid origin top-left, +y down), inches for item sizes, rotation in degrees clockwise, item "back" is local −y. `data/unit3d.json` is the collision grid (0.25 ft cells).
- `artifact/furniture.js` is the 3D furniture mesh library; `data/planner-layouts.json` holds the five saved layouts and 39 presets; `data/shopping-cards.json` holds all 65 products with planner sizes; `data/votes-2026-11-16.json` has my thumbs votes (down = hide; I haven't thumbed anything up yet).

Decisions already made: Coaster Jessica white king bed from Caravana; 65–75" TV wall-mounted on the bedroom's den wall; PS5 and Switch on HIDEit wall mounts; sectional against the living room's angled den wall facing the water, no living-room TV; den is my office with a Secretlab TITAN Evo and a FlexiSpot E7L L-shaped standing desk (return toward the glass), two white BenQ Mac monitors, four laptops in a vertical stand; a lift-top coffee table.

If you republish the artifact page, publish `artifact/shoreline-gateway-guide.html` with `capabilities: {db: {}}` so the thumbs votes keep saving. Open items I still owe you: the lease PDF (send as screenshots if PDF upload fails), and which PS5 model I have.
