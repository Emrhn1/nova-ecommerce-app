import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Link from 'next/link';

const FOOTER_LINKS = {
  shop: [
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Best Sellers', href: '/products?filter=bestsellers' },
    { label: 'Audio', href: '/products/audio' },
    { label: 'Workspace', href: '/products/workspace' },
    { label: 'Carry', href: '/products/carry' },
    { label: 'Deals', href: '/products?filter=deals' },
  ],
  support: [
    { label: 'Order Status', href: '/account/orders' },
    { label: 'Shipping & Returns', href: '/support/shipping' },
    { label: 'Help Center', href: '/support' },
    { label: 'Contact Us', href: '/support/contact' },
  ],
  company: [
    { label: 'About NOVA', href: '/about' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const linkHoverStyle = {
  fontSize: '0.875rem',
  display: 'inline-block',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: 'text.primary',
    transform: 'translateX(4px)',
  },
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={12} sx={{ mb: 6 }}>
          {/* Sol Kolon: Marka & Bülten Aboneliği */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.08em', mb: 1 }}>
              NOVA
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, lineHeight: 1.6 }}>
              Everyday essentials, exceptionally considered. Discover curated products built for calm, capable days.
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Subscribe to our newsletter
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, maxWidth: 340 }}>
              <OutlinedInput
                placeholder="Enter your email"
                size="small"
                fullWidth
                sx={{ bgcolor: 'background.default', fontSize: '0.875rem' }}
              />
              <Button variant="contained" color="primary" sx={{ whiteSpace: 'nowrap' }}>
                Subscribe
              </Button>
            </Box>
          </Grid>

          {/* Sağ Kolonlar: Navigasyon Link Grupları */}
          <Grid container spacing={6} size={{ xs: 12, md: 8 }} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} rowSpacing={3}>
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, letterSpacing: '0.05em' }}>
                SHOP
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {FOOTER_LINKS.shop.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={linkHoverStyle}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, letterSpacing: '0.05em' }}>
                SUPPORT
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {FOOTER_LINKS.support.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={linkHoverStyle}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, letterSpacing: '0.05em' }}>
                COMPANY
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {FOOTER_LINKS.company.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={linkHoverStyle}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Alt Kısım: Telif Hakları & Yasal Bildirim */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} NOVA Commerce Inc. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Terms of Service
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
