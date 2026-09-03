import React from 'react';
import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import { getCategories } from '@/lib/db/categories';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Categories | NOVA Commerce',
  description: 'Browse all product categories at NOVA Commerce. Find audio gear, workspace tools, carry accessories, and wearables.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 10 }}>
      {/* Breadcrumb Navigasyon */}
      <Breadcrumbs
        separator={<ChevronRight size={14} />}
        aria-label="breadcrumb"
        sx={{ mb: 2, fontSize: '0.85rem' }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Categories
        </Typography>
      </Breadcrumbs>

      {/* Üst Header Bar */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          All Categories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Explore our thoughtfully curated collections designed for modern productivity and everyday life.
        </Typography>
      </Box>

      {/* Kategori Izgarası (Category Showcase Grid) */}
      <Grid container spacing={4}>
        {categories.map((cat) => (
          <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 6 }}>
            <Link href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  height: '100%',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={cat.imageUrl}
                  alt={cat.name}
                  sx={{
                    width: { xs: '100%', sm: 220 },
                    height: { xs: 200, sm: '100%' },
                    objectFit: 'cover',
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                      {cat.itemCount} PRODUCTS
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, mb: 1, color: 'text.primary' }}>
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {cat.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontWeight: 700,
                      color: '#6366f1',
                      mt: 2,
                      fontSize: '0.9rem',
                    }}
                  >
                    Browse Collection <ArrowRight size={16} />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
