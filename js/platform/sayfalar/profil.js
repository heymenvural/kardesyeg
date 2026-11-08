/* ---------- Profil ---------- */
let profilSekme = 'genel';
SAYFALAR.yeg = (id) => {
  const y = yeg(id); if(!y) return SAYFALAR.yegler();
  const b = ben(), kendim = id===b.id, s = puan(b,y), k = kardesleri(id), pr = yegProjeleri(id), tek = D.teklif[anahtarBag(b.id,id)];
  return `
  <div class="sayfa">
    <a href="#yegler" class="satir k12" style="margin-bottom:14px;font-weight:700">${ik('geri',15)} YEG dizini</a>
    <div class="kart" style="overflow:visible">
      <div class="profil-kapak" style="background:linear-gradient(120deg,${renk(y)} 0%,hsl(${y.h} 40% 20%) 100%)">${desen(y.h)}
        <div class="cam" style="position:absolute;right:16px;top:16px;padding:6px 10px;font-size:12px;display:flex;gap:6px;align-items:center">${ik('pin',14)} ${esc(y.yer)}</div></div>
      <div class="profil-kafa">
        ${av(y,'b')}
        <div class="bilgi"><h1 style="font-size:26px">${esc(y.ad)}</h1><div class="soluk">${esc(y.ulke)} · ${y.kur}'ten beri LEADER YEG'i · ${y.uye} üye</div></div>
        <div class="eylem">${kendim?'<span class="cip ok">Sizin profiliniz</span>':`
          ${kardesMi(id)?`<button class="btn yesil">${ik('tik',16)} Kardeş YEG</button>`:tek?`<button class="btn cizgi" disabled>${ik('saat',16)} Teklif gönderildi</button>`:`<button class="btn altin" onclick="teklifModal('${id}')">${ik('bag',16)} Kardeş YEG ol</button>`}
          <button class="btn cizgi" onclick="mesajBaslat('${id}')">${ik('mesaj',16)} Mesaj</button>
          <button class="btn cizgi" onclick="festivaleDavet('${id}')">${ik('festival',16)} Festivale davet</button>`}</div>
      </div>
      <div style="padding:0 24px"><div class="sekmeler" id="pSek">${[['genel','Genel bakış'],['urun','Ürünler'],['proje',`Projeler (${pr.length})`],['kardes',`Kardeşler (${k.length})`],['ekip','Ekip']].map(([a,l])=>`<button data-s="${a}" class="${profilSekme===a?'on':''}">${l}</button>`).join('')}</div></div>
    </div>
    <div id="pIcerik" style="margin-top:16px">${profilIcerik(y)}</div>
  </div>`;
};
function profilIcerik(y){
  const b = ben(), kendim = y.id===b.id, s = puan(b,y), k = kardesleri(y.id), pr = yegProjeleri(y.id);
  if (profilSekme==='urun') return `<div class="grid g3">${y.urun.map((u,i)=>`<div class="kart urun-kart rise" style="--i:${i}"><div class="urun-ik">${URUN_EMOJI[u]||'🌱'}</div><div style="flex:1"><b style="text-transform:capitalize">${esc(u)}</b><div class="soluk k12">${esc(y.yer)} · ${8+((y.uye*(i+3))%40)} üretici</div><div class="mevsim" title="Hasat dönemi">${Array.from({length:12},(_,m)=>`<i class="${(MEVSIM[u]||[]).includes(m+1)?'on':''}"></i>`).join('')}</div><div class="soluk" style="font-size:11px;margin-top:4px">Hasat takvimi · Oca → Ara</div></div></div>`).join('')}</div>`;
  if (profilSekme==='proje') return pr.length? `<div class="grid g2">${pr.map((p,i)=>projeKart(p,i)).join('')}</div>`:`<div class="kart bos">Henüz proje yok.</div>`;
  if (profilSekme==='kardes') return k.length? `<div class="grid g3">${k.map((x,i)=>{const z=yeg(x);return `<div class="kart pad satir rise" style="--i:${i};cursor:pointer" onclick="git('yeg/${x}')">${av(z)}<div><b>${esc(z.ad)}</b><div class="soluk k12">${esc(z.yer)}</div></div></div>`;}).join('')}</div>`:`<div class="kart bos">Henüz kardeş YEG yok.</div>`;
  if (profilSekme==='ekip') { const ek=[y.kisi,['Yönetim kurulu başkanı','Yönetim kurulu'],['Mali işler sorumlusu','Muhasebe'],['Saha animatörü','Saha ekibi']];
    const adlar = {TR:['Ahmet Kaya','Fatma Şahin','Ali Çelik'],FR:['Sophie Bernard','Luc Moreau','Nadia Faure'],IT:['Paolo Ricci','Sara Greco','Luca Marino'],ES:['Carmen López','Pablo Sanz','Elena Gil'],PT:['João Silva','Ana Costa','Rui Lopes'],GR:['Dimitris Kostas','Maria Nikolaou','Yannis Georgiou'],BG:['Ivan Dimitrov','Elena Georgieva','Petar Kolev'],RO:['Ioana Rusu','Mihai Stan','Ana Moldovan'],HR:['Marko Horvat','Ana Kovač','Luka Babić'],PL:['Piotr Wiśniewski','Anna Kowalska','Tomasz Lewandowski'],AT:['Maria Gruber','Thomas Bauer','Lisa Wagner'],DE:['Jonas Schmidt','Laura Fischer','Felix Becker'],IE:['Seán Murphy','Aoife Byrne','Ciarán Walsh'],SE:['Karin Johansson','Lars Nilsson','Sara Berg']}[y.kod];
    return `<div class="kart pad" style="max-width:640px">${ek.map((e,i)=>{const ad=i?adlar[i-1]:e[0];return `<div class="ekip"><div class="kisi" style="background:hsl(${(y.h+i*50)%360} 35% 45%)">${bas(ad)}</div><div style="flex:1"><b>${esc(ad)}</b><div class="soluk k12">${esc(i?e[0]:e[1])}</div></div>${i===0&&!kendim?`<button class="btn cizgi k" onclick="mesajBaslat('${y.id}')">${ik('mesaj',14)} Yaz</button>`:''}</div>`;}).join('')}<p class="soluk k12" style="margin:12px 0 0">Kişiler kurgusaldır.</p></div>`; }
  return `<div class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)" id="pIzgara">
    <div class="grid" style="align-content:start">
      <div class="kart pad rise"><h2 style="margin-bottom:10px">Hakkında</h2><p style="margin:0 0 14px">${esc(y.hak)}</p>
        <h3 style="margin-bottom:8px">Öncelikler</h3>${y.onc.map(o=>`<span class="cip o ${!kendim&&b.onc.includes(o)?'ok':''}">${esc(o)}</span>`).join('')}
        <div class="ayrac"></div><h3 style="margin-bottom:6px">${ik('hedef',15)} Aradığı iş birliği</h3><p class="soluk" style="margin:0">${esc(y.ara)}</p></div>
      <div class="kart pad rise" style="--i:1"><h2 style="margin-bottom:14px">Son hareketler</h2><div class="zaman-cizgi">
        ${[[`${k[0]?esc(yeg(k[0]).ad)+' ile kardeş YEG oldu':'Ağa katıldı'}`,'2 hafta önce'],[pr[0]?`“${esc(pr[0].ad)}” projesinde yer aldı`:'Profilini güncelledi','1 ay önce'],[`${esc(y.urun[0])} ürününü vitrine ekledi`,'2 ay önce'],['YEG Kardeş ağına katıldı','4 ay önce']].map(([m,z])=>`<div class="z"><b style="font-size:13.5px">${m}</b><div class="soluk k12">${z}</div></div>`).join('')}</div></div>
    </div>
    <div class="grid" style="align-content:start">
      ${kendim?'':`<div class="kart pad rise satir" style="--i:1;gap:16px">${halka(s.p,72,7)}<div><h3>Sizinle uyum</h3><div class="soluk k12" style="margin-top:4px">${s.neden.map(n=>'• '+esc(n)).join('<br>')}</div></div></div>`}
      <div class="kart rise" style="--i:2;overflow:hidden"><div class="harita-kap" id="pHarita" style="border-radius:0;height:220px"></div></div>
      <div class="kart pad rise" style="--i:3"><table style="width:100%;font-size:13.5px;border-collapse:collapse">${[['Konum',y.yer],['Kuruluş',y.kur],['Üye',y.uye],['Çalışma dilleri',y.dil.join(', ')],['İletişim',y.kisi.join(' · ')]].map(([a,v])=>`<tr><td class="soluk" style="padding:7px 0;border-bottom:1px solid var(--krem2);width:40%">${a}</td><td style="padding:7px 0;border-bottom:1px solid var(--krem2)">${esc(v)}</td></tr>`).join('')}</table></div>
    </div></div>`;
}
SAYFALAR.yeg.sonra = (id) => {
  const y = yeg(id); if(!y) return;
  const kur = () => {
    const pi=$('#pIzgara'); if(pi && matchMedia('(max-width:900px)').matches) pi.style.gridTemplateColumns='1fr';
    if ($('#pHarita')) { const h=new Harita($('#pHarita'),{kontrol:false,lejant:false,sadece:[id,...kardesleri(id)]}); const [x,yy]=MAP.pts[id]; h.setVB([x-260,yy-110,520,302],false); }
    canlandir($('#pIcerik'));
  };
  $$('#pSek button').forEach(bt=>bt.onclick=()=>{ profilSekme=bt.dataset.s; $$('#pSek button').forEach(x=>x.classList.toggle('on',x===bt)); $('#pIcerik').innerHTML=profilIcerik(y); kur(); });
  kur();
};

