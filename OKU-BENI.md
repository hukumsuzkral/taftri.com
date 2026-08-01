# Taftri — Güncelleme Paketi

Bu klasörde iki iş var:
1. **Google'da çıkan yuvarlak logo (favicon) + düzgün SEO**
2. **Renk paletini bozmayan ekstra animasyonlar**

---

## 📦 Klasördeki dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `favicon.ico` | Google + tüm tarayıcılar için ana logo |
| `favicon.svg` | Keskin, ölçeklenen modern logo |
| `favicon-16.png` / `favicon-32.png` / `favicon-192.png` / `favicon-512.png` | Farklı boyutlar |
| `apple-touch-icon.png` | iPhone/iPad ana ekran ikonu |
| `og-image.png` | WhatsApp / Instagram / LinkedIn'de link atınca çıkan kart görseli |
| `site.webmanifest` | Android ikon tanımı |
| `robots.txt` | Google'a "her yeri tara" der |
| `sitemap.xml` | Site haritası (Google daha hızlı bulur) |
| `1-HEAD-bloğu-degistir.html` | index.html'e yapıştırılacak SEO+favicon kodu |
| `2-ANIMASYON-body-sonuna-ekle.html` | index.html'e eklenecek animasyon kodu |

---

## ✅ Adım adım (GitHub üzerinden)

### 1) Dosyaları repoya yükle
Şu dosyaların **hepsini** repo'nun **ANA (root) klasörüne** yükle
(index.html hangi klasördeyse aynı yere):

```
favicon.ico
favicon.svg
favicon-16.png
favicon-32.png
favicon-192.png
favicon-512.png
apple-touch-icon.png
og-image.png
site.webmanifest
robots.txt
sitemap.xml
```

GitHub'da: repo → **Add file → Upload files** → hepsini sürükle → **Commit**.

### 2) index.html içindeki HEAD bölümünü değiştir
- `index.html`'i GitHub'da aç → kalem (✏️) ikonu.
- En üstte `<head>` ile `<style>` arasındaki **eski meta + favicon + script(ld+json)** kısmını sil.
- Yerine `1-HEAD-bloğu-degistir.html` içeriğini yapıştır.
- ⚠️ `<style> ... </style>` (uzun CSS) kısmına **DOKUNMA**.

### 3) Animasyonları ekle
- Aynı `index.html`'de en altta `</body>` etiketini bul.
- `2-ANIMASYON-body-sonuna-ekle.html` içeriğini `</body>`'den **hemen önce** yapıştır.
- **Commit changes**.

---

## 🔍 "Google'da yuvarlak logo neden hemen çıkmaz?" — Açıklama

Favicon'un aramada görünmesi senin elinde değil, **Google'ın siteyi yeniden taramasına** bağlı. Kurallar:

1. **Logo gerçek bir dosya olmalı** → `favicon.ico` artık kök dizinde (halloldu).
2. **Ana sayfada `<link rel="icon">` ile tanımlı olmalı** → HEAD bloğunda hallettik.
3. **Boyut en az 48x48 olmalı** → bizimki 16/32/48/64 içeriyor (halloldu).
4. **Robots.txt engellememeli** → bizim robots.txt "Allow: /" diyor (halloldu).
5. **Google yeniden taramalı** → burada beklemek gerek: **birkaç günden 2-4 haftaya** kadar sürebilir.

### Hızlandırmak için (ÖNEMLİ)
- **Google Search Console** aç (ücretsiz): https://search.google.com/search-console
  - Siteni ekle (Domain: `taftri.com`), doğrula.
  - Üstteki arama kutusuna `https://taftri.com/` yaz → **"Dizine ekleme isteği / Request indexing"** tıkla.
  - **Sitemaps** bölümüne `sitemap.xml` gönder.
- Bu, hem faviconun hem de yeni SEO açıklamasının Google'a daha çabuk yansımasını sağlar.

### Kontrol
Yükledikten sonra tarayıcıda şunu aç, logo çıkmalı:
`https://taftri.com/favicon.ico`  →  çıkıyorsa iş tamam, gerisi Google'ın tarama süresi.

---

## 📝 SEO tarafında ne değişti?

- **Başlık (title):** "360° Dijital Büyüme Ajansı" → "**360° Dijital Pazarlama & E-Ticaret Ajansı**" (arama yapılan kelimelere daha yakın).
- **Açıklama (description):** Trendyol + web tasarım eklendi, daha zengin.
- **og:image eklendi:** Artık WhatsApp/Instagram/LinkedIn'e link atınca boş görünmez, **markalı kart** çıkar.
- **robots.txt + sitemap.xml** eklendi → Google daha hızlı ve eksiksiz tarar.
- **Yapısal veri (schema)** güncellendi: logo + görsel bilgisi eklendi.

## 🎬 Animasyon tarafında ne eklendi? (palet korundu)
- Kartlar ve başlıklar aşağıdan **yumuşak kayarak belirir** (kademeli).
- Altın renkli başlık kelimelerinde ince, sürekli **parıltı**.
- Menü linklerinde **altın alt-çizgi** animasyonu.
- Hizmet kutularında hafif **yukarı kalkma + kenar parlaması**.
- "Hareket azalt" tercihi olan cihazlarda animasyonlar otomatik kapanır.
