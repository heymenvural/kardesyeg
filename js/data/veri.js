/* =====================================================================
   VERİ — YEG'ler, kişiler, projeler ve mesajlar tamamen kurgusaldır.
   Yeni YEG eklemek için Y dizisine bir kayıt ve KOORD'a [enlem, boylam] ekleyin.
===================================================================== */
const Y = [
  // Türkiye
  {id:'menderes',ad:'Menderes Vadisi YEG',kisa:'MV',ulke:'Türkiye',kod:'TR',yer:'Aydın · Ege',h:212,uye:38,kur:2023,dil:['Türkçe','İngilizce'],dk:'tr',kisi:['Elif Aydoğan','Proje koordinatörü'],
   urun:['incir','zeytinyağı','kestane'],onc:['kadın üreticiler','coğrafi işaret','kırsal turizm'],
   hak:'Büyük Menderes havzasında kuru incir, zeytinyağı ve kestane üreticilerini; kadın kooperatiflerini ve köy turizmi girişimlerini bir araya getiren yerel eylem grubu.',
   ara:'Kuru incir değer zinciri, ortak kalite standardı ve coğrafi işaretli ürünlerin Avrupa pazarına tanıtımı.'},
  {id:'kazdag',ad:'Kazdağları YEG',kisa:'KD',ulke:'Türkiye',kod:'TR',yer:'Balıkesir · Marmara',h:150,uye:29,kur:2023,dil:['Türkçe','İngilizce'],dk:'tr',kisi:['Burak Yılmaz','Genel sekreter'],
   urun:['zeytinyağı','keçi peyniri','şifalı bitkiler'],onc:['kırsal turizm','iklim uyumu','gençlik'],
   hak:'Kazdağları eteklerinde zeytinyağı, keçi peyniri ve şifalı bitki üreticileriyle doğa temelli kırsal turizmi geliştiren YEG.',
   ara:'Ege adalarıyla zeytin kültürü üzerine ortak etkinlik ve genç üretici değişimi.'},
  {id:'toros',ad:'Toros Yaylaları YEG',kisa:'TY',ulke:'Türkiye',kod:'TR',yer:'Mersin · Akdeniz',h:20,uye:24,kur:2024,dil:['Türkçe'],dk:'tr',kisi:['Hatice Demir','Saha sorumlusu'],
   urun:['bal','keçi peyniri','harnup'],onc:['iklim uyumu','kısa tedarik zinciri','kadın üreticiler'],
   hak:'Yörük yayla kültürünü yaşatan, arıcılık ve küçükbaş hayvancılıkta iklim uyumu çalışmaları yürüten YEG.',
   ara:'Arıcılıkta iklim uyumu ve yayla ürünlerinin doğrudan satışı.'},
  {id:'karadeniz',ad:'Doğu Karadeniz Yayla YEG',kisa:'DK',ulke:'Türkiye',kod:'TR',yer:'Rize · Karadeniz',h:160,uye:31,kur:2023,dil:['Türkçe','İngilizce'],dk:'tr',kisi:['Emre Kalkan','Proje uzmanı'],
   urun:['çay','fındık','bal'],onc:['gençlik','kırsal turizm','dijitalleşme'],
   hak:'Çay, fındık ve yayla balı üreticilerini; yayla turizmi ve genç girişimcilik programlarıyla destekleyen YEG.',
   ara:'Gençlerin kırsalda kalması için Avrupa\'dan iyi uygulama ve genç çiftçi değişimi.'},
  {id:'kapadokya',ad:'Kapadokya Kırsal YEG',kisa:'KK',ulke:'Türkiye',kod:'TR',yer:'Nevşehir · İç Anadolu',h:28,uye:27,kur:2023,dil:['Türkçe','İngilizce','Fransızca'],dk:'tr',kisi:['Zeynep Arslan','Koordinatör'],
   urun:['üzüm','pekmez','el dokuması'],onc:['kırsal turizm','kadın üreticiler','coğrafi işaret'],
   hak:'Bağcılık, pekmez ve el dokuması geleneğini kadın girişimciliği ve kırsal turizmle buluşturan YEG.',
   ara:'Kadın üretici akademisi için Avrupa\'dan eğitim ortağı.'},
  {id:'firat',ad:'Fırat Havzası YEG',kisa:'FH',ulke:'Türkiye',kod:'TR',yer:'Malatya · Doğu Anadolu',h:32,uye:33,kur:2023,dil:['Türkçe','İngilizce'],dk:'tr',kisi:['Mehmet Öztürk','Proje koordinatörü'],
   urun:['kayısı','ceviz'],onc:['kısa tedarik zinciri','dijitalleşme','iklim uyumu'],
   hak:'Kayısı ve ceviz üreticilerinin dijital satış kanallarına erişimini ve iklim uyumunu destekleyen YEG.',
   ara:'Kurutulmuş meyve pazarlaması ve ortak dijital köy pazarı.'},
  {id:'goller',ad:'Göller Bölgesi YEG',kisa:'GB',ulke:'Türkiye',kod:'TR',yer:'Isparta · Akdeniz',h:330,uye:30,kur:2023,dil:['Türkçe','İngilizce'],dk:'tr',kisi:['Selin Koç','Turizm sorumlusu'],
   urun:['gül','lavanta','elma'],onc:['kırsal turizm','coğrafi işaret','gençlik'],
   hak:'Gül ve lavanta tarlalarını köy rotalarıyla turizme açan, coğrafi işaretli ürünleri tanıtan YEG.',
   ara:'Lavanta ve gül rotaları üzerine Avrupa ile ortak turizm ürünü.'},
  {id:'trakya',ad:'Trakya Ovası YEG',kisa:'TO',ulke:'Türkiye',kod:'TR',yer:'Kırklareli · Marmara',h:200,uye:22,kur:2024,dil:['Türkçe','Bulgarca'],dk:'tr',kisi:['Can Erdem','Saha koordinatörü'],
   urun:['beyaz peynir','tahıl','bal'],onc:['kısa tedarik zinciri','gençlik'],
   hak:'Trakya\'nın süt ürünleri ve tahıl üreticilerini kısa tedarik zinciriyle şehirlere bağlayan YEG.',
   ara:'Sınır komşusu Bulgaristan ile ortak ürün tanıtımı.'},
  {id:'antep',ad:'Güneydoğu Bağları YEG',kisa:'GD',ulke:'Türkiye',kod:'TR',yer:'Gaziantep · Güneydoğu',h:10,uye:26,kur:2024,dil:['Türkçe','Arapça','İngilizce'],dk:'tr',kisi:['Ayşe Güneş','Proje uzmanı'],
   urun:['fıstık','zeytinyağı','bakır işi'],onc:['coğrafi işaret','kadın üreticiler','dijitalleşme'],
   hak:'Fıstık, zeytinyağı ve geleneksel el sanatlarında coğrafi işaret ve dijital pazarlama çalışmaları yürüten YEG.',
   ara:'Coğrafi işaret deneyimi paylaşımı ve Akdeniz zeytinyağı ağı.'},
  // Avrupa
  {id:'lavande',ad:'GAL Pays de Lavande',kisa:'PL',ulke:'Fransa',kod:'FR',yer:'Provence · Fransa',h:270,uye:44,kur:2015,dil:['Fransızca','İngilizce'],dk:'fr',kisi:['Claire Martin','Animatrice LEADER'],
   urun:['lavanta','bal','zeytinyağı'],onc:['kırsal turizm','kısa tedarik zinciri','coğrafi işaret'],
   hak:'Provence\'ın lavanta platolarında üretici pazarları ve lavanta rotaları kuran yerel eylem grubu.',
   ara:'Türkiye\'den gül ve lavanta üreten bölgelerle ortak turizm rotası.'},
  {id:'cantal',ad:'GAL Monts du Volcan',kisa:'MV',ulke:'Fransa',kod:'FR',yer:'Auvergne · Fransa',h:120,uye:36,kur:2014,dil:['Fransızca','İngilizce'],dk:'fr',kisi:['Julien Roche','Chargé de coopération'],
   urun:['peynir','bal'],onc:['gençlik','iklim uyumu','kısa tedarik zinciri'],
   hak:'Volkanik dağ köylerinde yayla peynirciliği ve genç çiftçi devri üzerine çalışan GAL.',
   ara:'Yayla ekonomisi üzerine karşılıklı ziyaret ve genç çiftçi eşleştirmesi.'},
  {id:'salento',ad:'GAL Terra degli Ulivi',kisa:'TU',ulke:'İtalya',kod:'IT',yer:'Puglia · İtalya',h:95,uye:41,kur:2014,dil:['İtalyanca','İngilizce'],dk:'it',kisi:['Giulia Conte','Coordinatrice'],
   urun:['zeytinyağı','incir','şarap'],onc:['coğrafi işaret','iklim uyumu','kadın üreticiler'],
   hak:'Zeytin ağaçlarının yeniden dikimi, iklim uyumu ve korunan menşe adlı ürünler üzerine çalışan GAL.',
   ara:'Akdeniz zeytinyağı ve incir üreticileriyle ortak kalite ağı.'},
  {id:'langhe',ad:'GAL Colline del Nocciolo',kisa:'CN',ulke:'İtalya',kod:'IT',yer:'Piemonte · İtalya',h:350,uye:39,kur:2015,dil:['İtalyanca','İngilizce'],dk:'it',kisi:['Marco Bellini','Responsabile progetti'],
   urun:['fındık','şarap','peynir'],onc:['gençlik','kırsal turizm','coğrafi işaret'],
   hak:'Fındık ve bağ tepelerinde genç çiftçi programları ve gastronomi turizmi yürüten GAL.',
   ara:'2027 genç çiftçi değişimi için Türkiye\'den fındık üreten ortak.'},
  {id:'higueras',ad:'GAL Sierra de las Higueras',kisa:'SH',ulke:'İspanya',kod:'ES',yer:'Extremadura · İspanya',h:15,uye:33,kur:2016,dil:['İspanyolca','İngilizce'],dk:'es',kisi:['Lucía Moreno','Gerente'],
   urun:['incir','peynir','zeytinyağı'],onc:['kadın üreticiler','iklim uyumu','kısa tedarik zinciri'],
   hak:'Kurak sıradağlarda incir bahçeleri ve kadın kooperatifleriyle çalışan GAL.',
   ara:'İncir kurutma teknikleri ve kadın kooperatifleri arası deneyim paylaşımı.'},
  {id:'campina',ad:'GDR Campiña del Olivo',kisa:'CO',ulke:'İspanya',kod:'ES',yer:'Endülüs · İspanya',h:45,uye:47,kur:2013,dil:['İspanyolca','İngilizce'],dk:'es',kisi:['Javier Ruiz','Técnico de proyectos'],
   urun:['zeytinyağı','portakal','bal'],onc:['dijitalleşme','kısa tedarik zinciri','gençlik'],
   hak:'Küçük zeytinyağı üreticilerini ortak dijital pazar yeri ve lojistik ile Avrupa\'ya açan grup.',
   ara:'Ortak dijital köy pazarını yeni ülkelere genişletmek.'},
  {id:'castanheiro',ad:'GAL Terras do Castanheiro',kisa:'TC',ulke:'Portekiz',kod:'PT',yer:'Trás-os-Montes · Portekiz',h:25,uye:28,kur:2016,dil:['Portekizce','İngilizce'],dk:'en',kisi:['Inês Carvalho','Coordenadora'],
   urun:['kestane','bal','el dokuması'],onc:['gençlik','iklim uyumu','dijitalleşme'],
   hak:'Dağ köylerinde kestane mirasını, arıcılığı ve dokumayı genç kuşağa aktaran GAL.',
   ara:'Kestane kültürü üzerine belgesel ve gönüllü programı.'},
  {id:'evia',ad:'LAG Evia Fig Coast',kisa:'EF',ulke:'Yunanistan',kod:'GR',yer:'Eğriboz · Yunanistan',h:200,uye:25,kur:2017,dil:['Yunanca','İngilizce'],dk:'en',kisi:['Eleni Papadaki','Project manager'],
   urun:['incir','bal','zeytinyağı'],onc:['coğrafi işaret','kadın üreticiler','kırsal turizm'],
   hak:'Ada köylerinde incir kurutma, bal ve zeytinyağı üretimini turizmle buluşturan LAG.',
   ara:'Ege\'nin iki yakasında ortak incir standardı ve ortak festival.'},
  {id:'lesvos',ad:'LAG North Aegean Islands',kisa:'NA',ulke:'Yunanistan',kod:'GR',yer:'Midilli · Yunanistan',h:190,uye:23,kur:2017,dil:['Yunanca','İngilizce','Türkçe'],dk:'en',kisi:['Nikos Stratis','Coordinator'],
   urun:['zeytinyağı','peynir','deniz tuzu'],onc:['kırsal turizm','coğrafi işaret','gençlik'],
   hak:'Kuzey Ege adalarında zeytinyağı, peynir ve deniz tuzu üreticilerini destekleyen LAG.',
   ara:'Karşı kıyıyla zeytin kültürü buluşması.'},
  {id:'rosevalley',ad:'LAG Rose Valley',kisa:'RV',ulke:'Bulgaristan',kod:'BG',yer:'Stara Zagora · Bulgaristan',h:340,uye:21,kur:2017,dil:['Bulgarca','İngilizce','Türkçe'],dk:'en',kisi:['Mila Petrova','Project officer'],
   urun:['gül','lavanta','bal'],onc:['kadın üreticiler','coğrafi işaret','kırsal turizm'],
   hak:'Gül yağı ve lavanta üretiminde kadın girişimciliğini destekleyen LAG.',
   ara:'Türkiye ile gül rotası ve sınır ötesi ürün tanıtımı.'},
  {id:'transilvania',ad:'GAL Transilvania Verde',kisa:'TV',ulke:'Romanya',kod:'RO',yer:'Mureș · Romanya',h:140,uye:34,kur:2014,dil:['Rumence','İngilizce','Macarca'],dk:'en',kisi:['Andrei Pop','Manager'],
   urun:['bal','el dokuması','peynir'],onc:['gençlik','kadın üreticiler','dijitalleşme'],
   hak:'Geleneksel dokuma ve arıcılığı genç girişimcilerle yeniden canlandıran GAL.',
   ara:'El sanatlarının dijital pazarlanması ve gençlik değişimi.'},
  {id:'zagora',ad:'LAG Dalmatian Hinterland',kisa:'DH',ulke:'Hırvatistan',kod:'HR',yer:'Split-Dalmaçya · Hırvatistan',h:205,uye:19,kur:2018,dil:['Hırvatça','İngilizce'],dk:'en',kisi:['Ivana Marić','Voditeljica'],
   urun:['zeytinyağı','lavanta','şarap'],onc:['kırsal turizm','gençlik','iklim uyumu'],
   hak:'Dalmaçya iç bölgesinde zeytin, lavanta ve bağ köylerini kırsal turizme açan LAG.',
   ara:'Lavanta rotaları ve genç gönüllü değişimi.'},
  {id:'miodu',ad:'LGD Dolina Miodu',kisa:'DM',ulke:'Polonya',kod:'PL',yer:'Podkarpacie · Polonya',h:42,uye:52,kur:2012,dil:['Lehçe','İngilizce'],dk:'en',kisi:['Katarzyna Nowak','Prezes zarządu'],
   urun:['bal','peynir','tahıl'],onc:['kısa tedarik zinciri','dijitalleşme','gençlik'],
   hak:'Küçük üreticileri çevrim içi yerel pazarla buluşturan, arı dostu köyler programı yürüten LGD.',
   ara:'Arı dostu köyler ağına Türkiye\'den arıcılık bölgesi.'},
  {id:'almtal',ad:'LEADER-Region Bergwiesen',kisa:'BW',ulke:'Avusturya',kod:'AT',yer:'Alpler · Avusturya',h:110,uye:30,kur:2013,dil:['Almanca','İngilizce'],dk:'de',kisi:['Stefan Huber','Geschäftsführer'],
   urun:['peynir','bal'],onc:['kırsal turizm','iklim uyumu'],
   hak:'Alp çayırlarında yayla peynirciliği ve iklim dostu turizm üzerine çalışan LEADER bölgesi.',
   ara:'Yayla ekonomisi ve iklim uyumu üzerine karşılıklı ziyaret.'},
  {id:'obstland',ad:'LAG Obsttal Schwaben',kisa:'OS',ulke:'Almanya',kod:'DE',yer:'Baden-Württemberg · Almanya',h:5,uye:46,kur:2014,dil:['Almanca','İngilizce'],dk:'de',kisi:['Anna Weber','Regionalmanagerin'],
   urun:['elma','meyve suyu','bal'],onc:['kısa tedarik zinciri','dijitalleşme','iklim uyumu'],
   hak:'Meyve bahçesi kültürünü ve yerel meyve suyu işletmelerini koruyan LEADER bölgesi.',
   ara:'Kurutulmuş meyve ve meyve suyu işleme üzerine teknik iş birliği.'},
  {id:'connemara',ad:'LAG Atlantic Coast West',kisa:'AC',ulke:'İrlanda',kod:'IE',yer:'Galway · İrlanda',h:155,uye:27,kur:2015,dil:['İngilizce','İrlandaca'],dk:'en',kisi:['Siobhán Kelly','LEADER officer'],
   urun:['yün dokuma','deniz ürünleri'],onc:['kırsal turizm','gençlik','dijitalleşme'],
   hak:'Atlantik kıyı köylerinde yün dokuma ve kıyı turizmini geliştiren LAG.',
   ara:'El dokuması ustalarıyla değişim ve ortak sergi.'},
  {id:'kalix',ad:'LAG Skogsbygd',kisa:'SK',ulke:'İsveç',kod:'SE',yer:'Värmland · İsveç',h:180,uye:24,kur:2015,dil:['İsveççe','İngilizce'],dk:'en',kisi:['Erik Lindqvist','Verksamhetsledare'],
   urun:['yaban mersini','bal','ahşap işi'],onc:['iklim uyumu','dijitalleşme','gençlik'],
   hak:'Orman köylerinde yabani meyve, bal ve ahşap zanaatı üzerine çalışan LAG.',
   ara:'İklim uyumu üzerine güney Avrupa ve Türkiye ile ortak öğrenme.'}
];
const YM = Object.fromEntries(Y.map(y => [y.id, y]));
const yeg = id => YM[id];

const BAGLAR = [['menderes','evia'],['menderes','higueras'],['goller','lavande'],['goller','rosevalley'],['karadeniz','langhe'],['kazdag','lesvos'],['kapadokya','cantal'],['trakya','rosevalley'],['firat','obstland'],['antep','salento'],['toros','zagora'],['salento','lesvos'],['miodu','transilvania'],['castanheiro','connemara'],['campina','higueras'],['almtal','kalix'],['firat','campina']];

const PROGRAMLAR = ['LEADER ulusötesi işbirliği','Erasmus+ · Gençlik değişimi','Erasmus+ · Küçük ölçekli ortaklık','Avrupa Dayanışma Programı','Horizon Europe · Küme 6','Ortak finansman (kendi bütçeler)'];
const PR = [
  {id:'fignet',ad:'FIG-NET · Akdeniz İncir Değer Zinciri Ağı',lider:'menderes',ortak:['evia','higueras'],aranan:2,aranProfil:'İtalya veya Portekiz\'den incir ya da kurutulmuş meyve üreten YEG',program:'LEADER ulusötesi işbirliği',butce:240000,sure:24,durum:'ortak',son:'15 Ocak 2027',tarih:'12 gün önce',etiket:['incir','coğrafi işaret','kadın üreticiler'],
   ozet:'Akdeniz\'in dört bir yanındaki incir üreticisi YEG\'leri ortak bir kalite standardı, kurutma ve depolama pilotları ve ortak pazar erişimi etrafında buluşturan iki yıllık iş birliği.',
   hedef:['Ortak kuru incir kalite ve sınıflandırma standardı','Üç ülkede güneş enerjili kurutma pilotu','Kadın kooperatifleri için ortak ambalaj ve marka','Avrupa fuarlarında ortak stant'],
   ip:[['Ortak kalite standardı',1,6],['Kurutma ve depolama pilotları',4,14],['Ortak marka ve pazar erişimi',10,22],['Yaygınlaştırma ve festival',1,24]],
   dag:[['Personel',32],['Seyahat ve toplantı',18],['Pilot ekipman',28],['Tanıtım',14],['Yönetim',8]],
   yorum:[['evia','Kalite standardı iş paketini Eğriboz kooperatifimiz yürütebilir. Sınıflandırma tablolarımızı paylaşıyorum.','2 gün önce'],['higueras','Güneş enerjili kurutma pilotu için Extremadura\'da iki köy hazır. Bütçe kalemini birlikte netleştirelim.','1 gün önce']]},
  {id:'genc2027',ad:'Genç Çiftçi Değişimi 2027',lider:'langhe',ortak:['karadeniz','transilvania'],aranan:2,aranProfil:'Genç üretici ağı olan, 18–30 yaş katılımcı gönderebilecek YEG',program:'Erasmus+ · Gençlik değişimi',butce:68000,sure:12,durum:'ortak',son:'20 Şubat 2027',tarih:'5 gün önce',etiket:['gençlik','fındık','kırsal turizm'],
   ozet:'Dört ülkeden 40 genç üreticinin Piemonte ve Rize\'de buluştuğu, fındık ve çay bahçelerinde yan yana çalıştığı iki haftalık değişim programı.',
   hedef:['40 genç üretici, 4 ülke','İki ev sahibi bölgede uygulamalı atölyeler','Genç girişim fikirleri için ortak mentorluk'],
   ip:[['Hazırlık ve katılımcı seçimi',1,4],['Piemonte buluşması',5,6],['Rize buluşması',8,9],['Takip ve yaygınlaştırma',9,12]],
   dag:[['Seyahat',38],['Organizasyon',34],['Kapsayıcılık desteği',10],['Hazırlık ziyareti',8],['Yaygınlaştırma',10]],
   yorum:[['karadeniz','Rize ayağı için yayla evlerimizden ikisini ayırdık, Ağustos sonu uygun.','3 gün önce']]},
  {id:'rotalar',ad:'Lavanta ve Gül Rotaları',lider:'lavande',ortak:['goller','rosevalley'],aranan:1,aranProfil:'Hırvatistan veya Yunanistan\'dan lavanta/aromatik bitki bölgesi',program:'LEADER ulusötesi işbirliği',butce:150000,sure:18,durum:'ortak',son:'1 Mart 2027',tarih:'3 hafta önce',etiket:['lavanta','gül','kırsal turizm'],
   ozet:'Provence, Isparta ve Kazanlak çevresindeki çiçek tarlalarını ortak bir kültür rotası, dijital rehber ve hasat festivalleri takvimiyle birbirine bağlayan proje.',
   hedef:['Üç ülkede işaretlenmiş köy rotaları','Çok dilli dijital rota rehberi','Ortak hasat festivali takvimi'],
   ip:[['Rota envanteri',1,5],['Dijital rehber',4,12],['Pilot turlar',9,16],['Festival takvimi',12,18]],
   dag:[['Rota altyapısı',30],['Dijital rehber',22],['Seyahat',20],['Tanıtım',18],['Yönetim',10]],
   yorum:[['goller','Isparta\'da Haziran hasat dönemi için üç köy rotası hazır.','1 hafta önce']]},
  {id:'arikoy',ad:'Arı Dostu Köyler',lider:'miodu',ortak:['transilvania','toros','almtal'],aranan:1,aranProfil:'Arıcılık bölgesi olan, saha verisi toplayabilecek YEG',program:'Horizon Europe · Küme 6',butce:2400000,sure:36,durum:'hazirlik',son:'Başvuru taslağı',tarih:'1 ay önce',etiket:['bal','iklim uyumu','biyoçeşitlilik'],
   ozet:'Üniversitelerle birlikte; köy ölçeğinde polinatör dostu tarım uygulamalarını test eden ve sonuçları YEG\'ler aracılığıyla üreticilere taşıyan araştırma–uygulama projesi.',
   hedef:['12 pilot köyde polinatör izleme','Arıcılar için iklim uyum rehberi','YEG\'ler aracılığıyla çiftçiye aktarım'],
   ip:[['Saha tasarımı',1,6],['Pilot uygulamalar',6,30],['Veri analizi',12,34],['Aktarım ve politika önerileri',24,36]],
   dag:[['Araştırma personeli',48],['Saha uygulamaları',22],['Seyahat',10],['Ekipman',12],['Yaygınlaştırma',8]],
   yorum:[['toros','Toros yaylalarında 4 pilot köy için muhtarlıklarla ön görüşme yaptık.','5 gün önce']]},
  {id:'akademi',ad:'Kırsal Kadın Üretici Akademisi',lider:'kapadokya',ortak:['higueras'],aranan:2,aranProfil:'Kadın kooperatifleriyle çalışan, eğitmen gönderebilecek YEG',program:'Erasmus+ · Küçük ölçekli ortaklık',butce:60000,sure:18,durum:'ortak',son:'5 Mart 2027',tarih:'4 gün önce',etiket:['kadın üreticiler','eğitim','el dokuması'],
   ozet:'Kadın üreticiler için pazarlama, ürün fiyatlandırma ve dijital satış üzerine çok dilli bir eğitim programı ve mentorluk ağı.',
   hedef:['6 modüllük eğitim seti','30 kadın üretici için mentorluk','Ortak çevrim içi vitrin'],
   ip:[['Müfredat',1,5],['Pilot eğitimler',5,12],['Mentorluk',8,16],['Değerlendirme',15,18]],
   dag:[['Eğitim içerikleri',35],['Hareketlilik',30],['Mentorluk',20],['Yönetim',15]],
   yorum:[]},
  {id:'dijipazar',ad:'Ortak Dijital Köy Pazarı',lider:'campina',ortak:['miodu','firat','castanheiro'],aranan:0,aranProfil:'',program:'LEADER ulusötesi işbirliği',butce:190000,sure:24,durum:'yurutuluyor',ilerleme:62,son:'Ay 15 / 24',tarih:'15 ay önce',etiket:['dijitalleşme','kısa tedarik zinciri'],
   ozet:'Dört ülkeden küçük üreticilerin ortak bir pazar yerinde satış yaptığı, ortak lojistik ve ödeme altyapısı kuran proje.',
   hedef:['400 üreticinin pazar yerine katılımı','Ortak kargo anlaşması','Üretici başına dijital eğitim'],
   ip:[['Platform kurulumu',1,8],['Üretici katılımı',6,18],['Lojistik pilotu',10,20],['Sürdürülebilirlik planı',18,24]],
   dag:[['Yazılım',34],['Eğitim',22],['Lojistik',18],['Tanıtım',16],['Yönetim',10]],
   yorum:[['firat','Malatya\'dan 48 kayısı üreticisi pazar yerine katıldı.','2 hafta önce']]},
  {id:'zeytin',ad:'Ege\'nin İki Yakası Zeytin Buluşması',lider:'lesvos',ortak:['kazdag'],aranan:1,aranProfil:'Zeytinyağı üreten bir Türk veya Yunan YEG\'i',program:'Ortak finansman (kendi bütçeler)',butce:42000,sure:10,durum:'yurutuluyor',ilerleme:35,son:'Ay 4 / 10',tarih:'4 ay önce',etiket:['zeytinyağı','kırsal turizm'],
   ozet:'Midilli ve Kazdağları arasında zeytin hasadı döneminde karşılıklı üretici ziyaretleri ve ortak tadım günleri.',
   hedef:['İki karşılıklı ziyaret','Ortak tadım ve sınıflandırma günü','Kıyılar arası zeytin rotası'],
   ip:[['Planlama',1,2],['Midilli ziyareti',3,4],['Kazdağları ziyareti',6,7],['Ortak tadım günü',8,10]],
   dag:[['Seyahat',45],['Organizasyon',30],['Tanıtım',15],['Diğer',10]],
   yorum:[]},
  {id:'kestane',ad:'Kestane Mirası Belgesel Serisi',lider:'castanheiro',ortak:['karadeniz'],aranan:1,aranProfil:'Kestane üreten ve genç gönüllü ağırlayabilecek YEG',program:'Avrupa Dayanışma Programı',butce:34000,sure:12,durum:'ortak',son:'10 Şubat 2027',tarih:'9 gün önce',etiket:['kestane','gençlik','belgesel'],
   ozet:'Genç gönüllülerin üç ülkede kestane ormanlarını, hasat geleneğini ve ustaları belgeleyerek kısa filmler ürettiği dayanışma projesi.',
   hedef:['3 ülkede kısa belgesel','12 genç gönüllü','Köylerde açık hava gösterimleri'],
   ip:[['Hazırlık',1,3],['Çekimler',4,9],['Kurgu',8,11],['Gösterimler',11,12]],
   dag:[['Gönüllü destekleri',42],['Ekipman',24],['Seyahat',20],['Gösterimler',14]],
   yorum:[]}
];

const MESAJ0 = {
  evia:[{k:'evia',t:"Hi! We saw your FIG-NET call. Our cooperative in Evia dries around 40 tonnes of figs every season and we'd love to lead the quality-standard work package.",tr:"Merhaba! FIG-NET çağrınızı gördük. Eğriboz'daki kooperatifimiz her sezon yaklaşık 40 ton incir kurutuyor; kalite standardı iş paketini yürütmeyi çok isteriz.",z:'Dün 14:20'},
        {k:'ben',t:'Merhaba Eleni! Çok sevindik. Kurutma rafları ve sınıflandırma üzerine bir taslak hazırladık, bu hafta paylaşacağız.',z:'Dün 15:02'},
        {k:'evia',t:"Great, thank you! Could we schedule a short video call next Tuesday, together with Lucía from Extremadura?",tr:"Harika, teşekkürler! Gelecek salı Extremadura'dan Lucía'nın da katılacağı kısa bir görüntülü görüşme planlayabilir miyiz?",z:'Dün 15:40'}],
  higueras:[{k:'higueras',t:'¡Hola! El martes me va perfecto. ¿Os parece a las 11:00, hora de Madrid?',tr:'Merhaba! Salı benim için çok uygun. Madrid saatiyle 11:00 olur mu?',z:'Bugün 09:14'}],
  lavande:[{k:'lavande',t:"Bonjour ! Votre expérience en tourisme rural et en indication géographique nous intéresse beaucoup pour les « Routes de la lavande ».",tr:'Merhaba! “Lavanta Rotaları” için kırsal turizm ve coğrafi işaret deneyiminiz bizi çok ilgilendiriyor.',z:'Pzt 10:12'}],
  langhe:[{k:'langhe',t:'Ciao! Per lo scambio giovani del 2027 cerchiamo ancora due partner. Avete giovani agricoltori interessati?',tr:'Merhaba! 2027 gençlik değişimi için hâlâ iki ortak arıyoruz. İlgilenen genç çiftçileriniz var mı?',z:'Paz 18:30'}],
  goller:[{k:'goller',t:'Merhaba, YEGFEST uluslararası alanında stantlarımızı yan yana koyabilir miyiz? Gül ve incir aynı tezgâhta güzel durur.',z:'Cum 16:05'}]
};
const CEVAP = {
  en:['Thanks for your message! I\'ll discuss it with our team and get back to you this week.','Mesajınız için teşekkürler! Ekibimizle görüşüp bu hafta içinde size dönüş yapacağım.'],
  fr:['Merci pour votre message ! J\'en parle avec notre équipe et je reviens vers vous cette semaine.','Mesajınız için teşekkürler! Ekibimizle konuşup bu hafta içinde size döneceğim.'],
  it:['Grazie del messaggio! Ne parlo con il nostro gruppo e vi rispondo entro la settimana.','Mesajınız için teşekkürler! Ekibimizle konuşup hafta içinde size döneceğim.'],
  es:['¡Gracias por tu mensaje! Lo comento con nuestro equipo y te respondo esta semana.','Mesajınız için teşekkürler! Ekibimizle konuşup bu hafta size döneceğim.'],
  de:['Danke für Ihre Nachricht! Ich bespreche das mit unserem Team und melde mich diese Woche.','Mesajınız için teşekkürler! Ekibimizle görüşüp bu hafta size döneceğim.'],
  tr:['Mesajın için teşekkürler! Ekiple konuşup bu hafta içinde dönüş yapıyorum.',null]
};
const DIL_AD = {en:'İngilizce',fr:'Fransızca',it:'İtalyanca',es:'İspanyolca',de:'Almanca',tr:'Türkçe'};

const ETKINLIK = [
  {g:'18',a:'Kas',ad:'Çevrim içi tanışma: Ulusötesi işbirliği nasıl kurulur?',d:'15:00 TSİ · 26 YEG kayıtlı'},
  {g:'24',a:'Kas',ad:'FIG-NET ortak toplantısı',d:'11:00 TSİ · Video görüşme'},
  {g:'03',a:'Ara',ad:'YEGFEST uluslararası katılım koordinasyonu',d:'14:00 TSİ · Ankara + çevrim içi'},
  {g:'12',a:'Ara',ad:'Erasmus+ gençlik değişimi başvuru atölyesi',d:'10:30 TSİ · Çevrim içi'}
];

const URUN_EMOJI = {'incir':'🟣','zeytinyağı':'🫒','kestane':'🌰','keçi peyniri':'🧀','peynir':'🧀','beyaz peynir':'🧀','şifalı bitkiler':'🌿','bal':'🍯','harnup':'🌿','çay':'🍵','fındık':'🌰','üzüm':'🍇','şarap':'🍇','pekmez':'🍯','el dokuması':'🧶','yün dokuma':'🧶','kayısı':'🍑','ceviz':'🌰','gül':'🌹','lavanta':'💜','elma':'🍎','tahıl':'🌾','fıstık':'🥜','bakır işi':'🔨','portakal':'🍊','deniz tuzu':'🧂','deniz ürünleri':'🐟','meyve suyu':'🧃','yaban mersini':'🫐','ahşap işi':'🪵'};
const MEVSIM = {'incir':[7,8,9],'zeytinyağı':[10,11,12],'kestane':[9,10,11],'bal':[5,6,7,8],'çay':[5,6,7,8,9],'fındık':[8,9],'üzüm':[8,9,10],'şarap':[9,10],'kayısı':[6,7],'ceviz':[9,10],'gül':[5,6],'lavanta':[6,7,8],'elma':[8,9,10],'portakal':[11,12,1,2],'yaban mersini':[7,8]};


/* Coğrafi konumlar [enlem, boylam] — 3D küre için */
const KOORD = {"menderes":[37.88,28.3],"kazdag":[39.62,26.85],"toros":[36.95,33.9],"karadeniz":[40.85,40.45],"kapadokya":[38.62,34.75],"firat":[38.35,38.3],"goller":[37.85,30.55],"trakya":[41.7,27.25],"antep":[37.1,37.4],"lavande":[44.05,5.25],"cantal":[45.05,2.65],"salento":[40.2,18.15],"langhe":[44.65,8.0],"higueras":[39.45,-6.2],"campina":[37.55,-4.45],"castanheiro":[41.8,-6.75],"evia":[38.6,24.0],"lesvos":[39.2,26.3],"rosevalley":[42.62,25.4],"transilvania":[46.3,24.8],"zagora":[43.62,16.45],"miodu":[49.8,22.4],"almtal":[47.4,13.6],"obstland":[48.5,9.35],"connemara":[53.42,-9.6],"kalix":[59.3,15.2]};
const ANKARA = [39.93, 32.85];
Y.forEach(y => { [y.lat, y.lon] = KOORD[y.id]; });

/* ES modüllerinin (3D, tanıtım sayfası) erişimi için */
window.VERI = { Y, YM, BAGLAR, PR, PROGRAMLAR, URUN_EMOJI, ANKARA };
