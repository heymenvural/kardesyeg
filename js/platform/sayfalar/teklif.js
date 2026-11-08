/* ---------- Kardeşlik teklifi ---------- */
function teklifModal(id){
  const y = yeg(id), b = ben(), s = puan(b,y);
  const m = modal({baslik:'Kardeş YEG teklifi', govde:`
    <div class="satir" style="gap:14px;margin-bottom:16px">${av(b)}<div style="flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--altin) 0 6px,transparent 6px 12px)"></div>${halka(s.p,52,5)}<div style="flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--altin) 0 6px,transparent 6px 12px)"></div>${av(y)}</div>
    <label class="alan">Mesajınız <small>${y.dk!=='tr'?`${DIL_AD[y.dk]||'İngilizce'}ye otomatik çevrilerek iletilir`:''}</small>
      <textarea id="tMetin">Merhaba ${y.kisi[0].split(' ')[0]},\n\n${esc(b.ad)} olarak ${s.ou.length?s.ou.join(', ')+' üretimi':'kırsal kalkınma'} ve ${s.oo[0]||'ortak önceliklerimiz'} konusunda sizinle kardeş YEG olmak istiyoruz. Deneyim paylaşımı, karşılıklı ziyaret ve ortak proje fikirlerini konuşmak için bir tanışma görüşmesi öneriyoruz.\n\nSevgiyle,\n${b.kisi[0]}</textarea></label>
    <div class="satir sar" style="margin-top:12px">${['Deneyim paylaşımı','Karşılıklı ziyaret','Ortak proje','Festival'].map((x,i)=>`<label class="cip" style="cursor:pointer"><input type="checkbox" ${i<3?'checked':''} style="margin:0"> ${x}</label>`).join('')}</div>`,
    eylem:`<button class="btn cizgi" data-kapat>Vazgeç</button><button class="btn altin" id="tGonder">${ik('gonder',16)} Teklifi gönder</button>`});
  $('#tGonder', m.el).onclick = () => { m.kapat(); teklifGonder(id); };
}
function teklifGonder(id){
  const k = anahtarBag(D.aktif,id), y = yeg(id); D.teklif[k]='bekliyor'; kaydet(); yenile(true);
  toast(`Kardeşlik teklifi <b>${esc(y.ad)}</b>'e gönderildi`, 'gonder');
  setTimeout(()=>{ toast(`<b>${esc(y.ad)}</b> teklifinizi görüntüledi`, 'zarf'); }, 1600);
  setTimeout(()=>{ kardesKabul(id); }, 3600);
}
function kardesKabul(id){
  const k = anahtarBag(D.aktif,id), y = yeg(id); delete D.teklif[k];
  D.bagSil = D.bagSil.filter(x=>x!==k); if(!kardesMi(id)) D.bagEk.push([D.aktif,id]); kaydet();
  konfeti(); toast(`🎉 <b>${esc(y.ad)}</b> ile artık kardeş YEG'siniz!`, 'bag');
  bildirimEkle(`<b>${esc(y.ad)}</b> kardeşlik teklifinizi kabul etti`, 'yeg/'+id, 'bag');
  AKIS.unshift({tip:'kardes', metin:`<b data-y="${D.aktif}">${esc(ben().ad)}</b> ile <b data-y="${id}">${esc(y.ad)}</b> kardeş YEG oldu`, z:Date.now()});
  if (aktifHarita && document.body.contains(aktifHarita.svg)) { aktifHarita.bagCiz(D.aktif,id); aktifHarita.ping(id); }
  if (aktifKure?.kok.isConnected) {
    const k = aktifKure; k.yayKaldir([D.aktif,id].sort().join('|')+'|aday');
    k.yayEkle(D.aktif, id, 'kardes', { anim:true, sure:2 }); k.benimYaylar(); k.ping(id, 0xF2C14E); k.ping(D.aktif, 0xF2C14E);
    const a = ben(), b = yeg(id); k.ucus((a.lat+b.lat)/2 - 3, (a.lon+b.lon)/2, 3.0);
  }
  yenile(true);
}

