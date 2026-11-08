/* =====================================================================
   CANLI AKIŞ
===================================================================== */
const AKIS = [];
const OLAY_TIP = {
  kardes:{ik:'bag',bg:'#FBF3D9',c:'#8A6D10'}, proje:{ik:'klasor',bg:'#E8F0E3',c:'#3F6630'}, urun:{ik:'parilti',bg:'#F5EAF8',c:'#7A3D8C'},
  fest:{ik:'festival',bg:'#E6EFFA',c:'#245E9C'}, mesaj:{ik:'mesaj',bg:'#EEF0F3',c:'#3E4C5E'}, cagri:{ik:'zil',bg:'#FDECE7',c:'#A1432F'}
};
const rastgele = a => a[Math.random()*a.length|0];
function olayUret(){
  const a = rastgele(Y.filter(y=>y.id!==D.aktif)), p = rastgele(PR);
  const s = rastgele(['kardes','proje','urun','fest','cagri','proje']);
  let b; do { b = rastgele(Y); } while (b.id===a.id);
  const metin = {
    kardes:`<b data-y="${a.id}">${esc(a.ad)}</b> ile <b data-y="${b.id}">${esc(b.ad)}</b> kardeş YEG oldu`,
    proje:`<b data-y="${a.id}">${esc(a.ad)}</b> <b data-p="${p.id}">“${esc(p.ad)}”</b> projesine ortaklık başvurusu yaptı`,
    urun:`<b data-y="${a.id}">${esc(a.ad)}</b> yeni ürün ekledi: ${URUN_EMOJI[a.urun[0]]||''} ${esc(a.urun[a.urun.length-1])}`,
    fest:`<b data-y="${a.id}">${esc(a.ad)}</b> YEGFEST davetini kabul etti`,
    cagri:`<b data-y="${a.id}">${esc(a.ad)}</b> iş birliği çağrısı paylaştı: “${esc(a.ara)}”`
  }[s];
  return {tip:s, metin, z:Date.now(), aktor:a.id};
}
const ILK_AKIS = () => {
  const l = [
    {tip:'proje',metin:`<b data-y="evia">LAG Evia Fig Coast</b> <b data-p="fignet">“FIG-NET”</b> projesine yorum yazdı`,dk:4},
    {tip:'kardes',metin:`<b data-y="trakya">Trakya Ovası YEG</b> ile <b data-y="rosevalley">LAG Rose Valley</b> kardeş YEG oldu`,dk:22},
    {tip:'fest',metin:`<b data-y="lavande">GAL Pays de Lavande</b> YEGFEST davetini kabul etti`,dk:41},
    {tip:'proje',metin:`<b data-y="langhe">GAL Colline del Nocciolo</b> yeni proje açtı: <b data-p="genc2027">“Genç Çiftçi Değişimi 2027”</b>`,dk:75},
    {tip:'urun',metin:`<b data-y="firat">Fırat Havzası YEG</b> yeni ürün ekledi: 🍑 gün kurusu kayısı`,dk:130},
    {tip:'cagri',metin:`<b data-y="castanheiro">GAL Terras do Castanheiro</b> genç gönüllü ağırlayacak ortak arıyor`,dk:190},
    {tip:'kardes',metin:`<b data-y="firat">Fırat Havzası YEG</b> ile <b data-y="campina">GDR Campiña del Olivo</b> kardeş YEG oldu`,dk:260},
    {tip:'proje',metin:`<b data-y="miodu">LGD Dolina Miodu</b> <b data-p="arikoy">“Arı Dostu Köyler”</b> başvuru taslağını güncelledi`,dk:330}
  ];
  return l.map(o=>({...o, z:Date.now()-o.dk*60000}));
};
AKIS.push(...ILK_AKIS());
function sureMetin(z){ const s=(Date.now()-z)/1000; if(s<45) return 'şimdi'; if(s<3600) return Math.round(s/60)+' dk önce'; if(s<86400) return Math.round(s/3600)+' sa önce'; return Math.round(s/86400)+' gün önce'; }
function olayHTML(o, yeni){ const t=OLAY_TIP[o.tip]; return `<div class="olay ${yeni?'yeni':''}"><div class="ik" style="background:${t.bg};color:${t.c}">${ik(t.ik,15)}</div><div style="min-width:0"><p>${o.metin}</p><small data-z="${o.z}">${sureMetin(o.z)}</small></div></div>`; }
function akisTikla(e){ const y=e.target.closest('[data-y]'), p=e.target.closest('[data-p]'); if(p) git('proje/'+p.dataset.p); else if(y) git('yeg/'+y.dataset.y); }

/* =====================================================================
   BİLDİRİMLER
===================================================================== */
function bildirimler(){
  if (!D.bildirim) D.bildirim = [
    {id:'b1',m:'<b>GAL Terra degli Ulivi</b> size kardeşlik teklifi gönderdi',l:'eslesme',z:Date.now()-36e5,yeni:1,ik:'bag'},
    {id:'b2',m:'<b>LAG Evia Fig Coast</b> FIG-NET projesine yorum yazdı',l:'proje/fignet',z:Date.now()-2*36e5,yeni:1,ik:'mesaj'},
    {id:'b3',m:'YEGFEST: <b>2 uluslararası YEG</b> daha katılımını onayladı',l:'festival',z:Date.now()-20*36e5,yeni:1,ik:'festival'},
    {id:'b4',m:'Fon rehberine yeni not: <b>Erasmus+ gençlik değişimi</b>',l:'fon',z:Date.now()-50*36e5,yeni:0,ik:'para'}
  ];
  return D.bildirim;
}
function bildirimEkle(m, l, ikon='zil'){ bildirimler().unshift({id:'b'+Date.now(),m,l,z:Date.now(),yeni:1,ik:ikon}); kaydet(); zilCiz(true); }
function zilCiz(zipla){
  const n = bildirimler().filter(b=>b.yeni).length;
  $('#zilBtn').innerHTML = ik('zil',19) + (n?`<span class="nokta ${zipla?'zip':''}">${n}</span>`:'');
  $('#zilPanel').innerHTML = `<div class="satir arasi" style="padding:14px 16px;border-bottom:1px solid var(--krem2)"><h3>Bildirimler</h3><button class="btn cizgi k" id="tumOku">Tümünü okundu say</button></div>
    <div style="max-height:380px;overflow:auto">${bildirimler().slice(0,12).map(b=>`<div class="bildirim ${b.yeni?'yeni-b':''}" data-l="${b.l}" data-id="${b.id}"><div class="olay" style="padding:0;border:0"><div class="ik" style="background:var(--krem);color:var(--lacivert)">${ik(b.ik,15)}</div></div><div style="flex:1"><div>${b.m}</div><small class="soluk">${sureMetin(b.z)}</small></div>${b.yeni?'<span class="o"></span>':''}</div>`).join('')}</div>`;
  $('#tumOku').onclick = e => { e.stopPropagation(); bildirimler().forEach(b=>b.yeni=0); kaydet(); zilCiz(); };
  $$('#zilPanel .bildirim').forEach(el=>el.onclick=()=>{ const b=bildirimler().find(x=>x.id===el.dataset.id); if(b) b.yeni=0; kaydet(); zilCiz(); $('#zilPanel').classList.remove('on'); git(el.dataset.l); });
}

