import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Product } from '@/types/product';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface LiveStockAndPriceProps {
  productId?: string;
  product?: Product;
}

export default async function LiveStockAndPrice({ productId, product }: LiveStockAndPriceProps) {
  let targetProduct = product;

  if (productId && !targetProduct) {
    try {
      const dbProd = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (dbProd) {
        targetProduct = {
          id: dbProd.id,
          title: dbProd.title,
          slug: dbProd.slug,
          category: '',
          price: dbProd.price,
          originalPrice: dbProd.originalPrice || undefined,
          rating: dbProd.rating,
          reviewCount: dbProd.reviewCount,
          imageUrl: dbProd.imageUrl,
          inStock: dbProd.inStock,
        };
      }
    } catch (e) {
      console.error('Error fetching live stock and price:', e);
    }
  }

  if (!targetProduct) return null;

  const discountPercent = targetProduct.originalPrice
    ? Math.round(((targetProduct.originalPrice - targetProduct.price) / targetProduct.originalPrice) * 100)
    : 0;

  return (
    <Box sx={{ my: 3 }}>
      {/* Fiyat Alanı */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          ${targetProduct.price}
        </Typography>

        {targetProduct.originalPrice && (
          <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through', fontWeight: 500 }}>
            ${targetProduct.originalPrice}
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
        {targetProduct.inStock ? (
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
