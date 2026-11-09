const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{const b=await chromium.launch(); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const html=fs.readFileSync(process.env.JUEGO||'/home/user/criaturas/index.html','utf8');
await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await p.waitForTimeout(1500);
const D=await p.evaluate(()=>{
  E.flags.inicial='brasito';
  const tipos=e=>[ESP[e].tipo,ESP[e].tipo2].filter(Boolean);
  const nomMapa=id=>(MAPAS[id]&&MAPAS[id].nombre)||id;
  const lugarDe={}; for(const l of CONFIG.region) for(const m of l.mapas||[]) if(!lugarDe[m]) lugarDe[m]=l.nombre;
  for(let it=0;it<4;it++) for(const [mid,m] of Object.entries(MAPAS)) if(lugarDe[mid]) for(const q of m.salidas||[]) if(!lugarDe[q.a]) lugarDe[q.a]=lugarDe[mid];
  const npcNom={}; for(const [mid,m] of Object.entries(MAPAS)) for(const n of m.npcs||[]) npcNom[n.id]={nombre:n.nombre||'',mapa:mid};
  const FLAGS={paseTamayo:'conseguir el PASE DE TAMAYO del alcalde',cruzoCueva:'cruzar la Cueva Eco hasta la Ruta 3',comisariaLibre:'expulsar al Equipo COBRIX de la comisaría',inicial:'elegir tu primera criatura',nino_rescatado:'rescatar a Pablo en la Cueva Eco',avisoComisaria:'hablar con el guardia de la comisaría'};
  const cond=c=>{ if(!c) return ''; const r=[]; if(c.medalla) r.push('tener la '+c.medalla); if(c.medallas) r.push('tener '+c.medallas+' medallas'); if(c.flag) r.push(FLAGS[c.flag]||c.flag);
    if(c.vencidos) r.push('vencer a '+c.vencidos.map(id=>{ const q=npcNom[id]; return q?((q.nombre||id)+' ('+nomMapa(q.mapa)+')'):id; }).join(', ')); return r.join(' y '); };
  const OBJ={repelentes:'Repelente',superrepelentes:'Superrepelente',esferas:'Esfera',superesferas:'Superesfera',pociones:'Poción',superpociones:'Superpoción',revivires:'Revivir',curaestados:'Cura estado',dinero:'monedas',radar:'RADAR',amuleto:'AMULETO',reloj:'Reloj de Manuel',sopas:'Sopa'};
  const objTxt=o=>Object.entries(o||{}).filter(([k])=>OBJ[k]).map(([k,v])=>v===true?OBJ[k]:(k==='dinero'?v+' monedas':v+' × '+OBJ[k])).join(', ');
  // ---- nivel de progreso: nivel mínimo de criaturas salvajes y entrenadores de cada mapa
  const nivMapa={}; for(const [mid,m] of Object.entries(MAPAS)){ const L=[]; for(const k of ['encuentros','encSurf','encuentrosAgua']) for(const e of (m[k]||[])) L.push(e.min); for(const n of m.npcs||[]) if(n.equipo) for(const [,l] of n.equipo) L.push(l); if(L.length) nivMapa[mid]=Math.min(...L); }
  for(let it=0;it<5;it++) for(const [mid,m] of Object.entries(MAPAS)) if(nivMapa[mid]==null){ const v=(m.salidas||[]).map(q=>nivMapa[q.a]).filter(v=>v!=null); if(v.length) nivMapa[mid]=Math.min(...v); }
  { const nivL={}; for(const [mid,v] of Object.entries(nivMapa)){ const l=lugarDe[mid]; if(l&&v>=3) nivL[l]=Math.min(nivL[l]??99,v); } for(const mid of Object.keys(MAPAS)){ const l=lugarDe[mid]; if(l&&nivL[l]!=null&&(nivMapa[mid]==null||nivMapa[mid]<nivL[l]&&!/^(pueblo|lab|casa|casa2)$/.test(mid))) nivMapa[mid]=Math.max(nivMapa[mid]||0,nivL[l]); } }
  const LUGAR_MIN={'Desierto Árido':20,'Pueblo Termas':27,'Ciudad Bukera':29,'Puerto Salitre':31,'Poblado Hondo':34,'Central Hidroeléctrica':40,'Ciudad Tamayo':42,'Isla Vikina':47};
  for(const mid of Object.keys(MAPAS)){ const l=lugarDe[mid]; if(l&&LUGAR_MIN[l]) nivMapa[mid]=Math.max(nivMapa[mid]||0,LUGAR_MIN[l]); }
  const nivMedalla={}; for(const m of Object.values(MAPAS)) for(const n of m.npcs||[]) if(n.accion==='lider') nivMedalla[n.medalla]=Math.max(...n.equipo.map(e=>e[1]));
  const medOrden=Object.entries(nivMedalla).sort((a,b)=>a[1]-b[1]).map(e=>e[0]);
  const FLAGNIV={inicial:5,cruzoCueva:14,nino_rescatado:14,paseTamayo:44,comisariaLibre:46,avisoComisaria:44,campeon:70};
  const nivCond=c=>{ if(!c) return 0; let v=0; if(c.medalla) v=Math.max(v,nivMedalla[c.medalla]||0); if(c.medallas) v=Math.max(v,nivMedalla[medOrden[c.medallas-1]]||0); if(c.flag) v=Math.max(v,FLAGNIV[c.flag]||0);
    if(c.vencidos) for(const id of c.vencidos){ const q=npcNom[id]; if(q) v=Math.max(v,nivMapa[q.mapa]||0); } return v; };
  const nivTexto=t=>{ let v=0; const m=/nivel (\d+)/i.exec(t||''); if(m) v=+m[1]; if(/Liga/.test(t||'')&&/ganar la Liga|Después de ganar la Liga/.test(t)) v=Math.max(v,70); const md=/(Medalla \w+)/.exec(t||''); if(md&&nivMedalla[md[1]]) v=Math.max(v,nivMedalla[md[1]]); if(/primera medalla/.test(t||'')) v=Math.max(v,16); return v; };
  // ---- regalos
  const regalos=[];
  for(const [mid,m] of Object.entries(MAPAS)) for(const n of m.npcs||[]){ const antes=regalos.length;
    const who=n.nombre||(n.textos&&n.textos[0]?'Vecino/a':'Persona');
    const desc=(n.textos||[n.antes||''])[0]||'';
    if(n.da) regalos.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),quien:n.nombre||'Persona',obj:objTxt(n.da),cuando:'Al hablar con esta persona'+(n.desde?' (cuando puedas '+cond(n.desde)+')':'')+(n.requiere?' (necesitas '+cond(n.requiere)+')':''),frase:desc});
    if(n.regalo) regalos.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),quien:n.nombre||'Entrenador',obj:(n.nombreRegalo||(n.regalo==='cana'?'CAÑA DE PESCAR':n.regalo)).replace(/^el |^la /,''),cuando:'Al ganarle el combate'+(n.desde?' (aparece al '+cond(n.desde)+')':''),frase:''});
    if(n.daFlag==='paseTamayo') regalos.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),quien:n.nombre||'Alcalde',obj:n.daFlag==='paseTamayo'?'PASE DE TAMAYO':n.daFlag,cuando:'Al hablar con él'+(n.requiere?' (necesitas '+cond(n.requiere)+')':''),frase:''});
    if(n.accion==='mision'&&n.mision&&MISIONES[n.mision]){ const M=MISIONES[n.mision]; regalos.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),quien:n.nombre||'Persona',obj:objTxt(M.premio),cuando:'Encargo «'+M.titulo+'»: '+M.desc,frase:''}); }
    if(n.accion==='lider'){ const extra=n.medalla==='Medalla Pluma'?' + BICI':n.medalla==='Medalla Ola'?' + TABLA SURF':''; regalos.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),quien:n.nombre,obj:n.medalla+extra,cuando:'Al ganar al líder del gimnasio',frase:''}); }
    for(let k=antes;k<regalos.length;k++){ const r=regalos[k]; r.orden=Math.max(nivMapa[mid]||0,nivCond(n.desde),nivCond(n.requiere),nivTexto(r.cuando),n.accion==='lider'?Math.max(...n.equipo.map(e=>e[1])):0, n.equipo&&n.accion==='entrenador'?Math.max(...n.equipo.map(e=>e[1])):0); }
  }
  for(const r of regalos) if(r.orden==null) r.orden=0;
  regalos.push({lugar:'Pueblo Chy',mapa:'Laboratorio',quien:'Profesora Ceiba',obj:'REPARTIR EXP',cuando:'Al volver a hablarle después de ganar tu primera medalla',frase:'',orden:16});
  regalos.push({lugar:'Pueblo Chy',mapa:'Laboratorio',quien:'Profesora Ceiba',obj:'Otra criatura inicial (nivel 5)',cuando:'Después de ganar la Liga (una por cada victoria en la Liga)',frase:'',orden:70});
  regalos.forEach((r,i)=>r._i=i); regalos.sort((a,b)=>a.orden-b.orden||a._i-b._i);
  // ---- bloqueos
  const bloq=[];
  for(const [mid,m] of Object.entries(MAPAS)) for(const n of m.npcs||[]){
    if(n.requiere&&n.bloqueo) bloq.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),que:(n.nombre||(n.cosa?'Obstáculo':'Guardia'))+': «'+n.bloqueo[0]+'»',abre:n.accion==='entrenador'?'Te dejan retarlos al '+cond(n.requiere)+'; al vencerlos se apartan':cond(n.requiere)});
    else if(n.hasta&&(n.accion==='texto'||n.cosa)&&!n.da) bloq.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),que:(n.cosa?({tronco:'Un tronco',rocas:'Unas rocas'}[n.cosa]||n.cosa):(n.nombre||'Guardia'))+(n.textos?': «'+n.textos[0]+'»':''),abre:'Se aparta al '+cond(n.hasta)});
    else if(n.hasta&&n.accion==='entrenador'&&n.alIrse) bloq.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),que:(n.nombre||'Entrenador')+' bloquea el paso',abre:'Ganarle el combate'+(n.desde?' (aparece al '+cond(n.desde)+')':'')});
  }
  for(const [mid,m] of Object.entries(MAPAS)) for(const s of m.salidas||[]){ if(s.req) bloq.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),que:'Salida hacia '+nomMapa(s.a),abre:FLAGS[s.req]||s.req}); if(s.medallas) bloq.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),que:'Guardián de la entrada a '+nomMapa(s.a),abre:'tener '+s.medallas+' medallas'}); }
  bloq.push({lugar:'Ciudad Bukera',mapa:'Puerto de Bukera',que:'Ferry a Isla Vikina',abre:'tener el PASE DE BARCO (te lo da Martina en la Presa)'});
  bloq.push({lugar:'Puerto Salitre',mapa:'Puerto Salitre',que:'Barco Chymar a Isla Vikina',abre:'tener el PASE DE BARCO'});
  bloq.push({lugar:'Ciudad Bukera',mapa:'Puerto de Bukera',que:'Ferry a Puerto Salitre',abre:'vencer a los dos soldados COBRIX de Playa Coral'});
  bloq.push({lugar:'Ciudad Tamayo',mapa:'Torre Tamayo',que:'Ascensor al mirador',abre:'tener la Medalla Placa'});
  bloq.push({lugar:'Todos',mapa:'Gimnasios',que:'El líder no acepta el reto',abre:'vencer antes a todos los entrenadores del gimnasio'});
  bloq.push({lugar:'Último gimnasio',mapa:'',que:'El líder no acepta el reto',abre:'tener las otras 6 medallas'});
  bloq.push({lugar:'Bosque',mapa:'Gruta de Arcelon',que:'Puerta blindada',abre:'que la guardiana te dé el código 4-7-1-9 (tras salvarla)'});
  bloq.push({lugar:'Agua',mapa:'Lagos, ríos y mar',que:'No puedes nadar',abre:'TABLA SURF (al ganar la Medalla Ola)'});
  // ---- evoluciones
  const esEvo=new Set(Object.values(ESP).filter(e=>e.evoluciona).map(e=>e.evoluciona[1]));
  const familias=[]; for(const id of CONFIG.dex){ if(esEvo.has(id)) continue; const f=[]; let e=id; while(e){ const x=ESP[e]; f.push({id:e,nombre:x.nombre,tipos:tipos(e),nivel:x.evoluciona?x.evoluciona[0]:null,img:x.imagen||e,leg:!!x.legendaria,
      ataques:x.aprende.map(([l,m])=>({l,n:MOV[m]?MOV[m].nombre:m,t:MOV[m]?MOV[m].tipo:'',p:MOV[m]?MOV[m].poder:0}))}); e=x.evoluciona?x.evoluciona[1]:null; } familias.push(f); }
  // ---- COBRIX
  const cobrix=[]; for(const [mid,m] of Object.entries(MAPAS)) for(const n of m.npcs||[]){ if(!(n.equipo&&(/cobrix|cob/i.test(n.id)||/COBRIX/i.test(n.nombre||'')))) continue;
    cobrix.push({lugar:lugarDe[mid]||'',mapa:nomMapa(mid),nombre:n.nombre||n.id,jefe:!!n.jefe,equipo:n.equipo.map(([e,l])=>({id:e,nombre:ESP[e]?ESP[e].nombre:e,l,img:ESP[e]?(ESP[e].imagen||e):e}))}); }
  // ---- encuentros
  let fila; const enc=[]; for(const l of CONFIG.region) for(const mid of l.mapas||[]){ const m=MAPAS[mid]; if(!m) continue; ponerMapa(mid,1,1,'abajo');
    const tiene=ch=>m.casillas.some(r=>r.includes(ch));
    fila=(t,tipo)=>{ const agg={}; for(const x of t||[]){ const k=x.esp; if(!agg[k]) agg[k]={id:k,nombre:ESP[k].nombre,min:x.min,max:x.max,peso:0,img:ESP[k].imagen||k,noche:!!x.noche}; agg[k].min=Math.min(agg[k].min,x.min); agg[k].max=Math.max(agg[k].max,x.max); agg[k].peso+=x.peso||0; }
      const tot=Object.values(agg).reduce((a,b)=>a+b.peso,0)||1; return Object.values(agg).map(x=>({...x,pct:Math.round(x.peso*100/tot)})).sort((a,b)=>b.pct-a.pct); };
    const r={lugar:l.nombre,mapa:m.nombre||mid,tierra:m.encuentrosPor?[]:fila(m.encuentros),zonas:m.encuentrosPor?[['Hierba verde',fila(m.encuentrosPor[','])],['Hierba quemada',fila(m.encuentrosPor.j)]]:[],vado:fila(m.encuentrosVado),agua:null,pesca:null};
    if(tiene('~')||m.encuentrosAgua){ try{ if(!m.sinSurf) r.agua=fila(tablaAgua(mapa)); r.pesca=fila(tablaPesca(mapa)); }catch(e){} }
    if(r.tierra.length||r.zonas.length||(r.agua&&r.agua.length)||(r.pesca&&r.pesca.length)) enc.push(r); }
  const vistos=new Set(CONFIG.region.flatMap(l=>l.mapas||[]));
  for(const [mid,m] of Object.entries(MAPAS)){ if(vistos.has(mid)||!(m.encuentros||[]).length||/^liga|corral/.test(mid)) continue; ponerMapa(mid,1,1,'abajo'); enc.push({lugar:lugarDe[mid]||'',mapa:m.nombre||mid,tierra:fila(m.encuentros),agua:null,pesca:null}); }
  // ---- imágenes
  // ---- gimnasios (en orden de medalla)
  const GYMS=[['gym_coral','Corrientes de agua: las flechas te arrastran en una sola dirección.'],['gym_volkano','Dos pisos. Palancas que abren y cierran muros de lava (una en cada piso).'],['gym_termas','Laberinto de setos con vapor. Los arbustos se apartan al vencer al jardinero de al lado.'],['gym_puerto','Dos pisos con ventiladores en las cuatro direcciones que te empujan hasta 5 casillas.'],['gym_hondo','Dos pisos. En la planta baja hay cinco rocas que empujar para abrirte paso.'],['gym_tamayo','Dos pisos. Un interruptor rojo abajo y uno azul arriba abren y cierran rejas.'],['gym_vikina','Dos pisos de hielo resbaladizo y barreras eléctricas que se encienden y se apagan.']];
  const eqv=e=>e.map(([x,l])=>({id:x,nombre:ESP[x]?ESP[x].nombre:x,l,img:ESP[x]?(ESP[x].imagen||x):x}));
  const gyms=GYMS.map(([gid,mec],i)=>{ const pisos=[gid].concat(MAPAS[gid+'2']?[gid+'2']:[]); const ent=[]; let lider=null;
    pisos.forEach((m,k)=>{ for(const n of (MAPAS[m].npcs||[])){ if(n.accion==='entrenador'&&n.equipo) ent.push({nombre:n.nombre||n.id,piso:k+1,equipo:eqv(n.equipo)}); if(n.accion==='lider') lider={nombre:n.nombre,medalla:n.medalla,color:n.colorMedalla,piso:k+1,equipo:eqv(n.equipo)}; } });
    return {orden:i+1,nombre:MAPAS[gid].nombre,lugar:lugarDe[gid]||'',pisos:pisos.length,mecanica:mec,entrenadores:ent,lider}; });
  const usadas=new Set(); gyms.forEach(gy=>[...gy.entrenadores.flatMap(e=>e.equipo),...gy.lider.equipo].forEach(x=>usadas.add(x.img))); familias.flat().forEach(x=>usadas.add(x.img)); cobrix.forEach(c=>c.equipo.forEach(x=>usadas.add(x.img))); enc.forEach(r=>[r.tierra,r.vado||[],...(r.zonas||[]).map(z=>z[1]),r.agua||[],r.pesca||[]].flat().forEach(x=>usadas.add(x.img)));
  const imgs={}; for(const k of usadas) if(IMAGENES[k]) imgs[k]=IMAGENES[k];
  const dex=CONFIG.dex.map((id,i)=>({n:i+1,id,nombre:ESP[id].nombre,tipos:tipos(id),img:ESP[id].imagen||id,leg:!!ESP[id].legendaria}));
  dex.forEach(x=>{ if(IMAGENES[x.img]) imgs[x.img]=IMAGENES[x.img]; });
  const ET={atq:'ataque',def:'defensa',vel:'velocidad',prec:'precisión',eva:'evasión'}; const EST={dor:'dormir',par:'paralizar',que:'quemar',ven:'envenenar',con:'congelar',conf:'confundir'};
  const efecto=m=>{ const r=[]; if(m.estado) r.push((EST[m.estado]||m.estado).replace(/^./,c=>c.toUpperCase())+' al rival');
    if(m.sec){ const pc=Math.round(m.sec.p*100)+'%'; if(m.sec.e) r.push(pc+' de '+(EST[m.sec.e]||m.sec.e)); if(m.sec.confu) r.push(pc+' de confundir'); if(m.sec.et){ const [st,d,q]=m.sec.et; r.push(pc+' de '+(d<0?'bajar':'subir')+' '+(ET[st]||st)+(q==='rival'?' del rival':' propia')); } if(m.sec.acobardar) r.push(pc+' de acobardar'); }
    if(m.etapas) for(const [st,d,q] of m.etapas) r.push((d<0?'Baja ':'Sube ')+(Math.abs(d)>1?'mucho ':'')+'la '+(ET[st]||st)+(q==='rival'?' del rival':' propia'));
    if(m.golpes) r.push('Golpea '+m.golpes[0]+'-'+m.golpes[1]+' veces'); if(m.critAlto) r.push('Crítico más fácil'); if(m.drenar) r.push('Recupera la mitad del daño'); if(m.cura) r.push('Cura '+Math.round(m.cura*100)+'% de PS');
    if(m.retroceso) r.push('Se daña a sí mismo'); if(m.recarga) r.push('Necesita recargar'); if(m.prioridad) r.push('Ataca primero'); if(m.nuncaFalla) r.push('Nunca falla'); if(m.excavar) r.push('Se esconde un turno'); if(m.futuro) r.push('Golpea 2 turnos después');
    if(m.represalia) r.push('Más fuerte si le han golpeado'); if(m.robo) r.push('Roba un objeto'); if(m.echar) r.push('Obliga a cambiar'); if(m.furia) r.push('Ataca 2-3 turnos y se confunde'); return r.join('. '); };
  const quien={}; for(const id of CONFIG.dex){ for(const [l,mk] of ESP[id].aprende){ (quien[mk]=quien[mk]||[]).push({n:ESP[id].nombre,l}); } }
  const ataques=Object.entries(MOV).map(([k,m])=>({k,n:m.nombre,t:m.tipo,p:m.poder||0,pr:m.prec==null?'—':m.prec,e:efecto(m),q:(quien[k]||[]).sort((a,b)=>a.l-b.l)})).filter(a=>a.q.length);
  const der=Object.values(ESP).filter(e=>e.mira==='der').map(e=>e.imagen);
  // ---- personas del juego para el armario de la guía
  const personas=[], vistosP=new Set(); const CLAVES=['piel','pelo','camiseta','pantalon','gorra','gorro','peinado','prenda','emblema','capa','capaBorde','capaLarga','lentes','cara','barba','bigote','mochila','bata','placa','falda','bano','bikini','gafas','gorroNat'];
  const limpio=a=>{ const o={}; for(const k of CLAVES) if(a&&a[k]!=null) o[k]=a[k]; return o; };
  const addP=(grupo,id,nombre,a)=>{ if(!a) return; const key=nombre.toUpperCase(); if(vistosP.has(key)) return; vistosP.add(key); personas.push({grupo,id,nombre,a:limpio(a)}); };
  const todos=[]; for(const [mid,m] of Object.entries(MAPAS)) for(const n of m.npcs||[]) todos.push([mid,n]);
  const por=id=>{ const t=todos.find(([,n])=>n.id===id); return t&&t[1]; };
  const bonito=n=>n.replace(/ DE COBRIX$/,'').toLowerCase().replace(/(^|\s|-)([a-záéíóúñ])/g,(m,a,b)=>a+b.toUpperCase());
  addP('Tu familia','mama','Mamá',por('mama')&&aspectoNPC(por('mama'))); addP('Tu familia','campeon','Papá',por('campeon')&&aspectoNPC(por('campeon'))); addP('Tu familia','abuelo_a','Abuelo',por('abuelo_a')&&aspectoNPC(por('abuelo_a'))); addP('Tu familia','tia_elena','Tía Elena',por('tia_elena')&&aspectoNPC(por('tia_elena')));
  addP('Rivales','thomas',CONFIG.rival.nombre?bonito(CONFIG.rival.nombre):'Thomas',CONFIG.rival);
  for(const q of ['auron','martina']){ for(const m of Object.values(MAPAS)){ const ev=m.eventoRival; if(ev&&ev.quien===q&&ev.aspecto){ addP('Rivales','riv_'+q,bonito(ev.nombre||q),ev.aspecto); break; } } }
  const pr=todos.find(([,n])=>n.accion==='profe'); if(pr) addP('Personajes importantes','profe','Profesora Ceiba',aspectoNPC(pr[1]));
  for(const [mid,n] of todos) if(n.accion==='lider') addP('Líderes de gimnasio',n.id,bonito(n.nombre)+' ('+(n.medalla||'')+')',aspectoNPC(n));
  for(const id of ['alto1','alto2','alto3','alto4']){ const n=por(id); if(n) addP('Altos Mandos',id,bonito(n.nombre),aspectoNPC(n)); }
  const RANGO=n=>/^JEFE/.test(n)?0:/^CORONEL/.test(n)?1:/^COMANDANTE/.test(n)?2:/^SARGENTO/.test(n)?3:/^CIENT/.test(n)?5:4;
  const cob=todos.filter(([,n])=>n.nombre&&(/COBRIX/.test(n.nombre)||/^(COMANDANTE ESPARZA|SARGENTO ÓNIX|DOCTOR VOLTA)/.test(n.nombre))).sort((a,b)=>RANGO(a[1].nombre)-RANGO(b[1].nombre));
  for(const [mid,n] of cob) addP('Equipo COBRIX',n.id,bonito(n.nombre),aspectoNPC(n));
  for(const id of ['capitan','bruma_mujer_a','farero_libre','farera','zorro_desierto','capitan_barco','cirila','alcalde','jefa_central','guardiana','chico_lab','enfermera','ignea']){ const n=por(id); if(!n) continue;
    const nom={capitan:'Capitán Bruma',bruma_mujer_a:'Marina (mujer de Bruma)',farero_libre:'Farero Tomás',farera:'Farera',zorro_desierto:'Zorro del Desierto',capitan_barco:'Capitán del Chymar',alcalde:'Alcalde de Hondo',guardiana:'Guardiana del Ignis',chico_lab:'Leo',enfermera:'Enfermera'}[id]||bonito(n.nombre||id);
    addP('Personajes importantes',id,nom,aspectoNPC(n)); }
  return {personas,der,regalos,bloq,familias,cobrix,gyms,enc,imgs,dex,ataques,colores:COLOR_TIPO,nomTipo:NOMBRE_TIPO};
});
fs.writeFileSync('guia.json',JSON.stringify(D)); console.log('regalos',D.regalos.length,'bloq',D.bloq.length,'fam',D.familias.length,'cobrix',D.cobrix.length,'enc',D.enc.length,'imgs',Object.keys(D.imgs).length, errs);
await b.close(); })();
