# Mimari Kararlar ve Strateji Dokümanı (Architecture Decisions Record - ADR)

Bu doküman, Next.js e-ticaret projesi boyunca alınan teknik ve mimari kararları, işleme/rendering stratejilerini (ISR, SSR, SSG, PPR, CSR), caching (önbellekleme) yapılandırmalarını ve SEO/performans tercihlerini kayıt altında tutmak amacıyla oluşturulmuştur.

---

## 📜 İş Birliği ve Geliştirme Prensipleri

1. **Önce Anlat, Sonra Yaz Kuralı:**
   - Herhangi bir sayfa, mimari veya bileşen geliştirilmeden önce teknik strateji (render modeli, caching, SEO etkisi, DB yükü, dinamik/statik ayrımı) tartışılacak.
   - Karşılıklı soru-cevap ve fikir alışverişi tamamlandıktan ve fikir birliğine varıldıktan sonra kodlama aşamasına geçilecek.

2. **Bana Açıkla Refleksi:**
   - Yazılan her koddaki kritik tercihler (middleware matcher yapılandırması, Server Action stratejileri, cache revalidation süreleri, state yönetimi vb.) detaylıca açıklanacak ve yöneltilen sorular yanıtlanacak.

3. **Mimari Kayıt (ADR) Düzeni:**
   - Alınan her mimari karar, gerekçeleri ve değerlendirilen alternatifleriyle birlikte bu dokümana eklenecek.

---

## 🏛️ Mimari Kararlar Logu

### 1. ADR-001: Design System (MUI) ve Ürün Detay Sayfası Rendering Stratejisi
- **Tarih:** 2026-07-22
- **Karar:**
  1. **MUI Tema & Tasarım:** Tüm buton ve bileşenlerde tutarlılık için `border-radius: 8px` kullanılacak. Buton hover ve focus durumları kullanıcı etkileşimini net hissettirecek belirgin efektlerle (focus ring, renk değişimi) özelleştirilecek.
  2. **Ürün Detay Sayfası Hibrit Render (ISR + Suspense Streaming):**
     - **Statik Kabuk (ISR - 1 Saat Revalidation):** Ürün Başlığı, Açıklama, Görseller, Kategori bilgisi ve Özellikler önceden statik render edilip CDN/önbellekte saklanacak.
     - **Dinamik İçerik (Suspense Dynamic Holes):** Anlık Stok Bilgisi, Canlı Fiyat/İndirim ve Kullanıcı Değerlendirmeleri `<Suspense>` sınırı içine alınarak sunucu taraflı stream edilecek.
- **Gerekçe:**
  - Sayfa ilk açılış süresini (TTFB ve LCP) milisaniyelere indirmek ve mükemmel SEO puanı elde etmek.
  - Stok veya fiyat değiştiğinde ürün görsellerinin ve ağır statik içeriklerin tekrar render edilmesini önlemek, DB sorgu maliyetini düşürmek.
- **Değerlendirilen Alternatifler:**
  - *Full SSR:* Her istekte tüm sayfanın DB'den çekilmesi sunucuya aşırı yük bindirir.
  - *Full CSR:* Arama motorları (SEO) açısından olumsuz ve ilk açılışta beyaz ekran riski taşır.

### 2. ADR-002: Header, Navbar & Hero Yapısı ve Yalın JSX İlkeleri
- **Tarih:** 2026-07-23
- **Karar:**
  1. **Yalın JSX Mantığı (Aşırı İç İçe Box/Grid Kullanımından Kaçınma):** Kod okunabilirliğini artırmak için gereksiz iç içe `Box`, `Grid`, `Stack` sarmalamalarından kaçınılacak. Semantik HTML elemanları (`header`, `nav`, `section`) ve MUI'nin doğrudan Flex düzen fonksiyonları (örn: `display: 'flex'`, `justifyContent: 'space-between'`) doğrudan ana bileşene verilecek.
  2. **Bileşen Mimarisi:**
     - **Announcements:** Sunucu bileşeni (`Box` + `Typography`).
     - **Navbar:** Floating Card mimarisi. Masaüstü görünümü ve mobil gezinme için performans dostu izole `Drawer` yapısı.
     - **Hero:** Tek seviye MUI `Grid` yapısı ile görsel ve metin katmanının dengeli responsive dizilimi.
- **Gerekçe:**
  - Aşırı iç içe geçmiş JSX katmanları ("DIV soup") okunabilirliği ve bakım kolaylığını düşürür.
  - MUI temamızdaki renk ve shape token'ları doğrudan kullanarak stil tutarlılığı sağlanır.

### 3. ADR-003: Storefront Kategori ve Ürün Kartları Bileşen Mimarisi
- **Tarih:** 2026-07-23
- **Karar:**
  1. **Server Component Mimarisi:** `CategorySection`, `ProductCard` ve `FeaturedProducts` bileşenleri %100 Server Component olarak inşa edilecek. İstemci tarafında sıfır JavaScript yükü ile çalışacak.
  2. **MUI Card & Responsive Grid Yapısı:** `ProductCard` içinde semantik MUI `Card`, `CardMedia`, `CardContent` bileşenleri tercih edilerek iç içe div kirliliği önlenecek.
  3. **İngilizce Mock Data:** Phase 2 kapsamında statik arayüz doğrulaması için Figma uyumlu İngilizce mock ürün verileri (`src/lib/mockData.ts`) kullanılacak.
- **Gerekçe:**
  - Liste sayfalarının SEO ve LCP (Largest Contentful Paint) performansını zirvede tutmak.
  - Kod okunabilirliğini korumak ve tema renk/radius değişkenleriyle tam uyum sağlamak.

### 4. ADR-004: Storefront Footer Mimarisi & Semantik HTML
- **Tarih:** 2026-07-24
- **Karar:**
  1. **Server Component & Semantik Yapı:** `Footer` bileşeni `<Box component="footer">` ile semantik `<footer>` olarak %100 Server Component mimarisinde geliştirilecek.
  2. **Yalın Düzen (No DIV Soup):** Marka, Navigasyon Link Sütunları (Shop, Support, Company) ve Telif Hakları bölümleri MUI `Container` + `Grid` yapısıyla aşırı iç içe geçmiş kutu karmaşası olmadan dizayn edilecek.
  3. **SEO Taranabilirliği:** Tüm footer linkleri taranabilir Next.js `<Link>` elemanı ile sarmalanacak.
- **Gerekçe:**
  - Arama motorlarının site içi sayfa hiyerarşisini ve linklerini rahat tarlayabilmesi.
  - Temadaki varsayılan `background.paper` ve `divider` token'ları ile görsel bütünlük.

### 5. ADR-005: Route Groups ((store)) ve Mağaza Düzeni (Store Layout Mimarisi)
- **Tarih:** 2026-07-24
- **Karar:**
  1. **Route Group Mimarisi:** Mağaza gezinti sayfaları (`/`, `/products`, `/cart` vb.) `src/app/(store)` rota grubu altında toplanacak.
  2. **Shared Store Layout:** `Announcements`, `Navbar` ve `Footer` bileşenleri ile `min-h-screen flex flex-col` ve `<main className="flex-grow">` düzeni `src/app/(store)/layout.tsx` dosyasına taşınacak.
  3. **Yalın Sayfalar:** `(store)/page.tsx` ve diğer mağaza alt sayfaları yalnızca kendi özgün içeriklerini (Hero, Filtreler, Detay vb.) dönecek.
- **Gerekçe:**
  - Tekrar eden kodları (DRY - Don't Repeat Yourself) önlemek.
  - Auth (`/login`) ve Admin (`/admin`) sayfalarının Mağaza Header/Footer bileşenlerinden etkilenmesini önleyerek modüler rota izolasyonu sağlamak.

### 6. ADR-006: URL-Driven Product Filtering & On-Demand Revalidation Architecture
- **Tarih:** 2026-07-25
- **Karar:**
  1. **URL State Tabanlı Filtreleme:** Ürün arama, kategori, fiyat ve sıralama durumları Redux/Local State yerine URL parametrelerinde (`searchParams` / `useSearchParams`) saklanacak (Örn: `/products?category=audio&sort=price-asc`).
  2. **Server-Side Data Filtering (SSR):** `/products` ana bileşeni Server Component olarak `searchParams` prop'unu okur ve veritabanından/mockData'dan filtrelenmiş veriyi sunucuda hazırlar.
  3. **On-Demand Tag Revalidation (`revalidateTag`):** İleride ürün resmi, stoğu veya fiyatı güncellendiğinde tüm sayfa yeniden derlenmeyecek veya yok edilmeyecek. Admin panelinden `revalidateTag('products')` tetiklenerek önbellekteki ürün kopyası milisaniyelik hızla ve sıfır sunucu yüküyle güncellenecek.
- **Gerekçe:**
  - Paylaşılabilir URL'ler (shareable links), mükemmel arama motoru indekslemesi (SEO) ve ilk yükleme hızı.
  - Sunucu yükünü ve DB sorgu maliyetini en aza indirirken anında veri güncelliği elde etmek.

### 7. ADR-007: Product Detail Page Hybrid ISR & Dynamic Suspense Architecture
- **Tarih:** 2026-07-25
- **Karar:**
  1. **Statik Kabuk (ISR):** Ürün detay sayfasındaki başlık, açıklama, kategori, görseller ve teknik özellikler ISR (`revalidate: 3600`) ile önceden statik HTML olarak üretilip CDN/önbellekte saklanacak. 0ms TTFB sağlar.
  2. **Dinamik İçerik (Suspense Streaming):** Anlık Stok ve Canlı Fiyat bilgisi `LiveStockAndPrice` sunucu bileşeni ile `<Suspense>` sınırı içerisine alınacak. Stok değişse dahi ürünün yüksek çözünürlüklü görselleri ve statik metinleri tekrar render edilmeyecek.
  3. **Metadata & Schema.org (JSON-LD):** Dynamic Next.js `generateMetadata({ params })` ile ürüne özel meta etiketleri ve Google arama botları için `Product` Schema.org JSON-LD yapısı üretilecek.
- **Gerekçe:**
  - Maksimum SEO puanı ve anında sayfa açılış hızı elde etmek.
  - Ağır statik içeriklerin stok değişikliklerinden etkilenmesini önleyerek sunucu maliyetini en aza indirmek.

### 8. ADR-008: Clean Category Path Segment Routing (/products/[category] & /categories)
- **Tarih:** 2026-07-25
- **Karar:**
  1. **Clean Path Segment Routing:** Kategoriye özel ürün listelemelerinde `?category=audio` yerine `/products/audio` temiz rota yapısı tercih edilecek. Arama ve sıralama filtreleri (`?sort=price-asc`) bu temiz URL üzerine eklenecek.
  2. **Kategori Vitrini (`/categories`):** Tüm kategorilerin görsel kartlarla sergilendiği bağımsız vitrin sayfası oluşturulacak. Kartlara tıklandığında doğrudan `/products/[category]` temiz rotasına yönlendirilecek.
  3. **Sıfır Kod Tekrarı (DRY):** `/products` ve `/products/[category]` sayfaları aynı filtreleme me kart render motorunu paylaşacak.
- **Gerekçe:**
  - Akılda kalıcı, kullanıcı dostu URL yapısı (Clean UX) ve güçlü arama motoru (SEO) indekslemesi.

### 9. ADR-009: Client-Side Cart State & Redux Toolkit Architecture
- **Tarih:** 2026-08-06
- **Karar:**
  1. **İstemci Tarafı State Yönetimi (CSR + Redux Toolkit):** Sepet verisi kullanıcıya özel ve anlık dinamik etkileşim gerektirdiğinden Redux Toolkit (`cartSlice`) ile yönetilecek.
  2. **Hibrit Hydration & LocalStorage Persist:** SSR/CSR uyumsuzluklarını (Hydration Mismatch) önlemek adına sepet verisi istemci tarafında `useEffect` ile `localStorage` katmanından okunacak ve Redux state'ine aktarılacak (`hydrateCart`).
  3. **Çift Yönlü Sepet Arayüzü (CartDrawer + /cart Page):**
     - **CartDrawer (Mini-Cart):** Navbar sepet ikonuna basıldığında veya "Add to Bag" tetiklendiğinde açılan slide-over çekmece bileşeni.
     - **Full Cart Page (`/cart`):** Detaylı miktar değiştirme/silme, ücretsiz kargo ilerleme çubuğu (Free Shipping Threshold), promo kod girdisi ve sipariş özeti kartı içeren ana sayfa.
- **Gerekçe:**
  - Sıfır sunucu/DB maliyeti ile milisaniyelik sepet güncellemeleri elde etmek.
  - Sayfa yenilense dahi kullanıcının sepet içeriğini kaybetmemesini sağlamak (Persisted State).

### 10. ADR-010: Authentication & User Management Architecture (Clerk Integration)
- **Tarih:** 2026-08-06
- **Karar:**
  1. **Yönetilen Auth Katmanı (Clerk):** Kimlik doğrulama, kullanıcı oturumları, şifreleme ve OAuth entegrasyonu (Google, GitHub vb.) için `@clerk/nextjs` kullanılacak.
  2. **Next.js Middleware Güvenliği (`middleware.ts`):** `clerkMiddleware` ve `createRouteMatcher` ile `/`, `/products`, `/categories`, `/cart` gibi mağaza sayfaları her ziyaretçiye açık bırakılırken; `/account`, `/checkout`, `/admin` rotaları korumalı (protected) alan ilan edilecek.
  3. **Catch-All Auth Rotaları (`(auth)` Route Group):** Giriş ve kayıt ekranları Next.js catch-all rotalarında (`/login/[[...login]]`, `/create-account/[[...create-account]]`) Clerk `<SignIn />` ve `<SignUp />` bileşenleri MUI temamıza uyumlu biçimde sarmalanarak inşa edilecek.
  4. **Canlı Navbar Kullanıcı Durumu:** `navbar.tsx` içerisinde `<SignedIn>` ve `<SignedOut>` durum bileşenleri ile oturum açan kullanıcıya avatar (`<UserButton />`), açmayan kullanıcıya "Sign In" butonu sunulacak.
- **Gerekçe:**
  - Özel şifre doğrulama ve JWT yönetimi kodlamadan yüksek güvenlikli, çok faktörlü (MFA) kimlik doğrulama mimarisi elde etmek.
  - Sunucu yükünü ve DB sorgu karmaşıklığını en aza indirmek.

### 11. ADR-011: Global Search Modal & URL-Driven Search Architecture
- **Tarih:** 2026-08-17
- **Karar:**
  1. **İnteraktif Arama Modalı (`SearchModal.tsx`):** Navbardaki arama ikonuna basıldığında açılan, otomatik odaklanan ve popüler arama etiketleri içeren bir modal geliştirildi. Kullanıcı yazdıkça eşleşen ürünler canlı önizleme olarak sunuldu.
  2. **URL-State Tabanlı Tam Arama (`/products?search=...`):** Arama formu gönderildiğinde veya klavyede `Enter` tuşuna basıldığında arama terimi URL parametresine aktarılarak `/products?search={term}` rotasına yönlendirildi.
  3. **Server-Side Ürün Arama Filtrelemesi:** `/products` ve `/products/[category]` sayfaları Server Component olarak `searchParams.search` sorgusunu ürün başlığı ve kategorilerinde sunucu tarafında filtreleyerek SEO ve sayfa paylaşılabilirliğini korudu.
- **Gerekçe:**
  - Hızlı canlı ürün önizlemesi ile kullanıcı deneyimini (UX) artırmak.
  - Arama sonuçlarını paylaşılabilir ve taranabilir URL'ler üzerinde tutarak arama motoru optimizasyonunu (SEO) desteklemek.

### 12. ADR-012: Database Schema & Prisma ORM Data Layer Architecture
- **Tarih:** 2026-08-24
- **Karar:**
  1. **İlişkisel Veritabanı Modelleri (`schema.prisma`):** E-ticaret domainimiz için `User`, `Category`, `Product`, `ProductImage`, `Review`, `Order`, `OrderItem`, `Address` ilişkisel veri modelleri PostgreSQL üzerinde Prisma ORM ile tanımlandı.
  2. **Prisma Client Singleton Katmanı (`src/lib/prisma.ts`):** Next.js App Router sıcak yeniden yükleme (HMR) sürecinde DB bağlantı havuzunun (connection pool) dolmasını önlemek adına küresel `prisma` singleton örneği oluşturuldu.
  3. **Tip Güvenli Veri Erişim Katmanı (`src/lib/db/`):** `getProducts()`, `getProductBySlug()`, `getCategories()` helper fonksiyonları ve `searchProductsAction` Server Action yazılarak storefront sayfaları (`/products`, `/categories`, `/products/[category]/[slug]`) `mockData` yerine canlı Prisma DB sorgularına bağlandı.
  4. **Otomatik Seed Mekanizması (`prisma/seed.ts`):** Veritabanının ilk kurulumunda varsayılan kategori ve ürünlerin otomatik yüklenmesini sağlayan tohumlama betiği hazırlandı.
- **Gerekçe:**
  - Mock veriden gerçek ve ilişkisel veritabanına geçerek tam işlevsel e-ticaret altyapısını kurmak.
  - Tip güvenli Prisma Client ile sunucu taraflı performanslı sorgulama sağlamak.

### 13. ADR-013: Checkout Multi-Step Form & Atomic Order Transaction Architecture
- **Tarih:** 2026-09-07
- **Karar:**
  1. **İstemci Tarafı Form ve Durum Yönetimi (CSR - `/checkout`):** Checkout süreci çok adımlı doğrulama (Adres -> Kargo Yöntemi -> Kart Ödemesi) ve Redux sepet verisi ile anlık etkileşim gerektirdiğinden Client Component olarak inşa edildi. Zod ve React Hook Form ile hem anlık girdi maskelemesi (kart numarası, SKT, CVC) hem de şema doğrulaması sağlandı.
  2. **Atomik Sipariş Mutasyonu (`createOrderAction` Server Action):** Sipariş verme işlemi sunucu tarafında atomik `prisma.$transaction` ile koruma altına alındı. İşlem sırasında ürün stokları kontrol edildi (`stockQuantity >= quantity`), stok miktarları anında düşüldü (`decrement`), `Order` ve `OrderItem` kayıtları oluşturuldu ve kullanıcı adresi saklandı. Herhangi bir stok yetersizliğinde tüm işlem otomatik geri alındı (Rollback).
  3. **Güvenli Sipariş Onay Sayfası (Dinamik SSR - `/checkout/success/[orderId]`):** Kişiye özel sipariş detay sayfası Server Component olarak kurgulandı. Clerk `auth()` ile istek anında oturum açan kullanıcı doğrulandı ve siparişin bu kullanıcıya ait olduğu sunucuda teyit edilerek (`order.user.clerkId !== clerkId`) yetkisiz erişimler ve veri sızıntıları 0ms'de engellendi. İstemci tarafındaki sepet, izole bir `<ClearCartOnSuccess />` bileşeni ile sessizce temizlendi.
- **Gerekçe:**
  - Race condition (aynı anda son stoğu birden fazla kişinin alması) riskini Prisma transaction ile sıfırlamak.
  - Hassas sipariş ve adres verilerinin istemciye gereksiz gitmesini önleyerek %100 sunucu taraflı yetkilendirme sağlamak.
