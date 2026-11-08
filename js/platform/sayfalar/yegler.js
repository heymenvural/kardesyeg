/* ---------- YEG'ler ---------- */
function desen(h){ return `<svg viewBox="0 0 400 120" preserveAspectRatio="none" class="desen"><g fill="none" stroke="#fff" stroke-width="1.2">${Array.from({length:7},(_,i)=>`<path d="M-10 ${30+i*14} C 80 ${10+i*14+(h%30)}, 160 ${60+i*12}, 250 ${30+i*14} S 380 ${10+i*16}, 420 ${40+i*12}"/>`).join('')}</g></svg>`; }
SAYFALAR.yegler = () => `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('ekip',14)} YEG dizini</div><h1>Ağdaki <em>yerel eylem grupları</em></h1><p class="aciklama">Türkiye ve Avrupa'daki YEG'lerin profilleri, ürünleri ve aradıkları iş birlikleri.</p></div>
      <a class="btn cizgi" href="#harita">${ik('harita',16)} Haritada gör</a></div>
    <div class="satir sar" style="margin-bottom:18px">
      <div style="flex:1;min-width:220px;position:relative"><span style="position:absolute;left:12px;top:11px;color:var(--soluk)">${ik('ara',18)}</span><input type="search" id="yAra" placeholder="YEG, bölge, ürün veya öncelik…" style="padding-left:40px"></div>
      <select class="f" id="yUlke" style="width:auto"><option value="">Tüm ülkeler</option>${ULKELER.map(u=>`<option>${u}</option>`).join('')}</select>
      <select class="f" id="yUrun" style="width:auto"><option value="">Tüm ürünler</option>${TUM_URUN.map(u=>`<option>${esc(u)}</option>`).join('')}</select>
    </div>
    <div class="soluk k12" id="ySay" style="margin-bottom:12px"></div>
    <div class="grid g3" id="yListe"></div>
  </div>`;
SAYFALAR.yegler.sonra = () => {
  const ciz = () => {
    const q=$('#yAra').value.toLocaleLowerCase('tr'), u=$('#yUlke').value, ur=$('#yUrun').value;
    const l = Y.filter(y=>(!u||y.ulke===u)&&(!ur||y.urun.includes(ur))&&(!q||[y.ad,y.yer,y.ulke,...y.urun,...y.onc].join(' ').toLocaleLowerCase('tr').includes(q)));
    $('#ySay').textContent = `${l.length} YEG listeleniyor`;
    $('#yListe').innerHTML = l.length ? l.map((y,i)=>`
      <div class="kart yk rise" style="--i:${Math.min(i,12)}" onclick="git('yeg/${y.id}')">
        <div class="kapak" style="background:linear-gradient(120deg,${renk(y)},hsl(${y.h} 40% 22%))">${desen(y.h)}</div>
        <div class="govde">
          <div class="satir" style="align-items:flex-end">${av(y,'')}<div style="flex:1"></div>${y.id===D.aktif?'<span class="cip ok" style="margin:0">Siz</span>':kardesMi(y.id)?`<span class="cip ok" style="margin:0">${ik('bag',12)} Kardeş</span>`:''}</div>
          <div><b style="font-size:15.5px">${esc(y.ad)}</b><div class="soluk k12 satir" style="gap:4px">${ik('pin',13)} ${esc(y.yer)}</div></div>
          <div>${y.urun.map(x=>`<span class="cip u">${URUN_EMOJI[x]||''} ${esc(x)}</span>`).join('')}</div>
          <div class="soluk" style="font-size:13px">${esc(y.ara)}</div>
          <div class="istat"><span><b>${y.uye}</b>üye</span><span><b>${kardesleri(y.id).length}</b>kardeş</span><span><b>${yegProjeleri(y.id).length}</b>proje</span><span style="margin-left:auto">${esc(y.dil.slice(0,2).join(' · '))}</span></div>
        </div>
      </div>`).join('') : `<div class="kart bos" style="grid-column:1/-1">Aramanıza uyan YEG bulunamadı.</div>`;
  };
  ['yAra','yUlke','yUrun'].forEach(i=>$('#'+i).addEventListener('input',ciz)); ciz();
};

