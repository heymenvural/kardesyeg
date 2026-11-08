/* ---------- Mesajlar ---------- */
let acikSohbet = null; const orijinal = new Set();
function mesajBaslat(id){ if(!D.mesaj[id]) D.mesaj[id]=[]; kaydet(); acikSohbet=id; git('mesajlar'); }
SAYFALAR.mesajlar = () => `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('mesaj',14)} Mesajlar</div><h1>YEG'ler arası <em>yazışma</em></h1><p class="aciklama">Her YEG kendi dilinde yazar; mesajlar otomatik olarak çevrilir.</p></div></div>
    <div class="kart msj"><div class="liste" id="sListe"></div><div class="pencere" id="sPen"></div></div>
  </div>`;
function sohbetListe(){
  const ids = Object.keys(D.mesaj).filter(id=>id!==D.aktif && yeg(id));
  if(!acikSohbet || !ids.includes(acikSohbet)) acikSohbet = ids[0]||null;
  $('#sListe').innerHTML = `<div class="lb"><div style="position:relative"><span style="position:absolute;left:10px;top:10px;color:var(--soluk)">${ik('ara',16)}</span><input type="search" placeholder="Sohbet ara" style="padding-left:34px;padding-top:8px;padding-bottom:8px" id="sAra"></div></div>` +
    ids.map(id=>{ const y=yeg(id), l=D.mesaj[id], s=l[l.length-1], n=D.okunmadi[id];
      return `<div class="konusma ${id===acikSohbet?'on':''}" data-id="${id}">${av(y)}<div class="k"><b>${esc(y.ad)}</b><span>${s?(s.k==='ben'?'Siz: ':'')+esc(s.tr||s.t):'Yeni sohbet'}</span></div>${n?`<span class="okunmadi">${n}</span>`:''}</div>`; }).join('');
  $$('#sListe .konusma').forEach(k=>k.onclick=()=>{ acikSohbet=k.dataset.id; delete D.okunmadi[acikSohbet]; kaydet(); sohbetListe(); sohbetCiz(); navCiz(); });
  $('#sAra').oninput = e => { const q=e.target.value.toLocaleLowerCase('tr'); $$('#sListe .konusma').forEach(k=>k.style.display=yeg(k.dataset.id).ad.toLocaleLowerCase('tr').includes(q)?'':'none'); };
}
function balonHTML(m, y){
  const benim = m.k==='ben', dil = y.dk;
  const orj = orijinal.has(m), gosterilen = (!benim && m.tr && !orj) ? m.tr : m.t;
  return `<div class="balon-s ${benim?'ben':''}">${benim?'':avS(y)}<div class="balon">${esc(gosterilen).replace(/\n/g,'<br>')}
    <div class="alt-m"><span>${esc(m.z)}</span>${!benim&&m.tr?`<span>· ${DIL_AD[dil]||'İngilizce'}den çevrildi</span><button class="ceviri" data-i>${orj?'Çeviriyi göster':'Orijinali göster'}</button>`:''}${benim&&dil!=='tr'?`<span>· ${DIL_AD[dil]||'İngilizce'}ye çevrilerek iletildi</span>`:''}</div></div></div>`;
}
function sohbetCiz(){
  const pen=$('#sPen'); if(!acikSohbet){ pen.innerHTML='<div class="bos" style="margin:auto">Bir YEG profilinden “Mesaj” ile sohbet başlatın.</div>'; return; }
  const y=yeg(acikSohbet), l=D.mesaj[acikSohbet];
  pen.innerHTML = `<div class="pb">${av(y)}<div style="flex:1;min-width:0"><b style="cursor:pointer" onclick="git('yeg/${y.id}')">${esc(y.ad)}</b><div class="soluk k12">${esc(y.kisi.join(' · '))}</div></div>${y.dk!=='tr'?`<span class="cip o" style="margin:0">${ik('dil',13)} Otomatik çeviri</span>`:''}</div>
    <div class="govde" id="sGov">${l.length?l.map(m=>balonHTML(m,y)).join(''):'<div class="soluk" style="margin:auto;text-align:center">Sohbeti başlatın. Mesajınız karşı tarafın diline çevrilerek iletilir.</div>'}</div>
    <div class="yazma"><textarea id="sGir" placeholder="Mesajınızı Türkçe yazın…" rows="1"></textarea><button class="btn ana" id="sGon" aria-label="Gönder">${ik('gonder',18)}</button></div>`;
  const g=$('#sGov'); g.scrollTop=g.scrollHeight;
  $$('.ceviri',g).forEach((b,i)=>b.onclick=()=>{ const msjlar=l.filter(()=>true); const balonlar=$$('.balon-s',g); const idx=balonlar.indexOf(b.closest('.balon-s')); const m=l[idx]; orijinal.has(m)?orijinal.delete(m):orijinal.add(m); sohbetCiz(); });
  const gonder = () => { const t=$('#sGir').value.trim(); if(!t) return; const id=acikSohbet, z='Bugün '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    D.mesaj[id].push({k:'ben',t,z}); kaydet(); sohbetCiz(); sohbetListe();
    setTimeout(()=>{ if(acikSohbet!==id||!$('#sGov')) return; $('#sGov').insertAdjacentHTML('beforeend',`<div class="balon-s" id="yaziyor">${avS(yeg(id))}<div class="yaziyor"><i></i><i></i><i></i></div></div>`); $('#sGov').scrollTop=1e6; }, 700);
    setTimeout(()=>{ const c=CEVAP[yeg(id).dk]||CEVAP.en; D.mesaj[id].push({k:id,t:c[0],tr:c[1]||undefined,z:'Bugün '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}); kaydet();
      if(location.hash==='#mesajlar' && acikSohbet===id){ sohbetCiz(); sohbetListe(); } else { D.okunmadi[id]=(D.okunmadi[id]||0)+1; kaydet(); navCiz(); toast(`<b>${esc(yeg(id).ad)}</b> yanıt verdi`,'mesaj'); } }, 2600);
  };
  $('#sGon').onclick = gonder;
  $('#sGir').onkeydown = e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); gonder(); } };
  $('#sGir').oninput = e => { e.target.style.height='auto'; e.target.style.height=Math.min(140,e.target.scrollHeight)+'px'; };
}
SAYFALAR.mesajlar.sonra = () => { if(acikSohbet) delete D.okunmadi[acikSohbet]; kaydet(); sohbetListe(); sohbetCiz(); navCiz(); };

