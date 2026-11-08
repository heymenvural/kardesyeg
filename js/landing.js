/* =====================================================================
   YEG Kardeş · Tanıtım sayfası
   Sabit 3D küre + kaydırmayla değişen sahneler (GSAP ScrollTrigger)
===================================================================== */
import { Kure } from './3d/kure.js';
import { Salon } from './3d/salon.js';

const { Y, YM, BAGLAR, PR, URUN_EMOJI, ANKARA } = window.VERI;
const $ = (s, k = document) => k.querySelector(s), $$ = (s, k = document) => [...k.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tr = y => y.kod === 'TR';
const renk = y => tr(y) ? `hsl(${y.h} 42% 32%)` : `hsl(${y.h} 46% 40%)`;
const av = y => `<div class="av" style="background:${renk(y)}">${y.kisa}<i>${y.kod}</i></div>`;
const avS = y => `<div class="av" style="background:${renk(y)}">${y.kisa}</div>`;
const gsap = window.gsap, ST = window.ScrollTrigger;
const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;

function puan(a, b) {
  const ou = b.urun.filter(u => a.urun.includes(u)), oo = b.onc.filter(o => a.onc.includes(o));
  const pu = Math.min(1, ou.length / Math.min(a.urun.length, b.urun.length)), po = Math.min(1, oo.length / Math.min(a.onc.length, b.onc.length));
  const dil = b.dil.some(d => a.dil.includes(d));
  return { p: Math.max(18, Math.min(98, Math.round(100 * (0.48 * pu + 0.3 * po + 0.14 * (a.kod !== b.kod) + 0.08 * dil)))), ou, oo };
}
const halka = (p, boy = 48) => { const r = (boy - 6) / 2, c = 2 * Math.PI * r, rk = p >= 75 ? '#5E8C4A' : p >= 55 ? '#C9A227' : '#2E78C7';
  return `<div class="halka"><svg width="${boy}" height="${boy}"><circle cx="${boy / 2}" cy="${boy / 2}" r="${r}" stroke="#E2DBC6" stroke-width="5" fill="none"/><circle class="y" cx="${boy / 2}" cy="${boy / 2}" r="${r}" stroke="${rk}" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-h="${c * (1 - p / 100)}"/></svg><span>%${p}</span></div>`; };

/* ---------- İçerik ---------- */
const ulkeSay = new Set(Y.map(y => y.ulke)).size;
$('#sayilar').innerHTML = [[Y.length, 'YEG'], [ulkeSay, 'ülke'], [BAGLAR.length, 'kardeş bağı'], [PR.length, 'ortak proje']]
  .map(([s, l]) => `<div><b data-say="${s}">0</b><span>${l} <small style="opacity:.6">(örnek)</small></span></div>`).join('');

const yarim = Math.ceil(Y.length / 2);
const mini = y => `<div class="mini">${av(y)}<div><b>${esc(y.ad)}</b><span>${y.urun.slice(0, 2).map(u => (URUN_EMOJI[u] || '') + ' ' + u).join(' · ')}</span></div></div>`;
const satir = (l, ters) => `<div class="satir ${ters ? 'ters' : ''}">${[...l, ...l].map(mini).join('')}</div>`;
$('#yegSerit').innerHTML = satir(Y.slice(0, yarim)) + satir(Y.slice(yarim), true);

const MV = YM.menderes;
const adaylar = ['evia', 'higueras', 'salento'].map(id => ({ y: YM[id], ...puan(MV, YM[id]) })).sort((a, b) => b.p - a.p);
$('#eslesMock').innerHTML = `<div class="bas">${av(MV)}<div><h4>${esc(MV.ad)}</h4><small>için en iyi kardeş adayları</small></div></div>
  ${adaylar.map((a, i) => `<div class="esl">${avS(a.y)}<div class="ad"><b>${esc(a.y.ad)}</b><span>${esc(a.ou.join(', ') || a.oo.join(', '))} · ${esc(a.y.ulke)}</span></div>${halka(a.p)}<a class="btn altin" href="platform.html#yeg/${a.y.id}">${i ? 'Teklif' : 'Kardeş ol'}</a></div>`).join('')}`;

const P = PR.find(p => p.id === 'fignet'), PR_RENK = ['#1F3A5F', '#C9A227', '#2E78C7', '#5E8C4A'];
$('#projeMock').innerHTML = `<div class="bas" style="justify-content:space-between"><span class="cip">● Ortak aranıyor</span><small>${esc(P.program)}</small></div>
  <h4 style="font-size:17px">${esc(P.ad)}</h4>
  <div class="ortaklar">${[P.lider, ...P.ortak].map(id => avS(YM[id])).join('')}${'<div class="av bos">+</div>'.repeat(P.aranan)}</div>
  <div class="gantt">${P.ip.map(([ad, s, e], i) => `<div class="s"><span>İP${i + 1} · ${esc(ad)}</span><div class="ray"><i style="left:${(s - 1) / P.sure * 100}%;width:${(e - s + 1) / P.sure * 100}%;background:${PR_RENK[i % 4]};transition-delay:${i * .15}s"></i></div></div>`).join('')}</div>
  <div class="meta"><div>Bütçe<b>€${P.butce.toLocaleString('tr-TR')}</b></div><div>Süre<b>${P.sure} ay</b></div><div>Ortak<b>${P.ortak.length + 1} / ${P.ortak.length + 1 + P.aranan}</b></div></div>`;

const FON = [
  ['LEADER ulusötesi işbirliği', 'YEG\'ler arası ortak ürün, rota ve kalite standardı projeleri.', '#1F3A5F', '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'],
  ['Erasmus+ · Gençlik değişimi', 'Genç çiftçi ve genç üretici buluşmaları.', '#2E78C7', '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>'],
  ['Erasmus+ · Küçük ölçekli ortaklık', 'Eğitim içerikleri, kadın üretici akademisi, iyi uygulama paylaşımı.', '#5E8C4A', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/>'],
  ['Avrupa Dayanışma Programı', 'Gönüllülük, belgesel ve yerel dayanışma projeleri.', '#C2553F', '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'],
  ['Horizon Europe · Küme 6', 'Üniversitelerle tarım, gıda ve kırsal alan araştırmaları.', '#7A3D8C', '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>'],
  ['Ortak finansman', 'Katılımcı kendi ulaşım ve konaklamasını, ev sahibi alanı ve programı karşılar.', '#B8900F', '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5"/>']
];
$('#fonIzgara').innerHTML = FON.map(([ad, a, r, i]) => `<div class="fon-k r"><div class="ik" style="background:${r}22;color:${r === '#1F3A5F' ? '#9CC3EE' : r}"><svg class="i" viewBox="0 0 24 24" style="width:22px;height:22px">${i}</svg></div><h3>${ad}</h3><p>${a}</p></div>`).join('');

const ADIM = [['Profilini oluştur', 'YEG\'in ürünlerini, önceliklerini ve aradığı iş birliğini paylaşır.'], ['Kardeşini bul', 'Eşleştirme en uygun YEG\'leri önerir; teklif gönderilir.'], ['Proje kur', 'Ortaklar iş planını ve bütçeyi birlikte hazırlar.'], ['Festivalde buluş', 'Kardeş YEG\'ler YEGFEST\'te stant açar, yüz yüze görüşür.']];
$('#adimHat').insertAdjacentHTML('beforeend', ADIM.map(([b, a], i) => `<div class="adim r"><div class="n">${i + 1}</div><h3>${b}</h3><p>${a}</p></div>`).join(''));

/* ---------- 3D küre ---------- */
const KARDES = BAGLAR.map(b => [...b, 'kardes']);
const PROJE = PR.flatMap(p => p.ortak.map(o => [p.lider, o, 'proje']));
let kure = null;
const destek = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
if (destek) {
  kure = new Kure($('#kureSabit'), {
    yegler: Y, baglar: [...KARDES, ...PROJE], ankara: ANKARA, otoDon: true, etiketler: !matchMedia('(max-width:900px)').matches, uzaklik: 3.8, tekerlekYok: true,
    ipucuHTML: y => `<b>${esc(y.ad)}</b><span>${esc(y.yer)}</span><div class="ur">${y.urun.map(u => (URUN_EMOJI[u] || '') + ' ' + esc(u)).join(' · ')}</div><small>Profili platformda açmak için tıklayın</small>`,
    onSec: id => { location.href = 'platform.html#yeg/' + id; }
  });
  kure.ucus(30, 24, 4.2);
}

let zaman = [], pingDongu = null;
const temizle = () => { zaman.forEach(clearTimeout); zaman = []; clearInterval(pingDongu); pingDongu = null; };
const sonra = (ms, f) => zaman.push(setTimeout(f, ms));
let sonSahne = null;
function sahne(ad) {
  if (ad === sonSahne) return; sonSahne = ad;
  $$('.ust-nav nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + ({ ag: 'ag', esles: 'eslesme', proje: 'projeler', fest: 'festival', fon: 'finansman' }[ad])));
  const kap = $('#kureSabit'); kap.classList.toggle('soluk', ad === 'fon' || ad === 'son'); if (ad !== 'fest') kap.classList.remove('gizli');
  if (!kure) return;
  temizle(); kure.radarDur(); kure.etiketle([]); kure.vurgula(null); kure.o.ben = null; kure.o.otoDon = true;
  if (ad === 'giris' || ad === 'son') {
    kure.yaylariKur([...KARDES, ...PROJE], false); kure.benimYaylar(); kure.ucus(30, 24, ad === 'son' ? 4.4 : 4.2);
  } else if (ad === 'ag') {
    kure.yaylariKur(KARDES, false); kure.benimYaylar(); kure.ucus(47, 14, 2.75);
    kure.etiketle(['lavande', 'menderes', 'miodu', 'connemara', 'kalix', 'karadeniz']);
    pingDongu = setInterval(() => kure.ping(Y[Math.random() * Y.length | 0].id), 900);
  } else if (ad === 'esles') {
    kure.o.otoDon = false; kure.o.ben = 'menderes';
    kure.yaylariKur(KARDES.filter(b => !b.includes('menderes')), false); kure.benimYaylar();
    kure.vurgula(['menderes', 'evia', 'higueras', 'salento']); kure.etiketle(['evia', 'higueras', 'salento']);
    kure.ucus(38, 14, 2.45); kure.radar('menderes');
    ['evia', 'higueras', 'salento'].forEach((id, i) => sonra(1500 + i * 650, () => { kure.yayEkle('menderes', id, i < 2 ? 'kardes' : 'aday', { anim: true, sure: 1.4, kesik: i === 2 }); kure.benimYaylar(); kure.ping(id, 0xF2C14E); }));
    sonra(3800, () => kure.radarDur());
  } else if (ad === 'proje') {
    kure.yaylariKur(PROJE, true); kure.benimYaylar(); kure.ucus(44, 12, 3.0);
    kure.etiketle([...new Set(PR.map(p => p.lider))].slice(0, 5));
  } else if (ad === 'fest') {
    const dis = Y.filter(y => !tr(y)).map(y => [y.id, 'ankara', 'fest']), ic = Y.filter(tr).map(y => [y.id, 'ankara', 'fest']);
    kure.yaylariKur([...dis, ...ic], true); kure.ucus(42, 20, 3.0);
  } else if (ad === 'fon') {
    kure.yaylariKur([...KARDES, ...PROJE], false); kure.benimYaylar(); kure.ucus(28, 22, 4.4);
  }
}

/* ---------- Festival salonu (görününce kurulur) ---------- */
let salon = null;
function salonKur() {
  if (salon || !destek) return;
  const atama = [['lavande', 0], ['evia', 1], ['langhe', 2], ['salento', 3], ['rosevalley', 5], ['higueras', 6], ['miodu', 9]];
  salon = new Salon($('#salonSahne'), {
    otoTur: false, insan: matchMedia('(max-width:900px)').matches ? 40 : 75, zoom: false,
    stantlar: atama.map(([id, i]) => { const y = YM[id]; return { i, yeg: { id, ad: y.ad, kisa: y.kisa, kod: y.kod, ulke: y.ulke, renkHex: `hsl(${y.h}, 46%, 40%)` } }; })
  });
  salon.tur();
  // açılışta bir stant atama gösterisi
  setTimeout(() => { const y = YM.campina; salon.stantAta(10, { id: y.id, ad: y.ad, kisa: y.kisa, kod: y.kod, ulke: y.ulke, renkHex: `hsl(${y.h}, 46%, 40%)` }); setTimeout(() => salon.tur(), 4500); }, 7000);
}

/* ---------- Animasyonlar ---------- */
function sayac(el) {
  const h = +el.dataset.say, t0 = performance.now();
  const f = t => { const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(h * e).toLocaleString('tr-TR'); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function halkalar(k) { $$('circle.y', k).forEach(c => c.style.strokeDashoffset = c.dataset.h); }

// başlık kelime kelime
const bas = $('.baslik-anim');
bas.innerHTML = bas.innerHTML.split(/(<em>.*?<\/em>|\s+)/).filter(Boolean).map(p => /^\s+$/.test(p) ? ' ' : `<span class="k"><span>${p}</span></span>`).join('');

if (gsap && ST && !azHareket) {
  gsap.registerPlugin(ST);
  gsap.to('.baslik-anim .k>span', { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07, delay: 0.25 });
  gsap.to('.hero .r', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.6, onStart: () => $$('#sayilar [data-say]').forEach(sayac) });
  ST.batch('section:not(.hero) .r', { start: 'top 88%', onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true }) });
  $$('[data-sahne]').forEach(s => ST.create({ trigger: s, start: 'top 55%', end: 'bottom 45%', onToggle: self => self.isActive && sahne(s.dataset.sahne) }));
  ST.create({ trigger: '.nasil', start: 'top 55%', end: 'bottom 45%', onToggle: self => self.isActive && sahne('son') });
  ST.create({ trigger: '.son-cagri', start: 'top 55%', onToggle: self => self.isActive && sahne('son') });
  ST.create({ trigger: '#salonSahne', start: 'top 70%', end: 'bottom 30%', onEnter: () => { salonKur(); $('#kureSabit').classList.add('gizli'); $$('#salonSahne [data-say]').forEach(sayac); }, onEnterBack: () => $('#kureSabit').classList.add('gizli'), onLeave: () => $('#kureSabit').classList.remove('gizli'), onLeaveBack: () => $('#kureSabit').classList.remove('gizli') });
  ST.create({ trigger: '#salonSahne', start: 'top bottom+=400', onEnter: salonKur });
  ['#eslesMock', '#projeMock'].forEach(s => ST.create({ trigger: s, start: 'top 80%', onEnter: () => { $(s).classList.add('gorundu'); halkalar($(s)); } }));
  gsap.to('#hatDolu', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#adimHat', start: 'top 75%', end: 'bottom 55%', scrub: 0.6, onUpdate: self => $$('.adim').forEach((a, i) => a.classList.toggle('on', self.progress >= i / 3 - 0.02)) } });
  gsap.to('#ilerleme', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  // numaralar hafif paralaks
  $$('.no').forEach(n => gsap.to(n, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: n.closest('section'), scrub: true } }));
} else {
  document.documentElement.classList.remove('js');
  $$('.baslik-anim .k>span').forEach(s => s.style.transform = 'none');
  $$('[data-say]').forEach(sayac); ['#eslesMock', '#projeMock'].forEach(s => { $(s).classList.add('gorundu'); halkalar($(s)); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const s = e.target.dataset.sahne; if (s) sahne(s); if (e.target.id === 'festival') salonKur(); } }), { threshold: 0.4 });
  $$('[data-sahne]').forEach(s => io.observe(s));
  $$('.adim').forEach(a => a.classList.add('on'));
}
sahne('giris');

// menü arka planı
const nav = $('#ustNav'); const navF = () => nav.classList.toggle('dolu', scrollY > 30); addEventListener('scroll', navF, { passive: true }); navF();

// mıknatıs düğmeler + kart eğme
$$('.miknatis').forEach(b => {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});
$$('.mock-kart').forEach(k => {
  k.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = k.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; k.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`; });
  k.addEventListener('pointerleave', () => k.style.transform = '');
});
