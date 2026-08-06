'use client';

import React from 'react';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectIsCartDrawerOpen,
  setCartDrawerOpen,
  removeFromCart,
  updateQuantity,
} from '@/lib/redux/cartSlice';

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);

  const handleClose = () => {
    dispatch(setCartDrawerOpen(false));
  };

  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ShoppingBag size={22} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Shopping Bag ({totalQuantity})
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} aria-label="Close cart drawer">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Free Shipping Bar */}
      {items.length > 0 && (
        <Box sx={{ px: 2.5, py: 2, bgcolor: 'action.hover' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontWeight: 500 }}>
            {remainingForFreeShipping === 0
              ? '🎉 You unlocked FREE standard shipping!'
              : `Add $${remainingForFreeShipping.toFixed(2)} more to qualify for FREE Shipping`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={freeShippingProgress}
            color={remainingForFreeShipping === 0 ? 'success' : 'primary'}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      {/* Cart Content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              py: 6,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                color: 'text.secondary',
              }}
            >
              <ShoppingBag size={32} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Your bag is empty
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 260 }}>
              Looks like you haven&apos;t added any items to your shopping bag yet.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/products"
              onClick={handleClose}
              endIcon={<ArrowRight size={18} />}
            >
              Explore Products
            </Button>
          </Box>
        ) : (
          <Stack spacing={2.5} divider={<Divider />}>
            {items.map(({ product, quantity }) => (
              <Stack key={product.id} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                {/* Product Thumbnail */}
                <Box
                  component="img"
                  src={product.imageUrl}
                  alt={product.title}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 1,
                    objectFit: 'cover',
                    bgcolor: 'action.hover',
                  }}
                />

                {/* Details */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    component={Link}
                    href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                    onClick={handleClose}
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      textDecoration: 'none',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {product.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                    ${product.price.toFixed(2)}
                  </Typography>

                  {/* Quantity Controls */}
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
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
                        sx={{ p: 0.5 }}
                      >
                        <Minus size={14} />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{ px: 1.5, fontWeight: 600, minWidth: 20, textAlign: 'center' }}
                      >
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
                        sx={{ p: 0.5 }}
                      >
                        <Plus size={14} />
                      </IconButton>
                    </Box>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => dispatch(removeFromCart(product.id))}
                      sx={{ ml: 'auto' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer / Summary */}
      {items.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Subtotal
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Taxes and shipping calculated at checkout.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              component={Link}
              href="/cart"
              onClick={handleClose}
              sx={{ py: 1.2, fontWeight: 600 }}
            >
              View Cart & Checkout
            </Button>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/products"
              onClick={handleClose}
              sx={{ py: 1, color: 'text.primary', borderColor: 'divider' }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}
