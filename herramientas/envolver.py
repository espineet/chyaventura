# Convierte un HTML de artefacto (sin cabecera) en una página web completa para Cloudflare Pages.
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
if not s.lstrip().lower().startswith('<!doctype'):
    s=('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n'+s+'\n</body>\n</html>\n')
open(dst,'w',encoding='utf-8').write(s)
