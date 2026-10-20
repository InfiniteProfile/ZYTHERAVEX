'use strict';
(() => {
const $ = s => document.querySelector(s);
const CL = [
 {k:'VOIDBORN',d:'Identities associated with the unknown.',roles:['A keeper of unanswered questions','A voice from before the first star','A witness to empty rooms']},
 {k:'ASTRAVEN',d:'Explorers of distant cosmic territories.',roles:['A cartographer of far coasts','A pilot of long silences','A surveyor of unnamed suns']},
 {k:'NOCTYRA',d:'Mysterious identities connected to darkness.',roles:['A weaver of shadow','A night-shift archivist','A listener in the dark']},
 {k:'SOLVEX',d:'Architects of extraordinary civilizations.',roles:['An architect of floating cities','A founder of quiet republics','A builder of impossible bridges']},
 {k:'ECLYRON',d:'Identities representing forgotten realities.',roles:['A curator of lost timelines','A last speaker of a dead tongue','A restorer of erased maps']},
 {k:'VANTHOR',d:'Independent travelers across the infinite dimension.',roles:['A wanderer without a ledger','A courier between worlds','A traveler who never unpacks']}];
const DEEDS=['mapped the edges of','sealed a door beneath','keeps a lantern at','named every star over','was last seen leaving','still hears the tide of','traded a memory for','drew the first road through'];
const P1=['the Hollow','Orrin','the Glass','Vael','the Silent','Nexa','the Ninth','Kesh'];
const P2=['Meridian','Veil','Reach','Archive','Drift','Threshold','Spire','Basin'];
const TRAITS=['patient','restless','wry','solemn','curious','guarded','generous','exacting','dreamy','stubborn','warm','watchful'];
const ELEM=['Ash','Glass','Ion','Salt','Static','Frost','Dust','Mercury'];
const HUES=[190,215,245,265,285,305,330,348],HNAME=['Teal','Azure','Indigo','Violet','Amethyst','Magenta','Crimson','Rose'];
const ACC=['Unadorned','Glass visor','Halo ring','Ear studs','Brow glyph'];
const SK=['#e8c7b0','#c99a7a','#a06f52','#6e4a38','#f0dcd0','#b8a9d6','#9fb3c8'],HC=['#1a1220','#3b2a3f','#d4d6de','#7a1f3d','#4b3a8c','#0e0b14'];
const SYL=['ka','ve','zy','lo','mi','ar','sa','el','dra','no','thy','ry','xa','or','ul','ne','sh','vi','qua','te'];

// ---- deterministic core (string/BigInt only; ids are never Numbers) ----
function h32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;h=Math.imul(h,3266489909);h^=h>>>16;return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const cap=s=>s[0].toUpperCase()+s.slice(1);
function nameFor(ids){const r=rng(h32('n:'+ids));const w=()=>{let s='';for(let i=2+(r()*2|0);i>0;i--)s+=pick(r,SYL);return cap(s)};return w()+' '+w()}
// Each block of 6 consecutive ids holds one of every class, in a seeded order.
// That makes "k-th identity of class c" an O(1) calculation.
function perm(block){const r=rng(h32('c:'+block));const a=[0,1,2,3,4,5];for(let i=5;i>0;i--){const j=r()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
const classOf=n=>perm(((n-1n)/6n).toString())[Number((n-1n)%6n)];
function normId(s){s=String(s).replace(/[\s,_#]/g,'');if(!/^\d+$/.test(s))return null;s=s.replace(/^0+/,'');return s||null}
function profile(ids){
 const r=rng(h32('p:'+ids)),ci=classOf(BigInt(ids)),C=CL[ci],hi=r()*8|0,acc=r()*5|0;
 const bio=`${pick(r,C.roles)} who ${pick(r,DEEDS)} ${pick(r,P1)} ${pick(r,P2)}.`;
 const t=r()*12|0,traits=[TRAITS[t],TRAITS[(t+5)%12],TRAITS[(t+7)%12]];
 return {ids,name:nameFor(ids),ci,cls:C,bio,traits,hue:HUES[hi],hn:HNAME[hi],acc,
  sig:`${HNAME[hi]} signature, ${ACC[acc].toLowerCase()}`,
  attrs:[['Sector',`${100+(r()*900|0)}-${'ABCDEFGHJK'[r()*10|0]}`],['Epoch',String(1+(r()*99|0))],['Resonance',(r()*100).toFixed(2)+'%'],['Element',pick(r,ELEM)]]};
}
// Illustrated portrait (SVG). These are drawings, not photographs.
function avatar(p,pre){
 const r=rng(h32('a:'+p.ids)),h=p.hue,h2=pick(r,HUES),skin=pick(r,SK),hair=pick(r,HC),glow=`hsl(${h} 70% 68%)`,
  rx=17+(r()*4|0),ry=21+(r()*3|0),hv=r()*5|0,cv=r()*3|0,g=pre+p.ids;
 const cloth=['M14 100Q16 74 50 70Q84 74 86 100Z','M8 100L20 76Q50 66 80 76L92 100Z','M18 100Q20 72 50 72Q80 72 82 100Z'][cv];
 let back='',front='';
 if(hv===2)back=`<path d="M27 50Q25 18 50 17Q75 18 73 50L75 80L25 80Z" fill="${hair}"/>`;
 if(hv===1||hv===2||hv===4)front+=`<path d="M${50-rx} 44Q${50-rx} 22 50 22Q${50+rx} 22 ${50+rx} 44Q60 32 50 34Q40 32 ${50-rx} 44Z" fill="${hair}"/>`;
 if(hv===3)front+=`<path d="M${50-rx} 42L40 14L50 26L60 12L${50+rx} 42Q50 28 ${50-rx} 42Z" fill="${hair}"/>`;
 if(hv===4)front+=`<circle cx="50" cy="16" r="8" fill="${hair}"/>`;
 if(p.acc===1)front+=`<rect x="34" y="41" width="32" height="6" rx="3" fill="${glow}" opacity=".7"/>`;
 if(p.acc===2)front+=`<ellipse cx="50" cy="14" rx="20" ry="5" fill="none" stroke="${glow}" stroke-width="1.6"/>`;
 if(p.acc===3)front+=`<circle cx="${50-rx}" cy="54" r="2" fill="${glow}"/><circle cx="${50+rx}" cy="54" r="2" fill="${glow}"/>`;
 if(p.acc===4)front+=`<path d="M50 31L53 36L50 41L47 36Z" fill="${glow}"/>`;
 return `<svg viewBox="0 0 100 100" role="img" aria-label="Illustrated portrait of ${p.name}"><defs><radialGradient id="${g}" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="hsl(${h} 55% 30%)"/><stop offset="1" stop-color="#06030b"/></radialGradient></defs><rect width="100" height="100" fill="url(#${g})"/>${back}<path d="${cloth}" fill="hsl(${h2} 35% 22%)"/><rect x="44" y="58" width="12" height="16" fill="${skin}" opacity=".85"/><ellipse cx="50" cy="46" rx="${rx}" ry="${ry}" fill="${skin}"/>${front}<circle cx="43" cy="47" r="1.8" fill="#120a1a"/><circle cx="57" cy="47" r="1.8" fill="#120a1a"/></svg>`;
}

// ---- infinite virtualized feed ----
const ROWH=350,PAD=2000,BATCH=40;
const feed=$('#feed'),spacer=$('#spacer');
let cols=colsFor(innerWidth),anchor=0n,totalRows=60,filter=-1,lastY=scrollY,buf=3;
const rows=new Map();
function colsFor(w){return w>=1100?4:w>=760?3:w>=340?2:1}
// feed index k -> identity id (BigInt). Unfiltered: k+1. Filtered: direct formula, no scanning.
function idAt(k){if(filter<0)return k+1n;return k*6n+BigInt(perm(k.toString()).indexOf(filter))+1n}
function card(ids){const p=profile(ids);return `<article class="card" style="--h:${p.hue}" data-id="${ids}" tabindex="0" role="button" aria-label="Open identity ${ids}"><div class="pt">${avatar(p,'f')}</div><h3>${p.name}</h3><p class="idn">Identity ${ids}</p><p class="bio">${p.bio}</p><p class="cls">${p.cls.k}</p><p class="sig">${p.sig}</p></article>`}
function makeRow(r){const el=document.createElement('div');el.className='row';el.style.top=r*ROWH+'px';let h='';for(let c=0;c<cols;c++)h+=card(idAt(anchor+BigInt(r*cols+c)).toString());el.innerHTML=h;return el}
function clearRows(){rows.forEach(e=>e.remove());rows.clear()}
function setHeight(){spacer.style.height=totalRows*ROWH+'px';feed.style.setProperty('--cols',cols);feed.style.setProperty('--cols',cols)}
function render(){
 const y=scrollY-feed.offsetTop,first=Math.max(0,Math.floor(y/ROWH)-buf),last=Math.min(totalRows-1,Math.floor((y+innerHeight)/ROWH)+buf);
 for(const [r,e] of rows)if(r<first||r>last){e.remove();rows.delete(r)}
 const frag=document.createDocumentFragment();
 for(let r=first;r<=last;r++)if(!rows.has(r)){const e=makeRow(r);rows.set(r,e);frag.appendChild(e)}
 spacer.insertBefore(frag,$('#sentinel'));
}
// Generation = extending the virtual universe ahead of the visitor. Rechecked after every render.
function ensure(){const need=Math.ceil((scrollY-feed.offsetTop+innerHeight*3)/ROWH);if(need>totalRows){totalRows=need+BATCH;setHeight();return true}return false}
function pump(){
 try{let n=0,grew;do{grew=ensure();render()}while(grew&&++n<6)}
 catch(e){console.warn('Generation recovered',e);clearRows();try{setHeight();render()}catch(_){}}
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const dy=Math.abs(scrollY-lastY);lastY=scrollY;buf=Math.min(8,3+Math.floor(dy/ROWH));pump();rebase()})}
function setAnchor(k0,within){
 const c=BigInt(cols),pad=BigInt(PAD)*c;let a=k0>pad?k0-pad:0n;a=(a/c)*c;
 const row=Number((k0-a)/c);anchor=a;clearRows();totalRows=row+BATCH*3;setHeight();
 scrollTo(0,feed.offsetTop+row*ROWH+within);pump();
}
// Keeps document height bounded (browsers cap it) without changing what is on screen.
function rebase(){
 const y=scrollY-feed.offsetTop,fr=Math.max(0,Math.floor(y/ROWH));
 if(fr>6000||(anchor>0n&&fr<400))setAnchor(anchor+BigInt(fr*cols),y-fr*ROWH);
}
function resetFeed(){anchor=0n;clearRows();totalRows=60;setHeight();scrollTo(0,0);pump()}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
 const fr=Math.max(0,Math.floor((scrollY-feed.offsetTop)/ROWH)),k0=anchor+BigInt(fr*cols);
 cols=colsFor(innerWidth);setAnchor(k0,0)},150)});
addEventListener('scroll',schedule,{passive:true});
new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))schedule()},{rootMargin:'0px 0px 600px 0px'}).observe($('#sentinel'));
setInterval(()=>{if(!document.hidden)schedule()},1200); // watchdog: re-checks even if no event fires

// filters
const fbox=$('#filters');
['All classes',...CL.map(c=>c.k)].forEach((t,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=t;b.dataset.f=i-1;b.setAttribute('aria-pressed',i===0);fbox.appendChild(b)});
fbox.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;filter=+b.dataset.f;
 fbox.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));
 $('#fnote').textContent=filter<0?'':CL[filter].d+' New members keep appearing as you scroll.';resetFeed()});

// ---- chamber + routing ----
const ch=$('#chamber');
const depth=()=>(history.state&&history.state.d)||0;
function openId(ids){history.pushState({d:depth()+1},'','#/id/'+ids);route()}
function route(){const m=/^#\/id\/(\d+)$/.exec(location.hash),ids=m&&normId(m[1]);ids?showChamber(ids):hideChamber()}
function closeChamber(){const d=depth();if(d>0)history.go(-d);else{history.replaceState(null,'',location.pathname+location.search);route()}}
function hideChamber(){ch.hidden=true;ch.innerHTML='';unlock()}
const unlock=()=>{if($('#search').hidden&&ch.hidden)document.documentElement.classList.remove('lock')};
function showChamber(ids){
 const p=profile(ids),n=BigInt(ids),prev=n>1n?(n-1n).toString():null,next=(n+1n).toString(),url=location.origin+location.pathname+'#/id/'+ids;
 ch.innerHTML=`<div class="panel cham" style="--h:${p.hue}"><button class="x" data-act="close" aria-label="Close">&times;</button>
 <div><div class="big">${avatar(p,'c')}</div></div>
 <div><h2>${p.name}</h2><p class="fullid">Identity ${ids}</p><p>${p.bio}</p>
 <dl><dt>Personality</dt><dd>${p.traits.join(', ')}</dd><dt>Class</dt><dd>${p.cls.k}: ${p.cls.d}</dd><dt>Signature</dt><dd>${p.sig}</dd>${p.attrs.map(a=>`<dt>${a[0]}</dt><dd>${a[1]}</dd>`).join('')}</dl>
 <div class="acts"><button class="btn" data-go="${prev||''}" ${prev?'':'disabled'}>Previous identity</button><button class="btn" data-go="${next}">Next identity</button><button class="btn" data-copy="${ids}">Copy number</button><button class="btn" data-copy="${url}">Copy link</button></div>
 <input class="share" readonly value="${url}" aria-label="Shareable URL"></div></div>`;
 ch.hidden=false;ch.scrollTop=0;document.documentElement.classList.add('lock');ch.querySelector('.x').focus();
}
function copy(t,b){const done=()=>{const o=b.textContent;b.textContent='Copied';setTimeout(()=>b.textContent=o,1200)};
 const fb=()=>{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}a.remove()};
 navigator.clipboard?navigator.clipboard.writeText(t).then(done,fb):fb()}
ch.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.act==='close')closeChamber();else if(b.dataset.go)openId(b.dataset.go);else if(b.dataset.copy)copy(b.dataset.copy,b)});
feed.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openId(c.dataset.id)});
feed.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const c=e.target.closest('.card');if(c){e.preventDefault();openId(c.dataset.id)}}});
addEventListener('popstate',route);

// ---- search ----
const sr=$('#search'),sin=$('#sinput'),sout=$('#sout');let scanTok=0;
function hit(ids){const p=profile(ids);return `<button class="hit" data-open="${ids}" style="--h:${p.hue}"><div class="pt">${avatar(p,'s')}</div><div><b>${p.name}</b><span>Identity ${ids} (${p.cls.k})</span></div></button>`}
function openSearch(){sr.hidden=false;document.documentElement.classList.add('lock');sin.focus()}
function closeSearch(){sr.hidden=true;scanTok++;unlock()}
$('#searchBtn').addEventListener('click',openSearch);
sr.addEventListener('click',e=>{if(e.target===sr||e.target.dataset.close)closeSearch();const h=e.target.closest('[data-open]');if(h){closeSearch();openId(h.dataset.open)}
 if(e.target.id==='more')scan(BigInt(e.target.dataset.from))});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!sr.hidden)closeSearch();else if(!ch.hidden)closeChamber()}});
$('#sform').addEventListener('submit',e=>{e.preventDefault();const q=sin.value.trim();scanTok++;if(!q){sout.textContent='';return}
 if(/^[#\d\s,_]+$/.test(q)){const ids=normId(q);sout.innerHTML=ids?`<p>Computed directly. Nothing before it was generated.</p>${hit(ids)}`:'Identity numbers start at 1.';return}
 scan(1n)});
const WIN=40000n,CH=2500;
function scan(from){const tok=++scanTok,q=sin.value.trim().toLowerCase(),end=from+WIN;let k=from,found=[];
 const step=()=>{if(tok!==scanTok)return;const stop=k+BigInt(CH)<end?k+BigInt(CH):end;
  for(;k<stop;k++){const ids=k.toString();if(nameFor(ids).toLowerCase().includes(q)&&found.length<30)found.push(ids)}
  const done=k>=end;
  sout.innerHTML=`<p>${done?'Scanned':'Scanning'} identities ${from.toLocaleString()} to ${(k-1n).toLocaleString()}. This is a bounded search: the same name can also belong to identities outside this range, and the universe has no end to search exhaustively.</p>${found.map(hit).join('')||(done?'<p>No matches in this range.</p>':'')}${done?`<button class="btn" id="more" data-from="${end}">Scan the next ${WIN.toLocaleString()}</button>`:''}`;
  if(!done)setTimeout(step,0)};
 step()}

setHeight();pump();route();
})();
