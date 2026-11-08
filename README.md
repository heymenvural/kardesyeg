# YEG Kardeş · Türkiye–Avrupa YEG Ağı (prototip)

Türkiye ve Avrupa'daki Yerel Eylem Gruplarının (YEG) tanıştığı, kardeş YEG olduğu, ortak proje kurduğu ve YEGFEST'te buluştuğu platformun tıklanabilir prototipi.

> **Prototip · resmî site değildir.** YEG'ler, kişiler, projeler ve mesajlar kurgusaldır. Değişiklikler yalnızca tarayıcıda (`localStorage`) tutulur.

## Sayfalar

| Adres | İçerik |
|---|---|
| `/` (`index.html`) | Tanıtım: sabit 3D dünya küresi, kaydırdıkça değişen sahneler, 3D festival salonu turu |
| `/platform` (`platform.html`) | Platform: genel bakış, ağ küresi/haritası, YEG profilleri, kardeş eşleştirme, ortak projeler ve proje oluşturma, festival daveti (3D salon), mesajlar, fon rehberi |

Platformda doğrudan bir bölüme bağlantı verilebilir, örn. `platform.html#eslesme`, `platform.html#festival`, `platform.html#yeg/evia`.

## Klasör yapısı

```
index.html            tanıtım sayfası
platform.html         platform kabuğu
css/
  app.css             platform arayüzü
  uc3.css             3D görünümler, segment düğmeleri, kart eğme efekti
  landing.css         tanıtım sayfası
js/
  data/veri.js        YEG'ler, projeler, mesajlar, koordinatlar  ← içerik buradan düzenlenir
  data/harita2d.js    2D Avrupa–Türkiye haritası
  3d/kure.js          Three.js dünya küresi (nokta bulutu, ışık sütunları, akan yaylar)
  3d/salon.js         Three.js YEGFEST salonu (stantlar, ziyaretçiler, LED ekran, kamera turu)
  3d/index.js         3D modüllerini platforma açar (window.YEG3D)
  platform/           platform mantığı (durum, arayüz, akış, 2D harita, 3D köprüsü)
  platform/sayfalar/  her sayfa ayrı dosya
  landing.js          tanıtım sahneleri (GSAP ScrollTrigger)
data/kure.json        küre kara noktaları ve sınırlar (world-atlas'tan üretildi)
vendor/               three.js 0.160, OrbitControls, GSAP 3.12 (yerel kopya, CDN gerekmez)
```

## Yeni YEG veya proje eklemek

- **YEG:** `js/data/veri.js` içinde `Y` dizisine bir kayıt, `KOORD` nesnesine `[enlem, boylam]` ekleyin. 2D haritada da görünmesi için `js/data/harita2d.js` içindeki `pts` alanına izdüşüm koordinatı gerekir (3D küre koordinatı doğrudan kullanır).
- **Kardeş bağı:** `BAGLAR` dizisine `['yeg1','yeg2']`.
- **Proje:** `PR` dizisine mevcut kayıtlardan birini örnek alarak ekleyin.

## Yerelde çalıştırma

ES modülleri ve `fetch` kullanıldığı için dosyayı çift tıklayarak değil, küçük bir sunucuyla açın:

```bash
npx serve .
# veya
python -m http.server 8000
```

## Yayın

Vercel'de "Other" çerçevesiyle, build adımı olmadan statik olarak yayınlanır. `main` dalına her push otomatik yayınlanır.
