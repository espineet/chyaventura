# Extrae del juego el código que dibuja a las personas y las listas del armario, para la sección ARMARIO de la guía
import re
s=open('juego.js').read()
def entre(a,b,incl_b=False):
    i=s.index(a); j=s.index(b,i+len(a)); return s[i:j+(len(b) if incl_b else 0)]
def linea(a): i=s.index(a); return s[i:s.index('\n',i)]
partes=[linea('const _rgb=new Map();'), entre('function hexRgb(','\nconst osc='), linea('function mez('), linea('const osc=(c,t=.25)'),
  linea('const ELL=(cx,cy,rx,ry,r=0)'), linea('function trazo(fn)'), entre('function pieza(x,p,base,o={}){','\nfunction linea('), linea('function rr(x0,y0,w,h,r)'),
  entre('const ROPA=[','\nfunction valorArmario('), linea('const _personas=new Map();'), linea('const _personasComb=new Map();'),
  entre('function personaCombate(a){','\nconst GORRO_COLOR='), linea('const GORRO_COLOR='), entre('function personaHD(a,dir,paso,mochila,res=2){','\nfunction cuerpoPersona('),
  entre('function cuerpoPersona(x,a,dir,paso,moch){','\n}\n',True)]
js='(function(){ let E={genero:"chico"};\n'+'\n'.join(partes)+'\nwindow.ARMJS={ARMARIO,ROPA,personaHD,personaCombate,genero:g=>{E.genero=g;}};\n})();'
open('armario_guia.js','w').write(js.replace('</','<\\/'))
print(len(js))
