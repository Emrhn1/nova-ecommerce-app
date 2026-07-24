import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from 'next/link';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { ArrowRight } from 'lucide-react';

export default function CategorySection() {
  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em' }}>
            CATEGORIES
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Shop by Category
          </Typography>
        </Box>
        <Link
          href="/categories"
          style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.9rem' }}
        >
          View all categories <ArrowRight size={16} />
        </Link>
      </Box>

      <Grid container spacing={3}>
        {MOCK_CATEGORIES.map((cat) => (
          <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Link href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={cat.imageUrl}
                  alt={cat.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {cat.itemCount} Products
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
