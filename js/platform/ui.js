/* =====================================================================
   YARDIMCILAR
===================================================================== */
const $ = (s, k=document) => k.querySelector(s);
const $$ = (s, k=document) => [...k.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para = n => '€' + new Intl.NumberFormat('tr-TR').format(Math.round(n));
const trMi = y => y.kod === 'TR';
const renk = y => trMi(y) ? `hsl(${y.h} 42% 32%)` : `hsl(${y.h} 46% 40%)`;
const av = (y, cls='') => `<div class="av ${cls}" style="background:${renk(y)}" title="${esc(y.ad)}">${y.kisa}<span class="ulke">${y.kod}</span></div>`;
const avS = y => `<div class="av s" style="background:${renk(y)}" title="${esc(y.ad)}">${y.kisa}</div>`;
const bas = ad => ad.split(' ').map(s=>s[0]).slice(0,2).join('');
const DURUM_AD = {ortak:'Ortak aranıyor',hazirlik:'Başvuru hazırlığında',yurutuluyor:'Yürütülüyor',taslak:'Taslak'};
const sec = (ad, dizi, secili=[], tip='checkbox') => `<div class="secimler">${dizi.map(d=>`<label><input type="${tip}" name="${ad}" value="${esc(d)}" ${secili.includes(d)?'checked':''}><span>${esc(d)}</span></label>`).join('')}</div>`;
const TUM_URUN = [...new Set(Y.flatMap(y=>y.urun))].sort((a,b)=>a.localeCompare(b,'tr'));
const TUM_ONC = [...new Set(Y.flatMap(y=>y.onc))].sort((a,b)=>a.localeCompare(b,'tr'));
const ULKELER = [...new Set(Y.map(y=>y.ulke))];

function toast(html, ikon='tik'){
  const t = document.createElement('div'); t.className='toast'; t.innerHTML = ik(ikon,16) + `<span>${html}</span>`;
  $('#toastKap').appendChild(t);
  setTimeout(()=>{ t.classList.add('git'); setTimeout(()=>t.remove(),320); }, 3400);
}
function sayac(el){
  const hedef = +el.dataset.say, sure = 1300, t0 = performance.now(), ondalik = el.dataset.ondalik;
  const f = t => { const p = Math.min(1,(t-t0)/sure), e = 1-Math.pow(1-p,3);
    el.textContent = new Intl.NumberFormat('tr-TR').format(Math.round(hedef*e)); if(p<1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function halka(p, boy=64, kal=6){
  const r=(boy-kal)/2, c=2*Math.PI*r, renk = p>=75?'#5E8C4A':p>=55?'#C9A227':'#2E78C7';
  return `<div class="halka-s" style="width:${boy}px;height:${boy}px"><svg width="${boy}" height="${boy}"><circle cx="${boy/2}" cy="${boy/2}" r="${r}" stroke="#ECE7D8" stroke-width="${kal}" fill="none"/><circle class="yay" cx="${boy/2}" cy="${boy/2}" r="${r}" stroke="${renk}" stroke-width="${kal}" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-hedef="${c*(1-p/100)}"/></svg><span style="font-size:${boy>56?16:13}px">%${p}</span></div>`;
}
function canlandir(kok=document){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    $$('.yay[data-hedef]',kok).forEach(c=>c.style.strokeDashoffset=c.dataset.hedef);
    $$('[data-say]',kok).forEach(sayac);
    $$('.ilerleme i[data-w]',kok).forEach(i=>i.style.width=i.dataset.w+'%');
    $$('.cubuk',kok).forEach((c,i)=>setTimeout(()=>c.classList.add('on'),i*120));
    $$('.bar i[data-w]',kok).forEach(i=>i.style.width=i.dataset.w+'%');
  }));
}
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn'); if(!b) return;
  const r = b.getBoundingClientRect(), s = document.createElement('span'), d = Math.max(r.width,r.height);
  s.className='dalga'; s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
  b.appendChild(s); setTimeout(()=>s.remove(),600);
});

/* Konfeti */
function konfeti(){
  const cv = $('#konfeti'), cx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
  const renkler = ['#E3B341','#C9A227','#2E78C7','#5E8C4A','#1F3A5F','#9CC3EE'];
  const P = Array.from({length:150},()=>({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.45,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*6+3,c:renkler[Math.random()*6|0],a:Math.random()*6,va:(Math.random()-.5)*.3}));
  let t=0; (function k(){ cx.clearRect(0,0,cv.width,cv.height); t++;
    P.forEach(p=>{ p.vy+=.35; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.a+=p.va; cx.save(); cx.translate(p.x,p.y); cx.rotate(p.a); cx.fillStyle=p.c; cx.globalAlpha=Math.max(0,1-t/130); cx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); cx.restore(); });
    if(t<130) requestAnimationFrame(k); else cx.clearRect(0,0,cv.width,cv.height); })();
}

/* Modal */
function modal({baslik, govde, eylem='', genis}){
  const p = document.createElement('div'); p.className='modal-perde';
  p.innerHTML = `<div class="modal" style="${genis?'width:min(720px,100%)':''}"><div class="mb"><h2>${baslik}</h2><button class="kapat" data-kapat>${ik('x',20)}</button></div><div class="mg">${govde}</div>${eylem?`<div class="ma">${eylem}</div>`:''}</div>`;
  document.body.appendChild(p); requestAnimationFrame(()=>p.classList.add('on'));
  const kapat = () => { p.classList.remove('on'); setTimeout(()=>p.remove(),250); };
  p.addEventListener('click', e => { if (e.target===p || e.target.closest('[data-kapat]')) kapat(); });
  return {el:p, kapat};
}

/* =====================================================================
   EŞLEŞTİRME PUANI
===================================================================== */
function puan(a, b, urun=a.urun, onc=a.onc){
  const ou = b.urun.filter(u=>urun.includes(u)), oo = b.onc.filter(o=>onc.includes(o));
  const pu = urun.length ? Math.min(1, ou.length/Math.min(urun.length,b.urun.length)) : 0;
  const po = onc.length ? Math.min(1, oo.length/Math.min(onc.length,b.onc.length)) : 0;
  const sinir = a.kod!==b.kod, ortakDil = b.dil.filter(d=>a.dil.includes(d));
  let p = Math.round(100*(0.48*pu + 0.3*po + 0.14*(sinir?1:0) + 0.08*(ortakDil.length?1:0)));
  p = Math.max(18, Math.min(98, p));
  const neden = [];
  if (ou.length) neden.push('Ortak ürün: '+ou.join(', '));
  if (oo.length) neden.push('Ortak öncelik: '+oo.join(', '));
  if (sinir) neden.push('Sınır ötesi işbirliği');
  if (ortakDil.length) neden.push('Ortak dil: '+ortakDil.join(', '));
  return {p, ou, oo, neden};
}

