(() => {
'use strict';const S=window.ASF,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';let data;
function options(id,values,preferred){const el=$(id);el.replaceChildren();for(const v of values){const o=document.createElement('option');o.value=v;o.textContent=v;el.append(o);}el.value=values.includes(preferred)?preferred:(values[0]||'');}
function fields(){const nums=S.numericColumns(data),scatter=$('kind').value==='scatter';options('y',nums,$('y').value||nums[0]);options('x',scatter?nums:data.columns,$('x').value||(scatter?nums[0]:data.columns[0]));if(scatter&&$('x').value===$('y').value&&nums.length>1) $('y').value=nums.find(c=>c!==$('x').value);draw();}
function draw(){
 const kind=$('kind').value,x=$('x').value,y=$('y').value,all=data.rows.map((r,i)=>({row:r,label:String(r[x]??'—'),x:S.number(r[x]),y:S.number(r[y]),index:i+1})).filter(p=>p.y!==null&&(kind!=='scatter'||p.x!==null));
 const limit=kind==='bar'?24:kind==='line'?200:500,points=all.slice(0,limit),target=$('chart');target.replaceChildren();$('download-chart').disabled=!points.length;
 if(!points.length){target.textContent='No plottable numeric data. Choose numeric fields or import another dataset.';$('chart-status').textContent='No valid points for this selection.';$('chart-data').replaceChildren();return;}
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('xmlns',NS);svg.setAttribute('viewBox','0 0 900 400');svg.setAttribute('role','img');svg.setAttribute('aria-labelledby','svg-title svg-desc');
 function add(tag,attrs={},text,parent=svg){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;parent.append(el);return el;}
 add('title',{id:'svg-title'},`${kind} chart: ${y} by ${x}`);add('desc',{id:'svg-desc'},`${points.length} plotted records. Data is also available in the inspect plotted data table.`);
 const L=78,T=25,W=795,H=290;let minY=Math.min(0,...points.map(p=>p.y)),maxY=Math.max(0,...points.map(p=>p.y));if(minY===maxY)maxY=minY+1;
 const sy=v=>T+H-((v/2-minY/2)/(maxY/2-minY/2))*H;let minX=Math.min(...points.map(p=>p.x??0)),maxX=Math.max(...points.map(p=>p.x??0));
 const sx=(p,i)=>kind==='scatter'?(maxX===minX?L+W/2:L+((p.x/2-minX/2)/(maxX/2-minX/2))*W):L+(i+.5)*W/points.length;
 for(let i=0;i<=4;i++){const value=minY+(maxY/4-minY/4)*i,yy=sy(value);add('line',{x1:L,y1:yy,x2:L+W,y2:yy,class:'gridline'});add('text',{x:L-10,y:yy+4,'text-anchor':'end'},S.format(value));}
 add('line',{x1:L,y1:sy(0),x2:L+W,y2:sy(0),stroke:'#668078'});
 if(kind==='line')add('path',{d:points.map((p,i)=>(i?'L':'M')+sx(p,i)+','+sy(p.y)).join(' '),fill:'none',stroke:'#b5f275','stroke-width':3});
 for(let i=0;i<points.length;i++){const p=points[i],xx=sx(p,i),yy=sy(p.y);let mark;if(kind==='bar'){const width=W/points.length*.66;mark=add('rect',{x:xx-width/2,y:Math.min(yy,sy(0)),width,height:Math.max(1,Math.abs(sy(0)-yy)),rx:3,fill:p.y<0?'#bdacff':'#b5f275'});}else mark=add('circle',{cx:xx,cy:yy,r:kind==='scatter'?4:3,fill:'#b5f275',opacity:.9});add('title',{},`${x}: ${p.label} · ${y}: ${S.format(p.y)} · record ${p.index}`,mark);}
 if(kind==='scatter'){for(let i=0;i<=4;i++){const v=minX+(maxX/4-minX/4)*i;add('text',{x:L+W*i/4,y:T+H+28,'text-anchor':'middle'},S.format(v));}}else{const step=Math.max(1,Math.ceil(points.length/6));for(let i=0;i<points.length;i+=step)add('text',{x:sx(points[i],i),y:T+H+28,'text-anchor':'middle'},points[i].label.slice(0,14));}
 add('text',{x:L+W/2,y:386,'text-anchor':'middle'},x);add('text',{x:L,y:14},y);target.append(svg);
 $('chart-status').textContent=`${points.length} of ${all.length} valid records plotted · ${data.rows.length-all.length} excluded for missing/nonnumeric fields${all.length>limit?' · display limit applied':''}.`;
 S.table($('chart-data'),{columns:[...new Set([x,y])],rows:points.map(p=>p.row)},20);
}
S.start(d=>{data=d;fields();});$('kind').addEventListener('change',fields);$('x').addEventListener('change',draw);$('y').addEventListener('change',draw);
$('download-chart').addEventListener('click',()=>{const svg=$('chart').querySelector('svg');if(svg)S.download('asf-chart.svg','<?xml version="1.0" encoding="UTF-8"?>\n'+svg.outerHTML,'image/svg+xml;charset=utf-8');});
$('export').addEventListener('click',()=>S.download('asf-dataset.csv',S.toCSV(data),'text/csv;charset=utf-8'));
})();
