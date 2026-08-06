'use client';

import React, { useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart, setCartDrawerOpen } from '@/lib/redux/cartSlice';

interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick'> {
  product: Product;
  quantity?: number;
  openDrawerOnAdd?: boolean;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  openDrawerOnAdd = true,
  variant = 'outlined',
  color = 'primary',
  fullWidth = true,
  size = 'medium',
  sx,
  ...props
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !product.inStock) return;

    setLoading(true);

    // Dispatch Redux Action
    dispatch(addToCart({ product, quantity }));

    setTimeout(() => {
      setLoading(false);
      setAdded(true);

      if (openDrawerOnAdd) {
        dispatch(setCartDrawerOpen(true));
      }

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    }, 300);
  };

  return (
    <Button
      variant={added ? 'contained' : variant}
      color={added ? 'success' : color}
      fullWidth={fullWidth}
      size={size}
      disabled={!product.inStock || loading}
      onClick={handleAddToCart}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : added ? (
          <Check size={18} />
        ) : (
          <ShoppingBag size={18} />
        )
      }
      sx={{
        fontSize: '0.875rem',
        ...sx,
      }}
      {...props}
    >
      {!product.inStock
        ? 'Out of Stock'
        : loading
        ? 'Adding...'
        : added
        ? 'Added to Bag!'
        : 'Add to Bag'}
    </Button>
  );
}
