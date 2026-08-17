import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import ProductCard from '@/components/store/ProductCard';
import ProductSort from '@/components/product/ProductSort';
import ProductFilters from '@/components/product/ProductFilters';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Product } from '@/types/product';
import { ChevronRight, PackageSearch, X } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    sale?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category?.toLowerCase();
  const sortOption = resolvedParams.sort || 'newest';
  const saleOnly = resolvedParams.sale === 'true';
  const searchQuery = resolvedParams.search?.trim();

  // 1. Veri Filtreleme Mantığı (Server-Side)
  let filteredProducts: Product[] = MOCK_PRODUCTS.filter((prod) => {
    if (categoryFilter && prod.category.toLowerCase() !== categoryFilter) {
      return false;
    }
    if (saleOnly && prod.badge !== 'Sale') {
      return false;
    }
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const matchesTitle = prod.title.toLowerCase().includes(term);
      const matchesCategory = prod.category.toLowerCase().includes(term);
      if (!matchesTitle && !matchesCategory) {
        return false;
      }
    }
    return true;
  });

  // 2. Sıralama Mantığı (Server-Side)
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0; // newest / default
  });

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : categoryFilter
    ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
    : 'All Products';

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
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Products
        </Link>
        {searchQuery && (
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Search: {searchQuery}
          </Typography>
        )}
      </Breadcrumbs>

      {/* Üst Header Bar (Başlık, Ürün Sayısı & Sıralama) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {pageTitle}
            </Typography>
            {searchQuery && (
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Chip
                  label={`Clear search: "${searchQuery}" ✕`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                />
              </Link>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </Typography>
        </Box>

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
            /* Boş Sonuç Ekranı (No Products Found) */
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
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3 }}>
                We couldn&apos;t find any products matching your search &ldquo;{searchQuery || 'current filters'}&rdquo;. Try resetting your filters to see more results.
              </Typography>
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Clear All Filters
                </Button>
              </Link>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
