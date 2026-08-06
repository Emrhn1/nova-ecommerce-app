import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Product } from '@/types/product';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface LiveStockAndPriceProps {
  product: Product;
}

export default async function LiveStockAndPrice({ product }: LiveStockAndPriceProps) {
  // Simüle edilmiş sunucu taraflı anlık stok & fiyat doğrulaması
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Box sx={{ my: 3 }}>
      {/* Fiyat Alanı */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          ${product.price}
        </Typography>

        {product.originalPrice && (
          <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through', fontWeight: 500 }}>
            ${product.originalPrice}
          </Typography>
        )}

        {discountPercent > 0 && (
          <Chip
            label={`Save ${discountPercent}%`}
            size="small"
            sx={{ bgcolor: '#ef4444', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* Stok Durumu Rozeti */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {product.inStock ? (
          <>
            <CheckCircle2 size={18} color="#22c55e" />
            <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
              In Stock · Ships within 24 hours
            </Typography>
          </>
        ) : (
          <>
            <AlertTriangle size={18} color="#ef4444" />
            <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600 }}>
              Currently Out of Stock
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
