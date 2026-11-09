# Lo contrario de envolver.py: recupera el HTML de artefacto a partir de la página publicada.
import sys
s=open(sys.argv[1],encoding='utf-8').read()
a=s.find('<body>\n'); b=s.rfind('\n</body>')
if s.lstrip().lower().startswith('<!doctype') and a>=0 and b>a: s=s[a+len('<body>\n'):b]
open(sys.argv[2],'w',encoding='utf-8').write(s)
