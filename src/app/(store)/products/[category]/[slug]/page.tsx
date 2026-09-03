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
import { getProductBySlug } from '@/lib/db/products';
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
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | NOVA Commerce',
    };
  }

  return {
    title: `${product.title} | NOVA Commerce`,
    description: `Buy ${product.title} in ${product.categoryName} at NOVA Commerce. Premium quality with fast shipping.`,
    openGraph: {
      title: product.title,
      description: `Premium ${product.categoryName} product - $${product.price}`,
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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Schema.org Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.imageUrl],
    description: product.description,
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

  const formattedProduct = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.categoryName,
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    imageUrl: product.imageUrl,
    badge: (product.badge as any) || undefined,
    inStock: product.inStock,
  };

  return (
    <>
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container maxWidth="lg" sx={{ py: 4, mb: 8 }}>
        {/* Breadcrumb Navigasyon */}
        <Breadcrumbs
          separator={<ChevronRight size={14} />}
          aria-label="breadcrumb"
          sx={{ mb: 3, fontSize: '0.85rem' }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
            Products
          </Link>
          <Link href={`/products/${product.categorySlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.categoryName}
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {product.title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Sol Kolon: Ürün Görsel Galerisi */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductGallery
              mainImageUrl={product.imageUrl}
              title={product.title}
            />
          </Grid>

          {/* Sağ Kolon: Detaylar & Aksiyonlar */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              {/* Kategori Etiketi */}
              <Chip
                label={product.categoryName}
                size="small"
                variant="outlined"
                sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.75rem' }}
              />

              {/* Ürün Başlığı */}
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.2 }}>
                {product.title}
              </Typography>

              {/* Değerlendirme & Yorumlar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', color: 'warning.main' }}>
                  <Star size={18} fill="currentColor" />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {product.rating}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  ({product.reviewCount} customer reviews)
                </Typography>
              </Box>

              {/* Streaming Canlı Fiyat & Stok Bileşeni */}
              <Suspense fallback={<PriceStockSkeleton />}>
                <LiveStockAndPrice productId={product.id} />
              </Suspense>

              {/* Ürün Açıklaması */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Adet Seçici & Sepete Ekle Butonu */}
              <ProductQuantitySelector product={formattedProduct} />

              <Divider sx={{ my: 3 }} />

              {/* Güven ve Teslimat Rozetleri */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldCheck size={20} color="var(--mui-palette-primary-main)" />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        2-Year Warranty
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Full coverage
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Truck size={20} color="var(--mui-palette-primary-main)" />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        Free Express
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Orders over $150
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RotateCcw size={20} color="var(--mui-palette-primary-main)" />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        30-Day Returns
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hassle-free
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
