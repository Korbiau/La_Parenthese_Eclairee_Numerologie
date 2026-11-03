'use strict';
const defaults={1:'#c83e39',2:'#8dcae5',3:'#659e59',4:'#956844',5:'#e99635',6:'#e99eb5',7:'#999d9b',8:'#242624',9:'#8d61ab',11:'#253f7e',22:'#5b3927',33:'#9c365e'};
const names={1:'Rouge',2:'Bleu clair',3:'Vert',4:'Marron',5:'Orange',6:'Rose',7:'Gris',8:'Noir',9:'Violet',11:'Bleu foncé',22:'Marron foncé',33:'Rose foncé'};
const $=s=>document.getElementById(s);
let state={name:'',start:'',count:1,colors:{...defaults},values:{},homes:[]};
const numeric=/^(?:[1-9]|11|22|33)?$/;
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s;}
function validate(s){
 if(!s||typeof s!=='object'||!s.values||typeof s.values!=='object')throw Error('Format invalide');
 const start=s.start===''?'':Number(s.start);if(start!==''&&(!Number.isInteger(start)||start<1||start>9999))throw Error('Année invalide');
 const colors={...defaults};for(const n in defaults)if(/^#[a-f0-9]{6}$/i.test(s.colors?.[n]||''))colors[n]=s.colors[n];
 const values={};for(const [k,v]of Object.entries(s.values))if(/^\d*-[a-z]+-\d+$/.test(k)&&(k.includes('-age-')?/^\d{0,3}$/:numeric).test(String(v)))values[k]=String(v);
 const homes=(Array.isArray(s.homes)?s.homes:[]).slice(0,100).map(h=>({address:String(h.address||'').slice(0,160),from:validDate(h.from)?h.from:'',to:validDate(h.to)?h.to:'',number:/^\d{0,10}$/.test(String(h.number||''))?String(h.number||''):''}));
 return {name:String(s.name||'').slice(0,70),start,count:1,colors,values,homes};
}
try{const saved=JSON.parse(localStorage.getItem('claire-v1'));if(saved)state=validate(saved)}catch{}
function persist(){try{localStorage.setItem('claire-v1',JSON.stringify(state));$('status').textContent='✓ Enregistré sur ce navigateur'}catch{$('status').textContent='Sauvegarde locale indisponible : sauvegardez le fichier.'}}
function contrast(hex){const a=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2]>.179?'#202b22':'#ffffff'}
function paint(el){const c=state.colors[el.value];el.parentElement.style.background=c||'#eceee6';el.style.color=c?contrast(c):'#303c35'}
function palette(){
 $('palette').replaceChildren();for(const n in defaults){const l=document.createElement('label');l.className='swatch';l.style.margin='0';const c=document.createElement('input');c.type='color';c.value=state.colors[n];c.setAttribute('aria-label',n+' : '+names[n]);const s=document.createElement('span');s.textContent=n;l.append(c,s);$('palette').append(l);c.oninput=()=>{state.colors[n]=c.value;document.querySelectorAll('.cell').forEach(paint);legend();renderHomeBar();persist()}}legend();
}
function legend(){$('legend').replaceChildren();for(const n in defaults){const s=document.createElement('span'),i=document.createElement('i');i.style.background=state.colors[n];s.append(i,document.createTextNode(n+' · '+names[n]));$('legend').append(s)}}
const rows=[['ANNÉE UNIVERSELLE','universelle',1],['ANNÉE PERSONNELLE','personnelle',1],['ÂGE','age',1],['MAISONS ASTROLOGIQUES','maisons',12],['QUADRIMESTRES','quadrimestres',3],['TRIMESTRES','trimestres',4],['MOIS','mois',12]];
function render(){
 $('name').value=state.name;$('start').value=state.start;$('ageRaw').value=state.values[state.start+'-age-0']||'';$('person').textContent=state.name||'Votre tableau personnel';$('range').textContent=state.start;$('grid').replaceChildren();
 const t=document.createElement('table');t.className='table';t.setAttribute('aria-label','Tableau des cycles de numérologie');const col=document.createElement('colgroup');for(let i=0;i<13;i++)col.append(document.createElement('col'));t.append(col);

 for(const [label,key,num] of rows){const r=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=label;r.append(th);
 if(key==='maisons'&&state.homes.length){const td=document.createElement('td');td.colSpan=12;td.className='homecontainer';const bar=document.createElement('div');bar.className='homebar';bar.id='homebar';bar.setAttribute('aria-label','Périodes des domiciles');td.append(bar);r.append(td);}else for(let i=0;i<num;i++){
 const td=document.createElement('td');td.colSpan=12/num;const input=document.createElement('input');input.type='text';input.inputMode='numeric';input.className='cell';input.dataset.kind=key;input.maxLength=key==='age'?3:2;const k=state.start+'-'+key+'-'+i;input.dataset.key=k;input.value=key==='universelle'?singleDigit(state.start):key==='age'?singleDigit(state.values[k]):state.values[k]||'';if(key==='universelle'){input.readOnly=true;input.title='Calculé depuis le champ Année universelle à gauche';}if(key==='age'){input.readOnly=true;input.title='Âge saisi : '+(state.values[k]||'—')+' — modifiable dans le champ à gauche';}input.setAttribute('aria-label',label+' '+state.start+(num>1?' — '+(i+1):''));
 input.oninput=()=>{input.value=input.value.replace(/\D/g,'').slice(0,key==='age'?3:2);state.values[k]=input.value;paint(input);persist()};
 // Incomplete or empty cells never prevent export or trigger validation popups.
 td.append(input);r.append(td);paint(input)}t.append(r)}
 const m=document.createElement('tr');m.className='months';m.append(document.createElement('th'));for(const month of ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEP','OCT','NOV','DÉC']){const td=document.createElement('td');td.textContent=month;m.append(td)}t.append(m);$('grid').append(t);
 const info=document.createElement('div');info.id='homedates';info.className='homedates';$('grid').append(info);renderHomeBar();targets();
}
function datePosition(s,year){const [y,m,d]=s.split('-').map(Number);if(y<year)return 0;if(y>year)return 12;const days=new Date(Date.UTC(y,m,0)).getUTCDate();return m-1+(d-1)/days;}
function homePeriods(){
 if(state.start==='')return {periods:[],warnings:state.homes.length?['Renseignez l’année universelle pour afficher les domiciles.']:[]};
 const sorted=state.homes.filter(h=>validDate(h.from)).slice().sort((a,b)=>a.from.localeCompare(b.from));let warnings=[];const periods=[];
 for(let i=0;i<sorted.length;i++){const h=sorted[i],next=sorted[i+1];if(h.to&&h.to<=h.from){warnings.push('La date de départ doit suivre la date d’arrivée.');continue}if(next&&next.from===h.from){warnings.push('Deux domiciles ont la même date d’arrivée.');continue}
 let end=h.to||next?.from||String(state.start+1).padStart(4,'0')+'-01-01';if(next&&end>next.from){end=next.from;if(h.to)warnings.push('Une période a été arrêtée au déménagement suivant pour éviter un chevauchement.');}
 let a=datePosition(h.from,state.start),b=datePosition(end,state.start);if(b>a)periods.push({home:h,a,b});}
 if(state.homes.some(h=>!h.from))warnings.push('Ajoutez une date d’arrivée pour afficher chaque domicile.');return {periods,warnings:[...new Set(warnings)]};
}
function renderHomeBar(){
 const {periods,warnings}=homePeriods();$('homeerror').textContent=warnings.join(' ');const bar=$('homebar'),info=$('homedates');if(!bar||!info)return;bar.replaceChildren();info.replaceChildren();let cursor=0;
 function piece(a,b,h){if(b<=a)return;const d=document.createElement('div');d.className='homepiece'+(h?'':' homegap');d.style.width=(b-a)/12*100+'%';if(h){const result=singleDigit(h.number);const c=state.colors[result];d.style.background=c||'#eceee6';d.style.color=c?contrast(c):'#303c35';const box=document.createElement('div'),span=document.createElement('span');span.textContent=result;box.append(span);d.append(box);d.title=(h.address||'Domicile')+' · '+h.from+(h.to?' → '+h.to:'');d.setAttribute('aria-label',d.title+' · numéro saisi '+(h.number||'non renseigné')+' · résultat '+(result||'non renseigné'));}else{d.title='Période non renseignée';d.setAttribute('aria-label',d.title)}bar.append(d)}
 for(const p of periods){piece(cursor,p.a,null);piece(p.a,p.b,p.home);cursor=p.b;const line=document.createElement('div');line.textContent=(p.home.address||'Domicile')+' · arrivée : '+p.home.from+(p.home.to?' · départ : '+p.home.to:'')+' · numéro : '+(p.home.number||'—')+' · résultat : '+(singleDigit(p.home.number)||'—');info.append(line)}piece(cursor,12,null);
}
function renderHomes(){
 $('homes').replaceChildren();state.homes.forEach((h,index)=>{const card=document.createElement('div');card.className='homecard';const title=document.createElement('strong');title.textContent='Domicile '+(index+1);card.append(title);
 for(const [key,label,type]of [['address','Adresse / repère','text'],['from','Date d’arrivée','date'],['to','Date de départ (facultative)','date'],['number','Numéro du domicile (à réduire)','text']]){const l=document.createElement('label'),inp=document.createElement('input');inp.id='home-'+index+'-'+key;l.htmlFor=inp.id;l.textContent=label;inp.type=type;inp.value=h[key];if(key==='number'){inp.inputMode='numeric';inp.maxLength=10}else if(key==='address')inp.maxLength=160;inp.oninput=()=>{if(key==='number')inp.value=inp.value.replace(/\D/g,'').slice(0,10);h[key]=inp.value;renderHomeBar();persist()};card.append(l,inp)}const del=document.createElement('button');del.className='remove';del.textContent='Supprimer ce domicile';del.onclick=()=>{state.homes.splice(index,1);renderHomes();render();persist()};card.append(del);$('homes').append(card)});
}
$('addhome').onclick=()=>{if(state.homes.length>=100)return;state.homes.push({address:'',from:'',to:'',number:''});renderHomes();render();persist()};
for(const id of ['name','start'])$(id).oninput=()=>{
 if(id==='start'){
  const raw=$('start').value;if(raw!==''&&(!/^\d{1,4}$/.test(raw)||+raw<1))return;
  const previous=state.start;const next=raw===''?'':+raw;
  // Preserve the current worksheet when correcting its year.
  for(const [key,value]of Object.entries(state.values))if(key.startsWith(previous+'-'))state.values[next+key.slice(String(previous).length)]=value;
  state.start=next;resetResult();
 }else state.name=$('name').value;
 render();persist();
};
$('ageRaw').oninput=()=>{const input=$('ageRaw');input.value=input.value.replace(/\D/g,'').slice(0,3);state.values[state.start+'-age-0']=input.value;render();persist()};
$('pdf').onclick=downloadNumerologyPdf;
$('restore').onclick=()=>{state.colors={...defaults};palette();document.querySelectorAll('.cell').forEach(paint);renderHomeBar();persist()};
$('clear').onclick=()=>{if(confirm('Vider les nombres du tableau et des domiciles ? Les dates, adresses et couleurs seront conservées.')){state.values={};state.homes.forEach(h=>h.number='');renderHomes();render();persist()}};
$('save').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='numerologie-claire.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('load').onclick=()=>$('file').click();$('file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>1000000)throw Error();state=validate(JSON.parse(await f.text()));palette();renderHomes();render();persist();$('status').textContent='✓ Tableau importé'}catch{$('status').textContent='Fichier invalide. Sélectionnez une sauvegarde de cet outil.'}e.target.value=''};
// Calculation conventions are shown next to the inputs; users control master-number reduction.
function reduceDigits(value,keep){let n=String(value).replace(/^0+(?=\d)/,'');const steps=[n];while(n.length>1&&!(keep&&['11','22','33'].includes(n))){n=String([...n].reduce((a,d)=>a+Number(d),0));steps.push(n)}return {value:Number(n),steps};}
let calcValue=null;
function resetResult(){calcValue=null;$('calcResult').replaceChildren();$('applyCalc').disabled=true;}
function calculator(){resetResult();$('calcInputs').replaceChildren();const mode=$('calcMode').value;const fields=mode==='free'?[['calcNumber','Nombre à réduire','text']]:mode==='name'?[['calcName','Prénoms et nom','text']]:[['calcBirth','Date de naissance','date']];for(const [id,label,type]of fields){const l=document.createElement('label'),i=document.createElement('input');l.htmlFor=id;l.textContent=label;i.id=id;i.type=type;i.oninput=resetResult;if(mode==='free'){i.inputMode='numeric';i.maxLength=100;i.placeholder='Ex. 1999'}if(mode==='name'){i.maxLength=160;i.placeholder='Ex. Claire Dupont'}$('calcInputs').append(l,i)}
 $('calcMethod').textContent=({free:'Addition des chiffres, répétée jusqu’au résultat. L’option ci-dessus permet de conserver ou de réduire 11, 22 et 33.',birth:'Méthode : addition de tous les chiffres de la date de naissance, puis réduction.',personal:'Méthode : chiffres du jour et du mois de naissance + chiffres de l’année du tableau, puis réduction.',name:'Table pythagoricienne : A–Z valent 1–9 en boucle (A=1, I=9, J=1). Les accents sont retirés, Œ devient OE et Æ devient AE. Toutes les lettres sont additionnées, puis le total est réduit.'})[mode];
}
$('calcMode').onchange=calculator;$('masters').onchange=resetResult;
$('calculate').onclick=()=>{resetResult();const mode=$('calcMode').value;let source='',detail='';if(mode==='free'){source=$('calcNumber').value.trim();if(!/^\d{1,100}$/.test(source)){ $('calcResult').textContent='Saisissez uniquement des chiffres.';return}}
 else if(mode==='name'){const raw=$('calcName').value.toUpperCase().replaceAll('Œ','OE').replaceAll('Æ','AE').normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(/[^A-Z\s’'\-]/.test(raw)){$('calcResult').textContent='Utilisez les lettres de l’alphabet latin.';return}const letters=raw.replace(/[^A-Z]/g,'');if(!letters){$('calcResult').textContent='Saisissez un nom.';return}const nums=[...letters].map(c=>(c.charCodeAt(0)-65)%9+1);source=String(nums.reduce((a,b)=>a+b,0));detail=nums.join(' + ')+' = '+source;}
 else{if(mode==='personal'&&state.start===''){$('calcResult').textContent='Renseignez l’année universelle à gauche.';return}const date=$('calcBirth').value;if(!validDate(date)){$('calcResult').textContent='Renseignez une date de naissance valide.';return}source=mode==='birth'?date.replaceAll('-',''):date.slice(5).replace('-','')+state.start;source=[...source].join('');detail=mode==='personal'?'Jour + mois + année '+state.start:'Tous les chiffres de la date';}
 const r=reduceDigits(source,$('masters').checked);calcValue=r.value;const n=document.createElement('div');n.textContent='Résultat : '+r.value;const small=document.createElement('small');small.textContent=(detail?detail+' · ':'')+r.steps.join(' → ');$('calcResult').append(n,small);$('applyCalc').disabled=!$('calcTarget').value||!Object.hasOwn(defaults,calcValue);};
function targets(){const previous=$('calcTarget').value;$('calcTarget').replaceChildren(new Option('Choisir une case…',''));for(const [label,key,num]of rows){if(key==='universelle'||key==='age'||key==='maisons'&&state.homes.length)continue;for(let i=0;i<num;i++)$('calcTarget').add(new Option(label+(num>1?' '+(i+1):''),state.start+'-'+key+'-'+i))}state.homes.forEach((h,i)=>$('calcTarget').add(new Option('DOMICILE '+(i+1),'home:'+i)));$('calcTarget').value=previous;$('applyCalc').disabled=calcValue===null||!$('calcTarget').value||!Object.hasOwn(defaults,calcValue)}
$('calcTarget').onchange=()=>{$('applyCalc').disabled=calcValue===null||!$('calcTarget').value||!Object.hasOwn(defaults,calcValue)};
$('applyCalc').onclick=()=>{const target=$('calcTarget').value;if(calcValue===null||!target||!Object.hasOwn(defaults,calcValue))return;if(target.startsWith('home:')){state.homes[+target.split(':')[1]].number=String(calcValue);renderHomes()}else state.values[target]=String(calcValue);render();persist();$('status').textContent='✓ Résultat reporté dans le tableau'};
palette();renderHomes();render();calculator();
