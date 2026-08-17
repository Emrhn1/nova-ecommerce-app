'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectCartTotalQuantity, toggleCartDrawer } from '@/lib/redux/cartSlice';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from './SearchModal';

const NAV_LINKS = [
  { label: 'New', href: '/products?filter=new' },
  { label: 'Shop', href: '/products' },
  { label: 'Deals', href: '/products?filter=deals' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartTotalQuantity);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          my: { xs: 1.5, md: 2 },
          mx: 'auto',
          width: { xs: 'calc(100% - 1.5rem)', md: 'calc(100% - 4rem)' },
          maxWidth: 1280,
          borderRadius: 1, // 8px from theme shape
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar
          component="nav"
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: 56, md: 64 },
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Sol: Logo */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'text.primary',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
            }}
          >
            NOVA
          </Typography>

          {/* Orta: Masaüstü Linkleri */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.label}
                component={Link}
                href={link.href}
                color="inherit"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Sağ: İkonlar & Clerk Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              color="inherit"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </IconButton>

            <IconButton color="inherit" aria-label="Favorites" component={Link} href="/account/favorites">
              <Heart size={20} />
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="Cart"
              onClick={() => dispatch(toggleCartDrawer())}
            >
              <Badge
                badgeContent={cartItemCount}
                color="primary"
                slotProps={{ badge: { style: { fontSize: '0.7rem' } } }}
              >
                <ShoppingBag size={20} />
              </Badge>
            </IconButton>

            {/* Clerk User Status */}
            {isLoaded && isSignedIn && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <UserButton />
              </Box>
            )}

            {isLoaded && !isSignedIn && (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  size="small"
                  startIcon={<User size={18} />}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    ml: 0.5,
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  Sign In
                </Button>
                <IconButton
                  component={Link}
                  href="/login"
                  color="inherit"
                  aria-label="Sign In"
                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                >
                  <User size={20} />
                </IconButton>
              </>
            )}

            {/* Mobil Menü Butonu */}
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <Menu size={22} />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobil Çekmece Menü (Drawer) */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          slotProps={{ paper: { sx: { width: 280, p: 2 } } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
              NOVA
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>

          <List disablePadding>
            {NAV_LINKS.map((link) => (
              <ListItem disablePadding key={link.label}>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </AppBar>

      {/* Mini Cart Drawer Component */}
      <CartDrawer />

      {/* Search Modal Component */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
