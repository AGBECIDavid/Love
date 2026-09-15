#!/usr/bin/env python3
"""Fabrique le QR code du cadeau.

    pip install segno
    python3 tools/qr.py                        # l'adresse par défaut ci-dessous
    python3 tools/qr.py https://autre.site/#cadeau

Écrit dans qr/ :
  · qr-cadeau.png          noir sur blanc — celui qu'on imprime
  · qr-cadeau-violet.svg   violet, un cœur au centre — pour un écran ou une carte

Les deux encodent la même adresse et sont en correction d'erreur « H » : le
cœur peut cacher le centre sans empêcher la lecture.
"""
import os
import sys
import segno

URL = sys.argv[1] if len(sys.argv) > 1 else 'https://love-self-omega.vercel.app/#cadeau'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'qr')
os.makedirs(OUT, exist_ok=True)

qr = segno.make(URL, error='h')

# 1. Pour l'impression : rien ne vaut le noir sur blanc.
qr.save(os.path.join(OUT, 'qr-cadeau.png'), scale=16, border=4, dark='#000000', light='#ffffff')

# 2. Aux couleurs de la page, avec un petit cœur au centre.
B = 4                                            # la marge de 4 modules est obligatoire
n = len(qr.matrix)
S = n + 2 * B
path = ''.join('M%d %dh1v1h-1z' % (x + B, y + B)
               for y, row in enumerate(qr.matrix) for x, v in enumerate(row) if v)
c, r = S / 2, S * 0.115
heart = ('M0 3.1 C -2.5 0.8 -3.2 -0.9 -2.1 -2.2 C -1.1 -3.4 0.4 -3.1 0 -1.9 '
         'C -0.4 -3.1 1.1 -3.4 2.1 -2.2 C 3.2 -0.9 2.5 0.8 0 3.1 Z')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="{S * 16}" height="{S * 16}" shape-rendering="crispEdges">
  <rect width="{S}" height="{S}" fill="#ffffff"/>
  <path d="{path}" fill="#5b2fb8"/>
  <g shape-rendering="geometricPrecision">
    <circle cx="{c}" cy="{c}" r="{r:.2f}" fill="#ffffff"/>
    <g transform="translate({c},{c}) scale({r / 4.2:.3f})">
      <path d="{heart}" fill="#e83246"/>
    </g>
  </g>
</svg>'''
with open(os.path.join(OUT, 'qr-cadeau-violet.svg'), 'w') as f:
    f.write(svg)

print('QR code pour :', URL)
print('→ qr/qr-cadeau.png et qr/qr-cadeau-violet.svg')
