#!/usr/bin/env python3
"""
Gera os ícones da extensão (16/32/48/128 px) no tema preto e amarelo.

Como usar:
    pip install pillow
    python3 tools/gerar-icones.py

Para mudar as cores, edite BG e ACCENT abaixo. Dica: use a mesma cor
de destaque que você colocou em popup.css (variável --yellow).
"""

import os
from PIL import Image, ImageDraw

# ---- Cores (edite aqui) ----
ACCENT = (255, 212, 0, 255)  # amarelo  (#FFD400)
BG = (13, 13, 14, 255)       # quase preto (#0D0D0E)

# Pasta de saída: <raiz-do-projeto>/icons
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "icons")


def make_icon(size):
    scale = 8  # desenha grande e reduz, para bordas suaves
    S = size * scale
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Fundo arredondado
    pad = int(S * 0.03)
    d.rounded_rectangle([pad, pad, S - pad, S - pad], radius=int(S * 0.24), fill=BG)

    cx, cy = S / 2, S / 2

    # Anel (estilo "player")
    rr = S * 0.30
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
              outline=ACCENT, width=max(2, int(S * 0.055)))

    # Triângulo de "play" (levemente à direita para parecer centralizado)
    tw, th, ox = S * 0.22, S * 0.26, S * 0.028
    d.polygon([
        (cx - tw * 0.40 + ox, cy - th * 0.5),
        (cx - tw * 0.40 + ox, cy + th * 0.5),
        (cx + tw * 0.60 + ox, cy),
    ], fill=ACCENT)

    return img.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for s in (16, 32, 48, 128):
        path = os.path.join(OUT_DIR, f"icon{s}.png")
        make_icon(s).save(path)
        print("gerado:", os.path.normpath(path))


if __name__ == "__main__":
    main()
