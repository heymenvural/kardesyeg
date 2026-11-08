/* =====================================================================
   DURUM
===================================================================== */
const ANAHTAR = 'yegKardes.v2';
const ilkDurum = () => ({aktif:'menderes',bagEk:[],bagSil:[],teklif:{},gelen:{},red:{},projeEk:[],basvuru:{},yorumEk:{},fest:null,mesaj:JSON.parse(JSON.stringify(MESAJ0)),okunmadi:{higueras:1,langhe:1},bildirim:null,begen:{}});
let D;
try { D = Object.assign(ilkDurum(), JSON.parse(localStorage.getItem(ANAHTAR)) || {}); } catch(e) { D = ilkDurum(); }
const kaydet = () => { try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch(e){} };
const ben = () => yeg(D.aktif);
const anahtarBag = (a,b) => [a,b].sort().join('|');
function tumBaglar(){
  const sil = new Set(D.bagSil);
  const m = new Map();
  [...BAGLAR, ...D.bagEk].forEach(([a,b]) => { const k = anahtarBag(a,b); if (!sil.has(k)) m.set(k,[a,b]); });
  return [...m.values()];
}
const kardesleri = id => tumBaglar().filter(b => b.includes(id)).map(b => b[0]===id?b[1]:b[0]);
const kardesMi = id => kardesleri(D.aktif).includes(id);
const projeler = () => [...D.projeEk, ...PR];
const proje = id => projeler().find(p => p.id === id);
function projeOrtaklari(p){ const o=[...p.ortak]; Object.entries(D.basvuru).forEach(([k,v])=>{ const [pid,yid]=k.split('|'); if(pid===p.id && v==='ortak' && !o.includes(yid) && yid!==p.lider) o.push(yid); }); return o; }
const yegProjeleri = id => projeler().filter(p => p.lider===id || projeOrtaklari(p).includes(id));

