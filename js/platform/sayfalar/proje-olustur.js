/* ---------- Proje oluştur ---------- */
let sihir = null;
const sihirSifir = () => ({adim:0, ad:'', ozet:'', etiket:[], program:PROGRAMLAR[0], butce:120000, sure:18, aranan:2, aranProfil:'', ulke:[], urun:[]});
SAYFALAR['proje-olustur'] = () => {
  if(!sihir) sihir = sihirSifir();
  const ad = ['Temel bilgiler','Fon ve bütçe','Ortak arayışı','Önizle ve yayınla'];
  return `<div class="sayfa">
    <a href="#projeler" class="satir k12" style="margin-bottom:14px;font-weight:700">${ik('geri',15)} Projeler</a>
    <div class="kafa"><div><div class="ust-etiket">${ik('arti',14)} Yeni proje</div><h1>Proje <em>oluştur</em></h1><p class="aciklama">Projenizi tanımlayın, fon kaynağını seçin ve ağdaki YEG'lere ortaklık çağrısı yapın. Yayınladığınızda uygun YEG'lere bildirim gider.</p></div></div>
    <div class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:start" id="sIzgara">
      <div class="kart pad">
        <div class="adimlar">${ad.map((a,i)=>`<div class="a ${i<sihir.adim?'tamam':i===sihir.adim?'on':''}"><div class="n">${i<sihir.adim?ik('tik',16):i+1}</div><span>${a}</span></div>`).join('')}</div>
        <div id="sGovde" class="sihir-govde">${sihirAdim()}</div>
        <div class="satir arasi" style="margin-top:22px;padding-top:16px;border-top:1px solid var(--krem2)">
          <button class="btn cizgi" id="sGeri" ${sihir.adim===0?'style="visibility:hidden"':''}>${ik('geri',16)} Geri</button>
          ${sihir.adim<3?`<button class="btn ana" id="sIleri">Devam ${ik('ok',16)}</button>`:`<button class="btn altin" id="sYayinla">${ik('gonder',16)} Projeyi yayınla</button>`}
        </div>
      </div>
      <div style="position:sticky;top:86px"><div class="soluk k12" style="margin-bottom:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Canlı önizleme</div><div id="sOnizle">${projeKart(sihirProje())}</div>
        <div class="kart pad" style="margin-top:14px"><h3 style="margin-bottom:8px">${ik('parilti',15)} Olası ortaklar</h3><div id="sOneri" class="soluk k12"></div></div></div>
    </div></div>`;
};
function sihirProje(){ const s=sihir; return {id:'onizle',ad:s.ad||'Proje adınız',lider:D.aktif,ortak:[],aranan:s.aranan,aranProfil:s.aranProfil,program:s.program,butce:+s.butce||0,sure:+s.sure,durum:'ortak',son:'Yayından sonra 60 gün',tarih:'şimdi',etiket:s.etiket.length?s.etiket:['etiket'],ozet:s.ozet||'Projenizin kısa özeti burada görünecek.',hedef:[],ip:[],dag:[],yorum:[]}; }
function sihirAdim(){
  const s = sihir;
  if (s.adim===0) return `
    <label class="alan" style="margin-bottom:14px">Proje adı<input type="text" id="sAd" value="${esc(s.ad)}" placeholder="örn. Ege İncir Rotası" maxlength="70"></label>
    <label class="alan" style="margin-bottom:14px">Kısa özet <small>Ortakların ilk göreceği metin</small><textarea id="sOzet" placeholder="Projenin amacı, kimleri bir araya getireceği ve beklenen sonuç…" maxlength="320">${esc(s.ozet)}</textarea></label>
    <label class="alan">Konular ${sec('sEt',[...TUM_URUN.slice(0,14),'gençlik','kadın üreticiler','kırsal turizm','dijitalleşme','iklim uyumu'],s.etiket)}</label>`;
  if (s.adim===1) return `
    <label class="alan" style="margin-bottom:16px">Fon kaynağı<div class="grid g2" style="gap:8px">${PROGRAMLAR.map(p=>`<label class="kart" style="padding:12px;cursor:pointer;display:flex;gap:10px;align-items:center;${s.program===p?'border-color:var(--altin);background:#FFFBEF':''}"><input type="radio" name="sProg" value="${esc(p)}" ${s.program===p?'checked':''}><span style="font-weight:600;font-size:13px">${esc(p)}</span></label>`).join('')}</div></label>
    <div class="grid g2"><label class="alan">Toplam bütçe (€)<input type="number" id="sButce" min="0" step="5000" value="${s.butce}"></label>
    <label class="alan">Süre: <b id="sSureY">${s.sure} ay</b><input type="range" id="sSure" min="3" max="36" value="${s.sure}" style="accent-color:var(--altin)"></label></div>
    <div class="uyari" style="margin-top:14px">Uygunluk, bütçe sınırları ve çağrı takvimi fon kaynağının güncel rehberinden kontrol edilmelidir.</div>`;
  if (s.adim===2) return `
    <label class="alan" style="margin-bottom:14px">Kaç ortak arıyorsunuz?<div class="satir">${[1,2,3,4].map(n=>`<label style="cursor:pointer"><input type="radio" name="sAr" value="${n}" ${s.aranan==n?'checked':''} style="display:none"><span class="btn ${s.aranan==n?'ana':'cizgi'} k" style="pointer-events:none">${n}</span></label>`).join('')}</div></label>
    <label class="alan" style="margin-bottom:14px">Aranan ortak profili<textarea id="sArP" placeholder="örn. Kurutulmuş meyve üreten, kadın kooperatifleriyle çalışan YEG">${esc(s.aranProfil)}</textarea></label>
    <label class="alan" style="margin-bottom:14px">Tercih edilen ülkeler ${sec('sUl',ULKELER.filter(u=>u!=='Türkiye'),s.ulke)}</label>`;
  return `<div class="soluk" style="margin-bottom:12px">Yayınlamadan önce kontrol edin:</div>
    <table style="width:100%;font-size:13.5px;border-collapse:collapse">${[['Proje adı',s.ad||'—'],['Fon kaynağı',s.program],['Bütçe',para(s.butce)],['Süre',s.sure+' ay'],['Aranan ortak',s.aranan],['Aranan profil',s.aranProfil||'—'],['Ülke tercihi',s.ulke.join(', ')||'Tümü']].map(([a,v])=>`<tr><td class="soluk" style="padding:8px 0;border-bottom:1px solid var(--krem2);width:38%">${a}</td><td style="padding:8px 0;border-bottom:1px solid var(--krem2)"><b>${esc(v)}</b></td></tr>`).join('')}</table>
    <label class="satir k12" style="margin-top:14px;cursor:pointer"><input type="checkbox" checked> Uygun YEG'lere bildirim gönder</label>`;
}
function sihirOku(){
  const s=sihir;
  if(s.adim===0){ s.ad=$('#sAd').value.trim(); s.ozet=$('#sOzet').value.trim(); s.etiket=$$('input[name=sEt]:checked').map(i=>i.value); }
  if(s.adim===1){ s.program=$('input[name=sProg]:checked')?.value||s.program; s.butce=+$('#sButce').value||0; s.sure=+$('#sSure').value; }
  if(s.adim===2){ s.aranan=+($('input[name=sAr]:checked')?.value||s.aranan); s.aranProfil=$('#sArP').value.trim(); s.ulke=$$('input[name=sUl]:checked').map(i=>i.value); }
}
function sihirOneri(){
  const s=sihir, b=ben(), et=s.etiket;
  const l = Y.filter(y=>y.id!==b.id && (!s.ulke.length || s.ulke.includes(y.ulke))).map(y=>({y,p:puan(b,y,et.length?et:b.urun,et.length?et:b.onc).p})).sort((a,c)=>c.p-a.p).slice(0,4);
  const el=$('#sOneri'); if(el) el.innerHTML = l.map(o=>`<div class="satir" style="padding:6px 0">${avS(o.y)}<span style="flex:1;color:var(--koyu);font-weight:600">${esc(o.y.ad)}</span><b>%${o.p}</b></div>`).join('');
}
SAYFALAR['proje-olustur'].sonra = () => {
  const g=$('#sIzgara'); if(matchMedia('(max-width:1000px)').matches){ g.style.gridTemplateColumns='1fr'; g.lastElementChild.style.position='static'; }
  const onizle = () => { sihirOku(); $('#sOnizle').innerHTML = projeKart(sihirProje()); $('#sOnizle .rise')?.classList.remove('rise'); canlandir($('#sOnizle')); sihirOneri(); };
  $('#sGovde').addEventListener('input', e => { if(e.target.id==='sSure') $('#sSureY').textContent=e.target.value+' ay'; onizle(); });
  $('#sGovde').addEventListener('change', e => { onizle(); if(e.target.name==='sProg'||e.target.name==='sAr') yenile(true); });
  sihirOneri();
  $('#sGeri').onclick = () => { sihirOku(); sihir.adim--; yenile(true); };
  $('#sIleri') && ($('#sIleri').onclick = () => { sihirOku();
    if(sihir.adim===0 && sihir.ad.length<4){ $('#sAd').focus(); $('#sAd').style.borderColor='var(--kirmizi)'; toast('Lütfen bir proje adı girin','x'); return; }
    sihir.adim++; yenile(true); });
  $('#sYayinla') && ($('#sYayinla').onclick = () => {
    const s=sihir, id='p'+Date.now(), b=ben();
    const p = {id,ad:s.ad,lider:D.aktif,ortak:[],aranan:s.aranan,aranProfil:s.aranProfil||'Konuya ilgi duyan YEG',program:s.program,butce:s.butce,sure:s.sure,durum:'ortak',son:'60 gün içinde',tarih:'şimdi',etiket:s.etiket.length?s.etiket:b.urun.slice(0,2),
      ozet:s.ozet||'Proje özeti henüz eklenmedi.',hedef:['Ortaklarla birlikte netleştirilecek'],
      ip:[['Hazırlık ve ortak toplantısı',1,Math.max(2,Math.round(s.sure*.2))],['Uygulama',Math.round(s.sure*.2)+1,Math.round(s.sure*.8)],['Yaygınlaştırma',Math.round(s.sure*.6),s.sure]],
      dag:[['Personel',30],['Seyahat',25],['Uygulama',30],['Yönetim',15]],yorum:[]};
    D.projeEk.unshift(p); kaydet(); sihir=null; konfeti();
    toast(`“<b>${esc(p.ad)}</b>” yayınlandı · uygun YEG'lere bildirim gönderildi`,'gonder');
    AKIS.unshift({tip:'proje',metin:`<b data-y="${D.aktif}">${esc(b.ad)}</b> yeni proje açtı: <b data-p="${id}">“${esc(p.ad)}”</b>`,z:Date.now()});
    git('proje/'+id);
    const ilgi = Y.filter(y=>y.id!==b.id).map(y=>({y,p:puan(b,y,p.etiket,p.etiket).p})).sort((a,c)=>c.p-a.p).slice(0,2);
    ilgi.forEach((o,i)=>setTimeout(()=>{ bildirimEkle(`<b>${esc(o.y.ad)}</b> “${esc(p.ad)}” projenizle ilgilendi`,'proje/'+id,'yildiz'); toast(`<b>${esc(o.y.ad)}</b> projenizle ilgilendi`,'yildiz');
      (D.yorumEk[id]=D.yorumEk[id]||[]).push({y:o.y.id,m:['Merhaba! Projeniz bizim önceliklerimizle çok örtüşüyor, ortak olmak isteriz. Bir tanışma görüşmesi yapabilir miyiz?','Bölgemiz pilot uygulama için uygun. Bütçe ve iş paketlerini konuşmak isteriz.'][i],z:'şimdi'}); kaydet();
      if(location.hash==='#proje/'+id) yenile(true); }, 4000+i*3500));
  });
};

