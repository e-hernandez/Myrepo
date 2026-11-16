#!/usr/bin/env python3
"""Build data/unit3d.json: the 0.25 ft occupancy grid the planner and renderer use.

Inputs : images/plan/A7-plan-original-4958px.jpg and interior.npy (from measure_plan.py)
Output : unit3d.json with
  cell        0.25 (ft per cell)
  W, H        grid extent in ft (43.5 x 40.75)
  walls       horizontal runs [x, y, w] in ft of wall cells (thin door-leaf lines removed
              by a 13 px morphological opening)
  glass       interior boundary cells with no wall (the curtain wall / windows)
  rail        balcony boundary cells
  floor       walkable interior cells (holes such as text labels filled)
  balcony     balcony floor cells
  wallgrid    rows of '0'/'1' strings for collision tests
  origin_px   pixel of grid cell (0,0) in the original image  -> [1400+x0, 680+y0]
  px_per_ft   58.7

Grid origin in the plan: px (1400, 680) region crop; the published JSON records the exact
origin. Converting a plan pixel to grid feet: x_ft = (px - origin_px[0]) / 58.7.
"""
import json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

S, CELL = 58.7, 0.25
cp = S * CELL
X0, Y0, X1, Y1 = 1400, 680, 3950, 3060

im = np.array(Image.open("images/plan/A7-plan-original-4958px.jpg").convert("RGB"))[Y0:Y1, X0:X1].astype(np.int16)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
wall = (r < 120) & (g < 130) & (b < 150) & (b > r + 8)
wall = ndi.binary_opening(wall, structure=np.ones((13, 13)))
interior = ndi.binary_fill_holes(np.load("interior.npy")[Y0:Y1, X0:X1])
tan = (r > 185) & (r < 222) & (g > 175) & (g < 212) & (b > 160) & (b < 196)
tl, tn = ndi.label(tan)
cnt = np.bincount(tl.ravel())
balc_id = [i for i in range(1, tn + 1) if cnt[i] > 100000 and np.where(tl == i)[1].mean() > 3300 - X0][0]
balc = ndi.binary_fill_holes(tl == balc_id)

ys, xs = np.where(interior | wall | balc)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
W, H = int(np.ceil((x1 - x0) / cp)), int(np.ceil((y1 - y0) / cp))

def grid(mask, thr):
    gm = np.zeros((H, W), bool)
    for j in range(H):
        for i in range(W):
            sl = mask[int(y0 + j * cp):int(y0 + (j + 1) * cp), int(x0 + i * cp):int(x0 + (i + 1) * cp)]
            gm[j, i] = sl.mean() > thr if sl.size else False
    return gm

G_wall = grid(wall, 0.3)
G_in = grid(interior, 0.4) & ~G_wall
G_balc = grid(balc, 0.4)
outside = ~(G_in | G_wall | G_balc)
G_glass = G_in & ndi.binary_dilation(outside, structure=np.ones((3, 3)))
G_rail = G_balc & ndi.binary_dilation(outside, structure=np.ones((3, 3)))

def runs(gm):
    out = []
    for j in range(H):
        i = 0
        while i < W:
            if gm[j, i]:
                k = i
                while k < W and gm[j, k]:
                    k += 1
                out.append([round(i * CELL, 2), round(j * CELL, 2), round((k - i) * CELL, 2)])
                i = k
            else:
                i += 1
    return out

data = dict(cell=CELL, W=round(W * CELL, 2), H=round(H * CELL, 2), walls=runs(G_wall), glass=runs(G_glass),
            rail=runs(G_rail), floor=runs(G_in), balcony=runs(G_balc), origin_px=[int(x0 + X0), int(y0 + Y0)], px_per_ft=S)
data["wallgrid"] = ["".join("1" if v else "0" for v in row) for row in G_wall]
json.dump(data, open("unit3d.json", "w"), separators=(",", ":"))
print("grid", W, "x", H, "cells;", len(data["walls"]), "wall runs;", len(data["floor"]), "floor runs")
