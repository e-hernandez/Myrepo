# Unit 2607 (plan A7) measurements

All measured from the building's own plan drawing (images/plan/A7-plan-original-4958px.jpg)
at 58.7 px/ft, derived from the listed 1,010 sq ft and verified against 36" doors, 25.5" counter
depth, a 6'×3' island and a ~5' tub. Accuracy about ±3% (±4" on a 12 ft wall). Nobody publishes
room dimensions for this building; leasing may have the dimensioned architectural A7 sheet.

| Room | Size | Area | Notes |
|---|---|---|---|
| Bedroom | 11'4" deep × 13'3" at the head wall, 11'2" at the den wall | ~130 sq ft | Head wall is the top wall (shared with... nothing: it is exterior). A 4 ft wide, 6" deep bump (chase) on the head wall on the window side. Balcony door on the angled glass wall near the foot of the bed. Closet door on the left wall near the head end (opening ~2.9–5.45 ft from the top). Bedroom door at the bottom-left, swinging in along the den wall. |
| Bedroom closet | 7'4" × 3'6" | ~20 sq ft | Walk-in, shelf and rod on the long side. |
| Den | 12'0" wide along the bedroom wall; 6'2" deep at the door end to 8'4" at the glass | ~77 sq ft | Trapezoid. Door is on the SIDE wall (left, toward the living room, opening ~3.5 ft tall in plan at grid y 16–19.5), so the full 12 ft back wall is clear. Glass on the right faces east-southeast: morning sun, glare for screens facing it. |
| Living/dining | 22'10" den wall to window; 17'6" island line to window | ~300 sq ft beyond the island (465 total open area) | Curved glass on the long side. Only solid wall is the den wall, which runs at ~18° to the plan (living-room face: y = 0.3243x + 13.776 in grid ft, x from 18.1 to 28.9). Round structural column near the south window (~2'8" dia). |
| Kitchen | 16'4" wall run (13'4" counter + fridge), 6'×3' island, 4'4" aisle | — | Counter depth 25.5". Fridge at the entry end. |
| Bathroom | 6'11" × 12'4" incl. tub alcove | ~80 sq ft | Double vanity, toilet nook, 60" tub-shower. |
| Entry | 5'2" × 4'0" | ~18 sq ft | Shelf closet 3'6" × 2'10"; W/D closet 5'0" × 3'4"; HP (heat pump) closet 2'4" × 2'2". |
| Balcony | 14'4" × 5'7" | ~62 sq ft | Off the bedroom. |

## Key furniture clearances (as planned)
- Jessica king (88 × 88.75 × 43.25): headboard on the top wall, set 6" off it to clear the chase, pushed toward the window. About 4'0" on the closet side (closet door clears), ~3'4" at the foot to the den wall, window-side gap 23" at the head narrowing to a few inches at the foot. An 18" nightstand fits on the window side; the Jessica 202992 nightstand (26") needs the bed shifted ~2" toward the closet.
- TV on the bedroom's den wall (11'2"): centered on the bed, 59"–121" from the closet-side corner for a 70"; 57"–123" for a 75"; the bedroom door swing uses the left 36". Viewing distance ~10–10.5 ft. Screen center 48–52", tilting mount, metal-stud toggles.
- Den desk: back wall holds up to an 8 ft desk (even ~11 ft). Recommended 72" FlexiSpot E7 or the FlexiSpot E7L L-desk (76 × 24 run + 55 × 28 return, reversible, return on the right toward the glass, corner ~8" from the glass at the return's far end). Chair (Titan Evo, ~27 × 27) has ~6'5" behind the desk.
- Sectional against the den wall (living room): any of the listed ones fit; the 119" chenille leaves ~1 ft each end; chaise toward the window.

## Grid coordinates (data/unit3d.json, feet from the grid origin, +y is down the plan)
- Bedroom head wall interior: y 1.98, x 22.13 → 35.42. Bedroom/den partition (bedroom side): y 13.32. Den top wall interior: y 13.75, x 19.75 → 31.75 at y 14.
- Den door opening: x ≈ 19.25–19.5, y 16 → 19.5. Den glass line: x = 40.05 − 0.5088·y for y 14.25–21.5.
- Living-room face of the den wall: y = 0.3243·x + 13.776, x 18.1 → 28.9 (angle 18.0°).
- Kitchen counter: x 1.53–3.66, y 19.05–35.4. Island: x 8.02–11.07, y 23.56–29.42.
- Balcony top-left ≈ (33.05, 1.36). Bath top-left ≈ (9.74, 1.98).
- Pixel → ft: x_ft = (px_x − origin_px[0]) / 58.7, same for y; origin_px is in unit3d.json.
