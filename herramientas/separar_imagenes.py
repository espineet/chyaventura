# Saca los dibujos incrustados (data:image;base64) de una página a archivos en img/, para Cloudflare Pages.
# Cada archivo se llama como el resumen de su contenido: si un dibujo cambia, cambia su nombre y la caché nunca sirve el viejo.
#   python3 separar_imagenes.py pagina.html carpeta_img prefijo_en_la_pagina
import sys,re,base64,hashlib,os
html,carpeta,prefijo=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(html,encoding='utf-8').read(); os.makedirs(carpeta,exist_ok=True); n=0; bytes_=0
def fuera(m):
    global n,bytes_
    ext=m.group(1).replace('jpeg','jpg').replace('svg+xml','svg'); datos=base64.b64decode(m.group(2))
    nombre=hashlib.sha1(datos).hexdigest()[:12]+'.'+ext; ruta=os.path.join(carpeta,nombre)
    if not os.path.exists(ruta): open(ruta,'wb').write(datos)
    n+=1; bytes_+=len(m.group(0)); return prefijo+nombre
s=re.sub(r"data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)",fuera,s)
open(html,'w',encoding='utf-8').write(s)
print(f'{html}: {n} dibujos sacados a {carpeta} ({bytes_/1e6:.1f} MB menos)')
