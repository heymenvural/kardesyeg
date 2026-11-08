/* =====================================================================
   HARİTA
===================================================================== */
function egri(a, b){
  const [x1,y1]=MAP.pts[a], [x2,y2]=MAP.pts[b], mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1, d=Math.hypot(dx,dy);
  const k = Math.min(.2, 30/d+.1);
  return `M${x1},${y1} Q${mx - dy*k},${my + dx*k} ${x2},${y2}`;
}
class Harita {
  constructor(kap, o={}){
    this.kap = kap; this.o = Object.assign({kardes:true, proje:false, etiket:false, kontrol:true, lejant:true, sadece:null, vb:null, onSec:null}, o);
    this.vb0 = this.o.vb || [40,90,930,540]; this.vb = [...this.vb0];
    this.kur();
  }
  kur(){
    const o = this.o, gor = id => !o.sadece || o.sadece.includes(id);
    const bagS = tumBaglar().filter(([a,b])=>gor(a)&&gor(b)).map(([a,b])=>{
      const benim = a===D.aktif||b===D.aktif, d=egri(a,b);
      return `<path class="bag kardes ${benim?'benim':''}" pathLength="1" d="${d}" data-a="${a}" data-b="${b}"/>${benim?`<path class="akis kardes" pathLength="1" d="${d}"/>`:''}`;
    }).join('');
    const prjS = projeler().map(p=>projeOrtaklari(p).filter(x=>gor(x)&&gor(p.lider)).map(x=>`<path class="bag proje" pathLength="1" d="${egri(p.lider,x)}"/><path class="akis proje" pathLength="1" d="${egri(p.lider,x)}" style="animation-duration:3.5s"/>`).join('')).join('');
    const mk = Y.filter(y=>gor(y.id)).map((y,i)=>{ const [x,yy]=MAP.pts[y.id];
      return `<g class="mk ${trMi(y)?'tr':''} ${y.id===D.aktif?'ben':''} ${i%3===0?'canli':''}" data-id="${y.id}" transform="translate(${x},${yy})"><g class="olc"><circle class="halka" r="9" style="animation-delay:${(i%7)*.35}s"/><circle class="nokta" r="5.5"/><text class="etiket-h" x="10" y="4">${esc(y.ad)}</text></g></g>`;}).join('');
    const ankara = MAP.cities.Ankara;
    this.kap.innerHTML = `
      <svg class="harita" viewBox="${this.vb.join(' ')}" preserveAspectRatio="xMidYMid slice">
        <path class="grat" d="${MAP.grat}"/>
        <path class="ulkeler-d" d="${MAP.other}"/>
        <path class="ulkeler-ab" d="${MAP.eu}"/>
        <path class="ulke-tr" d="${MAP.tr}"/>
        <g class="k-proje ${o.proje?'':'gizli'}">${prjS}</g>
        <g class="k-kardes ${o.kardes?'':'gizli'}">${bagS}</g>
        <g class="k-efekt"></g>
        ${o.ankara?`<g transform="translate(${ankara[0]},${ankara[1]})"><rect x="-6" y="-6" width="12" height="12" rx="3" fill="#E3B341" stroke="#14263F" stroke-width="2" transform="rotate(45)"/><text x="12" y="4" style="font:800 12px 'Plus Jakarta Sans',sans-serif;fill:#fff;paint-order:stroke;stroke:#0F1E33;stroke-width:3px">YEGFEST · Ankara</text></g>`:''}
        <g class="k-mk">${mk}</g>
      </svg>
      ${o.kontrol?`<div class="harita-kontrol"><button data-z="1" aria-label="Yakınlaştır">${ik('arti',16)}</button><button data-z="-1" aria-label="Uzaklaştır">${ik('eksi',16)}</button><button data-z="0" aria-label="Sıfırla">${ik('hedef',16)}</button></div>`:''}
      ${o.lejant?`<div class="harita-lejant"><span><b style="background:#E3B341"></b>Türkiye YEG</span><span><b style="background:#9CC3EE"></b>Avrupa YEG</span><span><i style="background:#E3B341"></i>Sizin kardeşleriniz</span>${o.proje?'<span><i style="background:#8FCB7A"></i>Proje ortaklığı</span>':'<span><i style="background:#7FB0E6"></i>Kardeş bağı</span>'}</div>`:''}
      <div class="harita-ipucu"></div>`;
    this.svg = $('svg.harita', this.kap); this.ipucu = $('.harita-ipucu', this.kap);
    this.olcekle();
    setTimeout(()=>$$('.bag',this.svg).forEach((p,i)=>setTimeout(()=>p.classList.add('ciz'), 40*i)), 250);
    this.olaylar();
  }
  olcekle(){ const s = this.vb[2]/this.vb0[2]; $$('.mk .olc',this.svg).forEach(g=>g.setAttribute('transform',`scale(${Math.max(.45,s)})`)); }
  setVB(v, anim=true){
    const [x0,y0,w0,h0] = this.vb, t0 = performance.now(), sure = anim?600:0;
    const W = MAP.w, H = MAP.h;
    v[2] = Math.min(Math.max(v[2], 160), this.vb0[2]*1.05); v[3] = v[2]*this.vb0[3]/this.vb0[2];
    v[0] = Math.min(Math.max(v[0], -60), W - v[2] + 60); v[1] = Math.min(Math.max(v[1], -40), H - v[3]);
    const k = t => { const p = sure? Math.min(1,(t-t0)/sure):1, e = 1-Math.pow(1-p,3);
      this.vb = [x0+(v[0]-x0)*e, y0+(v[1]-y0)*e, w0+(v[2]-w0)*e, h0+(v[3]-h0)*e];
      this.svg.setAttribute('viewBox', this.vb.join(' ')); this.olcekle(); if(p<1) requestAnimationFrame(k); };
    requestAnimationFrame(k);
  }
  zum(f, cx, cy){
    const [x,y,w,h] = this.vb; cx ??= x+w/2; cy ??= y+h/2;
    const nw = w/f, nh = h/f; this.setVB([cx-(cx-x)/f, cy-(cy-y)/f, nw, nh]);
  }
  odak(id, w=420){ const [x,y]=MAP.pts[id], h=w*this.vb0[3]/this.vb0[2]; this.setVB([x-w/2, y-h/2, w, h]); }
  nokta(e){ const p = this.svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(this.svg.getScreenCTM().inverse()); }
  olaylar(){
    const svg = this.svg; let sur=null, hareket=0;
    svg.addEventListener('wheel', e => { e.preventDefault(); const p=this.nokta(e); const [x,y,w,h]=this.vb, f = e.deltaY<0?1.25:.8;
      this.setVB([p.x-(p.x-x)/f, p.y-(p.y-y)/f, w/f, h/f], false); }, {passive:false});
    svg.addEventListener('pointerdown', e => { sur = {x:e.clientX, y:e.clientY, vb:[...this.vb]}; hareket=0; });
    svg.addEventListener('pointermove', e => {
      if (sur && (e.buttons&1)) { const dx=e.clientX-sur.x, dy=e.clientY-sur.y; hareket=Math.abs(dx)+Math.abs(dy);
        if (hareket>4) { svg.classList.add('suruk'); try{svg.setPointerCapture(e.pointerId);}catch(_){} const r=svg.getBoundingClientRect(), s=Math.max(this.vb[2]/r.width, this.vb[3]/r.height);
          this.setVB([sur.vb[0]-dx*s, sur.vb[1]-dy*s, sur.vb[2], sur.vb[3]], false); } return; }
      const m = e.target.closest('.mk');
      if (m) this.goster(m.dataset.id, m); else this.ipucu.classList.remove('on');
    });
    svg.addEventListener('pointerup', e => { svg.classList.remove('suruk'); const m = e.target.closest('.mk');
      if (m && hareket<5) { this.sec(m.dataset.id); this.o.onSec ? this.o.onSec(m.dataset.id) : git('yeg/'+m.dataset.id); } sur=null; });
    svg.addEventListener('pointerleave', ()=>this.ipucu.classList.remove('on'));
    $$('.harita-kontrol button',this.kap).forEach(b=>b.onclick=()=>{ const z=+b.dataset.z; z? this.zum(z>0?1.6:.625) : this.setVB([...this.vb0]); });
  }
  goster(id, m){
    const y=yeg(id), r=this.kap.getBoundingClientRect(), mr=m.getBoundingClientRect(), kardes=kardesleri(id).length, pr=yegProjeleri(id).length;
    this.ipucu.innerHTML = `<b>${esc(y.ad)}</b><span class="soluk">${esc(y.yer)}</span><div style="margin-top:6px">${y.urun.map(u=>(URUN_EMOJI[u]||'')+' '+esc(u)).join(' · ')}</div><div class="soluk" style="margin-top:4px;font-size:11.5px">${kardes} kardeş YEG · ${pr} proje</div>`;
    this.ipucu.style.left = (mr.left+mr.width/2-r.left)+'px'; this.ipucu.style.top = (mr.top-r.top)+'px'; this.ipucu.classList.add('on');
  }
  sec(id){ $$('.mk',this.svg).forEach(m=>m.classList.toggle('sec', m.dataset.id===id)); }
  katman(ad, acik){ $('.k-'+ad,this.svg)?.classList.toggle('gizli', !acik); if(acik) $$('.k-'+ad+' .bag',this.svg).forEach(p=>{p.classList.remove('ciz'); requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.add('ciz')));}); }
  filtre(f){ $$('.mk',this.svg).forEach(m=>m.classList.toggle('soluk', !f(yeg(m.dataset.id)))); }
  ping(id){ const [x,y]=MAP.pts[id]; const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('class','ping'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',36); $('.k-efekt',this.svg).appendChild(c); setTimeout(()=>c.remove(),1500);
    const m=$(`.mk[data-id="${id}"]`,this.svg); if(m){ m.classList.add('parla'); setTimeout(()=>m.classList.remove('parla'),2200);} }
  radar(id, ac=true){ const g=$('.k-efekt',this.svg); g.innerHTML=''; if(!ac) return; const [x,y]=MAP.pts[id];
    for(let i=0;i<3;i++){ const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('class','radar'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',520); c.style.animationDelay=(i*.66)+'s'; g.appendChild(c);} }
  bagCiz(a,b){ const g=$('.k-kardes',this.svg), d=egri(a,b);
    g.insertAdjacentHTML('beforeend',`<path class="bag kardes benim" pathLength="1" d="${d}"/><path class="akis kardes" pathLength="1" d="${d}"/>`);
    const p=g.querySelectorAll('.bag'); const son=p[p.length-1]; requestAnimationFrame(()=>requestAnimationFrame(()=>son.classList.add('ciz'))); }
}

