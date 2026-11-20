# Lo contrario de envolver.py: recupera el HTML de artefacto a partir de la página publicada.
# Los dibujos que publicar.sh sacó a img/ se vuelven a meter dentro (el artefacto es un solo archivo).
import sys,os,re,base64
s=open(sys.argv[1],encoding='utf-8').read()
a=s.find('<body>\n'); b=s.rfind('\n</body>')
if s.lstrip().lower().startswith('<!doctype') and a>=0 and b>a: s=s[a+len('<body>\n'):b]
carpeta=os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])),'img')
TIPO={'jpg':'jpeg','svg':'svg+xml'}
def dentro(m):
    ruta=os.path.join(carpeta,m.group(1)+'.'+m.group(2))
    return 'data:image/%s;base64,%s'%(TIPO.get(m.group(2),m.group(2)),base64.b64encode(open(ruta,'rb').read()).decode())
s=re.sub(r"(?<=['\"])img/([0-9a-f]{12})\.(webp|png|jpg|gif|svg)(?=['\"])",dentro,s)
open(sys.argv[2],'w',encoding='utf-8').write(s)
