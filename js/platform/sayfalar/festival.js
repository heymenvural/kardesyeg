/* ---------- Festival ---------- */
const STANT_INT = 12;
function festDurum(){
  if (!D.fest) D.fest = {lavande:3, evia:3, langhe:2, rosevalley:2, salento:1, transilvania:1, castanheiro:0, miodu:0, zagora:0, higueras:2, stant:{lavande:0, evia:1}};
  return D.fest;
}
const KOLON = ['Davet edilecek','Davet gönderildi','Katılım onaylandı','Stant atandı'];
SAYFALAR.festival = () => {
  const f = festDurum(), ids = Object.keys(f).filter(k=>k!=='stant');
  const say = i => ids.filter(k=>f[k]>=i).length;
  return `<div class="sayfa">
    <div class="fest-hero rise">
      <svg class="desen" viewBox="0 0 200 200"><g fill="none" stroke="#E3B341" stroke-width="1">${Array.from({length:8},(_,i)=>`<circle cx="100" cy="100" r="${12+i*12}"/>`).join('')}</g></svg>
      <div style="position:relative"><div class="ust-etiket" style="color:var(--altin-a)">${ik('festival',14)} Festivale davet ve koordinasyon</div>
        <h1>YEGFEST · <em>Türkiye–AB</em> Yerel Ürün Festivali</h1>
        <p style="color:#C9D4E3;max-width:640px;margin:10px 0 0">Kardeş YEG'ler festivale buradan davet edilir; yanıt, katılım, stant ve program tek ekrandan izlenir.</p>
        <div class="bilgi"><span>${ik('pin',16)} Ankara</span><span>${ik('takvim',16)} 2027 · tarih taslak</span><span>${ik('dunya',16)} <b style="color:#fff" data-say="${say(2)}">0</b>&nbsp;uluslararası YEG onayladı</span><span>${ik('bina',16)} Uluslararası alan: ${STANT_INT} stant</span></div>
      </div>
    </div>
    <div class="grid g4" style="margin:16px 0" id="fKpi">${KOLON.map((k,i)=>`<div class="kart kpi rise" style="--i:${i}"><div class="s" data-say="${ids.filter(x=>f[x]===i).length}">0</div><div class="l">${k}</div></div>`).join('')}</div>
    <div class="kart rise salon-kart" style="--i:2;margin-bottom:16px">
      <div class="salon-kap" id="salon3d">
        <div class="salon-ust">
          <div class="cam" style="padding:12px 16px"><div class="satir" style="gap:8px;font-weight:800;color:#fff">${ik('bina',16)} 3D festival salonu</div><div class="k12" style="color:#9FB2CC;margin-top:2px">Sürükle: döndür · tekerlek: yakınlaştır · mavi alandaki bir stanta tıklayın</div></div>
          <div class="segment koyu" id="salonGor"><button data-g="genel" class="on">Genel</button><button data-g="int">Uluslararası alan</button><button data-g="tur">${ik('parilti',13)} Sinematik tur</button></div>
        </div>
        <div class="salon-pop" id="salonPop"></div>
      </div>
    </div>
    <div class="kart pad rise" style="--i:2;margin-bottom:16px"><div class="satir arasi sar" style="margin-bottom:14px"><h2>Davet panosu</h2>
      <div class="satir sar" style="min-width:0"><select class="f" id="fEkle" style="width:auto;max-width:min(260px,100%);min-width:0">${Y.filter(y=>!trMi(y)&&!(y.id in f)).map(y=>`<option value="${y.id}">${esc(y.ad)}${kardesMi(y.id)?' · kardeş':''}</option>`).join('')}</select><button class="btn ana k" id="fEkleBtn">${ik('arti',14)} Panoya ekle</button></div></div>
      <div class="kanban" id="kanban">${kanbanHTML()}</div></div>
    <div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)" id="fIzgara">
      <div class="kart pad rise" style="--i:3"><div class="satir arasi" style="margin-bottom:12px"><h2>Uluslararası stantlar</h2><span class="soluk k12">${STANT_INT} stant · tıklayınca salonda gösterilir</span></div><div class="stant-liste" id="stantListe">${stantListeHTML()}</div></div>
      <div class="kart pad rise" style="--i:4"><h2 style="margin-bottom:12px">Program taslağı</h2>
        <div class="sekmeler" id="fGun">${['1. gün','2. gün','3. gün'].map((g,i)=>`<button data-g="${i}" class="${i?'':'on'}">${g}</button>`).join('')}</div><div id="fProg">${programHTML(0)}</div></div>
    </div>
  </div>`;
};
function kanbanHTML(){
  const f=festDurum(); const ids=Object.keys(f).filter(k=>k!=='stant');
  const eylem=['Davet gönder','Onayı simüle et','Stant ata'];
  return KOLON.map((k,i)=>`<div class="kolon"><div class="kb">${k}<span>${ids.filter(x=>f[x]===i).length}</span></div>
    ${ids.filter(x=>f[x]===i).map(id=>{const y=yeg(id); return `<div class="kk" id="kk-${id}"><div class="satir">${avS(y)}<div style="min-width:0;flex:1"><b style="font-size:13px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(y.ad)}</b><span class="soluk" style="font-size:11.5px">${esc(y.ulke)}${kardesMi(id)?' · kardeş':''}</span></div></div>
      ${i===3?`<div class="satir arasi" style="margin-top:10px"><span class="cip u" style="margin:0">Stant U-${(f.stant[id]??0)+1}</span><button class="btn cizgi k" onclick="davetMektubu('${id}')">${ik('belge',14)} Mektup</button></div>`:`<div class="satir" style="margin-top:10px;gap:6px">${i===1?`<button class="btn cizgi k" onclick="davetMektubu('${id}')" title="Davet mektubu">${ik('belge',14)}</button>`:''}<button class="btn ${i===2?'altin':'ana'} k" style="flex:1" onclick="festIlerle('${id}')">${eylem[i]}</button></div>`}</div>`;}).join('')}
  </div>`).join('');
}
function salonSVG(yeni){
  const f=festDurum(), atanan=Object.entries(f.stant); let s='';
  s+=`<rect x="2" y="2" width="596" height="356" rx="14" fill="#FDFCF8" stroke="#CFC5A8" stroke-width="2"/>`;
  s+=`<rect x="20" y="20" width="250" height="34" rx="8" fill="#14263F"/><text x="145" y="41" text-anchor="middle" style="fill:#fff;font-size:11px">Türkiye YEG'leri · ilçe stantları</text>`;
  for(let r=0;r<4;r++) for(let c=0;c<8;c++) s+=`<rect class="stant dolu" x="${20+c*31.5}" y="${66+r*36}" width="27" height="30" rx="4"/>`;
  s+=`<rect x="300" y="20" width="280" height="34" rx="8" fill="#2E78C7"/><text x="440" y="41" text-anchor="middle" style="fill:#fff;font-size:11px">Uluslararası YEG alanı</text>`;
  for(let i=0;i<STANT_INT;i++){ const r=Math.floor(i/4), c=i%4, x=300+c*71, y=66+r*48; const a=atanan.find(([,v])=>v===i);
    s+=`<rect class="stant int ${a?'atandi':''} ${a&&a[0]===yeni?'yeni':''}" x="${x}" y="${y}" width="64" height="40" rx="6"/><text x="${x+32}" y="${y+18}" text-anchor="middle">${a?yeg(a[0]).kisa+' · '+yeg(a[0]).kod:'U-'+(i+1)}</text><text x="${x+32}" y="${y+31}" text-anchor="middle" style="font-weight:600;font-size:8px;fill:#5F6B7A">${a?'U-'+(i+1):'boş'}</text>`; }
  s+=`<rect x="20" y="222" width="250" height="60" rx="10" fill="#E8F0E3" stroke="#BCD2B0"/><text x="145" y="256" text-anchor="middle">Tadım ve ortak sofra alanı</text>`;
  s+=`<rect x="300" y="222" width="135" height="60" rx="10" fill="#FBF3D9" stroke="#EBD9A0"/><text x="367" y="250" text-anchor="middle">Kardeş YEG</text><text x="367" y="262" text-anchor="middle">görüşme alanı</text>`;
  s+=`<rect x="445" y="222" width="135" height="60" rx="10" fill="#E6EFFA" stroke="#C7DBF0"/><text x="512" y="256" text-anchor="middle">Panel salonu</text>`;
  s+=`<rect x="160" y="300" width="280" height="40" rx="10" fill="#14263F"/><text x="300" y="324" text-anchor="middle" style="fill:#E3B341;font-size:11px">ANA SAHNE</text>`;
  return `<svg viewBox="0 0 600 360">${s}</svg>`;
}
const PROGRAM = [
  [['10:00','Açılış ve uluslararası YEG karşılaması','Ana sahne'],['11:30','Uluslararası stant alanı açılışı','Uluslararası alan'],['14:00','Panel: Coğrafi işaretli ürünlerde Türkiye–AB işbirliği','Panel salonu'],['17:00','Ortak sofra: yöresel lezzetler','Tadım alanı']],
  [['10:00','Kardeş YEG tanışma oturumları (eşleştirmeli)','Görüşme alanı'],['13:30','Atölye: Ortak proje nasıl kurulur?','Panel salonu'],['15:30','Üretici pazarı ve B2B görüşmeler','Stant alanları'],['19:00','Halk oyunları ve müzik','Ana sahne']],
  [['10:00','Gençlik buluşması: Erasmus+ ve Avrupa Dayanışma Programı','Panel salonu'],['12:00','Kardeşlik protokollerinin imzası','Ana sahne'],['14:00','Kapanış ve 2028 ev sahibi duyurusu','Ana sahne']]
];
function programHTML(g){ return PROGRAM[g].map(([s,a,y],i)=>`<div class="satir rise" style="--i:${i};align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--krem2)"><b style="width:52px;flex:none;color:var(--lacivert)">${s}</b><div><div style="font-weight:600">${esc(a)}</div><div class="soluk k12">${esc(y)}</div></div></div>`).join(''); }
function festIlerle(id){
  const f=festDurum(), y=yeg(id), el=$('#kk-'+id);
  const ilerle = () => { f[id]=Math.min(3,f[id]+1); let yeniStant=null;
    if(f[id]===3){ const dolu=new Set(Object.values(f.stant)); for(let i=0;i<STANT_INT;i++) if(!dolu.has(i)){ f.stant[id]=i; yeniStant=id; break; } }
    kaydet(); $('#kanban').innerHTML=kanbanHTML(); $$('#fKpi .s').forEach((e,i)=>e.textContent=Object.keys(f).filter(k=>k!=='stant'&&f[k]===i).length); const n=$('#kk-'+id); if(n) n.classList.add('gel');
    if(yeniStant){ stantGoster(id); }
    const msg=['',`Davet <b>${esc(y.ad)}</b>'e gönderildi`,`<b>${esc(y.ad)}</b> katılımını onayladı`,`<b>${esc(y.ad)}</b> stant U-${(f.stant[id]??0)+1}'e yerleştirildi`][f[id]];
    toast(msg, ['','gonder','tik','bina'][f[id]]);
    if(f[id]===2){ AKIS.unshift({tip:'fest',metin:`<b data-y="${id}">${esc(y.ad)}</b> YEGFEST davetini kabul etti`,z:Date.now()}); bildirimEkle(`<b>${esc(y.ad)}</b> YEGFEST katılımını onayladı`,'festival','festival'); }
  };
  if(el){ el.style.transition='all .3s var(--ease)'; el.style.transform='translateX(40px)'; el.style.opacity='0'; setTimeout(ilerle,280); } else ilerle();
}
function festivaleDavet(id){ const f=festDurum(); if(trMi(yeg(id))){ toast('Türkiye YEG\'leri ilçe stantlarıyla katılır; davet panosu uluslararası YEG\'ler içindir','festival'); return; }
  if(!(id in f)) f[id]=0; kaydet(); git('festival'); setTimeout(()=>{ const el=$('#kk-'+id); el?.scrollIntoView({behavior:'smooth',block:'center'}); el?.classList.add('gel'); },500); }
function davetMektubu(id){
  const y=yeg(id), b=ben();
  const metin = `Sayın ${y.kisi[0]},\n${y.ad}\n\n${b.ad} olarak, kardeş YEG ağımız aracılığıyla sizi Ankara'da düzenlenecek YEGFEST · Türkiye–AB Yerel Ürün Festivali'ne davet etmekten mutluluk duyarız.\n\nFestivalde uluslararası YEG alanında size bir stant ayrılacak; ${y.urun.slice(0,2).join(' ve ')} ürünlerinizi tanıtma, Türk YEG'leriyle tanışma oturumlarına katılma ve ortak proje atölyelerinde yer alma imkânı bulacaksınız.\n\nUlaşım ve konaklama giderleri katılımcı YEG'in kendi bütçesinden; stant, ortak program ve yerel koordinasyon ev sahibi tarafından karşılanacaktır.\n\nSaygılarımızla,\n${b.kisi[0]}\n${b.kisi[1]}, ${b.ad}`;
  const en = `Dear ${y.kisi[0]},\n\nOn behalf of ${b.ad}, we are pleased to invite ${y.ad} to YEGFEST – Türkiye–EU Local Products Festival in Ankara. A stand in the international LAG area, matchmaking sessions and joint project workshops await you. Travel and accommodation are covered by participating LAGs; the stand and programme are provided by the host.\n\nKind regards,\n${b.kisi[0]}`;
  const m = modal({baslik:'Davet mektubu', genis:true, govde:`<div class="sekmeler" id="mSek"><button class="on" data-d="tr">Türkçe</button><button data-d="en">English</button></div><div class="mektup" id="mMetin">${esc(metin)}</div><p class="soluk k12" style="margin:10px 0 0">Vize başvurularında kullanılabilecek resmî davet yazısı festival sekretaryasınca ayrıca düzenlenir.</p>`,
    eylem:`<button class="btn cizgi" id="mKop">${ik('belge',16)} Kopyala</button><button class="btn altin" id="mGon">${ik('zarf',16)} ${esc(y.ad)}'e gönder</button>`});
  let d='tr'; $$('#mSek button',m.el).forEach(b=>b.onclick=()=>{ d=b.dataset.d; $$('#mSek button',m.el).forEach(x=>x.classList.toggle('on',x===b)); $('#mMetin',m.el).textContent = d==='tr'?metin:en; });
  $('#mKop',m.el).onclick=()=>{ navigator.clipboard?.writeText(d==='tr'?metin:en).catch(()=>{}); toast('Mektup panoya kopyalandı','belge'); };
  $('#mGon',m.el).onclick=()=>{ m.kapat(); const f=festDurum(); if(f[id]===0) festIlerle(id); else toast(`Mektup <b>${esc(y.ad)}</b>'e iletildi`,'zarf'); };
}
function stantListeHTML(){
  const f = festDurum(), es = Object.fromEntries(Object.entries(f.stant).map(([id,i])=>[i,id]));
  return Array.from({length:STANT_INT},(_,i)=>{ const id=es[i], y=id&&yeg(id);
    return `<button class="stant-s ${y?'dolu':''}" data-i="${i}"><span class="no">U-${i+1}</span>${y?`${avS(y)}<span class="ad">${esc(y.ad)}</span>`:'<span class="ad soluk">Boş</span>'}</button>`; }).join('');
}
function stantGoster(id){
  const f = festDurum(), i = f.stant[id]; $('#stantListe') && ($('#stantListe').innerHTML = stantListeHTML(), stantListeBagla());
  if (aktifSalon?.kok.isConnected) { aktifSalon.stantAta(i, salonYeg(yeg(id))); $('#salon3d')?.scrollIntoView({behavior:'smooth', block:'center'}); }
}
function stantListeBagla(){ $$('#stantListe .stant-s').forEach(b => b.onclick = () => { aktifSalon?.odakla(+b.dataset.i); $('#salon3d')?.scrollIntoView({behavior:'smooth', block:'center'}); stantPop({i:+b.dataset.i, yeg: (()=>{ const e=Object.entries(festDurum().stant).find(([,v])=>v===+b.dataset.i); return e?{id:e[0]}:null; })()}); }); }
function stantPop(st){
  const pop = $('#salonPop'); if (!pop) return;
  const f = festDurum();
  if (st.yeg) {
    const y = yeg(st.yeg.id);
    pop.innerHTML = `<div class="satir" style="gap:12px">${av(y)}<div style="min-width:0"><b>${esc(y.ad)}</b><div class="soluk k12">${esc(y.yer)} · Stant U-${st.i+1}</div></div><button class="kapat" onclick="$('#salonPop').classList.remove('on')">${ik('x',16)}</button></div>
      <div style="margin:10px 0">${y.urun.map(u=>`<span class="cip u">${URUN_EMOJI[u]||''} ${esc(u)}</span>`).join('')}</div>
      <div class="satir"><button class="btn altin k" onclick="git('yeg/${y.id}')">Profili aç</button><button class="btn cizgi k" onclick="mesajBaslat('${y.id}')">${ik('mesaj',14)} Mesaj</button></div>`;
  } else {
    const aday = Object.keys(f).filter(k=>k!=='stant' && f[k]===2);
    pop.innerHTML = `<div class="satir arasi"><b>Stant U-${st.i+1} · boş</b><button class="kapat" onclick="$('#salonPop').classList.remove('on')">${ik('x',16)}</button></div>
      <p class="soluk k12" style="margin:6px 0 10px">Katılımını onaylamış bir YEG'i bu stanta yerleştirin.</p>
      ${aday.length ? aday.map(id=>{const y=yeg(id);return `<button class="stant-s" style="width:100%;margin-bottom:6px" onclick="stantAtaManuel('${id}',${st.i})">${avS(y)}<span class="ad">${esc(y.ad)}</span><span class="no" style="margin-left:auto">Yerleştir →</span></button>`;}).join('') : '<div class="soluk k12">Onay bekleyen YEG yok. Davet panosundan onay simüle edin.</div>'}`;
  }
  pop.classList.add('on');
}
function stantAtaManuel(id, i){
  const f = festDurum(); f[id] = 3; f.stant[id] = i; kaydet();
  $('#kanban').innerHTML = kanbanHTML(); $$('#fKpi .s').forEach((e,k)=>e.textContent=Object.keys(f).filter(x=>x!=='stant'&&f[x]===k).length);
  $('#salonPop').classList.remove('on'); stantGoster(id);
  toast(`<b>${esc(yeg(id).ad)}</b> stant U-${i+1}'e yerleştirildi`, 'bina');
}
SAYFALAR.festival.sonra = () => {
  stantListeBagla();
  salonKur($('#salon3d'), { onStant: st => stantPop(st) }).then(s => {
    if (!s) return; if (!YUMUSAK) s.genel();
    $$('#salonGor button').forEach(b => b.onclick = () => { $$('#salonGor button').forEach(x=>x.classList.toggle('on',x===b));
      const g = b.dataset.g; if (g==='genel') s.genel(); else if (g==='int') { s.turDur(); s.kamHedef = { poz: new s.kam.position.constructor(4, 13, 10), bak: new s.kam.position.constructor(11.5, 0.5, -7.5) }; } else s.tur(); });
  });
  const g=$('#fIzgara'); if(matchMedia('(max-width:1000px)').matches) g.style.gridTemplateColumns='1fr';
  $('#fEkleBtn').onclick = () => { const v=$('#fEkle').value; if(!v) return; festDurum()[v]=0; kaydet(); yenile(true); setTimeout(()=>$('#kk-'+v)?.classList.add('gel'),30); toast(`<b>${esc(yeg(v).ad)}</b> davet panosuna eklendi`,'arti'); };
  $$('#fGun button').forEach(b=>b.onclick=()=>{ $$('#fGun button').forEach(x=>x.classList.toggle('on',x===b)); $('#fProg').innerHTML=programHTML(+b.dataset.g); });
};

