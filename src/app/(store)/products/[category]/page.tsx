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
import { getCategoryBySlug } from '@/lib/db/categories';
import { getProducts } from '@/lib/db/products';
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
  const matchedCategory = await getCategoryBySlug(category);

  if (!matchedCategory) {
    return {
      title: 'Category Not Found | NOVA Commerce',
    };
  }

  return {
    title: `${matchedCategory.name} Products | NOVA Commerce`,
    description: matchedCategory.description || undefined,
  };
}

export default async function CategoryProductsPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = category.toLowerCase();
  const matchedCategory = await getCategoryBySlug(categorySlug);

  if (!matchedCategory) {
    notFound();
  }

  const sortOption = resolvedSearchParams.sort || 'newest';
  const saleOnly = resolvedSearchParams.sale === 'true';
  const searchQuery = resolvedSearchParams.search?.trim();

  // 2. Prisma Database Query (Server Component)
  const filteredProducts = await getProducts({
    category: categorySlug,
    sort: sortOption,
    sale: saleOnly,
    search: searchQuery,
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
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {matchedCategory.name} Collection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {matchedCategory.description}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', bgcolor: 'action.hover', px: 2, py: 1, borderRadius: 1 }}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Product Available' : 'Products Available'}
        </Typography>
      </Box>

      {/* Üst Sıralama & Filtreleme Barları */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Explore Products
        </Typography>
        <ProductSort />
      </Box>

      {/* Ana Sayfa Düzeni (Sol: Filtreler, Sağ: Ürün Izgarası) */}
      <Grid container spacing={4}>
        {/* Sol Panel: Filtreler */}
        <Grid size={{ xs: 12, md: 3 }}>
          <ProductFilters />
        </Grid>

        {/* Sağ Panel: Ürün Listesi veya Boş Sonuç Ekranı */}
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
                No products found in this category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3 }}>
                We couldn&apos;t find any products in {matchedCategory.name} matching your current filters.
              </Typography>
              <Link href={`/products/${categorySlug}`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Clear Category Filters
                </Button>
              </Link>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
