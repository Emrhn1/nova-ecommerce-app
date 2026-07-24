import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em' }}>
            CURATED SELECTION
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Featured Products
          </Typography>
        </Box>
        <Link
          href="/products"
          style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.9rem' }}
        >
          Explore all products <ArrowRight size={16} />
        </Link>
      </Box>

      <Grid container spacing={3}>
        {MOCK_PRODUCTS.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
