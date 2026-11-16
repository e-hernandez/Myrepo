#!/usr/bin/env python3
"""Measure room dimensions from the building's A7 plan drawing.

Input : images/plan/A7-plan-original-4958px.jpg (the 4958x3506 architectural plan
        pulled from the SightMap unit map embedded on shorelinegatewayliving.com)
Output: prints the scale and per-room pixel/feet measurements; writes
        interior.npy (bool mask of floor area, used by build_grid.py and
        gen_floor_texture.py).

Method (as used for the 2026-11-16 numbers):
 1. Classify pixels by color: navy walls, cream floor, tan (bath/balcony), white.
 2. Flood-fill the background from the image corner; everything else is "inside".
 3. interior = inside minus walls minus the balcony region (balcony = tan component
    whose centroid is on the right of the drawing, dilated to cover its outline).
 4. Scale: assume the listed 1,010 sq ft is measured to roughly the wall centerline:
    px_per_ft = sqrt((interior_px + wall_px/2) / 1010)  ->  58.7 px/ft.
    Cross-checked against fixtures: doors 36", counter 25.5", island 6'x3', tub ~5'.
 5. Room sizes come from connected cream components and row/column runs.

Accuracy about +/-3%. Requires numpy, pillow, scipy.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = sys.argv[1] if len(sys.argv) > 1 else "images/plan/A7-plan-original-4958px.jpg"
LISTED_SQFT = 1010

im = np.array(Image.open(SRC).convert("RGB")).astype(np.int16)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
wall = (r < 120) & (g < 130) & (b < 150) & (b > r + 8)
cream = (r > 236) & (r < 252) & (g > 236) & (g < 252) & (b > 230) & (b < 248)
tan = (r > 185) & (r < 222) & (g > 175) & (g < 212) & (b > 160) & (b < 196)
bgwhite = (r > 252) & (g > 252) & (b > 252)

lab, _ = ndi.label(bgwhite)
inside = ~(lab == lab[0, 0])

tl, tn = ndi.label(tan)
cnt = np.bincount(tl.ravel())
big = [i for i in range(1, tn + 1) if cnt[i] > 100000]
balc_id = [i for i in big if np.where(tl == i)[1].mean() > 3300][0]
balc = tl == balc_id
balc_region = ndi.binary_dilation(balc, iterations=45) & ~cream & ~wall
interior = inside & ~wall & ~balc_region
np.save("interior.npy", interior)

A, W = interior.sum(), wall.sum()
S = ((A + W / 2) / LISTED_SQFT) ** 0.5
print(f"scale {S:.2f} px/ft  (inside-face {((A)/LISTED_SQFT)**0.5:.2f}, +all walls {((A+W)/LISTED_SQFT)**0.5:.2f})")

def ft(px):
    i = round(px / S * 12)
    return f"{i//12}'{i%12}\""

def sf(px):
    return round(px / S / S)

cl, cn = ndi.label(cream)
cc = np.bincount(cl.ravel())
order = np.argsort(cc)[::-1]
living, bedall, den, entry = (cl == order[1]), (cl == order[2]), (cl == order[3]), (cl == order[4])
closet = bedall & (np.arange(bedall.shape[1])[None, :] < 2690)
bed = bedall & ~closet

def area(m):
    return sf(ndi.binary_fill_holes(m).sum())

print("BEDROOM depth", ft(1462 - 796), "width head wall", ft(3479 - 2699), "width at den wall", ft(3354 - 2699), "area", area(bed))
print("CLOSET", ft(2663 - 2459), "x", ft(1226 - 796), "area", area(closet))
print("DEN width", ft(3247 - 2541), "depth max", ft(2001 - 1492), "area", area(den))
for x in (2600, 2800, 3000):
    ys = np.where(den[:, x])[0]
    print("  den depth at px x", x, ft(ys.max() - ys.min()))
print("LIVING+KITCHEN+DINING area", area(living))
print("  width den wall to window (y=2200px)", ft(3395 - 2053), " island line to window (x=2400px)", ft(2989 - 1960))
print("KITCHEN wall run", ft(2757 - 1798), "island", ft(344), "x", ft(180), "aisle", ft(1871 - 1615))
print("BATH", ft(2380 - 1972), "x", ft(1519 - 796))
print("BALCONY ~", ft(840), "x", ft(330))
print("ENTRY", ft(304), "x", ft(237), " SHELF closet", ft(204), "x", ft(167), " W/D closet", ft(293), "x", ft(195))
print("TOTAL interior (inside face)", sf(A), "sq ft vs listed", LISTED_SQFT)
