/* Vector PDF export. All data and generation stay in the visitor's browser. */
async function buildNumerologyPdf(data, periods) {
 const {PDFDocument, StandardFonts, rgb}=PDFLib;
 const doc=await PDFDocument.create();doc.setTitle('Numérologie Claire — '+(data.name||'Tableau personnel')+(data.start?' — '+data.start:''));doc.setCreator('Numérologie Claire');
 const page=doc.addPage([841.89,595.28]);
 const regular=await doc.embedFont(StandardFonts.Helvetica),serif=await doc.embedFont(StandardFonts.TimesRomanItalic);
 const ink=rgb(.19,.24,.21),muted=rgb(.47,.51,.45),neutral='#eceee6';
 const color=h=>rgb(...h.match(/\w\w/g).map(n=>parseInt(n,16)/255));
 function safe(s,font){return [...String(s)].map(c=>{try{font.encodeText(c);return c}catch{return '?'}}).join('')}
 function text(s,x,y,size=10,font=regular,c=ink,max=760,center=false){let v=safe(s,font);while(font.widthOfTextAtSize(v,size)>max&&v.length)v=v.slice(0,-1);if(!v)return;const w=font.widthOfTextAtSize(v,size);page.drawText(v,{x:center?x-w/2:x,y,size,font,color:c})}
 page.drawRectangle({x:0,y:0,width:841.89,height:595.28,color:rgb(1,.996,.976)});
 text('numérologie',38,539,30,serif);text(data.name||'Votre tableau personnel',38,515,13,regular,ink,590);
 text('NUMÉROLOGIE CLAIRE',660,543,9);text(data.start?'Année : '+data.start:'Année : —',660,525,11,regular,ink,145);
 const x0=180,width=623.89,top=463,rowHeight=37,gap=5;

 page.drawLine({start:{x:x0,y:471},end:{x:x0+width,y:471},thickness:.6,color:color('#cdd5c7')});
 const rows=[['ANNÉE UNIVERSELLE','universelle',1],['ANNÉE PERSONNELLE','personnelle',1],['ÂGE','age',1],['MAISONS ASTROLOGIQUES','maisons',12],['QUADRIMESTRES','quadrimestres',3],['TRIMESTRES','trimestres',4],['MOIS','mois',12]];
 function box(x,y,w,value,key){const hex=data.colors[value]||neutral;page.drawRectangle({x,y,width:Math.max(.1,w),height:rowHeight,color:color(hex)});if(value){const a=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);const fg=.2126*a[0]+.7152*a[1]+.0722*a[2]>.179?ink:rgb(1,1,1);text(value,x+w/2,y+12,16,regular,fg,w-3,true)}}
 rows.forEach(([label,key,num],r)=>{const y=top-(r+1)*(rowHeight+gap);text(label,38,y+15,8,regular,ink,137);if(key==='maisons'&&data.homes.length){box(x0,y,width,'',key);for(const p of periods)box(x0+p.a/12*width,y,(p.b-p.a)/12*width-1,singleDigit(p.home.number),key)}else for(let i=0;i<num;i++){const w=(width+gap)/num;box(x0+i*w,y,w-gap,key==='universelle'?singleDigit(data.start):key==='age'?singleDigit(data.values[data.start+'-'+key+'-'+i]):data.values[data.start+'-'+key+'-'+i]||'',key)}});
 ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEP','OCT','NOV','DÉC'].forEach((m,i)=>text(m,x0+(i+.5)*width/12,top-7*(rowHeight+gap)-17,8,regular,muted,45,true));
 const noteY=top-7*(rowHeight+gap)-40;
 const noteSize=Math.min(8,100/Math.max(periods.length,1));
 periods.forEach((p,i)=>text((p.home.address||'Domicile')+' · arrivée : '+p.home.from+(p.home.to?' · départ : '+p.home.to:'')+' · numéro : '+(p.home.number||'—')+' · résultat : '+(singleDigit(p.home.number)||'—'),38,noteY-i*(noteSize+2),noteSize,regular,muted,765));
 const labels={1:'Rouge',2:'Bleu clair',3:'Vert',4:'Marron',5:'Orange',6:'Rose',7:'Gris',8:'Noir',9:'Violet',11:'Bleu foncé',22:'Marron foncé',33:'Rose foncé'};
 Object.keys(labels).forEach((n,i)=>{const x=38+(i%6)*128,y=i<6?61:45;page.drawCircle({x:x+3,y:y+3,size:3,color:color(data.colors[n])});text(n+' · '+labels[n],x+11,y,8,regular,muted,112)});
 page.drawLine({start:{x:38,y:32},end:{x:804,y:32},thickness:.5,color:color('#dfe3d9')});
 text('LES CYCLES EN COULEURS',38,18,7,regular,muted);text('NUMÉROLOGIE CLAIRE',690,18,7,regular,muted);
 return doc.save();
}
let pdfDownloadUrl;
async function downloadNumerologyPdf(){
 const button=document.getElementById('pdf'),feedback=document.getElementById('exportFeedback');button.disabled=true;button.textContent='Création du PDF…';feedback.textContent='';
 try{
 const bytes=await buildNumerologyPdf(state,homePeriods().periods);
 if(pdfDownloadUrl)URL.revokeObjectURL(pdfDownloadUrl);
 pdfDownloadUrl=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
 const link=document.createElement('a');link.href=pdfDownloadUrl;link.download='numerologie-'+(state.name||'tableau').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()+(state.start?'-'+state.start:'')+'.pdf';link.textContent='PDF prêt — télécharger';feedback.append(link);link.click();
 }catch(error){console.error('Export PDF',error);feedback.textContent='Le PDF n’a pas pu être créé. Réessayez après avoir actualisé la page.';}
 finally{button.disabled=false;button.textContent='Télécharger le PDF'}
}
