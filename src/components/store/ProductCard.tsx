import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Star } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Sale':
        return { bg: '#ef4444', color: '#ffffff' };
      case 'New':
        return { bg: '#6366f1', color: '#ffffff' };
      case 'Best Seller':
        return { bg: '#0a0a0a', color: '#ffffff' };
      default:
        return null;
    }
  };

  const badgeStyle = getBadgeColor(product.badge);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, boxShadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Badge (New / Sale / Best Seller) */}
      {product.badge && badgeStyle && (
        <Chip
          label={product.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            fontWeight: 700,
            fontSize: '0.7rem',
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.color,
          }}
        />
      )}

      {/* Ürün Görseli */}
      <Link href={`/products/${product.category.toLowerCase()}/${product.slug}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          height="220"
          image={product.imageUrl}
          alt={product.title}
          sx={{ objectFit: 'cover' }}
        />
      </Link>

      {/* Ürün Detayları */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
          {product.category}
        </Typography>
        <Link href={`/products/${product.category.toLowerCase()}/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mt: 0.5,
              mb: 1,
              lineHeight: 1.3,
              '&:hover': { color: '#6366f1' },
            }}
          >
            {product.title}
          </Typography>
        </Link>

        {/* Rating & Fiyat */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({product.reviewCount})
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              ${product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${product.originalPrice}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>

      {/* İzolasyonlu İstemci Sepete Ekle Butonu */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <AddToCartButton product={product} />
      </CardActions>
    </Card>
  );
}
