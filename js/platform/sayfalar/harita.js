/* ---------- Harita ---------- */
SAYFALAR.harita = () => `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('harita',14)} Ağ haritası</div><h1>Avrupa ve Türkiye'de <em>${Y.length} YEG</em>, ${tumBaglar().length} kardeş bağı</h1></div>
      <div class="segment acik" id="hMod"><button data-m="3d" class="${haritaMod==='3d'?'on':''}">${ik('dunya',15)} 3D küre</button><button data-m="2d" class="${haritaMod==='2d'?'on':''}">${ik('harita',15)} 2D harita</button></div></div>
    <div class="harita-kap ${haritaMod==='3d'?'kure-kap':''}" id="tamHarita" style="height:calc(100vh - 220px);min-height:520px">
    </div>
  </div>`;
let haritaMod = '3d';
SAYFALAR.harita.sonra = () => {
  const kap = $('#tamHarita');
  $$('#hMod button').forEach(b => b.onclick = () => { haritaMod = b.dataset.m; yenile(true); });
  let H;
  if (haritaMod === '3d') {
    H = { filtre: f => KURE?.vurgula(Y.filter(f).map(y=>y.id).length===Y.length ? null : Y.filter(f).map(y=>y.id)), katman: (t,a) => KURE?.katman(t,a), odak: id => KURE?.odak(id, 2.1) };
    kureKur(kap, { onSec: id => detay(id) }).then(k => k && !YUMUSAK && k.ucus(44, 16, 3.3));
  } else { aktifHarita = H = new Harita(kap, {vb:[0,40,1000,620], proje:true, onSec:id=>detay(id)}); }
  kap.insertAdjacentHTML('beforeend', `
    <div class="harita-ust">
      <div class="cam" style="padding:12px 14px;width:260px;max-width:calc(100% - 20px)">
        <div class="satir" style="font-weight:700;margin-bottom:10px">${ik('katman',16)} Katmanlar</div>
        <label class="satir k12" style="margin-bottom:6px;cursor:pointer"><input type="checkbox" id="kK" checked> Kardeş bağları</label>
        <label class="satir k12" style="margin-bottom:10px;cursor:pointer"><input type="checkbox" id="kP" checked> Proje ortaklıkları</label>
        <select class="f" id="hU" style="background:#1B3152;border-color:#2F4E79;color:#fff;padding:8px 10px;margin-bottom:8px"><option value="">Tüm ürünler</option>${TUM_URUN.map(u=>`<option>${esc(u)}</option>`).join('')}</select>
        <select class="f" id="hG" style="background:#1B3152;border-color:#2F4E79;color:#fff;padding:8px 10px"><option value="">Türkiye + Avrupa</option><option value="tr">Yalnızca Türkiye</option><option value="ab">Yalnızca Avrupa</option></select>
      </div>
      <div class="cam" id="hDetay" style="width:300px;max-width:calc(100% - 20px);padding:0;overflow:hidden;transform:translateX(30px);opacity:0;transition:all .35s var(--ease);pointer-events:none"></div>
    </div>`);
  const filtre = () => { const u=$('#hU').value, g=$('#hG').value; H.filtre(y => (!u||y.urun.includes(u)) && (!g || (g==='tr')===trMi(y))); };
  $('#kK').onchange = e => H.katman('kardes', e.target.checked);
  $('#kP').onchange = e => H.katman('proje', e.target.checked);
  $('#hU').onchange = filtre; $('#hG').onchange = filtre;
  function detay(id){
    const y = yeg(id), d = $('#hDetay'), k = kardesleri(id);
    haritaMod==='3d' ? H.odak(id) : H.odak(id, 520);
    d.innerHTML = `<div style="height:56px;background:linear-gradient(120deg,${renk(y)},#14263F)"></div>
      <div style="padding:0 16px 16px;margin-top:-22px">${av(y)}<div style="margin-top:10px;font-weight:800;font-size:15px">${esc(y.ad)}</div><div style="font-size:12.5px;color:#9FB2CC">${esc(y.yer)}</div>
      <div style="margin:10px 0;font-size:12.5px">${y.urun.map(u=>(URUN_EMOJI[u]||'')+' '+esc(u)).join('<br>')}</div>
      <div style="font-size:12px;color:#9FB2CC;margin-bottom:12px">${k.length} kardeş: ${k.map(x=>esc(yeg(x).ad)).join(', ')||'—'}</div>
      <div class="satir"><button class="btn altin k" onclick="git('yeg/${id}')">Profili aç</button>${id!==D.aktif&&!kardesMi(id)?`<button class="btn k" style="background:#1B3152;color:#fff" onclick="teklifModal('${id}')">Kardeş teklifi</button>`:''}</div></div>`;
    d.style.cssText += ';transform:none;opacity:1;pointer-events:auto';
  }
};

