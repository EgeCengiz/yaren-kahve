# Yâren — Her fincanda ortak bir hikâye

Geleneksel Türk kahvesini espresso ve modern demleme kültürüyle buluşturan hayali kahve markası **Yâren** için hazırlanmış tek sayfalık, mobil uyumlu web sitesi.

**Canlı site:** _(yayınlandığında bağlantı buraya eklenecek)_

## Çalıştırma

Gereksinim: Node.js 20.19+ (veya 22.12+)

```bash
npm install     # bağımlılıkları kur
npm run dev     # geliştirme sunucusu → http://localhost:5173
```

Üretim çıktısı için:

```bash
npm run build   # dist/ klasörüne derler
npm run preview # derlenen siteyi yerelde önizler → http://localhost:4173
```

`dist/` klasörü statik dosyalardan oluşur; Netlify, Vercel veya GitHub Pages'e doğrudan yüklenebilir.

## Neler yaptım, hangi araçları kullandım?

Siteyi **React 19 + Vite** ile, ek bir UI kütüphanesi kullanmadan düz CSS (CSS değişkenleri, grid/flex, `clamp()` ile akışkan ölçüler) yazarak kurdum. Kırık beyaz, koyu kahverengi ve zeytin yeşili paletini; ekrana sabitlenen ve kaydırdıkça ilerleyen bir hero sahnesiyle (dumanı tüten fincanla açılır; kaydırdıkça közde cezve, espresso akışı ve filtre demleme videolarına geçer, çekirdekler yörüngede döner) ve SVG filtresiyle üretilen ahşap dokuyla birleştirip geleneksel ama çağdaş bir atmosfer hedefledim. İletişim formu sunucusuz çalışır: boş alanları ve e-posta biçimini kontrol eder, ilk hatalı alana odaklanır ve geçerli gönderimde başarı mesajı gösterir. Geliştirme sürecinde yapay zekâ asistanı olarak **Claude Code** kullandım; hero sahnelerini, döngüye giren arka plan videolarını, duman ve çekirdek görsellerini Google Gemini (görsel ve Omni video modelleri) ile ürettim; yazı tipleri Google Fonts'tan (Fraunces, DM Sans), hikâye bölümündeki fotoğraf Unsplash'tan alındı.

## Sayfa bölümleri

| Bölüm | İçerik |
| --- | --- |
| Hero | Marka adı, slogan ve **Kahveleri Keşfet** butonu. Sahne ekrana sabitlenir; kaydırdıkça arka plan közde cezve, espresso akışı ve filtre demleme videolarına geçer, çekirdekler fincanın etrafında döner |
| Şerit | Kaydırma hızına ve yönüne tepki veren, kendi kendine akan yazı şeridi |
| Hikâyemiz | Kaydırdıkça kelime kelime aydınlanan metin, çerçevesinde paralaks kayan fotoğraf, dönen mühür ve sayarak beliren rakamlar |
| Kahveler | Türk Kahvesi, Espresso ve Filtre Kahve — üzerine gelince hazırlanış videosu oynayan ve imlece doğru eğilen görsel, açıklama, tat profili çubukları, tadım notları, örnek fiyat |
| İletişim | Ad, e-posta ve mesaj alanlı, doğrulamalı form; alanlar doldukça dolan fincan ve ziyaretçinin saatine göre açık/kapalı durumu |
| Alt bilgi | Ekrana girdikçe yükselen, harfleri tek tek tepki veren dev logo ve başa dön düğmesi |

## Proje yapısı

```
src/
├─ main.jsx                 # giriş noktası
├─ App.jsx                  # sayfa iskeleti
├─ components/              # her bölüm kendi .jsx + .css dosyasıyla
│  ├─ Header · Hero · Story · Products · Contact · Footer
│  ├─ Marquee.jsx           # kaydırma hızına tepki veren yazı şeridi
│  ├─ ContactForm.jsx       # form durumu, doğrulama ve başarı ekranı
│  ├─ CupMeter.jsx          # form doldukça dolan fincan
│  ├─ OpenStatus.jsx        # saate göre açık/kapalı durumu
│  ├─ CountUp.jsx           # ekrana girince sayan rakam
│  └─ Reveal.jsx            # kaydırmayla beliren içerik sarmalayıcısı
├─ data/products.js         # ürün listesi (tek veri kaynağı) ve fiyat biçimleyici
├─ utils/validateContact.js # form doğrulama kuralları
├─ hooks/useReveal.js       # IntersectionObserver kancası
├─ hooks/useScrollProgress.js # hero sahnesinin kaydırma ilerlemesi (0 → 1)
├─ hooks/useViewProgress.js # bir öğenin ekrandan geçiş ilerlemesi (paralaks, metin aydınlanması)
├─ hooks/useTilt.js         # imlece doğru eğilme
├─ hooks/useBeanSpill.js    # düğmelere tıklanınca dökülen kahve çekirdekleri
├─ styles/base.css          # renk/tipografi değişkenleri, ortak sınıflar
└─ assets/                  # fotoğraflar ve hero videoları
```

## Erişilebilirlik ve mobil uyum

- Mobil öncelikli yerleşim; 320 px'ten geniş ekranlara kadar yatay taşma yok.
- Mobilde açılır menü (`aria-expanded`, Escape ile kapanır), masaüstünde yatay menü.
- Form hataları `aria-invalid` / `aria-describedby` ile alanlara bağlı; başarı mesajı `role="status"` ile duyurulur.
- Başlık en üstte şeffaftır; kaydırılınca yüzen bir kapsüle dönüşür, etkin bölümü işaretler ve sayfa ilerlemesini ince bir çizgiyle gösterir.
- Düğmelere tıklandığında altlarından kahve çekirdekleri dökülür.
- `prefers-reduced-motion` açıkken animasyonlar ve hero sabitlemesi devre dışı kalır.

## Görsel kaynakları

- Hero sahneleri (fincan, cezve, espresso, filtre demleme), bu sahnelerin döngü videoları, duman ve kahve çekirdeği görselleri: Google Gemini ile üretildi
- Hikâye bölümündeki fotoğraf: [Unsplash](https://unsplash.com) (Unsplash Lisansı)
