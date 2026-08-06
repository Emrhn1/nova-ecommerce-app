import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import LiveStockAndPrice from '@/components/product/LiveStockAndPrice';
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ChevronRight, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

// ISR (Incremental Static Regeneration): 1 Saat revalidation
export const revalidate = 3600;

interface ProductDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// 1. Dinamik SEO Metadata Üretimi
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found | NOVA Commerce',
    };
  }

  return {
    title: `${product.title} | NOVA Commerce`,
    description: `Buy ${product.title} in ${product.category} at NOVA Commerce. Premium quality with fast shipping.`,
    openGraph: {
      title: product.title,
      description: `Premium ${product.category} product - $${product.price}`,
      images: [{ url: product.imageUrl }],
    },
  };
}

// Skeleton yüklenme bileşeni (Suspense Fallback)
function PriceStockSkeleton() {
  return (
    <Box sx={{ my: 3 }}>
      <Skeleton variant="text" width={120} height={48} />
      <Skeleton variant="text" width={200} height={24} />
    </Box>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { category, slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Google Rich Snippets için Schema.org JSON-LD Yapısı
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl,
    description: `Premium ${product.category} item`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 10 }}>
      {/* Schema.org JSON-LD Gömmesi */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigasyon */}
      <Breadcrumbs
        separator={<ChevronRight size={14} />}
        aria-label="breadcrumb"
        sx={{ mb: 4, fontSize: '0.85rem' }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Products
        </Link>
        <Link
          href={`/products/${product.category.toLowerCase()}`}
          style={{ textDecoration: 'none', color: 'inherit', textTransform: 'capitalize' }}
        >
          {product.category}
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {product.title}
        </Typography>
      </Breadcrumbs>

      {/* Ana Ürün Detay Düzeni (Sol: Galeri, Sağ: Bilgiler & Aksiyon) */}
      <Grid container spacing={6}>
        {/* Sol Sütun: Görsel Galerisi (ISR Statik Kabuk) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductGallery mainImageUrl={product.imageUrl} title={product.title} />
        </Grid>

        {/* Sağ Sütun: Ürün Bilgileri & Canlı Stok / Fiyat */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={product.category}
              size="small"
              sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', fontWeight: 600 }}
            />
            {product.badge && (
              <Chip
                label={product.badge}
                size="small"
                sx={{ bgcolor: '#0a0a0a', color: '#ffffff', fontWeight: 700 }}
              />
            )}
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.1 }}>
            {product.title}
          </Typography>

          {/* Yıldız & Değerlendirme Sayısı */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {product.rating}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount} customer reviews)
            </Typography>
          </Box>

          <Divider />

          {/* DİNAMİK ALAN (Suspense Streaming): Canlı Stok & Fiyat */}
          <Suspense fallback={<PriceStockSkeleton />}>
            <LiveStockAndPrice product={product} />
          </Suspense>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Designed for uncompromising everyday performance. Crafted with high-grade durable materials, ultra-clear acoustic drivers, and ergonomically balanced weight for all-day comfort.
          </Typography>

          {/* Miktar Seçici & Sepete Ekle Butonu */}
          <ProductQuantitySelector product={product} />

          <Divider sx={{ my: 3 }} />

          {/* Güvence Rozetleri (Teslimat, İade, Garanti) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Truck size={20} color="#6366f1" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Free Express Shipping on orders over $100
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RotateCcw size={20} color="#6366f1" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                30-day hassle-free return policy
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldCheck size={20} color="#6366f1" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                2-year official NOVA warranty included
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
