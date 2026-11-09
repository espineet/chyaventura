#!/usr/bin/env bash
# Publica el juego y la guía en https://chyaventura.pages.dev
# Cloudflare Pages despliega solo cada vez que se sube algo a la rama main.
#   herramientas/publicar.sh "Qué ha cambiado"
# Variables opcionales:
#   JUEGO      HTML del juego tal como se publica en el artefacto (por defecto /home/user/criaturas/index.html)
#   GUIA_OUT   dónde dejar también la guía generada (para publicarla como artefacto)
set -euo pipefail
R="$(cd "$(dirname "$0")/.." && pwd)"; H="$R/herramientas"
export JUEGO="${JUEGO:-/home/user/criaturas/index.html}"
if [ ! -f "$JUEGO" ]; then mkdir -p "$(dirname "$JUEGO")"; python3 "$H/desenvolver.py" "$R/index.html" "$JUEGO"; echo "Juego recuperado del repositorio en $JUEGO"; fi
T="$(mktemp -d)"
# 1) guía: datos sacados del juego + código del armario + plantilla
python3 -c "import re,sys;s=open(sys.argv[1],encoding='utf-8').read();open(sys.argv[2],'w',encoding='utf-8').write(re.findall(r'<script>(.*?)</script>',s,re.S)[-1])" "$JUEGO" "$T/juego.js"
node --check "$T/juego.js"
( cd "$T" && node "$H/guia_datos.js" >/dev/null && python3 "$H/armario_js.py" >/dev/null )
python3 - "$H/guia_tpl.html" "$T" <<'P'
import sys
tpl,T=sys.argv[1],sys.argv[2]
t=open(tpl,encoding='utf-8').read(); d=open(T+'/guia.json',encoding='utf-8').read().replace('</','<\\/'); a=open(T+'/armario_guia.js',encoding='utf-8').read()
t=t.replace('__ARMARIO__',a.replace('__DATOS__','')).replace('__DATOS__',d)
open(T+'/guia.html','w',encoding='utf-8').write(t)
P
[ -n "${GUIA_OUT:-}" ] && cp "$T/guia.html" "$GUIA_OUT"
# 2) páginas completas
mkdir -p "$R/guia"
python3 "$H/envolver.py" "$JUEGO" "$R/index.html"
python3 "$H/envolver.py" "$T/guia.html" "$R/guia/index.html"
# 3) subir a GitHub
cd "$R"; git add -A
if git diff --cached --quiet; then echo "Nada nuevo que publicar."; exit 0; fi
git -c user.name=espineet -c user.email=espineet@gmail.com commit -q -m "${1:-Actualiza el juego y la guía}

${FIRMA:-Co-Authored-By: Claude <noreply@anthropic.com>}"
for i in 1 2 3 4 5; do git push -u origin main && break; sleep $((2**i)); done
echo "Publicado: https://chyaventura.pages.dev  ·  https://chyaventura.pages.dev/guia/"
