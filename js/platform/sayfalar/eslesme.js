/* ---------- Eşleştirme ---------- */
let eslesme = null;
function gelenler(){
  if (!D.gelen[D.aktif]) { const b=ben(); D.gelen[D.aktif] = D.aktif==='menderes' ? ['salento','lesvos'] : Y.filter(y=>y.id!==b.id && !kardesMi(y.id) && !trMi(y)).map(y=>({id:y.id,p:puan(b,y).p})).sort((a,c)=>c.p-a.p).slice(2,4).map(x=>x.id); kaydet(); }
  return D.gelen[D.aktif].filter(id=>!kardesMi(id));
}
SAYFALAR.eslesme = () => {
  const b = ben(); if(!eslesme || eslesme.yeg!==b.id) eslesme = {yeg:b.id, urun:[...b.urun], onc:[...b.onc], kapsam:'hepsi', sonuc:null};
  const g = gelenler();
  return `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('bag',14)} Kardeş YEG eşleştirmesi</div><h1>Size en uygun <em>kardeş YEG'i</em> bulun</h1><p class="aciklama">Ürün, öncelik ve dil uyumuna göre ağdaki tüm YEG'ler taranır. Teklif gönderin; kabul edildiğinde haritada bağınız oluşur.</p></div></div>
    ${g.length?`<div class="kart pad rise" style="margin-bottom:16px;border-color:#EBD9A0;background:linear-gradient(180deg,#FFFBEF,#fff)"><div class="satir" style="margin-bottom:12px">${ik('zarf',18)}<h2>Gelen kardeşlik teklifleri <span class="cip u" style="margin-left:6px">${g.length}</span></h2></div>
      ${g.map(id=>{const y=yeg(id);return `<div class="satir sar" style="padding:10px 0;border-top:1px solid var(--krem2)" id="gel-${id}">${av(y)}<div style="flex:1;min-width:200px"><b>${esc(y.ad)}</b><div class="soluk k12">“${esc(y.ara)}”</div></div>${halka(puan(b,y).p,44,5)}<button class="btn cizgi k" onclick="gelenRed('${id}')">Reddet</button><button class="btn altin k" onclick="kardesKabul('${id}')">${ik('tik',14)} Kabul et</button></div>`;}).join('')}</div>`:''}
    <div class="grid" style="grid-template-columns:minmax(0,340px) minmax(0,1fr);align-items:start" id="eIzgara">
      <div class="kart pad rise" style="position:sticky;top:86px">
        <h2 style="margin-bottom:14px">Kriterler</h2>
        <label class="alan" style="margin-bottom:14px">Ürünler ${sec('eu',TUM_URUN,eslesme.urun)}</label>
        <label class="alan" style="margin-bottom:14px">Öncelikler ${sec('eo',TUM_ONC,eslesme.onc)}</label>
        <label class="alan" style="margin-bottom:16px">Kapsam<select class="f" id="eK"><option value="hepsi">Türkiye ve Avrupa</option><option value="ab">Yalnızca Avrupa</option><option value="tr">Yalnızca Türkiye</option></select></label>
        <button class="btn ana" style="width:100%" id="eBasla">${ik('parilti',16)} Eşleştir</button>
      </div>
      <div class="grid" style="align-content:start">
        <div class="kart rise" style="--i:1;overflow:hidden"><div class="kure-kap" id="eKure" style="border-radius:0;height:380px"><div class="kure-ust"><div class="k12" style="color:#C9D4E3" id="eKureNot">${ik('hedef',14)} Konumunuz merkezde · eşleştirme küre üzerinde taranır</div></div></div>
          <div class="pad" id="eTarama" style="padding:14px 18px"><div class="soluk k12">Kriterleri seçip <b>Eşleştir</b>'e basın.</div></div></div>
        <div class="grid" id="eSonuc"></div>
      </div>
    </div>
  </div>`;
};
function gelenRed(id){ D.gelen[D.aktif]=D.gelen[D.aktif].filter(x=>x!==id); kaydet(); const el=$('#gel-'+id); if(el){ el.style.transition='all .3s'; el.style.opacity=0; el.style.transform='translateX(20px)'; setTimeout(()=>yenile(true),300);} toast('Teklif reddedildi','x'); }
SAYFALAR.eslesme.sonra = () => {
  const i=$('#eIzgara'); if(matchMedia('(max-width:900px)').matches){ i.style.gridTemplateColumns='1fr'; i.firstElementChild.style.position='static'; }
  $('#eK').value = eslesme.kapsam;
  kureKur($('#eKure'), { otoDon:false }).then(k => { if(!k) return; if(!YUMUSAK) k.odak(D.aktif, 3.0); if (eslesme.sonuc) adayYaylari(false); });
  $$('input[name=eu]').forEach(x=>x.onchange=()=>eslesme.urun=$$('input[name=eu]:checked').map(i=>i.value));
  $$('input[name=eo]').forEach(x=>x.onchange=()=>eslesme.onc=$$('input[name=eo]:checked').map(i=>i.value));
  $('#eK').onchange = e => eslesme.kapsam = e.target.value;
  $('#eBasla').onclick = esles;
  if (eslesme.sonuc) sonucCiz(false);
};
function esles(){
  const b = ben(), bt = $('#eBasla'); bt.disabled = true;
  if (aktifKure) { aktifKure.yaylariKur(kureBaglari(), false); aktifKure.vurgula(null); aktifKure.odak(b.id, 3.6); aktifKure.radar(b.id); }
  const adimlar = [`${Y.length-1} YEG taranıyor`,'Ürün uyumu hesaplanıyor','Öncelikler ve dil karşılaştırılıyor','Sonuçlar sıralanıyor'];
  $('#eTarama').innerHTML = `<div class="tarama">${adimlar.map((a,i)=>`<div class="a" id="ta${i}"><span class="don" style="visibility:hidden"></span>${a}</div>`).join('')}</div>`;
  $('#eSonuc').innerHTML = Array.from({length:3},()=>`<div class="iskelet" style="height:96px"></div>`).join('');
  const sirali = Y.filter(y=>y.id!==b.id && (eslesme.kapsam==='hepsi' || (eslesme.kapsam==='tr')===trMi(y)));
  sirali.forEach((y,i)=>setTimeout(()=>{ aktifKure?.kok.isConnected && aktifKure.ping(y.id, 0xF2C14E); }, 150+i*70));
  adimlar.forEach((_,i)=>{
    setTimeout(()=>{ const el=$('#ta'+i); if(!el) return; el.classList.add('on'); $('.don',el).style.visibility='visible'; }, i*520);
    setTimeout(()=>{ const el=$('#ta'+i); if(!el) return; el.classList.add('tamam'); $('.don',el).outerHTML=ik('tik',16); }, i*520+480);
  });
  setTimeout(()=>{ if(!$('#eSonuc')) return; aktifKure?.radarDur(); bt.disabled=false;
    eslesme.sonuc = sirali.map(y=>({id:y.id,...puan(b,y,eslesme.urun,eslesme.onc)})).sort((a,c)=>c.p-a.p).slice(0,8);
    sonucCiz(true); }, adimlar.length*520+300);
}
function sonucCiz(anim){
  const b=ben(); const l = eslesme.sonuc;
  $('#eTarama').innerHTML = `<div class="satir arasi k12"><span><b>${l.length}</b> uygun YEG bulundu · en yüksek uyum <b>%${l[0]?.p||0}</b></span><span class="soluk">Kesikli yaylar: en iyi 3 aday</span></div>`;
  adayYaylari(anim);
  $('#eSonuc').innerHTML = l.map((s,i)=>{ const y=yeg(s.id), tek=D.teklif[anahtarBag(b.id,s.id)], kar=kardesMi(s.id);
    return `<div class="kart esles-kart ${i===0?'en-iyi':''} ${anim?'rise':''}" style="--i:${i}">
      ${halka(s.p,64,6)}
      <div style="flex:1;min-width:220px">${i===0?`<span class="cip u" style="margin-bottom:6px">${ik('yildiz',12)} En iyi eşleşme</span>`:''}
        <div class="satir" style="gap:8px">${avS(y)}<b style="cursor:pointer" onclick="git('yeg/${y.id}')">${esc(y.ad)}</b></div>
        <div class="soluk k12" style="margin-top:2px">${esc(y.yer)}</div>
        <div class="neden">${s.neden.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>
      <div class="satir">${kar?`<span class="btn yesil k">${ik('tik',14)} Kardeş</span>`:tek?`<button class="btn cizgi k" disabled>${ik('saat',14)} Bekliyor</button>`:`<button class="btn altin k" onclick="teklifModal('${y.id}')">${ik('bag',14)} Teklif gönder</button>`}<button class="btn cizgi k" onclick="git('yeg/${y.id}')">Profil</button></div>
    </div>`;}).join('');
  canlandir($('#eSonuc'));
}


function adayYaylari(anim){
  const k = aktifKure; if (!k || !k.kok.isConnected || !eslesme.sonuc) return;
  const b = D.aktif, ust = eslesme.sonuc.slice(0,3).map(x=>x.id);
  k.yaylariKur([...kureBaglari(), ...ust.filter(id=>!kardesMi(id)).map(id=>[b,id,'aday'])], anim);
  k.yaylar.forEach(y => { if (y.tip==='aday') y.mat.uniforms.uKesik.value = 1; });
  k.vurgula(eslesme.sonuc.map(x=>x.id)); k.etiketle(ust);
  const n = $('#eKureNot'); if (n) n.innerHTML = `${ik('parilti',14)} En iyi aday: <b style="color:#fff">${esc(yeg(ust[0]).ad)}</b> · %${eslesme.sonuc[0].p} uyum`;
  if (anim) { const y0 = yeg(ust[0]), me = ben(); k.ucus((y0.lat+me.lat)/2 - 3, (y0.lon+me.lon)/2, 3.2); }
}
