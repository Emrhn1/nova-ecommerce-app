'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';

interface ProductGalleryProps {
  mainImageUrl: string;
  title: string;
}

export default function ProductGallery({ mainImageUrl, title }: ProductGalleryProps) {
  // Simüle edilmiş ek ürün açıları
  const images = [
    mainImageUrl,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
  ];

  const [activeImage, setActiveImage] = useState(mainImageUrl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Ana Görsel */}
      <Box
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <CardMedia
          component="img"
          height="440"
          image={activeImage}
          alt={title}
          sx={{ objectFit: 'cover', transition: 'all 0.3s ease-in-out' }}
        />
      </Box>

      {/* Küçük Önizleme Resimleri (Thumbnails) */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {images.map((imgUrl, index) => (
          <Box
            key={index}
            onClick={() => setActiveImage(imgUrl)}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              border: '2px solid',
              borderColor: activeImage === imgUrl ? '#6366f1' : 'divider',
              overflow: 'hidden',
              cursor: 'pointer',
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#6366f1',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardMedia
              component="img"
              height="80"
              image={imgUrl}
              alt={`${title} view ${index + 1}`}
              sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
