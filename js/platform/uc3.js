/* =====================================================================
   3D KÖPRÜSÜ — küre ve salon tek örnek olarak sayfalar arasında taşınır
===================================================================== */
let KURE = null, SALON = null, aktifKure = null, aktifSalon = null;

function uc3(fn){ if (window.YEG3D) fn(window.YEG3D); else window.addEventListener('yeg3d', () => fn(window.YEG3D), {once:true}); }

function kureBaglari(){
  const k = tumBaglar().map(([a,b]) => [a,b,'kardes']);
  const p = [];
  projeler().forEach(pr => projeOrtaklari(pr).forEach(x => p.push([pr.lider, x, 'proje'])));
  return [...k, ...p];
}
function kureIpucu(y){
  return `<b>${esc(y.ad)}</b><span>${esc(y.yer)}</span><div class="ur">${y.urun.map(u=>(URUN_EMOJI[u]||'')+' '+esc(u)).join(' · ')}</div><small>${kardesleri(y.id).length} kardeş YEG · ${yegProjeleri(y.id).length} proje · tıklayın</small>`;
}
function webglYok(kap){ kap.innerHTML = `<div class="webgl-yok">${ik('dunya',28)}<b>3D gösterim bu cihazda açılamadı</b><span>Ağ haritasının 2D görünümünü kullanabilirsiniz.</span><a class="btn cizgi k" href="#harita">2D haritayı aç</a></div>`; }

function kureKur(kap, ayar = {}){
  return new Promise(res => uc3(Y3 => {
    if (!kap || !kap.isConnected) return res(null);
    if (!Y3.destek) { webglYok(kap); return res(null); }
    const o = Object.assign({ ben: D.aktif, baglar: kureBaglari(), onSec: id => git('yeg/'+id), ipucuHTML: kureIpucu, otoDon: true, etiketler: true, interaktif: true }, ayar);
    try {
      if (!KURE) KURE = new Y3.Kure(kap, { yegler: Y, ankara: ANKARA, ...o });
      else KURE.tasi(kap, o);
    } catch (e) { console.warn(e); webglYok(kap); return res(null); }
    aktifKure = KURE; res(KURE);
  }));
}

const salonYeg = y => y ? ({ id:y.id, ad:y.ad, kisa:y.kisa, kod:y.kod, ulke:y.ulke, renkHex:`hsl(${y.h}, 46%, 40%)` }) : null;
function salonStantlari(){ const f = festDurum(); return Object.entries(f.stant).map(([id,i]) => ({ i, yeg: salonYeg(yeg(id)) })); }

function salonKur(kap, ayar = {}){
  return new Promise(res => uc3(Y3 => {
    if (!kap || !kap.isConnected) return res(null);
    if (!Y3.destek) { kap.innerHTML = salonSVG(); return res(null); }
    try {
      if (!SALON) SALON = new Y3.Salon(kap, { stantlar: salonStantlari(), ...ayar });
      else { SALON.tasi(kap); Object.assign(SALON.o, ayar); SALON.stantlariGuncelle(salonStantlari(), false); }
    } catch (e) { console.warn(e); kap.innerHTML = salonSVG(); return res(null); }
    aktifSalon = SALON; res(SALON);
  }));
}

/* Kart eğme efekti (3D tilt + parıltı) */
(function(){
  const SEC = '.yk,.pk,.kpi,.esles-kart,.fon';
  let aktif = null;
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const k = e.target.closest?.(SEC);
    if (aktif && aktif !== k) { aktif.style.transform = ''; aktif.style.removeProperty('--gx'); aktif = null; }
    if (!k) return;
    aktif = k; const r = k.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    k.style.transform = `perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-4px)`;
    k.style.setProperty('--gx', ((x+.5)*100).toFixed(1)+'%'); k.style.setProperty('--gy', ((y+.5)*100).toFixed(1)+'%');
  }, {passive:true});
})();
