'use client';

import React, { useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';

interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick'> {
  product: Product;
  quantity?: number;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = 'outlined',
  color = 'primary',
  fullWidth = true,
  size = 'medium',
  sx,
  ...props
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !product.inStock) return;

    setLoading(true);

    // İleride Redux dispatch(addToCart({ product, quantity })) işlemi burada yapılacak
    setTimeout(() => {
      setLoading(false);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    }, 600);
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
