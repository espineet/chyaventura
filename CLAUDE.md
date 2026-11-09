# Chy Aventura

Juego de criaturas (un solo HTML) y su guía, publicados en Cloudflare Pages:

- Juego: https://chyaventura.pages.dev  (`index.html`)
- Guía: https://chyaventura.pages.dev/guia/  (`guia/index.html`)

Cloudflare Pages despliega solo cada vez que llega un commit a `main`.

## Regla: publicar después de cada cambio

Siempre que se modifique el juego o la guía, en el mismo turno:

1. Publica los artefactos de Claude como hasta ahora:
   - Juego: https://claude.ai/artifact/KSnFmcUVetgu5xqZWdSH1Y
   - Guía: https://claude.ai/artifact/1bC75ykTubdA1Eyski2v76
2. Ejecuta `herramientas/publicar.sh "Qué ha cambiado"` para subirlo a Pages.
   Pon en la variable `FIRMA` las líneas de atribución de commit que indique la sesión.
3. Dile al usuario que ya está en https://chyaventura.pages.dev (tarda ~1 minuto).

## Cómo están hechos

- El juego se edita como HTML de artefacto (sin `<!doctype>` ni `<head>`), por defecto en
  `/home/user/criaturas/index.html`. `publicar.sh` le añade la cabecera (`envolver.py`).
  Si ese archivo no existe (sesión nueva), `publicar.sh` lo recupera del `index.html` del repo
  (`desenvolver.py`); también se puede leer el artefacto del juego con la herramienta Artifact.
- La guía se genera desde el juego: `guia_datos.js` (con Playwright) saca los datos,
  `armario_js.py` copia el código que dibuja a las personas para la sección ARMARIO, y todo se
  rellena en `guia_tpl.html`.
- Armario de la guía: las personas del juego que el usuario edita se guardan en la base de datos
  del artefacto de la guía (colección `avatares`). Cuando pida aplicarlas al juego: leer esa
  colección con ArtifactData, guardarla como lista JSON `[{id, a, nombre}]` y ejecutar
  `JUEGO=... python3 herramientas/aplicar_avatares.py lista.json`. A los miembros del Equipo
  COBRIX añadirles siempre `emblema:'cuervo'`; los SOLDADOS de COBRIX llevan siempre gorra granate.
