# Aplica al juego los aspectos guardados desde el armario de la guía (colección «avatares»)
import json,sys,re
import os; P=os.environ.get('JUEGO','/home/user/criaturas/index.html'); s=open(P).read()
docs=json.load(open(sys.argv[1]))
# a qué personajes del juego afecta cada persona de la guía
EXTRA={'alcalde':['alcalde','alcalde_salida'],'enfermera':re.findall(r"\{id:'(enfermera[a-z0-9]*)'",s),'abuelo_a':['abuelo_a','abuelo_b','abuelo_c'],'capitan':['capitan','capitan_vk','bruma_barco'],'bruma_mujer_a':['bruma_mujer_a','bruma_mujer_b','bruma_mujer_c'],'farero_libre':['farero_libre','farero_preso']}
for q in ('auron','martina'):
    ids=re.findall(r"eventoRival:\{id:'([a-z_0-9]+)',quien:'%s'"%q,s)+[q+'_casa']+(['rival_central'] if q=='martina' else [])
    EXTRA['riv_'+q]=ids
AV={}
for d in docs:
    a={k:v for k,v in d['a'].items() if v is not None}
    for nid in EXTRA.get(d['id'],[d['id']]): AV[nid]=a
i=s.index('const AVATARES={'); j=s.index('};',i)+2
s=s[:i]+'const AVATARES='+json.dumps(AV,ensure_ascii=False,separators=(',',':'))+';'+s[j:]
open(P,'w').write(s); print(len(docs),'personas ->',len(AV),'personajes:',', '.join(sorted(AV)))
