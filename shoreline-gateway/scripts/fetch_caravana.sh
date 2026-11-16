#!/usr/bin/env bash
# Pull Caravana Furniture's full catalog (Shopify) and product pages for dimension scraping.
# Caravana: 975 Long Beach Blvd, Long Beach CA 90813, (562) 432-0562. Free white-glove delivery within 20 miles.
# Product pages carry "Dimensions: 48"W x 13.5"D x 17"H" style text that the catalog JSON lacks.
set -e
mkdir -p caravana && cd caravana
for p in 1 2 3 4 5 6; do
  curl -sSL -A "Mozilla/5.0" "https://www.caravanafurniture.com/products.json?limit=250&page=$p" -o p$p.json
  n=$(python3 -c "import json;print(len(json.load(open('p$p.json'))['products']))")
  echo "page $p: $n"; [ "$n" = "0" ] && break
done
# Example: fetch one product page and grep the dimension line
# curl -sSL -A "Mozilla/5.0" https://www.caravanafurniture.com/products/mid-century-modern-48-tv-stand | \
#   python3 -c "import re,sys,html;t=re.sub(r'<[^>]+>',' ',sys.stdin.read());print(re.search(r'Dimensions?:[^$]{0,60}',html.unescape(t)).group(0))"
# Other Shopify stores that answer /products.json: secretlab.co, hideitmounts.com, floativa.com.
# Blocked for plain fetches (use search snippets or a browser): wayfair, amazon, target, walmart, livingspaces, mybobs, westelm, cb2, crateandbarrel, ikea (JS shell), benq price.
