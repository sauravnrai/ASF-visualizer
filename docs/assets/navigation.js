(() => {
'use strict';
const current=document.body.dataset.app,guide=document.body.dataset.page==='guide',nav=document.getElementById('navigation');
const apps=[['/','App Network','network'],['/discovery/','Discovery','discovery'],['/ASF/','ASF Studio','ASF'],['/ASF-analytics/','Analytics','ASF-analytics'],['/ASF-visualizer/','Visualizer','ASF-visualizer'],['./guide.html','Guide','guide']];
if(nav){nav.setAttribute('aria-label','App Network');nav.replaceChildren();for(const [href,label,key]of apps){const a=document.createElement('a');a.href=href;a.textContent=label;if((guide&&key==='guide')||(!guide&&key===current))a.setAttribute('aria-current','page');nav.append(a);}}
const source=document.getElementById('source');if(source&&current)source.href='https://github.com/sauravnrai/'+current;
})();
