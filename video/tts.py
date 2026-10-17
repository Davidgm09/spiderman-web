"""
Voz de los vídeos con las voces neuronales gratuitas de Microsoft Edge (paquete edge-tts).

Uso: python tts.py <escenas.json> <carpeta_salida> [voz] [velocidad]
  escenas.json: lista de textos, uno por escena
  Genera escena_0.mp3, escena_1.mp3… y palabras.json con el tiempo de cada palabra:
  [[{"t": "Tres", "ini": 0.1, "fin": 0.4}, ...], ...]  (una lista por escena, en segundos)

Si da un error 403, actualiza la librería: pip install -U edge-tts
"""

import asyncio
import json
import sys
from pathlib import Path

import edge_tts


async def escena(texto: str, voz: str, velocidad: str, mp3: Path):
    comunicar = edge_tts.Communicate(texto, voz, rate=velocidad, boundary="WordBoundary")
    palabras = []
    with open(mp3, "wb") as f:
        async for trozo in comunicar.stream():
            if trozo["type"] == "audio":
                f.write(trozo["data"])
            elif trozo["type"] == "WordBoundary":
                ini = trozo["offset"] / 1e7
                palabras.append({"t": trozo["text"], "ini": round(ini, 3), "fin": round(ini + trozo["duration"] / 1e7, 3)})
    return palabras


async def main():
    textos = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    salida = Path(sys.argv[2])
    voz = sys.argv[3] if len(sys.argv) > 3 else "es-ES-AlvaroNeural"
    velocidad = sys.argv[4] if len(sys.argv) > 4 else "+8%"
    todas = []
    for i, texto in enumerate(textos):
        todas.append(await escena(texto, voz, velocidad, salida / f"escena_{i}.mp3"))
    (salida / "palabras.json").write_text(json.dumps(todas, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
