/* =====================================================================
   YEG Kardeş · 3D Dünya Küresi (Three.js)
   - Kara parçaları nokta bulutu (Türkiye altın, AB mavi, diğerleri koyu)
   - Her YEG bir ışık sütunu; kardeş bağları ve proje ortaklıkları
     üzerinde ışık akan yaylar
   - Sürükle-döndür, tekerlekle yakınlaştır, YEG'e tıkla
   - Tek örnek sayfalar arasında taşınır (tasi), yeniden kurulmaz
===================================================================== */
import * as THREE from 'three';

const R = 1;
const RAD = Math.PI / 180;
let VERI_SOZ = null;
const veriYukle = () => (VERI_SOZ ??= fetch(new URL('../../data/kure.json', import.meta.url)).then(r => r.json()));

export const konum = (lat, lon, r = R) => {
  const la = lat * RAD, lo = lon * RAD;
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
};

const RENK = {
  tr: new THREE.Color('#E3B341'), ab: new THREE.Color('#8DB8EC'), diger: new THREE.Color('#4C70A6'),
  kardes: new THREE.Color('#F2C14E'), proje: new THREE.Color('#8FD07A'), fest: new THREE.Color('#FFE3A3'), aday: new THREE.Color('#E8F1FF'), ben: new THREE.Color('#FFFFFF')
};

function isikDokusu() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- Gölgelendiriciler ---------- */
const CEKIRDEK = {
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vN; void main(){ float f = pow(1.0 - max(dot(vN, vec3(0,0,1)),0.0), 2.2);
    vec3 c = mix(vec3(.047,.094,.172), vec3(.13,.25,.45), f); gl_FragColor = vec4(c,1.); }`
};
const ATMOSFER = {
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 uRenk; varying vec3 vN; void main(){ float i = pow(max(0.72 - dot(vN, vec3(0,0,1.)),0.0), 3.2);
    gl_FragColor = vec4(uRenk, 1.) * i * 1.6; }`
};
const NOKTA = {
  vertexShader: `attribute float aBoy; attribute vec3 aRenk; attribute float aTur; uniform float uOlcek; uniform float uZaman;
    varying vec3 vRenk; varying float vYuz; varying float vTur;
    void main(){ vec4 wp = modelMatrix*vec4(position,1.); vec3 n = normalize(wp.xyz); vYuz = dot(n, normalize(cameraPosition - wp.xyz));
      vRenk = aRenk; vTur = aTur; vec4 mv = viewMatrix*wp;
      float tw = aTur > 0.5 ? 1.0 + 0.18*sin(uZaman*2.0 + position.x*40.0 + position.y*30.0) : 1.0;
      gl_PointSize = aBoy * tw * uOlcek / -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vRenk; varying float vYuz; varying float vTur;
    void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if(r > .5) discard;
      float a = smoothstep(.5, .18, r) * smoothstep(-.05, .35, vYuz); gl_FragColor = vec4(vRenk, a * (vTur > .5 ? .95 : .7)); }`
};
const YAY = {
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 uRenk; uniform float uIlerleme; uniform float uZaman; uniform float uOfs; uniform float uSeffaf; uniform float uKesik;
    varying vec2 vUv;
    void main(){ if(vUv.x > uIlerleme) discard;
      if(uKesik > .5 && fract(vUv.x*38.0) > .55) discard;
      float d = fract(vUv.x - uZaman*.32 - uOfs); float p = smoothstep(.82, 1., d);
      float bas = smoothstep(uIlerleme - .06, uIlerleme, vUv.x) * step(uIlerleme, .999);
      vec3 c = uRenk * (.55 + p*1.7 + bas*2.0);
      gl_FragColor = vec4(c, (.38 + p*.62 + bas) * uSeffaf); }`
};
const DALGA = {
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 uMerkez; uniform float uYaricap; uniform float uSeffaf; uniform vec3 uRenk; varying vec3 vP;
    void main(){ float a = acos(clamp(dot(vP, uMerkez), -1., 1.));
      float bant = smoothstep(.035, 0., abs(a - uYaricap)); float ic = smoothstep(uYaricap, 0., a) * .12;
      float al = (bant + ic) * uSeffaf; if(al < .01) discard; gl_FragColor = vec4(uRenk, al); }`
};

/* =====================================================================
   Küre
===================================================================== */
export class Kure {
  constructor(kap, o = {}) {
    this.o = Object.assign({ yegler: [], baglar: [], ben: null, otoDon: true, etiketler: true, uzaklik: 3.4, onSec: null, onHover: null, interaktif: true, ankara: null, ipucu: true }, o);
    this.kok = document.createElement('div');
    this.kok.className = 'kure-kok';
    this.kok.style.cssText = 'position:absolute;inset:0;overflow:hidden';
    kap.appendChild(this.kok);
    this.hazir = false; this.yaylar = new Map(); this.efektler = []; this.vurgu = null; this.katmanlar = { kardes: true, proje: true, aday: true, fest: true };
    this.hedef = { x: 0.62, y: -0.55, z: this.o.uzaklik }; this.simdi = { ...this.hedef };
    this.hiz = { x: 0, y: 0 }; this.sonEtk = 0; this.saat = new THREE.Clock(); this.zaman = 0;
    this.kur();
    veriYukle().then(v => { if (!this.yokEdildi) { this.noktalar(v); this.sinirlar(v); this.hazir = true; this.kok.classList.add('hazir'); this.o.onHazir?.(this); } });
  }

  kur() {
    const rd = this.rd = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rd.setPixelRatio(Math.min(devicePixelRatio, 2));
    rd.setClearColor(0x000000, 0);
    rd.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;outline:none';
    this.kok.appendChild(rd.domElement);
    this.sahne = new THREE.Scene();
    this.kam = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
    this.kam.position.set(0, 0, this.o.uzaklik);
    this.dunya = new THREE.Group(); this.sahne.add(this.dunya);
    this.isik = isikDokusu();

    this.dunya.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.994, 96, 96), new THREE.ShaderMaterial(CEKIRDEK)));
    const atm = new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 64, 64), new THREE.ShaderMaterial({ ...ATMOSFER, uniforms: { uRenk: { value: new THREE.Color('#5E9BE0') } }, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    this.sahne.add(atm);

    // Uzak yıldızlar
    const yg = new THREE.BufferGeometry(), yp = [];
    for (let i = 0; i < 900; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 10); yp.push(v.x, v.y, v.z); }
    yg.setAttribute('position', new THREE.Float32BufferAttribute(yp, 3));
    this.yildiz = new THREE.Points(yg, new THREE.PointsMaterial({ color: 0x9FB6D6, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
    this.sahne.add(this.yildiz);

    this.isaretGrup = new THREE.Group(); this.yayGrup = new THREE.Group(); this.efektGrup = new THREE.Group();
    this.dunya.add(this.isaretGrup, this.yayGrup, this.efektGrup);

    // Tarama dalgası
    this.dalga = new THREE.Mesh(new THREE.SphereGeometry(R * 1.004, 96, 96), new THREE.ShaderMaterial({ ...DALGA, uniforms: { uMerkez: { value: new THREE.Vector3(0, 0, 1) }, uYaricap: { value: 0 }, uSeffaf: { value: 0 }, uRenk: { value: new THREE.Color('#F2C14E') } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.dalga.visible = false; this.dunya.add(this.dalga);

    this.isaretler();
    if (this.o.ankara) this.ankaraIsaret(this.o.ankara);
    this.yaylariKur(this.o.baglar, false);

    // Etiket katmanı
    this.etiketKat = document.createElement('div'); this.etiketKat.className = 'kure-etiketler'; this.kok.appendChild(this.etiketKat);
    this.ipucuEl = document.createElement('div'); this.ipucuEl.className = 'kure-ipucu'; this.kok.appendChild(this.ipucuEl);

    this.olaylar();
    this.ro = new ResizeObserver(() => this.boyut()); this.ro.observe(this.kok);
    this.io = new IntersectionObserver(e => { this.gorunur = e[0].isIntersecting; if (this.gorunur) this.baslat(); }, { threshold: 0 });
    this.io.observe(this.kok);
    this.boyut(); this.baslat();
  }

  /* ---------- Veri katmanları ---------- */
  noktalar(v) {
    const p = v.p, n = p.length / 3, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), boy = new Float32Array(n), tur = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = p[i * 3 + 2], q = konum(p[i * 3], p[i * 3 + 1], R * 1.002);
      pos.set([q.x, q.y, q.z], i * 3);
      const c = t === 2 ? RENK.tr : t === 1 ? RENK.ab : RENK.diger; col.set([c.r, c.g, c.b], i * 3);
      boy[i] = t === 2 ? 1.12 : t === 1 ? 1.0 : 0.9; tur[i] = t;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aRenk', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aBoy', new THREE.BufferAttribute(boy, 1)); g.setAttribute('aTur', new THREE.BufferAttribute(tur, 1));
    this.noktaMat = new THREE.ShaderMaterial({ ...NOKTA, uniforms: { uOlcek: { value: 10 }, uZaman: { value: 0 } }, transparent: true, depthWrite: false });
    this.noktaBulut = new THREE.Points(g, this.noktaMat); this.noktaBulut.renderOrder = 1;
    this.dunya.add(this.noktaBulut); this.boyut();
  }
  sinirlar(v) {
    const seg = [];
    v.s.forEach(l => { for (let i = 0; i < l.length - 1; i++) { const a = konum(l[i][0], l[i][1], R * 1.003), b = konum(l[i + 1][0], l[i + 1][1], R * 1.003); seg.push(a.x, a.y, a.z, b.x, b.y, b.z); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    this.dunya.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x9CC3EE, transparent: true, opacity: 0.28, depthWrite: false })));
  }

  isaretler() {
    this.isaret = new Map();
    const silGeo = new THREE.CylinderGeometry(0.0038, 0.0038, 1, 8, 1, true); silGeo.translate(0, 0.5, 0);
    const halkaGeo = new THREE.RingGeometry(0.011, 0.016, 40);
    const secGeo = new THREE.SphereGeometry(0.035, 8, 8), secMat = new THREE.MeshBasicMaterial({ visible: false });
    this.secilebilir = [];
    this.o.yegler.forEach((y, i) => {
      const tr = y.kod === 'TR', renk = tr ? RENK.tr : RENK.ab, n = konum(y.lat, y.lon, 1).normalize();
      const g = new THREE.Group(); g.position.copy(n.clone().multiplyScalar(R * 1.002));
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      const yuk = 0.05 + y.uye / 900;
      const sut = new THREE.Mesh(silGeo, new THREE.MeshBasicMaterial({ color: renk, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      sut.scale.y = 0.0001;
      const tepe = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.isik, color: renk, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      tepe.scale.setScalar(0.06);
      const halka = new THREE.Mesh(halkaGeo, new THREE.MeshBasicMaterial({ color: renk, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      halka.rotation.x = -Math.PI / 2;
      const sec = new THREE.Mesh(secGeo, secMat); sec.userData.id = y.id; sec.position.y = yuk * 0.5;
      g.add(sut, tepe, halka, sec); this.isaretGrup.add(g); this.secilebilir.push(sec);
      this.isaret.set(y.id, { g, sut, tepe, halka, yuk, hedefYuk: yuk, simdiYuk: 0, gecikme: 0.3 + i * 0.045, renk, n, y, olcek: 1, hedefOlcek: 1, seffaf: 1, hedefSeffaf: 1, faz: Math.random() * 6 });
    });
  }
  ankaraIsaret([lat, lon]) {
    const n = konum(lat, lon, 1).normalize(), g = new THREE.Group();
    g.position.copy(n.clone().multiplyScalar(R * 1.003)); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    const elmas = new THREE.Mesh(new THREE.OctahedronGeometry(0.022), new THREE.MeshBasicMaterial({ color: 0xFFE08A }));
    elmas.position.y = 0.09;
    const sut = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.09, 6), new THREE.MeshBasicMaterial({ color: 0xFFE08A, transparent: true, opacity: .7 }));
    sut.position.y = 0.045;
    const isik = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.isik, color: 0xFFD45E, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    isik.scale.setScalar(0.16); isik.position.y = 0.09;
    g.add(elmas, sut, isik); this.dunya.add(g); this.ankara = { g, elmas, isik, n };
  }

  /* ---------- Yaylar ---------- */
  yayGeo(a, b) {
    const va = konum(a.lat, a.lon, 1).normalize(), vb = konum(b.lat, b.lon, 1).normalize();
    const aci = va.angleTo(vb), yuk = 0.03 + aci * 0.42, pts = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48, v = new THREE.Vector3().copy(va).lerp(vb, t).normalize();
      // küresel ara değer (slerp)
      const s = Math.sin(aci); if (s > 1e-4) v.copy(va).multiplyScalar(Math.sin((1 - t) * aci) / s).add(vb.clone().multiplyScalar(Math.sin(t * aci) / s));
      pts.push(v.multiplyScalar(R * 1.003 + Math.sin(Math.PI * t) * yuk));
    }
    const egri = new THREE.CatmullRomCurve3(pts);
    return { egri, geo: new THREE.TubeGeometry(egri, 80, 0.0032, 6, false) };
  }
  yayEkle(aId, bId, tip = 'kardes', { anim = true, gecikme = 0, kesik = false, sure = 1.6 } = {}) {
    const k = [aId, bId].sort().join('|') + '|' + tip;
    if (this.yaylar.has(k)) return this.yaylar.get(k);
    const nok = id => id === 'ankara' && this.o.ankara ? { lat: this.o.ankara[0], lon: this.o.ankara[1] } : this.isaret.get(id)?.y;
    const a = nok(aId), b = nok(bId); if (!a || !b) return;
    const { egri, geo } = this.yayGeo(a, b);
    const mat = new THREE.ShaderMaterial({ ...YAY, uniforms: { uRenk: { value: RENK[tip] || RENK.kardes }, uIlerleme: { value: anim ? 0 : 1 }, uZaman: { value: 0 }, uOfs: { value: Math.random() }, uSeffaf: { value: 1 }, uKesik: { value: kesik ? 1 : 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const m = new THREE.Mesh(geo, mat); m.renderOrder = 3;
    const parca = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.isik, color: RENK[tip] || RENK.kardes, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    parca.scale.setScalar(tip === 'kardes' ? 0.045 : 0.035);
    const grup = new THREE.Group(); grup.add(m, parca); this.yayGrup.add(grup);
    const yay = { k, tip, a: aId, b: bId, grup, m, mat, parca, egri, ilerleme: anim ? 0 : 1, gecikme, sure, t0: this.zaman, hiz: 0.18 + Math.random() * 0.1, faz: Math.random(), benim: false };
    grup.visible = this.katmanlar[tip] !== false;
    this.yaylar.set(k, yay); return yay;
  }
  yayKaldir(k) { const y = this.yaylar.get(k); if (!y) return; this.yayGrup.remove(y.grup); y.m.geometry.dispose(); y.mat.dispose(); y.parca.material.dispose(); this.yaylar.delete(k); }
  yaylariKur(list, anim = true) {
    const yeni = new Set(list.map(([a, b, t]) => [a, b].sort().join('|') + '|' + (t || 'kardes')));
    [...this.yaylar.keys()].forEach(k => { if (!yeni.has(k)) this.yayKaldir(k); });
    list.forEach(([a, b, t], i) => this.yayEkle(a, b, t || 'kardes', { anim, gecikme: anim ? 0.6 + i * 0.07 : 0 }));
    this.benimYaylar();
  }
  benimYaylar() { this.yaylar.forEach(y => { y.benim = !!this.o.ben && (y.a === this.o.ben || y.b === this.o.ben); }); }
  katman(tip, acik) { this.katmanlar[tip] = acik; this.yaylar.forEach(y => { if (y.tip === tip) { y.grup.visible = acik; if (acik) { y.ilerleme = 0; y.t0 = this.zaman; y.gecikme = Math.random() * .4; } } }); }

  /* ---------- Ayarlar ve efektler ---------- */
  ayarla(o = {}) {
    Object.assign(this.o, o);
    if (o.baglar) this.yaylariKur(o.baglar, true);
    if ('ben' in o) this.benimYaylar();
    this.vurgula(null); this.radarDur();
    this.etiketKat.innerHTML = ''; this.etiketEl = new Map();
  }
  vurgula(ids) {
    this.vurgu = ids ? new Set(ids) : null;
    this.isaret.forEach((m, id) => {
      const v = !this.vurgu || this.vurgu.has(id) || id === this.o.ben;
      m.hedefSeffaf = v ? 1 : 0.18; m.hedefYuk = v && this.vurgu && id !== this.o.ben ? m.yuk * 2.2 : m.yuk;
    });
  }
  ping(id, renk) {
    const m = this.isaret.get(id); if (!m) return;
    const h = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.026, 48), new THREE.MeshBasicMaterial({ color: renk || 0xffffff, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    h.position.copy(m.g.position); h.quaternion.copy(m.g.quaternion); h.rotateX(-Math.PI / 2);
    this.efektGrup.add(h); this.efektler.push({ m: h, t0: this.zaman, sure: 1.3, tip: 'ping' });
    m.olcek = 2.2;
  }
  radar(id) {
    const m = this.isaret.get(id); if (!m) return;
    this.dalga.material.uniforms.uMerkez.value.copy(m.n); this.dalga.visible = true; this.radarT0 = this.zaman; this.radarAcik = true;
  }
  radarDur() { this.radarAcik = false; }
  etiketle(ids) { this.sabitEtiket = new Set(ids || []); }

  /* ---------- Kamera ---------- */
  ucus(lat, lon, uzak = this.hedef.z, { yumusak = 1 } = {}) {
    let y = -lon * RAD; const x = lat * RAD;
    while (y - this.simdi.y > Math.PI) y -= Math.PI * 2;
    while (y - this.simdi.y < -Math.PI) y += Math.PI * 2;
    this.hedef.x = x; this.hedef.y = y; this.hedef.z = uzak; this.ucusAcik = true; this.ucusT = this.zaman; this.yumusak = yumusak;
    this.sonEtk = this.zaman;
  }
  odak(id, uzak = 2.2) { const m = this.isaret.get(id); if (m) this.ucus(m.y.lat - 4, m.y.lon, uzak); }

  /* ---------- Olaylar ---------- */
  olaylar() {
    const el = this.rd.domElement; let sur = null, hareket = 0;
    this.ray = new THREE.Raycaster(); this.fare = new THREE.Vector2();
    el.addEventListener('pointerdown', e => {
      if (!this.o.interaktif) return;
      sur = { x: e.clientX, y: e.clientY, id: e.pointerId }; hareket = 0; this.hiz.x = this.hiz.y = 0;
    });
    el.addEventListener('pointermove', e => {
      if (sur && e.pointerId === sur.id) {
        const dx = e.clientX - sur.x, dy = e.clientY - sur.y; hareket += Math.abs(dx) + Math.abs(dy);
        if (hareket > 4) {
          if (!el.hasPointerCapture(e.pointerId)) try { el.setPointerCapture(e.pointerId); } catch (_) { }
          el.style.cursor = 'grabbing';
          const k = 0.0042 * (this.simdi.z / 3.4);
          this.hedef.y += dx * k; this.hedef.x = Math.max(-1.25, Math.min(1.25, this.hedef.x + dy * k));
          this.hiz.y = dx * k; this.hiz.x = dy * k; this.ucusAcik = false;
        }
        sur.x = e.clientX; sur.y = e.clientY; this.sonEtk = this.zaman; this.ipucuGizle(); return;
      }
      this.uzerinde(e);
    });
    const birak = e => {
      if (!sur) return; el.style.cursor = 'grab';
      if (hareket < 6) { const id = this.sec(e); if (id) this.o.onSec?.(id, e); }
      sur = null;
    };
    el.addEventListener('pointerup', birak); el.addEventListener('pointercancel', () => { sur = null; });
    el.addEventListener('pointerleave', () => this.ipucuGizle());
    el.addEventListener('wheel', e => {
      if (!this.o.interaktif || this.o.tekerlekYok) return;
      e.preventDefault(); this.hedef.z = Math.max(1.75, Math.min(5.2, this.hedef.z * (e.deltaY > 0 ? 1.08 : 0.92))); this.sonEtk = this.zaman;
    }, { passive: false });
  }
  sec(e) {
    const r = this.rd.domElement.getBoundingClientRect();
    this.fare.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.fare, this.kam);
    const h = this.ray.intersectObjects(this.secilebilir, false).filter(x => this.yuzuk(x.object.parent))[0];
    return h?.object.userData.id;
  }
  yuzuk(g) { const w = new THREE.Vector3(); g.getWorldPosition(w); return w.clone().normalize().dot(this.kam.position.clone().sub(w).normalize()) > 0.05; }
  uzerinde(e) {
    if (!this.hazir) return;
    const id = this.sec(e); this.uzerindeId = id;
    this.rd.domElement.style.cursor = id ? 'pointer' : 'grab';
    if (!id || !this.o.ipucu) { this.ipucuGizle(); return; }
    const y = this.isaret.get(id).y, r = this.kok.getBoundingClientRect();
    this.ipucuEl.innerHTML = (this.o.ipucuHTML ? this.o.ipucuHTML(y) : `<b>${y.ad}</b><span>${y.yer}</span>`);
    this.ipucuEl.style.left = (e.clientX - r.left) + 'px'; this.ipucuEl.style.top = (e.clientY - r.top) + 'px';
    this.ipucuEl.classList.add('on'); this.o.onHover?.(id);
  }
  ipucuGizle() { this.ipucuEl?.classList.remove('on'); this.uzerindeId = null; }

  /* ---------- Döngü ---------- */
  boyut() {
    const w = this.kok.clientWidth || 1, h = this.kok.clientHeight || 1;
    this.rd.setSize(w, h, false); this.kam.aspect = w / h;
    // dar alanlarda küreyi sığdır
    this.uzakCarpan = w / h < 1 ? Math.min(1.7, 1 / (w / h) * 0.95) : 1;
    this.kam.updateProjectionMatrix();
    if (this.noktaMat) this.noktaMat.uniforms.uOlcek.value = h * this.rd.getPixelRatio() * 0.019;
  }
  baslat() { if (this.raf || this.yokEdildi) return; this.saat.getDelta(); const d = () => { this.raf = requestAnimationFrame(d); this.kare(); }; this.raf = requestAnimationFrame(d); }
  durdur() { cancelAnimationFrame(this.raf); this.raf = null; }
  tasi(kap, o) {
    if (this.kok.parentNode !== kap) kap.appendChild(this.kok);
    if (o) this.ayarla(o);
    this.boyut(); this.io.unobserve(this.kok); this.io.observe(this.kok); this.baslat();
  }
  kare() {
    if (!this.kok.isConnected) { this.durdur(); return; }
    if (this.gorunur === false || document.hidden) return;
    const dt = Math.min(this.saat.getDelta(), 0.05); this.zaman += dt; const z = this.zaman;

    // dönüş
    const bos = z - this.sonEtk > 2.5;
    if (!this.ucusAcik && this.o.otoDon && bos) this.hedef.y += dt * 0.07;
    if (!this.ucusAcik && !bos) { this.hiz.x *= 0.92; this.hiz.y *= 0.92; }
    const k = 1 - Math.exp(-dt * (this.ucusAcik ? 2.4 * (this.yumusak || 1) : 6));
    this.simdi.x += (this.hedef.x - this.simdi.x) * k; this.simdi.y += (this.hedef.y - this.simdi.y) * k;
    this.simdi.z += (this.hedef.z - this.simdi.z) * (1 - Math.exp(-dt * 2.6));
    if (this.ucusAcik && Math.abs(this.hedef.y - this.simdi.y) < 0.002 && Math.abs(this.hedef.x - this.simdi.x) < 0.002) this.ucusAcik = false;
    this.dunya.rotation.set(this.simdi.x, this.simdi.y, 0);
    this.kam.position.set(0, 0, this.simdi.z * (this.uzakCarpan || 1));
    this.yildiz.rotation.y = this.simdi.y * 0.15;
    if (this.noktaMat) this.noktaMat.uniforms.uZaman.value = z;

    // işaretler
    this.isaret.forEach((m, id) => {
      const acik = z > m.gecikme; const hy = acik ? m.hedefYuk : 0.0001;
      m.simdiYuk += (hy - m.simdiYuk) * (1 - Math.exp(-dt * 5));
      m.olcek += (m.hedefOlcek - m.olcek) * (1 - Math.exp(-dt * 4));
      m.seffaf += (m.hedefSeffaf - m.seffaf) * (1 - Math.exp(-dt * 5));
      const ben = id === this.o.ben, uz = id === this.uzerindeId;
      m.sut.scale.y = m.simdiYuk * (uz ? 1.35 : 1); m.sut.scale.x = m.sut.scale.z = (ben ? 1.8 : 1) * (uz ? 1.6 : 1);
      m.sut.material.opacity = 0.85 * m.seffaf;
      m.tepe.position.y = m.sut.scale.y; m.tepe.scale.setScalar((ben ? 0.09 : 0.055) * m.olcek * (uz ? 1.5 : 1) * (0.9 + 0.1 * Math.sin(z * 3 + m.faz)));
      m.tepe.material.opacity = m.seffaf; m.tepe.material.color.copy(ben ? RENK.ben : m.renk);
      const p = ((z * 0.6 + m.faz) % 1); m.halka.scale.setScalar(1 + p * (ben ? 3.2 : 2.2)); m.halka.material.opacity = (1 - p) * 0.75 * m.seffaf * (acik ? 1 : 0);
    });
    if (this.ankara) { this.ankara.elmas.rotation.y += dt * 1.5; this.ankara.isik.scale.setScalar(0.14 + 0.03 * Math.sin(z * 3)); }

    // yaylar
    this.yaylar.forEach(y => {
      const t = z - y.t0 - y.gecikme;
      if (y.ilerleme < 1) y.ilerleme = Math.max(0, Math.min(1, t / y.sure));
      const e = 1 - Math.pow(1 - y.ilerleme, 3);
      y.mat.uniforms.uIlerleme.value = e; y.mat.uniforms.uZaman.value = z;
      const vurgulu = y.benim || (this.vurgu && (this.vurgu.has(y.a) && this.vurgu.has(y.b)));
      y.mat.uniforms.uSeffaf.value = this.o.ben && !y.benim && y.tip === 'kardes' ? 0.45 : 1;
      y.mat.uniforms.uRenk.value = y.benim && y.tip === 'kardes' ? RENK.kardes : (RENK[y.tip] || RENK.kardes);
      const pt = y.ilerleme < 1 ? e : (z * y.hiz + y.faz) % 1;
      y.parca.position.copy(y.egri.getPointAt(Math.min(pt, 1)));
      y.parca.visible = y.ilerleme > 0; y.parca.material.opacity = vurgulu || y.ilerleme < 1 ? 1 : 0.7;
    });

    // efektler
    this.efektler = this.efektler.filter(f => {
      const p = (z - f.t0) / f.sure;
      if (p >= 1) { this.efektGrup.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); return false; }
      f.m.scale.setScalar(1 + p * 3.2 * Math.min(1, this.simdi.z / 3)); f.m.material.opacity = 1 - p; return true;
    });
    this.isaret.forEach(m => { if (m.olcek > 1.01) m.hedefOlcek = 1; });
    if (this.radarAcik || this.dalga.visible) {
      const u = this.dalga.material.uniforms, p = ((z - this.radarT0) % 1.6) / 1.6;
      u.uYaricap.value = p * 1.4; u.uSeffaf.value = this.radarAcik ? (1 - p) : Math.max(0, u.uSeffaf.value - dt * 2);
      if (!this.radarAcik && u.uSeffaf.value <= 0) this.dalga.visible = false;
    }

    this.rd.render(this.sahne, this.kam);
    this.etiketler();
  }
  etiketler() {
    if (!this.o.etiketler) { if (this.etiketEl?.size) { this.etiketKat.innerHTML = ''; this.etiketEl.clear(); } return; }
    this.etiketEl ??= new Map();
    const ids = new Set(this.sabitEtiket || []); if (this.o.ben) ids.add(this.o.ben);
    if (this.vurgu) this.vurgu.forEach(i => ids.add(i));
    const r = this.kok.getBoundingClientRect(), w = new THREE.Vector3();
    this.etiketEl.forEach((el, id) => { if (!ids.has(id)) { el.remove(); this.etiketEl.delete(id); } });
    ids.forEach(id => {
      const m = this.isaret.get(id); if (!m) return;
      let el = this.etiketEl.get(id);
      if (!el) { el = document.createElement('div'); el.className = 'kure-etiket' + (id === this.o.ben ? ' ben' : ''); el.textContent = m.y.ad; this.etiketKat.appendChild(el); this.etiketEl.set(id, el); }
      m.tepe.getWorldPosition(w);
      const gor = this.yuzuk(m.g) && z_ok(m);
      const p = w.project(this.kam);
      el.style.transform = `translate(${(p.x * 0.5 + 0.5) * r.width}px, ${(-p.y * 0.5 + 0.5) * r.height}px) translate(-50%, -140%)`;
      el.style.opacity = gor ? 1 : 0;
    });
    function z_ok(m) { return m.simdiYuk > 0.01; }
  }
  yokEt() {
    this.yokEdildi = true; this.durdur(); this.ro.disconnect(); this.io.disconnect();
    this.rd.dispose(); this.kok.remove();
  }
}
