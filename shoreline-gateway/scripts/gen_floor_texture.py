#!/usr/bin/env python3
"""Paint the floor texture used by the 3D views (walnut planks in living areas, carpet in
the bedroom, tile in the bath, concrete on the balcony).

Inputs : images/plan/A7-plan-original-4958px.jpg, interior.npy, data/unit3d.json (for origin and extent)
Output : floor-color.jpg, 1200 px wide, covering exactly the grid extent so UV (0..1) maps to grid ft.
"""
import json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

S, CELL = 58.7, 0.25
cp = S * CELL
U = json.load(open("data/unit3d.json"))
ox, oy = U["origin_px"]
W, H = int(round(U["W"] / CELL)), int(round(U["H"] / CELL))

im = np.array(Image.open("images/plan/A7-plan-original-4958px.jpg").convert("RGB")).astype(np.int16)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
cream = (r > 236) & (r < 252) & (g > 236) & (g < 252) & (b > 230) & (b < 248)
tan = (r > 185) & (r < 222) & (g > 175) & (g < 212) & (b > 160) & (b < 196)
interior = ndi.binary_fill_holes(np.load("interior.npy"))
cl, cn = ndi.label(cream)
cc = np.bincount(cl.ravel())
order = np.argsort(cc)[::-1]
bedroom = ndi.binary_fill_holes(cl == order[2])
tl, tn = ndi.label(tan)
cnt = np.bincount(tl.ravel())
balc_id = [i for i in range(1, tn + 1) if cnt[i] > 100000 and np.where(tl == i)[1].mean() > 3300][0]
balc = ndi.binary_fill_holes(tl == balc_id)
bath = np.zeros_like(interior)
bath[796:1519, 1972:2380] = True
bath &= interior
wood = interior & ~bedroom & ~bath

px_w, px_h = int(W * cp), int(H * cp)
TW = 1200
TH = int(round(TW * px_h / px_w))

def crop(m):
    return np.array(Image.fromarray(m[oy:oy + px_h, ox:ox + px_w].astype(np.uint8) * 255).resize((TW, TH), Image.NEAREST)) > 127

Mw, Mb, Mt, Mk = crop(wood), crop(bedroom), crop(bath), crop(balc)
rng = np.random.default_rng(7)
tex = np.full((TH, TW, 3), 235, np.uint8)
ppf = TW / U["W"]
y = np.arange(TH)[:, None]
x = np.arange(TW)[None, :]
row = (y // (5 / 12 * ppf)).astype(int)
shade = rng.uniform(-9, 9, size=(row.max() + 2,))
base = np.array([92, 72, 56])
woodimg = np.clip(base[None, None, :] + shade[row][..., None] + rng.normal(0, 2.5, (TH, TW, 1)), 0, 255)
jo = rng.uniform(0, 4, size=(row.max() + 2,)) * ppf
jl = (40 / 12) * ppf
joint = ((x + jo[row]) % jl) < 1.2
woodimg[joint] *= 0.78
seam = (y % (5 / 12 * ppf)) < 0.9
woodimg[np.broadcast_to(seam, (TH, TW))] *= 0.84
tex[Mw] = woodimg[Mw].astype(np.uint8)
carpet = np.clip(np.array([208, 199, 184])[None, None, :] + rng.normal(0, 4, (TH, TW, 3)), 0, 255)
tex[Mb] = carpet[Mb].astype(np.uint8)
tile = np.full((TH, TW, 3), [224, 224, 220], np.float32)
grid = ((x % ppf) < 1.0) | ((y % ppf) < 1.0)
tile[np.broadcast_to(grid, (TH, TW))] *= 0.86
tex[Mt] = tile[Mt].astype(np.uint8)
conc = np.clip(np.array([152, 154, 150])[None, None, :] + rng.normal(0, 3, (TH, TW, 3)), 0, 255)
tex[Mk] = conc[Mk].astype(np.uint8)
Image.fromarray(tex).save("floor-color.jpg", quality=82)
print("floor-color.jpg", TW, "x", TH)
