/* =====================================================================
   YEG Kardeş · 3D YEGFEST Festival Salonu (Three.js)
   - Türkiye ilçe stantları, uluslararası YEG alanı (12 stant),
     tadım alanı, kardeş YEG görüşme alanı, panel salonu, ana sahne
   - Gezinen ziyaretçiler, kayan LED ekran, gölgeler
   - Stant atama animasyonu, stant seçimi, sinematik kamera turu
===================================================================== */
import * as THREE from 'three';
import { OrbitControls } from '../../vendor/addons/OrbitControls.js';

const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

function yaziDokusu(satirlar, { w = 512, h = 128, zemin = '#ffffff', renk = '#14263F', boy = 52, alt = null } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  if (zemin) { x.fillStyle = zemin; x.fillRect(0, 0, w, h); }
  x.fillStyle = renk; x.textAlign = 'center'; x.textBaseline = 'middle';
  const s = Array.isArray(satirlar) ? satirlar : [satirlar];
  if (s.length === 1) { x.font = `800 ${boy}px ${FONT}`; x.fillText(s[0], w / 2, h / 2, w - 24); }
  else { x.font = `800 ${boy}px ${FONT}`; x.fillText(s[0], w / 2, h * 0.38, w - 24); x.font = `600 ${boy * 0.5}px ${FONT}`; x.globalAlpha = .8; x.fillText(s[1], w / 2, h * 0.74, w - 24); x.globalAlpha = 1; }
  if (alt) { x.fillStyle = alt; x.fillRect(0, h - 10, w, 10); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

const M = (renk, o = {}) => new THREE.MeshStandardMaterial({ color: renk, roughness: 0.75, metalness: 0.02, ...o });

export class Salon {
  constructor(kap, o = {}) {
    this.o = Object.assign({ stantlar: [], onStant: null, otoTur: false, kontrol: true, insan: 70 }, o);
    this.kok = document.createElement('div'); this.kok.className = 'salon-kok';
    this.kok.style.cssText = 'position:absolute;inset:0;overflow:hidden';
    kap.appendChild(this.kok);
    this.saat = new THREE.Clock(); this.zaman = 0; this.animler = []; this.int = [];
    this.kur();
  }

  kur() {
    const rd = this.rd = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rd.setPixelRatio(Math.min(devicePixelRatio, 2)); rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap;
    rd.outputColorSpace = THREE.SRGBColorSpace; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.05;
    rd.domElement.style.cssText = 'display:block;width:100%;height:100%;outline:none;touch-action:pan-y';
    this.kok.appendChild(rd.domElement);
    const s = this.sahne = new THREE.Scene();
    s.fog = new THREE.Fog(0xEFE9DA, 55, 110);
    this.kam = new THREE.PerspectiveCamera(38, 1, 0.5, 200); this.kam.position.set(-3, 31, 33);

    if (this.o.kontrol) {
      const k = this.kontrol = new OrbitControls(this.kam, rd.domElement);
      k.enableDamping = true; k.dampingFactor = 0.07; k.maxPolarAngle = 1.32; k.minPolarAngle = 0.25;
      k.minDistance = 9; k.maxDistance = 60; k.target.set(0, 0, -1); k.enablePan = true; k.screenSpacePanning = false;
      k.autoRotate = this.o.otoTur; k.autoRotateSpeed = 0.35; k.enableZoom = this.o.zoom !== false;
      k.addEventListener('start', () => { this.turDur(); this.kamHedef = null; });
    }
    this.hedefBak = new THREE.Vector3(0, 0, -1);

    s.add(new THREE.HemisphereLight(0xffffff, 0xD8CDB2, 1.15));
    const g = new THREE.DirectionalLight(0xFFF6E5, 1.6); g.position.set(14, 26, 12); g.castShadow = true;
    g.shadow.mapSize.set(2048, 2048); Object.assign(g.shadow.camera, { left: -26, right: 26, top: 22, bottom: -22, near: 1, far: 70 }); g.shadow.bias = -0.0004; g.shadow.normalBias = 0.02;
    s.add(g);

    this.zemin(); this.turkiyeAlani(); this.uluslararasiAlan(); this.tadimAlani(); this.gorusmeAlani(); this.panelSalonu(); this.sahneKur(); this.tabelalar(); this.insanlar();
    this.stantlariGuncelle(this.o.stantlar, false);

    this.ray = new THREE.Raycaster(); this.fare = new THREE.Vector2();
    const el = rd.domElement; let bas = null;
    el.addEventListener('pointerdown', e => { bas = [e.clientX, e.clientY]; });
    el.addEventListener('pointerup', e => { if (bas && Math.hypot(e.clientX - bas[0], e.clientY - bas[1]) < 6) this.tikla(e); bas = null; });
    el.addEventListener('pointermove', e => { if (!bas) this.uzerinde(e); });

    this.ro = new ResizeObserver(() => this.boyut()); this.ro.observe(this.kok);
    this.io = new IntersectionObserver(e => { this.gorunur = e[0].isIntersecting; if (this.gorunur) this.baslat(); }); this.io.observe(this.kok);
    this.boyut(); this.baslat();
  }

  /* ---------- Yapı ---------- */
  zemin() {
    const s = this.sahne;
    const z = new THREE.Mesh(new THREE.BoxGeometry(46, 0.4, 32), M(0xF3EEE2)); z.position.y = -0.2; z.receiveShadow = true; s.add(z);
    const kenar = new THREE.Mesh(new THREE.BoxGeometry(47, 0.25, 33), M(0xD9CFB5)); kenar.position.y = -0.36; s.add(kenar);
    // yürüyüş yolları
    const yol = (w, d, x, zz) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M(0xE6DCC4)); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.005, zz); m.receiveShadow = true; s.add(m); };
    yol(3, 26, 0, -2); yol(44, 2.4, 0, 1.6);
    // arka ve sol duvar (kesit görünüm)
    const duvar = (w, h, d, x, y, zz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(0xE2DBC6)); m.position.set(x, y, zz); m.receiveShadow = true; m.castShadow = true; s.add(m); };
    duvar(46, 5, 0.4, 0, 2.5, -16); duvar(0.4, 5, 32, -23, 2.5, 0);
  }
  stantYap({ w, d, fascia, tezgah, etiket, alt, renkZemin = 0xEDE6D3, urunler = 3 }) {
    const g = new THREE.Group();
    const taban = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), M(renkZemin)); taban.position.y = 0.03; taban.receiveShadow = true;
    const beyaz = M(0xFFFFFF);
    const arka = new THREE.Mesh(new THREE.BoxGeometry(w, 1.9, 0.07), beyaz); arka.position.set(0, 0.95, -d / 2); arka.castShadow = arka.receiveShadow = true;
    const sol = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, d), beyaz); sol.position.set(-w / 2, 0.95, 0); sol.castShadow = sol.receiveShadow = true;
    const sag = sol.clone(); sag.position.x = w / 2;
    const fasMat = new THREE.MeshStandardMaterial({ map: yaziDokusu(etiket, { zemin: fascia, renk: alt ? '#14263F' : '#ffffff', boy: 54 }), roughness: .6 });
    const fas = new THREE.Mesh(new THREE.BoxGeometry(w, 0.42, 0.08), [beyaz, beyaz, beyaz, beyaz, fasMat, beyaz]); fas.position.set(0, 2.1, d / 2 - 0.04); fas.castShadow = true;
    const ust = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, d), beyaz); ust.position.set(-w / 2, 1.9, 0); const ust2 = ust.clone(); ust2.position.x = w / 2;
    const tz = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.85, 0.45), M(tezgah)); tz.position.set(0, 0.43, d / 2 - 0.45); tz.castShadow = tz.receiveShadow = true;
    g.add(taban, arka, sol, sag, fas, ust, ust2, tz);
    const renkler = [0xC9A227, 0x7A5E3A, 0x5E8C4A, 0xB4543F, 0x8A6FB0];
    for (let i = 0; i < urunler; i++) {
      const u = new THREE.Mesh(i % 2 ? new THREE.CylinderGeometry(0.09, 0.09, 0.26, 12) : new THREE.BoxGeometry(0.22, 0.18, 0.18), M(renkler[(i + Math.floor(w * 7)) % 5]));
      u.position.set(-w * 0.22 + i * (w * 0.44 / Math.max(1, urunler - 1)), 0.97, d / 2 - 0.45); u.castShadow = true; g.add(u);
    }
    // arka duvar posteri
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.55, 0.9), M(fascia === '#ffffff' ? 0xF3EEE2 : new THREE.Color(fascia).lerp(new THREE.Color(0xffffff), .35)));
    poster.position.set(0, 1.25, -d / 2 + 0.04); g.add(poster);
    g.userData = { fas, tz, fasMat };
    return g;
  }
  turkiyeAlani() {
    const ilceRenk = ['#1F3A5F', '#2B5280', '#5E8C4A', '#B8900F', '#7A3D3D', '#3D6B7A'];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const st = this.stantYap({ w: 2.1, d: 1.9, fascia: ilceRenk[(r * 7 + c) % 6], tezgah: 0xD8CDB2, etiket: 'İlçe ' + (r * 7 + c + 1), urunler: 2 + (c % 3) });
      st.position.set(-20 + c * 2.55, 0, -13.2 + r * 3.35 + (r % 2 ? -0.55 : 0));
      if (r % 2) st.rotation.y = Math.PI; this.sahne.add(st);
    }
  }
  uluslararasiAlan() {
    this.intStant = [];
    const tab = new THREE.Mesh(new THREE.PlaneGeometry(19, 13.5), M(0xE4EDF7)); tab.rotation.x = -Math.PI / 2; tab.position.set(11.5, 0.008, -7.6); tab.receiveShadow = true; this.sahne.add(tab);
    for (let i = 0; i < 12; i++) {
      const r = Math.floor(i / 4), c = i % 4;
      const kap = new THREE.Group(); kap.position.set(4.3 + c * 4.75, 0, -12.6 + r * 4.3); this.sahne.add(kap);
      const sec = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 3), new THREE.MeshBasicMaterial({ visible: false })); sec.position.y = 1.2; sec.userData.stant = i; kap.add(sec);
      const halka = new THREE.Mesh(new THREE.RingGeometry(2.05, 2.3, 48), new THREE.MeshBasicMaterial({ color: 0xE3B341, transparent: true, opacity: 0, depthWrite: false }));
      halka.rotation.x = -Math.PI / 2; halka.position.y = 0.02; kap.add(halka);
      const isik = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 9, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xFFD45E, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      isik.position.y = 4.5; kap.add(isik);
      this.intStant.push({ i, kap, sec, halka, isik, stant: null, yeg: null });
    }
  }
  intStantKur(i, yeg, anim) {
    const s = this.intStant[i]; if (!s) return;
    if (s.stant) { s.kap.remove(s.stant); }
    const st = yeg
      ? this.stantYap({ w: 3.4, d: 2.7, fascia: yeg.renkHex || '#2E78C7', tezgah: 0xE3B341, etiket: [yeg.ad.length > 24 ? yeg.ad.replace(/^(GAL|LAG|LGD|GDR|LEADER-Region) /, '') : yeg.ad, `${yeg.ulke} · U-${i + 1}`], urunler: 4, renkZemin: 0xF6E7B5 })
      : this.stantYap({ w: 3.4, d: 2.7, fascia: '#ffffff', tezgah: 0xE8E3D6, etiket: [`U-${i + 1}`, 'Boş stant'], alt: true, urunler: 0, renkZemin: 0xEAF1FA });
    s.kap.add(st); s.stant = st; s.yeg = yeg || null;
    if (yeg) {
      // bayrak direği
      const dir = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), M(0xBBBBBB, { metalness: .6, roughness: .3 })); dir.position.set(1.45, 1.6, 1.1); dir.castShadow = true;
      const bay = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.48), new THREE.MeshStandardMaterial({ map: yaziDokusu(yeg.kod, { w: 128, h: 82, zemin: yeg.renkHex || '#2E78C7', renk: '#fff', boy: 44 }), side: THREE.DoubleSide }));
      bay.position.set(1.84, 2.9, 1.1); st.add(dir, bay); st.userData.bayrak = bay;
    }
    if (anim) {
      st.scale.set(1, 0.001, 1);
      this.animler.push({ t0: this.zaman, sure: 1.1, f: p => { const e = p < 1 ? 1 - Math.pow(1 - p, 3) * Math.cos(p * 9) * (1 - p) : 1; st.scale.y = Math.max(0.001, e); } });
      this.animler.push({ t0: this.zaman, sure: 2.6, f: p => { s.isik.material.opacity = Math.sin(Math.min(1, p) * Math.PI) * 0.35; s.halka.material.opacity = (1 - p) * 0.9; s.halka.scale.setScalar(0.6 + p * 0.8); } });
      this.konfeti(s.kap.position);
    }
  }
  stantlariGuncelle(list, anim = true) {
    // list: [{i, yeg}] — atanmamış stantlar boş görünür
    const m = new Map(list.map(x => [x.i, x.yeg]));
    this.intStant.forEach(s => {
      const y = m.get(s.i) || null;
      if (!s.stant || (s.yeg?.id || null) !== (y?.id || null)) this.intStantKur(s.i, y, anim && !!y && !s.yeg);
    });
  }
  stantAta(i, yeg) { this.intStantKur(i, yeg, true); this.odakla(i); }
  tadimAlani() {
    const hal = new THREE.Mesh(new THREE.PlaneGeometry(17, 5.5), M(0xE3ECDB)); hal.rotation.x = -Math.PI / 2; hal.position.set(-11, 0.01, 5.6); hal.receiveShadow = true; this.sahne.add(hal);
    for (let i = 0; i < 4; i++) {
      const masa = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1), M(0xA0784E)); masa.position.set(-17.5 + i * 4.3, 0.78, 5.6); masa.castShadow = masa.receiveShadow = true;
      const ayak = new THREE.Mesh(new THREE.BoxGeometry(3, 0.74, 0.8), M(0x8A6642)); ayak.position.set(-17.5 + i * 4.3, 0.37, 5.6); ayak.castShadow = true;
      this.sahne.add(masa, ayak);
      for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), M([0xC9A227, 0x5E8C4A, 0xB4543F, 0xffffff, 0x7A3D8C][k])); t.position.set(-18.7 + i * 4.3 + k * 0.6, 0.85, 5.6); this.sahne.add(t); }
    }
  }
  gorusmeAlani() {
    const hal = new THREE.Mesh(new THREE.CircleGeometry(3.4, 48), M(0xF2DE9E)); hal.rotation.x = -Math.PI / 2; hal.position.set(5.6, 0.012, 5.6); hal.receiveShadow = true; this.sahne.add(hal);
    [[4.2, 4.6], [7, 4.6], [5.6, 6.9]].forEach(([x, z]) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24), M(0xffffff)); m.position.set(x, 0.75, z); m.castShadow = true;
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.72, 8), M(0x777777)); a.position.set(x, 0.36, z);
      this.sahne.add(m, a);
      for (let k = 0; k < 2; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), M(0x1F3A5F)); c.position.set(x + (k ? 0.85 : -0.85), 0.23, z); c.castShadow = true; this.sahne.add(c); }
    });
  }
  panelSalonu() {
    const cam = new THREE.Mesh(new THREE.BoxGeometry(9, 3, 6), new THREE.MeshPhysicalMaterial({ color: 0xCFE2F5, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, depthWrite: false }));
    cam.position.set(16.5, 1.5, 5.6); this.sahne.add(cam);
    const cerceve = new THREE.LineSegments(new THREE.EdgesGeometry(cam.geometry), new THREE.LineBasicMaterial({ color: 0x8DB0D3 })); cerceve.position.copy(cam.position); this.sahne.add(cerceve);
    const ekran = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.8), new THREE.MeshBasicMaterial({ map: yaziDokusu(['Panel', 'Türkiye–AB işbirliği'], { w: 512, h: 230, zemin: '#1F3A5F', renk: '#fff', boy: 64 }) }));
    ekran.position.set(16.5, 1.6, 2.7); ekran.rotation.y = Math.PI; this.sahne.add(ekran);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const k = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), M(0xC9A227)); k.position.set(13.8 + c * 1.1, 0.23, 5.2 + r * 1.1); k.castShadow = true; this.sahne.add(k); }
  }
  sahneKur() {
    const p = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 3.6), M(0x14263F)); p.position.set(0, 0.45, 12.8); p.castShadow = p.receiveShadow = true; this.sahne.add(p);
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256; this.ledC = c;
    this.ledDoku = new THREE.CanvasTexture(c); this.ledDoku.colorSpace = THREE.SRGBColorSpace;
    const ekran = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5), new THREE.MeshBasicMaterial({ map: this.ledDoku, toneMapped: false }));
    ekran.position.set(0, 3.4, 14.4); ekran.rotation.y = Math.PI; this.sahne.add(ekran);
    const cerceve = new THREE.Mesh(new THREE.BoxGeometry(10.4, 2.9, 0.2), M(0x0F1E33)); cerceve.position.set(0, 3.4, 14.55); this.sahne.add(cerceve);
    [-5.4, 5.4].forEach(x => { const d = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 0.3), M(0x2A3A52, { metalness: .5 })); d.position.set(x, 2.5, 14.4); d.castShadow = true; this.sahne.add(d); });
    this.spotlar = [];
    [-4, 0, 4].forEach((x, i) => {
      const k = new THREE.Mesh(new THREE.ConeGeometry(1.5, 5, 32, 1, true), new THREE.MeshBasicMaterial({ color: [0xFFD45E, 0x9CC3EE, 0xFFD45E][i], transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      k.position.set(x, 3.4, 12.8); this.sahne.add(k); this.spotlar.push(k);
    });
    this.ledCiz(0);
  }
  ledCiz(t) {
    const c = this.ledC, x = c.getContext('2d'), w = c.width, h = c.height;
    const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#14263F'); g.addColorStop(.5, '#1F3A5F'); g.addColorStop(1, '#14263F');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.font = `800 92px ${FONT}`; x.textBaseline = 'middle';
    const metin = 'YEGFEST  ·  Türkiye–AB Yerel Ürün Festivali  ·  Ankara  ·  ', mw = x.measureText(metin).width, ofs = (t * 120) % mw;
    x.fillStyle = '#E3B341'; for (let k = -1; k < 3; k++) x.fillText(metin, k * mw - ofs, h / 2);
    x.fillStyle = 'rgba(0,0,0,.18)'; for (let yy = 0; yy < h; yy += 4) x.fillRect(0, yy, w, 1);
    this.ledDoku.needsUpdate = true;
  }
  tabelalar() {
    // duvar tabelaları
    const tab = (metin, x, y, z, w = 9, renk = '#14263F', yazi = '#ffffff', ry = 0) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 5), new THREE.MeshBasicMaterial({ map: yaziDokusu(metin, { w: 640, h: 128, zemin: renk, renk: yazi, boy: 56 }), transparent: true }));
      m.position.set(x, y, z); m.rotation.y = ry; this.sahne.add(m);
    };
    tab("Türkiye YEG'leri · İlçe stantları", -11.5, 3.6, -15.78);
    tab('Uluslararası YEG Alanı', 11.5, 3.6, -15.78, 9, '#2E78C7');
    tab('Tadım ve ortak sofra', -22.78, 2.8, 5.6, 6, '#5E8C4A', '#ffffff', Math.PI / 2);
    // görüşme alanı için zemin yazısı
    const zy = new THREE.Mesh(new THREE.PlaneGeometry(5, 1), new THREE.MeshBasicMaterial({ map: yaziDokusu('Kardeş YEG görüşmeleri', { w: 640, h: 128, zemin: null, renk: '#8A6D10', boy: 52 }), transparent: true }));
    zy.rotation.x = -Math.PI / 2; zy.position.set(5.6, 0.02, 2.55); this.sahne.add(zy);
  }
  insanlar() {
    this.kisiler = [];
    const alanlar = [[-1.2, 1.2, -13, 8.5], [-21, 21, 0.8, 2.4], [-19, -3, 3.6, 7.6], [2.6, 8.6, 3, 8], [-6, 6, 8.6, 10.3], [3, 20, -1.2, -0.3]];
    this.alanlar = alanlar;
    const renk = [0x1F3A5F, 0xC9A227, 0x5E8C4A, 0xB4543F, 0x2E78C7, 0x7A3D8C, 0x3E4C5E, 0xD98C5F, 0x8DB0D3];
    const govGeo = new THREE.CapsuleGeometry(0.17, 0.5, 4, 8), basGeo = new THREE.SphereGeometry(0.15, 12, 10), ten = [0xE8C5A0, 0xC99A72, 0x9C6B48, 0xF1D4B5];
    for (let i = 0; i < this.o.insan; i++) {
      const g = new THREE.Group();
      const gov = new THREE.Mesh(govGeo, M(renk[i % renk.length])); gov.position.y = 0.45; gov.castShadow = true;
      const bas = new THREE.Mesh(basGeo, M(ten[i % 4])); bas.position.y = 1.0; bas.castShadow = true;
      g.add(gov, bas); g.scale.setScalar(0.85 + Math.random() * 0.3);
      const a = Math.floor(Math.random() * alanlar.length), p = this.rastNokta(a);
      g.position.set(p.x, 0, p.z); this.sahne.add(g);
      this.kisiler.push({ g, alan: a, yol: [], hiz: 0.9 + Math.random() * 0.7, bekle: Math.random() * 3, faz: Math.random() * 6 });
    }
  }
  rastNokta(a) { const [x0, x1, z0, z1] = this.alanlar[a]; return new THREE.Vector3(x0 + Math.random() * (x1 - x0), 0, z0 + Math.random() * (z1 - z0)); }
  yolBul(k) {
    const yeniA = Math.random() < 0.55 ? k.alan : Math.floor(Math.random() * this.alanlar.length), hedef = this.rastNokta(yeniA), yol = [];
    if (yeniA !== k.alan) { const pz = 1.6; yol.push(new THREE.Vector3(k.g.position.x, 0, pz), new THREE.Vector3(hedef.x, 0, pz)); }
    yol.push(hedef); k.yol = yol; k.alan = yeniA;
  }

  /* ---------- Etkileşim ---------- */
  isin(e) {
    const r = this.rd.domElement.getBoundingClientRect();
    this.fare.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.fare, this.kam);
    return this.ray.intersectObjects(this.intStant.map(s => s.sec), false)[0];
  }
  uzerinde(e) {
    const h = this.isin(e), i = h?.object.userData.stant;
    this.rd.domElement.style.cursor = i != null ? 'pointer' : 'grab';
    this.intStant.forEach(s => { if (s.stant) { const f = s.stant.userData.fas; f.material.forEach?.(m => m.emissive?.setHex(s.i === i ? 0x332200 : 0)); } });
  }
  tikla(e) {
    const h = this.isin(e); if (!h) return;
    const i = h.object.userData.stant, s = this.intStant[i];
    this.odakla(i);
    this.o.onStant?.({ i, yeg: s.yeg }, e);
  }
  odakla(i, uzak = 11) {
    const s = this.intStant[i]; if (!s) return;
    const p = s.kap.position; this.turDur();
    this.kamHedef = { poz: new THREE.Vector3(p.x - 2.5, uzak * 0.9, p.z + uzak * 0.95), bak: new THREE.Vector3(p.x, 0.6, p.z) };
  }
  genel() { this.kamHedef = { poz: new THREE.Vector3(-3, 31, 33), bak: new THREE.Vector3(0, 0, 0.5) }; }
  tur() {
    const d = [
      [new THREE.Vector3(-3, 31, 33), new THREE.Vector3(0, 0, 0.5)],
      [new THREE.Vector3(-22, 8, 6), new THREE.Vector3(-10, 0, -6)],
      [new THREE.Vector3(2, 9, 4), new THREE.Vector3(11, 0.5, -8)],
      [new THREE.Vector3(18, 7, 16), new THREE.Vector3(6, 0.5, 6)],
      [new THREE.Vector3(0, 6, 1), new THREE.Vector3(0, 3, 14)],
      [new THREE.Vector3(26, 20, 22), new THREE.Vector3(0, 0, -2)]
    ];
    this.turAdim = 0; this.turListe = d; this.turAcik = true; this.turT = this.zaman - 10;
  }
  turDur() { this.turAcik = false; }

  /* ---------- Efekt ---------- */
  konfeti(merkez) {
    const n = 90, g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3), hiz = [];
    const pal = [0xE3B341, 0x2E78C7, 0x5E8C4A, 0xffffff, 0xB4543F].map(c => new THREE.Color(c));
    for (let i = 0; i < n; i++) { pos.set([merkez.x, 2.6, merkez.z], i * 3); const c = pal[i % 5]; col.set([c.r, c.g, c.b], i * 3); hiz.push(new THREE.Vector3((Math.random() - .5) * 6, 4 + Math.random() * 5, (Math.random() - .5) * 6)); }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true })); this.sahne.add(p);
    this.animler.push({ t0: this.zaman, sure: 2.2, f: (q, dt) => {
      const a = g.attributes.position.array;
      for (let i = 0; i < n; i++) { hiz[i].y -= 9.8 * dt; a[i * 3] += hiz[i].x * dt; a[i * 3 + 1] = Math.max(0.05, a[i * 3 + 1] + hiz[i].y * dt); a[i * 3 + 2] += hiz[i].z * dt; }
      g.attributes.position.needsUpdate = true; p.material.opacity = 1 - q * q;
      if (q >= 1) { this.sahne.remove(p); g.dispose(); p.material.dispose(); }
    } });
  }

  /* ---------- Döngü ---------- */
  boyut() { const w = this.kok.clientWidth || 1, h = this.kok.clientHeight || 1; this.rd.setSize(w, h, false); this.kam.aspect = w / h; this.kam.updateProjectionMatrix(); }
  baslat() { if (this.raf || this.yokEdildi) return; this.saat.getDelta(); const d = () => { this.raf = requestAnimationFrame(d); this.kare(); }; this.raf = requestAnimationFrame(d); }
  durdur() { cancelAnimationFrame(this.raf); this.raf = null; }
  tasi(kap) { if (this.kok.parentNode !== kap) kap.appendChild(this.kok); this.boyut(); this.io.unobserve(this.kok); this.io.observe(this.kok); this.baslat(); }
  kare() {
    if (!this.kok.isConnected) { this.durdur(); return; }
    if (this.gorunur === false || document.hidden) return;
    const dt = Math.min(this.saat.getDelta(), 0.05); this.zaman += dt; const z = this.zaman;

    // sinematik tur
    if (this.turAcik && z - this.turT > 5.5) { this.turT = z; const [p, b] = this.turListe[this.turAdim++ % this.turListe.length]; this.kamHedef = { poz: p.clone(), bak: b.clone(), tur: true }; }
    if (this.kamHedef) {
      const k = 1 - Math.exp(-dt * (this.kamHedef.tur ? 0.9 : 2.2));
      this.kam.position.lerp(this.kamHedef.poz, k);
      (this.kontrol ? this.kontrol.target : this.hedefBak).lerp(this.kamHedef.bak, k);
      if (!this.kamHedef.tur && this.kam.position.distanceTo(this.kamHedef.poz) < 0.05) this.kamHedef = null;
    }
    if (this.kontrol) this.kontrol.update(); else this.kam.lookAt(this.hedefBak);

    // ziyaretçiler
    this.kisiler.forEach(k => {
      if (k.bekle > 0) { k.bekle -= dt; return; }
      if (!k.yol.length) { this.yolBul(k); }
      const h = k.yol[0], p = k.g.position, d = h.clone().sub(p); const L = d.length();
      if (L < 0.05) { k.yol.shift(); if (!k.yol.length) k.bekle = 1 + Math.random() * 4; return; }
      d.normalize(); p.addScaledVector(d, Math.min(L, k.hiz * dt)); k.g.rotation.y = Math.atan2(d.x, d.z);
      k.g.children[0].position.y = 0.45 + Math.abs(Math.sin(z * 9 + k.faz)) * 0.05;
    });
    this.spotlar.forEach((s, i) => { s.rotation.z = Math.sin(z * 0.8 + i * 2) * 0.35; s.material.opacity = 0.09 + 0.05 * Math.sin(z * 2 + i); });
    if (Math.floor(z * 20) !== this._led) { this._led = Math.floor(z * 20); this.ledCiz(z); }
    this.intStant.forEach(s => { if (s.stant?.userData.bayrak) s.stant.userData.bayrak.rotation.y = Math.sin(z * 2.2 + s.i) * 0.25; });

    this.animler = this.animler.filter(a => { const p = Math.min(1, (z - a.t0) / a.sure); a.f(p, dt); return p < 1; });
    this.rd.render(this.sahne, this.kam);
  }
  yokEt() { this.yokEdildi = true; this.durdur(); this.ro.disconnect(); this.io.disconnect(); this.kontrol?.dispose(); this.rd.dispose(); this.kok.remove(); }
}
