/* =====================================================================
   GEZİNME, ARAMA, BAŞLANGIÇ
===================================================================== */
const NAV = [['genel','Genel bakış','ev'],['harita','Ağ haritası','harita'],['yegler','YEG\'ler','ekip'],['_','İş birliği'],['eslesme','Kardeş eşleştirme','bag'],['projeler','Ortak projeler','klasor'],['festival','Festival daveti','festival'],['mesajlar','Mesajlar','mesaj'],['fon','Fon rehberi','para']];
function navCiz(){
  const h=(location.hash.slice(1)||'genel').split('/')[0], esle={yeg:'yegler',proje:'projeler','proje-olustur':'projeler'}[h]||h;
  const msj = Object.values(D.okunmadi).reduce((a,b)=>a+b,0), gel = gelenler().length;
  $('#nav').innerHTML = NAV.map(([k,l,i])=>k==='_'?`<div class="baslik">${l}</div>`:`<a href="#${k}" class="${esle===k?'on':''}">${ik(i,18)}${l}${k==='mesajlar'&&msj?`<span class="rozet">${msj}</span>`:''}${k==='eslesme'&&gel?`<span class="rozet">${gel}</span>`:''}</a>`).join('');
  const b=ben(); $('#benAv').innerHTML=av(b); $('#benAd').textContent=b.ad;
}
function git(h){ if(location.hash==='#'+h) yenile(); else location.hash=h; }
let sonRota = null;
function yenile(yumusak){
  const [r, p] = (location.hash.slice(1)||'genel').split('/');
  const sayfa = SAYFALAR[r] ? r : 'genel', v = $('#view');
  const yeniRota = sonRota !== location.hash; sonRota = location.hash;
  aktifHarita = null; aktifKure = null; aktifSalon = null;
  const ciz = () => { window.YUMUSAK = !!yumusak; v.classList.toggle('yumusak', !!yumusak); v.innerHTML = SAYFALAR[sayfa](p); SAYFALAR[sayfa].sonra?.(p); canlandir(v); navCiz(); };
  if (yeniRota && !yumusak) {
    if (r!=='yeg') profilSekme='genel';
    scrollTo({top:0});
    v.classList.remove('yumusak');
    v.innerHTML = `<div class="iskelet" style="height:38px;width:42%;margin-bottom:12px"></div><div class="iskelet" style="height:16px;width:60%;margin-bottom:26px"></div><div class="grid g3">${'<div class="iskelet" style="height:180px"></div>'.repeat(6)}</div>`;
    setTimeout(ciz, 230);
  } else { const y=scrollY; ciz(); scrollTo({top:y}); }
  $('#side').classList.remove('acik'); $('#perde').classList.remove('acik');
}
window.addEventListener('hashchange', ()=>yenile());

/* Komut paleti */
function paletAc(){ $('#palet').classList.add('on'); $('#paletGir').value=''; paletCiz(''); setTimeout(()=>$('#paletGir').focus(),30); }
function paletKapat(){ $('#palet').classList.remove('on'); }
let paletSec=0;
function paletCiz(q){
  q=q.toLocaleLowerCase('tr'); const s=x=>!q||x.toLocaleLowerCase('tr').includes(q);
  const sy = NAV.filter(n=>n[0]!=='_'&&s(n[1])).map(n=>({g:'Sayfalar',h:n[0],ad:n[1],ik:ik(n[2],18)}));
  const yy = Y.filter(y=>s([y.ad,y.yer,...y.urun].join(' '))).slice(0,6).map(y=>({g:'YEG\'ler',h:'yeg/'+y.id,ad:y.ad,alt:y.yer,ik:avS(y)}));
  const pp = projeler().filter(p=>s([p.ad,...p.etiket].join(' '))).slice(0,5).map(p=>({g:'Projeler',h:'proje/'+p.id,ad:p.ad,alt:p.program,ik:ik('klasor',18)}));
  const l=[...sy,...yy,...pp]; paletSec=Math.min(paletSec,Math.max(0,l.length-1));
  let g=''; $('#paletSonuc').innerHTML = l.length? l.map((x,i)=>`${x.g!==g?(g=x.g,`<div class="grp">${x.g}</div>`):''}<div class="ps ${i===paletSec?'on':''}" data-h="${x.h}">${x.ik}<div><b style="font-size:13.5px">${esc(x.ad)}</b>${x.alt?`<div class="soluk k12">${esc(x.alt)}</div>`:''}</div></div>`).join('') : '<div class="bos">Sonuç yok</div>';
  $$('#paletSonuc .ps').forEach(e=>e.onclick=()=>{ paletKapat(); git(e.dataset.h); });
}
$('#aramaAc').onclick = paletAc;
$('#palet').onclick = e => { if(e.target.id==='palet') paletKapat(); };
$('#paletGir').oninput = e => { paletSec=0; paletCiz(e.target.value); };
$('#paletGir').onkeydown = e => { const l=$$('#paletSonuc .ps'); if(e.key==='ArrowDown'){paletSec=Math.min(l.length-1,paletSec+1);} else if(e.key==='ArrowUp'){paletSec=Math.max(0,paletSec-1);} else if(e.key==='Enter'){ l[paletSec]?.click(); return; } else return; e.preventDefault(); l.forEach((x,i)=>x.classList.toggle('on',i===paletSec)); l[paletSec]?.scrollIntoView({block:'nearest'}); };
document.addEventListener('keydown', e => { if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); paletAc(); } if(e.key==='Escape'){ paletKapat(); $('#zilPanel').classList.remove('on'); $$('.modal-perde').forEach(m=>m.click()); } });

/* Üst çubuk */
$('#aramaIk').innerHTML = ik('ara',18);
$('#menuBtn').innerHTML = ik('menu',20);
$('#yeniProjeBtn').innerHTML = ik('arti',16)+'<span class="yp-yazi">Yeni proje</span>';
$('#menuBtn').onclick = () => { $('#side').classList.add('acik'); $('#perde').classList.add('acik'); };
$('#perde').onclick = () => { $('#side').classList.remove('acik'); $('#perde').classList.remove('acik'); };
$('#zilBtn').onclick = e => { e.stopPropagation(); $('#zilPanel').classList.toggle('on'); };
document.addEventListener('click', e => { if(!e.target.closest('#zilPanel')&&!e.target.closest('#zilBtn')) $('#zilPanel').classList.remove('on'); });
$('#benSec').innerHTML = `<optgroup label="Türkiye">${Y.filter(trMi).map(y=>`<option value="${y.id}">${esc(y.ad)}</option>`).join('')}</optgroup><optgroup label="Avrupa">${Y.filter(y=>!trMi(y)).map(y=>`<option value="${y.id}">${esc(y.ad)}</option>`).join('')}</optgroup>`;
$('#benSec').value = D.aktif;
$('#benSec').onchange = e => { D.aktif=e.target.value; eslesme=null; sihir=null; acikSohbet=null; kaydet(); toast(`Artık <b>${esc(ben().ad)}</b> olarak geziyorsunuz`,'ekip'); yenile(); };
$('#sifirla').onclick = e => { e.preventDefault(); if(!confirm('Tüm değişiklikler silinip başlangıç verilerine dönülsün mü?')) return; try{localStorage.removeItem(ANAHTAR);}catch(_){} D=ilkDurum(); eslesme=null; sihir=null; acikSohbet=null; $('#benSec').value=D.aktif; zilCiz(); yenile(); toast('Başlangıç verilerine dönüldü','geri'); };
const mqDar = matchMedia('(max-width:640px)'); const ypf=()=>{ const s=$('.yp-yazi'); if(s) s.style.display=mqDar.matches?'none':''; }; mqDar.addEventListener('change',ypf); ypf();

/* Canlı akış döngüsü */
setInterval(()=>{
  const o = olayUret(); AKIS.unshift(o); if(AKIS.length>40) AKIS.pop();
  const l = $('#akisListe'); if(l){ l.insertAdjacentHTML('afterbegin', olayHTML(o,true)); if(l.children.length>16) l.lastElementChild.remove(); }
  if (aktifHarita && document.body.contains(aktifHarita.svg)) aktifHarita.ping(o.aktor);
  if (aktifKure?.kok.isConnected) aktifKure.ping(o.aktor, o.tip==='kardes'?0xF2C14E:0xffffff);
  $$('small[data-z]').forEach(s=>s.textContent=sureMetin(+s.dataset.z));
}, 6500);
setTimeout(()=>bildirimEkle('<b>GAL Colline del Nocciolo</b> sizi “Genç Çiftçi Değişimi 2027” projesine davet etti','proje/genc2027','klasor'), 26000);

/* Başlat */
zilCiz(); navCiz(); yenile();
setTimeout(()=>$('#splash').classList.add('bitti'), 1700);