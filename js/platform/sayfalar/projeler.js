/* ---------- Projeler ---------- */
function projeKart(p,i=0){
  const o = projeOrtaklari(p), top = o.length+1+p.aranan, lider = yeg(p.lider);
  const slot = Math.max(0, p.aranan - Object.entries(D.basvuru).filter(([k,v])=>k.startsWith(p.id+'|')&&v==='ortak').length);
  return `<div class="kart pk rise" style="--i:${Math.min(i,10)}" onclick="git('proje/${p.id}')">
    <div class="satir arasi"><span class="durum ${p.durum}">${DURUM_AD[p.durum]}</span><span class="soluk k12">${esc(p.tarih)}</span></div>
    <div><h3>${esc(p.ad)}</h3><div class="soluk k12" style="margin-top:4px">${esc(p.program)}</div></div>
    <p class="soluk" style="margin:0;font-size:13px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(p.ozet)}</p>
    <div class="satir arasi"><div class="yigin">${[lider,...o.map(yeg)].map(avS).join('')}${Array.from({length:slot},()=>`<div class="bos-slot">+</div>`).join('')}</div>
      ${p.durum==='yurutuluyor'?`<span class="k12"><b>%${p.ilerleme}</b> tamamlandı</span>`:`<span class="k12"><b>${o.length+1}</b>/${o.length+1+slot} ortak</span>`}</div>
    <div class="ilerleme" style="height:6px"><i data-w="${p.durum==='yurutuluyor'?p.ilerleme:(o.length+1)/(o.length+1+slot)*100}"></i></div>
    <div class="meta"><div>Bütçe<b>${para(p.butce)}</b></div><div>Süre<b>${p.sure} ay</b></div><div>${p.durum==='yurutuluyor'?'İlerleme':'Son başvuru'}<b>${esc(p.son)}</b></div></div>
    <div>${p.etiket.map(e=>`<span class="cip">${esc(e)}</span>`).join('')}</div>
  </div>`;
}
let projeFiltre = {sekme:'acik', program:'', q:''};
SAYFALAR.projeler = () => `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('klasor',14)} Ortak projeler</div><h1>Birlikte <em>proje</em> kurun</h1><p class="aciklama">YEG'lerin açtığı iş birliği çağrıları. Bir projeye ortak olmak için başvurun ya da kendi projenizi açıp Avrupa'dan ortak arayın.</p></div>
      <a class="btn altin" href="#proje-olustur">${ik('arti',16)} Proje oluştur</a></div>
    <div class="sekmeler" id="prSek">${[['acik','Ortak arayanlar'],['yurut','Yürütülenler'],['benim','Projelerim'],['tum','Tümü']].map(([k,l])=>`<button data-s="${k}" class="${projeFiltre.sekme===k?'on':''}">${l}</button>`).join('')}</div>
    <div class="satir sar" style="margin-bottom:18px">
      <div style="flex:1;min-width:220px;position:relative"><span style="position:absolute;left:12px;top:11px;color:var(--soluk)">${ik('ara',18)}</span><input type="search" id="prAra" placeholder="Proje, ürün veya konu ara…" style="padding-left:40px" value="${esc(projeFiltre.q)}"></div>
      <select class="f" id="prProg" style="width:auto"><option value="">Tüm fon kaynakları</option>${PROGRAMLAR.map(p=>`<option ${projeFiltre.program===p?'selected':''}>${p}</option>`).join('')}</select>
    </div>
    <div class="grid g2" id="prListe"></div>
  </div>`;
SAYFALAR.projeler.sonra = () => {
  const ciz = () => {
    const f = projeFiltre, q=f.q.toLocaleLowerCase('tr');
    const l = projeler().filter(p => (f.sekme==='tum' || (f.sekme==='acik'&&p.durum==='ortak') || (f.sekme==='yurut'&&(p.durum==='yurutuluyor'||p.durum==='hazirlik')) || (f.sekme==='benim'&&(p.lider===D.aktif||projeOrtaklari(p).includes(D.aktif))))
      && (!f.program||p.program===f.program) && (!q || [p.ad,p.ozet,...p.etiket].join(' ').toLocaleLowerCase('tr').includes(q)));
    $('#prListe').innerHTML = l.length ? l.map((p,i)=>projeKart(p,i)).join('') : `<div class="kart bos" style="grid-column:1/-1">Bu filtreye uyan proje yok. <a href="#proje-olustur">Yeni bir proje açın →</a></div>`;
    canlandir($('#prListe'));
  };
  $$('#prSek button').forEach(b=>b.onclick=()=>{ projeFiltre.sekme=b.dataset.s; $$('#prSek button').forEach(x=>x.classList.toggle('on',x===b)); ciz(); });
  $('#prAra').oninput = e => { projeFiltre.q=e.target.value; ciz(); };
  $('#prProg').onchange = e => { projeFiltre.program=e.target.value; ciz(); };
  ciz();
};

const BUTCE_RENK = ['#1F3A5F','#C9A227','#2E78C7','#5E8C4A','#B8900F','#8BA6C6'];
SAYFALAR.proje = (id) => {
  const p = proje(id); if(!p) return SAYFALAR.projeler();
  const lider = yeg(p.lider), o = projeOrtaklari(p), b = D.aktif, bv = D.basvuru[p.id+'|'+b];
  const benimMi = p.lider===b || o.includes(b);
  const slot = Math.max(0, p.aranan - Object.entries(D.basvuru).filter(([k,v])=>k.startsWith(p.id+'|')&&v==='ortak').length);
  const yorumlar = [...p.yorum.map(([y,m,z])=>({y,m,z})), ...(D.yorumEk[p.id]||[])];
  let acc=0; const C=2*Math.PI*54;
  const donut = p.dag.map(([k,v],i)=>{ const s=`<circle r="54" cx="70" cy="70" fill="none" stroke="${BUTCE_RENK[i%6]}" stroke-width="22" stroke-dasharray="0 ${C}" data-d="${v/100*C} ${C}" stroke-dashoffset="${-acc/100*C}" style="transition:stroke-dasharray 1s ${i*.12}s var(--ease)"/>`; acc+=v; return s; }).join('');
  return `
  <div class="sayfa">
    <a href="#projeler" class="satir k12" style="margin-bottom:14px;font-weight:700">${ik('geri',15)} Projeler</a>
    <div class="kart" style="overflow:hidden;margin-bottom:16px">
      <div style="padding:26px;background:linear-gradient(120deg,#14263F,#1F3A5F 60%,#2B5280);color:#fff;position:relative;overflow:hidden">${desen(p.ad.length*7)}
        <div style="position:relative"><span class="durum ${p.durum}">${DURUM_AD[p.durum]}</span>
          <h1 style="color:#fff;margin:12px 0 8px;font-size:clamp(22px,2.6vw,30px)">${esc(p.ad)}</h1>
          <div class="satir sar" style="gap:18px;color:#C9D4E3;font-size:13px"><span class="satir" style="gap:6px">${ik('para',15)} ${esc(p.program)}</span><span class="satir" style="gap:6px">${ik('saat',15)} ${p.sure} ay</span><span class="satir" style="gap:6px">${ik('takvim',15)} ${esc(p.son)}</span><span class="satir" style="gap:6px">${ik('ekip',15)} ${o.length+1} ortak${slot?` · ${slot} yer açık`:''}</span></div>
        </div>
      </div>
      <div class="pad satir arasi sar">
        <div class="satir">${av(lider)}<div><span class="soluk k12">Proje lideri</span><b style="display:block;cursor:pointer" onclick="git('yeg/${lider.id}')">${esc(lider.ad)}</b></div></div>
        <div class="satir sar">${benimMi?`<span class="btn yesil">${ik('tik',16)} ${p.lider===b?'Bu proje sizin':'Ortağısınız'}</span>`:bv==='bekliyor'?`<button class="btn cizgi" disabled>${ik('saat',16)} Başvurunuz değerlendiriliyor</button>`:slot&&p.durum==='ortak'?`<button class="btn altin" onclick="basvurModal('${p.id}')">${ik('arti',16)} Ortak olmak için başvur</button>`:''}
          ${p.lider!==b?`<button class="btn cizgi" onclick="mesajBaslat('${p.lider}')">${ik('mesaj',16)} Liderle yazış</button>`:''}</div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);align-items:start" id="pjIzgara">
      <div class="grid">
        <div class="kart pad rise"><h2 style="margin-bottom:10px">Özet</h2><p style="margin:0 0 14px">${esc(p.ozet)}</p><h3 style="margin-bottom:8px">Hedefler</h3>
          ${p.hedef.map(h=>`<div class="satir" style="align-items:flex-start;margin-bottom:6px"><span style="color:var(--yesil);margin-top:2px">${ik('tik',16)}</span><span>${esc(h)}</span></div>`).join('')}
          <div style="margin-top:10px">${p.etiket.map(e=>`<span class="cip">${esc(e)}</span>`).join('')}</div></div>
        <div class="kart pad rise" style="--i:1"><div class="satir arasi" style="margin-bottom:16px"><h2>İş planı</h2><span class="soluk k12">${p.sure} ay</span></div>
          <div class="gantt">${p.ip.map(([ad,s,e],i)=>`<div class="s"><span>İP${i+1} · ${esc(ad)}</span><div class="ray" style="--ay:${p.sure}"><div class="cubuk" style="left:${(s-1)/p.sure*100}%;width:${(e-s+1)/p.sure*100}%;background:${BUTCE_RENK[i%6]}">Ay ${s}–${e}</div></div></div>`).join('')}
            <div class="aylar"><span>Ay 1</span><span>Ay ${Math.round(p.sure/2)}</span><span>Ay ${p.sure}</span></div></div></div>
        <div class="kart pad rise" style="--i:2"><h2 style="margin-bottom:6px">Tartışma <span class="soluk" style="font-weight:600;font-size:14px">(${yorumlar.length})</span></h2>
          <div id="yorumlar">${yorumlar.map(c=>yorumHTML(c)).join('') || '<p class="soluk">Henüz yorum yok. İlk yorumu siz yazın.</p>'}</div>
          <div class="satir" style="margin-top:14px;align-items:flex-end">${avS(ben())}<textarea id="yorumGir" placeholder="Projeye katkı, soru veya öneri yazın…" style="min-height:48px"></textarea><button class="btn ana" id="yorumGonder">${ik('gonder',16)}</button></div></div>
      </div>
      <div class="grid">
        <div class="kart pad rise" style="--i:1"><h2 style="margin-bottom:14px">Ortaklar</h2><div class="grid" style="gap:10px">
          ${[[lider,'Lider'],...o.map((x,i)=>[yeg(x),['İş paketi lideri','Pilot bölge','Yaygınlaştırma','Ortak'][i%4]])].map(([y,r])=>`<div class="ortak-kart" style="cursor:pointer" onclick="git('yeg/${y.id}')">${av(y)}<div style="flex:1;min-width:0"><b style="font-size:13.5px;display:block">${esc(y.ad)}</b><span class="soluk k12">${r} · ${esc(y.ulke)}</span></div></div>`).join('')}
          ${Array.from({length:slot},()=>`<div class="ortak-kart bos-o"><div class="bos-slot" style="width:40px;height:40px">+</div><div style="flex:1"><b style="font-size:13px">Aranan ortak</b><div class="soluk k12">${esc(p.aranProfil)}</div></div></div>`).join('')}</div></div>
        <div class="kart rise" style="--i:2;overflow:hidden"><div class="harita-kap" id="pjHarita" style="border-radius:0;height:230px"></div></div>
        <div class="kart pad rise" style="--i:3"><div class="satir arasi" style="margin-bottom:12px"><h2>Bütçe</h2><b>${para(p.butce)}</b></div>
          <div class="satir" style="gap:18px;align-items:center;flex-wrap:wrap"><svg width="140" height="140" viewBox="0 0 140 140" style="transform:rotate(-90deg);flex:none" id="donut">${donut}</svg>
          <div style="flex:1;min-width:140px">${p.dag.map(([k,v],i)=>`<div class="satir arasi k12" style="padding:4px 0"><span class="satir" style="gap:8px"><i style="width:10px;height:10px;border-radius:3px;background:${BUTCE_RENK[i%6]};display:inline-block"></i>${esc(k)}</span><b>%${v}</b></div>`).join('')}</div></div>
          <p class="soluk k12" style="margin:10px 0 0">Her ortak kendi payını kendi bütçesi veya fon kaynağından karşılar.</p></div>
      </div>
    </div>
  </div>`;
};
function yorumHTML(c, yeni){ const y=yeg(c.y); return `<div class="yorum ${yeni?'yeni':''}">${avS(y)}<div style="flex:1"><div class="satir" style="gap:8px"><b style="font-size:13.5px">${esc(y.ad)}</b><span class="soluk k12">${esc(c.z)}</span></div><p style="margin:4px 0 0;font-size:13.5px">${esc(c.m)}</p></div></div>`; }
SAYFALAR.proje.sonra = (id) => {
  const p = proje(id); if(!p) return;
  const g=$('#pjIzgara'); if(matchMedia('(max-width:1000px)').matches) g.style.gridTemplateColumns='1fr';
  const ids=[p.lider,...projeOrtaklari(p)];
  const h = new Harita($('#pjHarita'),{kardes:false,proje:true,kontrol:false,lejant:false,sadece:ids});
  const xs=ids.map(i=>MAP.pts[i][0]), ys=ids.map(i=>MAP.pts[i][1]); const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  const w=Math.max(260,(maxx-minx)*1.5), cx=(minx+maxx)/2, cy=(miny+maxy)/2; h.setVB([cx-w/2,cy-w*.29,w,w*.58],false);
  setTimeout(()=>$$('#donut circle').forEach(c=>c.setAttribute('stroke-dasharray',c.dataset.d)),200);
  $('#yorumGonder').onclick = () => { const m=$('#yorumGir').value.trim(); if(!m) return; const c={y:D.aktif,m,z:'şimdi'};
    (D.yorumEk[p.id]=D.yorumEk[p.id]||[]).push(c); kaydet(); const kap=$('#yorumlar'); if(kap.querySelector('p.soluk')) kap.innerHTML=''; kap.insertAdjacentHTML('beforeend',yorumHTML(c,true)); $('#yorumGir').value='';
    toast('Yorumunuz projeye eklendi','mesaj');
    if (p.lider!==D.aktif) setTimeout(()=>{ const r={y:p.lider,m:'Teşekkürler, çok faydalı! Bir sonraki ortak toplantısında bu konuyu gündeme alalım.',z:'şimdi'}; (D.yorumEk[p.id]=D.yorumEk[p.id]||[]).push(r); kaydet(); const k2=$('#yorumlar'); if(k2) k2.insertAdjacentHTML('beforeend',yorumHTML(r,true)); }, 2600);
  };
};
function basvurModal(pid){
  const p = proje(pid), b = ben(), lider=yeg(p.lider);
  const m = modal({baslik:'Ortaklık başvurusu', govde:`
    <div class="satir" style="margin-bottom:14px">${av(b)}<div style="flex:1"><b>${esc(b.ad)}</b><div class="soluk k12">“${esc(p.ad)}” projesine başvuruyor</div></div></div>
    <div class="uyari" style="margin-bottom:14px"><b>Aranan profil:</b> ${esc(p.aranProfil)}</div>
    <label class="alan" style="margin-bottom:12px">Üstlenmek istediğiniz rol<select class="f">${p.ip.map((x,i)=>`<option>İP${i+1} · ${esc(x[0])}</option>`).join('')}<option>Pilot bölge</option></select></label>
    <label class="alan" style="margin-bottom:12px">Katkınız<textarea>${esc(b.ad)} olarak ${b.urun.slice(0,2).join(' ve ')} üreticilerimizle pilot bölge olabilir, ${b.onc[0]} alanındaki deneyimimizi projeye taşıyabiliriz.</textarea></label>
    <label class="alan">Tahmini eş finansman payınız (€)<input type="number" value="${Math.round(p.butce/(projeOrtaklari(p).length+2)/1000)*1000}"></label>`,
    eylem:`<button class="btn cizgi" data-kapat>Vazgeç</button><button class="btn altin" id="bGonder">${ik('gonder',16)} Başvuruyu gönder</button>`});
  $('#bGonder',m.el).onclick = () => { m.kapat(); D.basvuru[pid+'|'+D.aktif]='bekliyor'; kaydet(); yenile(true);
    toast(`Başvurunuz <b>${esc(lider.ad)}</b>'e iletildi`,'gonder');
    setTimeout(()=>{ D.basvuru[pid+'|'+D.aktif]='ortak'; kaydet(); konfeti(); toast(`🎉 “${esc(p.ad)}” projesine <b>ortak olarak kabul edildiniz</b>`,'klasor');
      bildirimEkle(`<b>${esc(lider.ad)}</b> sizi “${esc(p.ad)}” projesine ortak olarak kabul etti`,'proje/'+pid,'klasor');
      AKIS.unshift({tip:'proje',metin:`<b data-y="${D.aktif}">${esc(ben().ad)}</b> <b data-p="${pid}">“${esc(p.ad)}”</b> projesine ortak oldu`,z:Date.now()}); yenile(true); }, 4200);
  };
}

