'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { Product } from '@/types/product';
import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  product: Product;
}

export default function ProductQuantitySelector({ product }: ProductQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', my: 3 }}>
      {/* Miktar Seçim Butonları (- 1 +) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          px: 1,
          py: 0.5,
        }}
      >
        <IconButton size="small" onClick={handleDecrement} disabled={quantity <= 1 || !product.inStock}>
          <Minus size={16} />
        </IconButton>

        <Typography variant="body1" sx={{ fontWeight: 700, minWidth: 36, textAlign: 'center' }}>
          {quantity}
        </Typography>

        <IconButton size="small" onClick={handleIncrement} disabled={quantity >= 10 || !product.inStock}>
          <Plus size={16} />
        </IconButton>
      </Box>

      {/* Sepete Ekle Butonu */}
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <AddToCartButton product={product} quantity={quantity} size="large" />
      </Box>
    </Box>
  );
}
