(() => {
'use strict';
const KEY='asf.workspace.v1', MAX=2*1024*1024;
const SAMPLE='month,revenue,orders,visitors,cost\nJan,12000,124,3200,7200\nFeb,14500,146,3500,8700\nMar,18200,181,4100,10400\nApr,16800,169,3900,10100\nMay,21400,205,4600,12300\nJun,23600,221,5100,13700\nJul,25800,246,5600,14800\nAug,24900,239,,14600\nSep,28300,270,6100,16400\nOct,31200,291,6800,18100\nNov,34500,315,7200,19800\nDec,38200,348,8100,22100\n';
const missing=v=>v==null||(typeof v==='string'&&v.trim()==='');
const number=v=>{if(missing(v)||typeof v==='boolean')return null;if(typeof v!=='number'&&(typeof v!=='string'||!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(v.trim())))return null;const n=Number(v);return Number.isFinite(n)?n:null;};
function normalize(rows,name){
 if(!Array.isArray(rows)||!rows.length||rows.length>10000)throw Error('Provide 1–10,000 data rows.');
 const columns=[];
 for(const row of rows){if(!row||typeof row!=='object'||Array.isArray(row))throw Error('JSON must be an array of flat objects.');for(const c of Object.keys(row)){if(!c.trim())throw Error('Column names cannot be empty.');if(!columns.includes(c))columns.push(c);const v=row[c];if(v!==null&&typeof v==='object'||!['string','number','boolean','object'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v))throw Error('Cells must be text, finite numbers, booleans, or null.');}}
 if(!columns.length||columns.length>50)throw Error('Provide 1–50 columns.');
 return {name:String(name||'Dataset').slice(0,120),columns,rows:rows.map(r=>Object.fromEntries(columns.map(c=>[c,Object.hasOwn(r,c)?r[c]:null])))};
}
function csv(text){
 const records=[];let row=[],field='',quoted=false,closed=false;
 const end=()=>{row.push(field);if(row.some(v=>v.trim()!==''))records.push(row);row=[];field='';closed=false;};
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;}else if(c==='"'){if(field||closed)throw Error('Invalid CSV quoting.');quoted=true;}else if(c===','){row.push(field);field='';closed=false;}else if(c==='\n'||c==='\r'){end();if(c==='\r'&&text[i+1]==='\n')i++;}else{if(closed){if(c.trim())throw Error('Unexpected text after a quoted CSV field.');}else field+=c;}}
 if(quoted)throw Error('CSV has an unclosed quoted field.');if(field||row.length||closed)end();
 if(records.length<2)throw Error('CSV needs a header and at least one data row.');
 const headers=records.shift().map(c=>c.trim());if(headers.some(c=>!c)||new Set(headers).size!==headers.length)throw Error('CSV headers must be nonempty and unique.');
 return records.map(r=>{if(r.length>headers.length)throw Error('A CSV row has more cells than its header.');return Object.fromEntries(headers.map((c,i)=>[c,r[i]??'']));});
}
function parse(text,name='Dataset.csv'){if(new TextEncoder().encode(text).length>MAX)throw Error('File exceeds 2 MiB.');const clean=text.replace(/^\uFEFF/,'').trim();return normalize(name.toLowerCase().endsWith('.json')||clean.startsWith('[')?JSON.parse(clean):csv(text),name);}
const sample=()=>parse(SAMPLE,'Synthetic monthly sample.csv');
function load(){try{const raw=sessionStorage.getItem(KEY);if(raw){if(raw.length>MAX*2)throw Error('Stored workspace is too large.');const d=JSON.parse(raw);return normalize(d.rows,d.name);}}catch(e){}return sample();}
function save(d){try{sessionStorage.setItem(KEY,JSON.stringify({name:d.name,rows:d.rows}));return true;}catch(e){return false;}}
const format=v=>v==null||!Number.isFinite(v)?'—':new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(v);
function stats(rows,c){const values=rows.map(r=>number(r[c])).filter(v=>v!==null).sort((a,b)=>a-b), n=values.length, missingCount=rows.filter(r=>missing(r[c])).length;const mean=n?values.reduce((s,v)=>s+v/n,0):null;return {column:c,count:rows.length,numericCount:n,missingCount,textCount:rows.length-missingCount-n,min:n?values[0]:null,max:n?values[n-1]:null,mean,median:n?(n%2?values[(n-1)/2]:values[n/2-1]/2+values[n/2]/2):null,stdDev:n?Math.sqrt(values.reduce((s,v)=>s+((v-mean)/Math.sqrt(n))**2,0)):null};}
function table(target,d,limit=8){target.replaceChildren();const t=document.createElement('table'),cap=document.createElement('caption');cap.textContent=`Showing ${Math.min(d.rows.length,limit)} of ${d.rows.length} rows`;t.append(cap);const head=document.createElement('thead'),hr=document.createElement('tr');for(const c of d.columns){const th=document.createElement('th');th.scope='col';th.textContent=c;hr.append(th);}head.append(hr);t.append(head);const body=document.createElement('tbody');for(const r of d.rows.slice(0,limit)){const tr=document.createElement('tr');for(const c of d.columns){const td=document.createElement('td');td.textContent=missing(r[c])?'—':String(r[c]).slice(0,160);tr.append(td);}body.append(tr);}t.append(body);target.append(t);}
function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toCSV(d){const cell=v=>{let s=v==null?'':String(v);if(number(v)===null&&/^[=+\-@]/.test(s.trimStart()))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};return [d.columns,...d.rows.map(r=>d.columns.map(c=>r[c]))].map(r=>r.map(cell).join(',')).join('\r\n');}
function status(message,error=false){const el=document.getElementById('status');if(el){el.textContent=message;el.classList.toggle('error',error);}}
function start(render){let data=load();render(data);status(`${data.name} · ${data.rows.length} rows · ${data.columns.length} columns`);const use=(d,note)=>{data=d;const stored=save(d);render(d);status((note||`${d.name} · ${d.rows.length} rows loaded.`)+(stored?' Shared with ASF apps in this tab.':' Storage unavailable; export/import to transfer.'));};document.getElementById('file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>MAX)throw Error('File exceeds 2 MiB.');use(parse(await f.text(),f.name));}catch(err){status(err.message,true);}finally{e.target.value='';}});document.getElementById('sample').addEventListener('click',()=>use(sample(),'Synthetic sample loaded.'));document.getElementById('clear').addEventListener('click',()=>{try{sessionStorage.removeItem(KEY);}catch(e){}data=sample();render(data);status('Saved workspace cleared. Showing the synthetic sample.');});return ()=>data;}
window.ASF={KEY,parse,csv,normalize,number,missing,format,stats,table,download,toCSV,status,start,sample,load,save,numericColumns:d=>d.columns.filter(c=>d.rows.some(r=>number(r[c])!==null))};
})();
