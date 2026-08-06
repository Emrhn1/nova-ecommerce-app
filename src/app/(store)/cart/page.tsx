'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/lib/redux/cartSlice';

const FREE_SHIPPING_THRESHOLD = 150;
const TAX_RATE = 0.08;

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 15;
  const taxCost = subtotal * TAX_RATE;
  const discountAmount = subtotal * appliedDiscount;
  const totalCost = Math.max(0, subtotal - discountAmount + shippingCost + taxCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === 'NOVA10') {
      setAppliedDiscount(0.1);
      setPromoSuccess('10% discount applied successfully!');
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setAppliedDiscount(0.2);
      setPromoSuccess('20% welcome discount applied!');
    } else {
      setPromoError('Invalid promo code. Try NOVA10 or WELCOME20.');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Card
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              color: 'text.secondary',
            }}
          >
            <ShoppingBag size={40} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Your Shopping Bag is Empty
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 460, mx: 'auto', mb: 4 }}>
            Your cart is currently waiting for curated products. Discover our newest items and special deals.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/products"
            startIcon={<ArrowLeft size={18} />}
            sx={{ py: 1.5, px: 4, fontWeight: 600 }}
          >
            Continue Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            component={Link}
            href="/products"
            startIcon={<ArrowLeft size={16} />}
            sx={{ color: 'text.secondary', mb: 1, p: 0, '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
          >
            Back to Shop
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Shopping Bag ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
          </Typography>
        </Box>

        <Button
          variant="text"
          color="error"
          onClick={() => dispatch(clearCart())}
          startIcon={<Trash2 size={16} />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Item List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Free Shipping Banner */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {remainingForFreeShipping === 0
                  ? '🎉 Congratulations! You have unlocked FREE Standard Shipping.'
                  : `Add $${remainingForFreeShipping.toFixed(2)} more to qualify for FREE Shipping`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={freeShippingProgress}
                color={remainingForFreeShipping === 0 ? 'success' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Card>

            {/* Cart Items List */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Stack spacing={3} divider={<Divider />}>
                  {items.map(({ product, quantity }) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                      }}
                    >
                      {/* Image */}
                      <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.title}
                        sx={{
                          width: { xs: '100%', sm: 100 },
                          height: { xs: 180, sm: 100 },
                          borderRadius: 1,
                          objectFit: 'cover',
                          bgcolor: 'action.hover',
                        }}
                      />

                      {/* Item Details */}
                      <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Chip
                              label={product.category}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20, mb: 0.5 }}
                            />
                            <Typography
                              variant="subtitle1"
                              component={Link}
                              href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                textDecoration: 'none',
                                display: 'block',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {product.title}
                            </Typography>
                          </Box>

                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => dispatch(removeFromCart(product.id))}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          {/* Quantity Selector */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: 'background.default',
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: product.id,
                                    quantity: quantity - 1,
                                  })
                                )
                              }
                              sx={{ p: 0.75 }}
                            >
                              <Minus size={16} />
                            </IconButton>
                            <Typography sx={{ px: 2, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                              {quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: product.id,
                                    quantity: quantity + 1,
                                  })
                                )
                              }
                              sx={{ p: 0.75 }}
                            >
                              <Plus size={16} />
                            </IconButton>
                          </Box>

                          {/* Price & Total */}
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              ${product.price.toFixed(2)} each
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              ${(product.price * quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column: Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                  Order Summary
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  {appliedDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography variant="body2">Discount ({(appliedDiscount * 100)}%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        -${discountAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Estimated Shipping
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Estimated Tax (8%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${taxCost.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Promo Code Form */}
                <Box component="form" onSubmit={handleApplyPromo} sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
                    Promo Code
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="e.g. NOVA10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      error={!!promoError}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Tag size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button variant="outlined" type="submit" sx={{ px: 2.5, whiteSpace: 'nowrap', borderColor: 'divider' }}>
                      Apply
                    </Button>
                  </Stack>
                  {promoError && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {promoError}
                    </Typography>
                  )}
                  {promoSuccess && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block', fontWeight: 600 }}>
                      {promoSuccess}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${totalCost.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ArrowRight size={18} />}
                  sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <ShieldCheck size={20} color="var(--mui-palette-primary-main)" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Secure Checkout
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      256-bit SSL Encryption
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Truck size={20} color="var(--mui-palette-primary-main)" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Fast Express Delivery
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Ships within 24 hours
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <RefreshCw size={20} color="var(--mui-palette-primary-main)" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Easy 30-Day Returns
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Hassle-free money back guarantee
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
