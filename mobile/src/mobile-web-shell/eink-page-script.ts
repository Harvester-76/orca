// The host page is served by the desktop and knows nothing of E-ink, so the shell restyles it
// before it runs. Colours are mapped explicitly (ink on paper, ink-on-ink inverted) instead of
// thresholding the whole page: a threshold erases the grey edge pixels that make glyphs smooth.
const PAGE_CSS = [
  '*,*::before,*::after{box-shadow:none!important;text-shadow:none!important;background-image:none!important}',
  'svg,svg *{stroke-width:3!important}',
  'svg[stroke]:not([stroke="none"]),svg *[stroke]:not([stroke="none"]){stroke:currentColor!important}',
  'svg[fill]:not([fill="none"]),svg *[fill]:not([fill="none"]){fill:currentColor!important}',
  'input::placeholder,textarea::placeholder{color:#000!important;opacity:1!important}',
  'img,canvas,video{filter:grayscale(1) contrast(1.4)}'
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
 const wide=()=>innerWidth>=900;
 const hasOwnText=el=>Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
 const isField=el=>el.tagName==='INPUT'||el.tagName==='TEXTAREA';
 // The sidebar is read at arm's length in a narrow column, so it grows a little more than the content.
 const textScale=(el,rect)=>{
  if(!wide()||rect.width<=0||!(hasOwnText(el)||isField(el))) return 1;
  return rect.right<=innerWidth*0.42?1.2:1.15;
 };
 // Lightness of the paper under an element, so ink on a dark fill is drawn white.
 const paper=new WeakMap();
 function paperUnder(el){
  if(!el) return 1;
  if(paper.has(el)) return paper.get(el);
  const bg=rgba(getComputedStyle(el).backgroundColor);
  const value=bg.a>0.5?lum(bg):paperUnder(el.parentElement);
  paper.set(el,value);
  return value;
 }
 function scaleText(el,cs,scale){
  const fs=parseFloat(cs.fontSize);
  if(el.dataset.einkFs&&Math.abs(fs-parseFloat(el.dataset.einkFs))<0.01) return;
  const target=fs*scale;
  set(el,'font-size',target+'px');
  const lh=parseFloat(cs.lineHeight);
  if(!isNaN(lh)) set(el,'line-height',(lh*scale)+'px');
  el.dataset.einkFs=target;
 }
 function pillPadding(el,rect){
  const cs=getComputedStyle(el);
  const h=rect.height,w=rect.width;
  const radius=parseFloat(cs.borderTopLeftRadius)||0;
  if(h>=24&&h<=52&&w<=360&&radius>=8&&parseFloat(cs.borderTopWidth)>0&&el.textContent.trim().length>0&&parseFloat(cs.paddingLeft)<14){
   set(el,'padding-left','20px');set(el,'padding-right','20px');
  }
 }
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
   paper.set(el,1);
   return;
  }
  if(bg.a>0.05&&((h<=2&&w>=24)||(w<=2&&h>=24))){
   set(el,'background-color','#000');
   set(el,h<=2?'min-height':'min-width','2px');
   paper.set(el,0);
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
  let own=null;
  if(bg.a>0.05){
   const L=lum(bg);
   if(sat(bg)>0.2){
    set(el,'background-color','#000');
    own=0;
    // Red marks attention or failure: a square keeps it apart from the round "done" dot.
    if(small&&bg.r>bg.g+80&&bg.r>bg.b+80) set(el,'border-radius','0');
   }
   else if(small&&L>0.2&&L<0.95){
    set(el,'background-color','transparent');
    outline(el,2);
   }
   else{
    if(!bordered){
     const radius=parseFloat(cs.borderTopLeftRadius)||0;
     const tile=radius>=6&&w>=24&&h>=24&&L>0.8&&L<0.995&&w*h<screenArea*0.4;
     const sheet=radius>=14&&w>=300&&h>=200&&L>=0.995&&w*h<screenArea*0.6;
     if(tile) outline(el,2);
     else if(sheet) outline(el,3);
    }
    if(bg.a<0.9) set(el,'background-color','transparent');
    else if(L>=0.45){set(el,'background-color','#fff');own=1}
    else{set(el,'background-color','#000');own=0}
   }
  }
  paper.set(el,own!==null?own:paperUnder(el.parentElement));
  if(hasOwnText(el)||el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.tagName.toLowerCase()==='svg'){
   set(el,'color',paper.get(el)<0.45?'#fff':'#000');
  }
  const scale=textScale(el,rect);
  if(scale>1) scaleText(el,cs,scale);
  pillPadding(el,rect);
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
