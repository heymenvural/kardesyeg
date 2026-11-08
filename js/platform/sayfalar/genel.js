/* ---------- Genel bakış ---------- */
SAYFALAR.genel = () => {
  const b = ben(), saat = new Date().getHours();
  const selam = saat<6?'İyi geceler':saat<12?'Günaydın':saat<18?'İyi günler':'İyi akşamlar';
  const acik = projeler().filter(p=>p.durum==='ortak').length;
  const oneriler = Y.filter(y=>y.id!==b.id && !kardesMi(y.id)).map(y=>({y,...puan(b,y)})).sort((a,c)=>c.p-a.p).slice(0,3);
  const spark = v => { const m=Math.max(...v); return `<svg class="spark" viewBox="0 0 110 40" preserveAspectRatio="none"><path d="M0 40 ${v.map((x,i)=>`L${i*110/(v.length-1)} ${38-x/m*30}`).join(' ')} L110 40Z" fill="rgba(201,162,39,.18)"/><path d="${v.map((x,i)=>`${i?'L':'M'}${i*110/(v.length-1)} ${38-x/m*30}`).join(' ')}" fill="none" stroke="#C9A227" stroke-width="2"/></svg>`; };
  return `
  <div class="sayfa">
    <div class="kafa">
      <div><div class="ust-etiket">${ik('dunya',14)} Türkiye – Avrupa YEG ağı</div>
        <h1>${selam}, <em>${esc(b.ad)}</em></h1>
        <p class="aciklama">Ağda bugün ${AKIS.length+7} yeni hareket var. ${kardesleri(b.id).length} kardeş YEG'iniz ve ${yegProjeleri(b.id).length} projeniz bulunuyor.</p></div>
      <div class="satir sar"><a class="btn cizgi" href="#eslesme">${ik('bag',16)} Kardeş YEG bul</a><a class="btn ana" href="#projeler">${ik('klasor',16)} Açık projeler</a></div>
    </div>
    <div class="grid g5" style="margin-bottom:16px">
      ${[[Y.length,'Kayıtlı YEG','+3 bu ay',[3,5,6,8,9,12,15,18,21,26]],[ULKELER.length,'Ülke','',[4,6,7,8,9,10,11,12,13,14]],[tumBaglar().length,'Kardeş YEG bağı','+5',[2,3,4,6,7,9,11,13,15,17]],[projeler().length,'Ortak proje',acik+' açık',[1,1,2,3,3,4,5,6,7,8]],[1284,'Bu ay mesaj','%18',[300,420,380,520,610,700,840,910,1100,1284]]]
        .map(([s,l,a,v],i)=>`<div class="kart kpi rise" style="--i:${i}">${spark(v)}<div class="s" data-say="${s}">0</div><div class="l">${l}</div>${a?`<span class="art">${a}</span>`:''}</div>`).join('')}
    </div>
    <div class="grid" style="grid-template-columns:minmax(0,1.65fr) minmax(0,1fr);margin-bottom:16px" id="anaIzgara">
      <div class="kart rise kure-kart" style="--i:2">
        <div class="kure-kap" id="anaKure">
          <div class="kure-ust">
            <div><h2 style="color:#fff">Canlı ağ küresi</h2><div class="k12" style="color:#9FB2CC">Altın yaylar sizin kardeş bağlarınız · yeşiller ortak projeler · sürükleyip döndürün</div></div>
            <a class="btn k cam-btn" href="#harita">Tam ekran ${ik('ok',14)}</a>
          </div>
          <div class="kure-alt">
            <div class="segment" id="kureGorus"><button data-g="avrupa" class="on">Avrupa</button><button data-g="ben">Benim ağım</button><button data-g="tr">Türkiye</button><button data-g="dunya">Dünya</button></div>
            <div class="kure-lejant"><span><b style="background:#E3B341"></b>Türkiye</span><span><b style="background:#8DB8EC"></b>Avrupa</span><span><i style="background:#F2C14E"></i>Kardeş</span><span><i style="background:#8FD07A"></i>Proje</span></div>
          </div>
        </div>
      </div>
      <div class="kart rise" style="--i:3;display:flex;flex-direction:column">
        <div class="pad satir arasi" style="padding-bottom:12px"><h2>Ağda neler oluyor?</h2><span class="canli-rozet">Canlı</span></div>
        <div class="akis-liste" id="akisListe" style="flex:1">${AKIS.slice(0,14).map(o=>olayHTML(o)).join('')}</div>
      </div>
    </div>
    <div class="grid g3">
      <div class="kart pad rise" style="--i:4">
        <div class="satir arasi" style="margin-bottom:14px"><h2>Size önerilen ortaklar</h2><a href="#eslesme" class="k12">Tümü</a></div>
        ${oneriler.map(o=>`<div class="satir" style="padding:10px 0;border-bottom:1px solid var(--krem2);cursor:pointer" onclick="git('yeg/${o.y.id}')">${av(o.y)}<div style="flex:1;min-width:0"><b style="display:block;font-size:13.5px">${esc(o.y.ad)}</b><span class="soluk k12">${esc(o.ou.join(', ')||o.oo.join(', '))}</span></div>${halka(o.p,46,5)}</div>`).join('')}
      </div>
      <div class="kart pad rise" style="--i:5">
        <div class="satir arasi" style="margin-bottom:14px"><h2>Ortak arayan projeler</h2><a href="#projeler" class="k12">Tümü</a></div>
        ${projeler().filter(p=>p.durum==='ortak').slice(0,3).map(p=>{const o=projeOrtaklari(p), sl=Math.max(0,p.aranan-Object.entries(D.basvuru).filter(([k,v])=>k.startsWith(p.id+'|')&&v==='ortak').length), top=o.length+1+sl; return `<div style="padding:10px 0;border-bottom:1px solid var(--krem2);cursor:pointer" onclick="git('proje/${p.id}')"><b style="font-size:13.5px">${esc(p.ad)}</b><div class="satir arasi" style="margin-top:6px"><span class="soluk k12">${esc(p.program)}</span><span class="k12"><b>${o.length+1}</b>/${top} ortak</span></div><div class="ilerleme" style="margin-top:6px;height:6px"><i data-w="${(o.length+1)/top*100}"></i></div></div>`;}).join('')}
      </div>
      <div class="kart pad rise" style="--i:6">
        <div class="satir arasi" style="margin-bottom:14px"><h2>Yaklaşan</h2>${ik('takvim',18)}</div>
        ${ETKINLIK.map(e=>`<div class="satir" style="padding:9px 0;border-bottom:1px solid var(--krem2);align-items:flex-start"><div style="width:46px;flex:none;text-align:center;background:var(--krem);border-radius:10px;padding:5px 0"><b style="display:block;font-size:17px;line-height:1">${e.g}</b><span class="soluk" style="font-size:11px">${e.a}</span></div><div><b style="font-size:13.5px">${esc(e.ad)}</b><div class="soluk k12">${esc(e.d)}</div></div></div>`).join('')}
      </div>
    </div>
  </div>`;
};
SAYFALAR.genel.sonra = () => {
  kureKur($('#anaKure')).then(k => { if(!k) return; if(!YUMUSAK) k.ucus(43, 17, 3.1); kureGorusBagla(k); });
  $('#akisListe').addEventListener('click', akisTikla);
  const mq = matchMedia('(max-width:1100px)'); const f=()=>{ const g=$('#anaIzgara'); if(g) g.style.gridTemplateColumns = mq.matches?'1fr':'minmax(0,1.65fr) minmax(0,1fr)'; }; f();
};


function kureGorusBagla(k){
  const gor = { avrupa:()=>k.ucus(43,17,3.1), tr:()=>k.ucus(36,34,2.2), dunya:()=>k.ucus(25,20,4.4), ben:()=>{ const b=ben(); k.ucus(b.lat-6,b.lon+ (trMi(b)?-12:6),2.5); } };
  $$('#kureGorus button').forEach(bt => bt.onclick = () => { $$('#kureGorus button').forEach(x=>x.classList.toggle('on',x===bt)); gor[bt.dataset.g](); });
}
