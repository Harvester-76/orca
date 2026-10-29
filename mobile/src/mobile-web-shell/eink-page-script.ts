// The host page is served by the desktop and knows nothing of E-ink, so the shell restyles it
// before it runs: a luminance threshold makes everything pure black or white, and the script
// turns borders, coloured fills and status dots into ink so the threshold cannot erase them.
const PAGE_CSS = [
  'html{filter:grayscale(1) brightness(.75) contrast(100)}',
  '*,*::before,*::after{box-shadow:none!important;text-shadow:none!important;background-image:none!important}'
].join('\n')

const PAGE_SCRIPT = String.raw`(function(){
 const css=__CSS__;
 try{const s=new CSSStyleSheet();s.replaceSync(css);document.adoptedStyleSheets=[...document.adoptedStyleSheets,s]}catch(_){}
 const rgba=c=>{const m=c.match(/[\d.]+/g);return m?{r:+m[0],g:+m[1],b:+m[2],a:m[3]===undefined?1:+m[3]}:{r:0,g:0,b:0,a:0}};
 const sat=c=>(Math.max(c.r,c.g,c.b)-Math.min(c.r,c.g,c.b))/255;
 const lum=c=>(0.2126*c.r+0.7152*c.g+0.0722*c.b)/255;
 const SIDES=['top','right','bottom','left'];
 const set=(el,name,value)=>el.style.setProperty(name,value,'important');
 const outline=(el,width)=>{set(el,'border',width+'px solid #000');set(el,'box-sizing','border-box')};
 function ink(el){
  if(el.nodeType!==1) return;
  const cs=getComputedStyle(el);
  const rect=el.getBoundingClientRect();
  const bg=rgba(cs.backgroundColor);
  const w=rect.width,h=rect.height;
  const small=w<=16&&h<=16&&w>0;
  const screenArea=innerWidth*innerHeight;
  if(bg.a>0.05&&bg.a<0.95&&bg.r<30&&bg.g<30&&bg.b<30&&w>innerWidth*0.6&&h>innerHeight*0.6){
   set(el,'background-color','rgba(255,255,255,0.92)');
   return;
  }
  if(bg.a>0.05&&((h<=2&&w>=24)||(w<=2&&h>=24))){
   set(el,'background-color','#000');
   set(el,h<=2?'min-height':'min-width','2px');
   return;
  }
  let bordered=false;
  for(const side of SIDES){
   const bw=parseFloat(cs['border-'+side+'-width']);
   if(bw>0){
    const c=rgba(cs['border-'+side+'-color']);
    if(c.a>0.05){
     set(el,'border-'+side+'-color','#000');
     if(bw<2) set(el,'border-'+side+'-width','2px');
     bordered=true;
    }
   }
  }
  if(el.tagName==='INPUT'&&el.getAttribute('role')==='switch'){
   const track=el.parentElement&&el.parentElement.firstElementChild;
   if(track) outline(track,2);
   return;
  }
  if(bg.a>0.05){
   if(sat(bg)>0.2){
    set(el,'background-color','#000');
    // Red marks attention or failure: a square keeps it apart from the round "done" dot.
    if(small&&bg.r>bg.g+80&&bg.r>bg.b+80) set(el,'border-radius','0');
   }
   else if(small&&lum(bg)>0.2&&lum(bg)<0.95){
    set(el,'background-color','transparent');
    outline(el,2);
   }
   else if(!bordered){
    const radius=parseFloat(cs.borderTopLeftRadius)||0;
    const tile=radius>=6&&w>=24&&h>=24&&lum(bg)>0.8&&lum(bg)<0.995&&w*h<screenArea*0.4;
    const sheet=radius>=14&&w>=300&&h>=200&&lum(bg)>=0.995&&w*h<screenArea*0.6;
    if(tile) outline(el,2);
    else if(sheet) outline(el,3);
   }
  }
 }
 function walk(n){ if(n.nodeType!==1) return; ink(n); for(const c of n.querySelectorAll('*')) ink(c); }
 const queue=new Set();
 let scheduled=false,observer=null;
 function flush(){
  scheduled=false;
  const q=[...queue];queue.clear();
  for(const n of q) if(n.isConnected) walk(n);
  if(observer) observer.takeRecords();
 }
 function enqueue(n){queue.add(n); if(!scheduled){scheduled=true;requestAnimationFrame(flush)}}
 const start=()=>{
  walk(document.documentElement);
  observer=new MutationObserver(ms=>{for(const m of ms){ if(m.type==='childList') m.addedNodes.forEach(n=>n.nodeType===1&&enqueue(n)); else if(m.target.nodeType===1) enqueue(m.target);}});
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
 };
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})()`

export const EINK_PAGE_SCRIPT = PAGE_SCRIPT.replace('__CSS__', JSON.stringify(PAGE_CSS))
