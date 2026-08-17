import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ProductCard from '@/components/store/ProductCard';
import ProductSort from '@/components/product/ProductSort';
import ProductFilters from '@/components/product/ProductFilters';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { Product } from '@/types/product';
import { ChevronRight, PackageSearch } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    sale?: string;
    search?: string;
  }>;
}

// 1. Dinamik Kategori SEO Metadata Üretimi
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const matchedCategory = MOCK_CATEGORIES.find((c) => c.slug === category.toLowerCase());

  if (!matchedCategory) {
    return {
      title: 'Category Not Found | NOVA Commerce',
    };
  }

  return {
    title: `${matchedCategory.name} Products | NOVA Commerce`,
    description: matchedCategory.description,
  };
}

export default async function CategoryProductsPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = category.toLowerCase();
  const matchedCategory = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);

  if (!matchedCategory) {
    notFound();
  }

  const sortOption = resolvedSearchParams.sort || 'newest';
  const saleOnly = resolvedSearchParams.sale === 'true';
  const searchQuery = resolvedSearchParams.search?.trim();

  // 2. Veri Filtreleme Mantığı (Server-Side)
  let filteredProducts: Product[] = MOCK_PRODUCTS.filter((prod) => {
    if (prod.category.toLowerCase() !== categorySlug) {
      return false;
    }
    if (saleOnly && prod.badge !== 'Sale') {
      return false;
    }
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      if (!prod.title.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  // 3. Sıralama Mantığı
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
      {/* Breadcrumb Navigasyon */}
      <Breadcrumbs
        separator={<ChevronRight size={14} />}
        aria-label="breadcrumb"
        sx={{ mb: 2, fontSize: '0.85rem' }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link href="/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
          Categories
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {matchedCategory.name}
        </Typography>
      </Breadcrumbs>

      {/* Şık Kategori Banner'ı (Category Hero Banner) */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 3, md: 4 },
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
        }}
      >
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em' }}>
            CATEGORY COLLECTION
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
            {matchedCategory.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {matchedCategory.description}
          </Typography>
        </Box>

        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {filteredProducts.length} Items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available in {matchedCategory.name}
          </Typography>
        </Box>
      </Box>

      {/* Üst Sıralama Barı */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <ProductSort />
      </Box>

      {/* Ana Sayfa Düzeni (Sol: Özelleştirilmiş Filtre, Sağ: Ürün Izgarası) */}
      <Grid container spacing={4}>
        {/* Sol Panel: Özelleştirilmiş Filtre (Gereksiz Kategori Checkbox'ları Yok!) */}
        <Grid size={{ xs: 12, md: 3 }}>
          <ProductFilters hideCategoryFilter={true} />
        </Grid>

        {/* Sağ Panel: Ürün Listesi */}
        <Grid size={{ xs: 12, md: 9 }}>
          {filteredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            /* Boş Sonuç Ekranı */
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider',
                p: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PackageSearch size={48} color="#9ca3af" />
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                No products found in {matchedCategory.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3 }}>
                We couldn't find any products matching your current filters in this category.
              </Typography>
              <Link href={`/products/${categorySlug}`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Clear Filters
                </Button>
              </Link>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
