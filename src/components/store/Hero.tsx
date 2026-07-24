import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Hero() {
  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Box
        component="section"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1, // 8px from theme shape
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 3, md: 5 },
        }}
      >
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          {/* Sol Kolon: Metin & CTA Butonları */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="caption"
              sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}
            >
              NEW SEASON · 2026
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Everyday essentials, exceptionally considered.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, mb: 4, maxWidth: 500 }}
            >
              Premium audio, carry and workspace pieces selected for calm, capable days.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" size="large">
                  Shop the collection
                </Button>
              </Link>

              <Link href="/categories" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" size="large">
                  Explore categories
                </Button>
              </Link>
            </Box>
          </Grid>

          {/* Sağ Kolon: Görsel / Öne Çıkan Kart */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                height: { xs: 260, md: 360 },
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                textAlign: 'center',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              }}
            >
              <Typography variant="overline" sx={{ letterSpacing: '0.15em', opacity: 0.8 }}>
                CURATED COLLECTION
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                NOVA Essentials
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 260 }}>
                Minimalist design, crafted with premium durable materials.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}