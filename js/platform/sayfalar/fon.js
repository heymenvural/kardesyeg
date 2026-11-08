/* ---------- Fon rehberi ---------- */
const FONLAR = [
  {ad:'LEADER ulusötesi işbirliği',ik:'bag',r:'#1F3A5F',bg:'#E6EDF5',kim:'YEG\'ler arası ortak projeler',ne:'Ortak ürün, rota, kalite standardı, deneyim aktarımı',not:'IPARD III LEADER tedbiri kapsamındaki işbirliği imkânları için TKDK duyuruları izlenmelidir.'},
  {ad:'Erasmus+ · Gençlik değişimi',ik:'genc',r:'#2E78C7',bg:'#E6EFFA',kim:'Gençlik grupları ve onları ağırlayan kuruluşlar',ne:'Genç çiftçi ve genç üretici buluşmaları',not:'Başvurular Türkiye Ulusal Ajansı üzerinden yapılır; çağrı takvimini ajanstan kontrol edin.'},
  {ad:'Erasmus+ · Küçük ölçekli ortaklık',ik:'ekip',r:'#5E8C4A',bg:'#E8F0E3',kim:'Deneyimi sınırlı kuruluşlar dahil küçük ortaklıklar',ne:'Eğitim içerikleri, kadın üretici akademisi, iyi uygulama paylaşımı',not:'Ortak sayısı ve süre çağrı rehberine bağlıdır.'},
  {ad:'Avrupa Dayanışma Programı',ik:'kalp',r:'#C2553F',bg:'#FDECE7',kim:'Gönüllü ağırlayan kuruluşlar ve genç grupları',ne:'Gönüllülük, belgesel ve yerel dayanışma projeleri',not:'Kuruluşların kalite etiketi gereklilikleri olabilir.'},
  {ad:'Horizon Europe · Küme 6',ik:'bilim',r:'#7A3D8C',bg:'#F5EAF8',kim:'Üniversite, araştırma kurumu ve uygulayıcı ortaklıkları',ne:'Tarım, gıda, biyoçeşitlilik ve kırsal alan araştırmaları',not:'YEG\'ler genellikle uygulayıcı ve yaygınlaştırma ortağı olarak yer alır.'},
  {ad:'Ortak finansman (kendi bütçeler)',ik:'para',r:'#B8900F',bg:'#FBF3D9',kim:'Tüm YEG\'ler',ne:'Festival katılımı, karşılıklı ziyaretler, küçük ölçekli etkinlikler',not:'Her katılımcı kendi ulaşım ve konaklamasını, ev sahibi alan ve programı karşılar.'}
];
SAYFALAR.fon = () => `
  <div class="sayfa">
    <div class="kafa"><div><div class="ust-etiket">${ik('para',14)} Ortak finansman</div><h1>Ortaklığınızı <em>nasıl finanse edersiniz?</em></h1><p class="aciklama">YEG'ler arası iş birliğinde kullanılabilecek kaynaklar ve platformdaki örnekleri. Uygunluk ve takvim için ilgili kurumun güncel duyurusu esas alınır.</p></div></div>
    <div class="grid g3" style="margin-bottom:16px">${FONLAR.map((f,i)=>{const n=projeler().filter(p=>p.program===f.ad).length; return `<div class="kart fon rise" style="--i:${i}"><div class="ust-f"><div class="ik" style="background:${f.bg};color:${f.r}">${ik(f.ik,20)}</div><div><h3>${esc(f.ad)}</h3><span class="soluk k12">Platformda ${n} proje</span></div></div>
      <dl><dt>Kimler</dt><dd>${esc(f.kim)}</dd><dt>YEG için</dt><dd>${esc(f.ne)}</dd></dl><div class="soluk k12" style="border-top:1px solid var(--krem2);padding-top:8px">${esc(f.not)}</div>
      ${n?`<a class="k12" href="#projeler" onclick="projeFiltre={sekme:'tum',program:'${esc(f.ad)}',q:''}" style="font-weight:700">Projeleri gör ${ik('ok',13)}</a>`:''}</div>`;}).join('')}</div>
    <div class="grid" style="grid-template-columns:minmax(0,340px) minmax(0,1fr)" id="fnIzgara">
      <div class="kart pad rise" style="--i:3"><h2 style="margin-bottom:14px">Festival maliyet hesaplayıcı</h2>
        ${[['fY','Katılımcı YEG sayısı',10,1],['fK','YEG başına kişi',3,1],['fM','Kişi başı ulaşım + konaklama (€)',650,50],['fE','Ev sahibi ortak gider (€)',15000,500]].map(([id,l,v,s])=>`<label class="alan" style="margin-bottom:12px">${l}<input type="number" id="${id}" value="${v}" min="0" step="${s}"></label>`).join('')}
        <label class="satir k12" style="cursor:pointer;font-weight:600"><input type="checkbox" id="fG"> Gençlik bileşeni (Erasmus+ / Dayanışma) ayrı başvuru olarak eklensin</label></div>
      <div class="kart pad rise" style="--i:4"><h2 style="margin-bottom:14px">Kim neyi karşılar?</h2><div class="grid g3" id="fnSonuc" style="margin-bottom:18px"></div><div class="bar" id="fnBar"></div><div class="satir sar k12 soluk" style="margin-top:10px;gap:16px" id="fnLej"></div><div class="uyari" style="margin-top:16px" id="fnNot"></div></div>
    </div>
  </div>`;
SAYFALAR.fon.sonra = () => {
  const g=$('#fnIzgara'); if(matchMedia('(max-width:900px)').matches) g.style.gridTemplateColumns='1fr';
  const h = () => { const n=+$('#fY').value||0,k=+$('#fK').value||0,m=+$('#fM').value||0,e=+$('#fE').value||0,gc=$('#fG').checked; const kat=n*k*m, top=kat+e, pk=top?kat/top*100:0;
    $('#fnSonuc').innerHTML=[[para(kat),'Katılımcıların kendi bütçeleri'],[para(n?kat/n:0),'YEG başına ortalama'],[para(e),'Ev sahibi']].map(([s,l])=>`<div><div class="kpi" style="padding:0"><div class="s" style="font-size:22px">${s}</div><div class="l">${l}</div></div></div>`).join('');
    $('#fnBar').innerHTML=`<i data-w="${pk}" style="background:var(--mavi);width:${pk}%"></i><i style="background:var(--altin);width:${100-pk}%"></i>`;
    $('#fnLej').innerHTML=`<span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--mavi);margin-right:6px"></i>Katılımcılar %${Math.round(pk)}</span><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--altin);margin-right:6px"></i>Ev sahibi %${Math.round(100-pk)}</span>${gc?'<span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--yesil);margin-right:6px"></i>Gençlik bileşeni: ayrı başvuru</span>':''}`;
    $('#fnNot').innerHTML = gc?'<b>Gençlik bileşeni:</b> Genç üretici buluşması veya gönüllülük faaliyeti, Erasmus+ ya da Avrupa Dayanışma Programı kapsamında ayrı bir proje olarak başvuruya konu edilebilir. Destek tutarı başvuru sonucuna bağlı olduğundan hesaba katılmamıştır.':'<b>Not:</b> Hesaplama örnek değerlerle dağılım mantığını gösterir. Fon desteği başvuruya bağlı olduğundan tabloya eklenmez.'; };
  ['fY','fK','fM','fE','fG'].forEach(i=>$('#'+i).addEventListener('input',h)); h();
};

