'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Product } from '@/types/product';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Audio', 'Headphones', 'Accessories', 'Watch', 'Wireless'];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Live filter mock products based on search term
  const liveResults: Product[] = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return MOCK_PRODUCTS.filter(
      (prod) =>
        prod.title.toLowerCase().includes(trimmed) ||
        prod.category.toLowerCase().includes(trimmed)
    ).slice(0, 5);
  }, [query]);

  const handleSearchSubmit = (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;
    onClose();
    setQuery('');
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit(query);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            mt: { xs: 4, sm: 8 },
            verticalAlign: 'top',
            position: 'absolute',
            top: 20,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            border: '1px solid',
            borderColor: 'divider',
          },
        },
      }}
    >
      {/* Search Input Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          gap: 1,
        }}
      >
        <Search size={22} style={{ color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
        <InputBase
          autoFocus
          fullWidth
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            fontSize: '1.05rem',
            fontWeight: 500,
          }}
        />

        {/* Yazıyı Temizleme Butonu (Yazı varken görünür) */}
        {query && (
          <IconButton
            size="small"
            onClick={() => setQuery('')}
            aria-label="Clear search text"
            sx={{
              p: 0.5,
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <X size={14} />
          </IconButton>
        )}

        {/* Modalı Kapatma ESC Butonu (Masaüstü) */}
        <Box
          component="button"
          onClick={onClose}
          aria-label="Close modal"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
            py: 0.4,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'text.secondary',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
              borderColor: 'text.secondary',
            },
          }}
        >
          ESC
        </Box>

        {/* Mobil Kapatma Butonu */}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close search modal"
          sx={{ display: { xs: !query ? 'inline-flex' : 'none', sm: 'none' } }}
        >
          <X size={18} />
        </IconButton>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 2.5, maxHeight: 400, overflowY: 'auto' }}>
        {/* Popular Searches when query is empty */}
        {!query.trim() && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
              <TrendingUp size={16} />
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Popular Searches
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {POPULAR_SEARCHES.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onClick={() => handleSearchSubmit(item)}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Live Filtered Results */}
        {query.trim() && (
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5, display: 'block' }}>
              {liveResults.length > 0
                ? `Results for "${query}"`
                : `No products found for "${query}"`}
            </Typography>

            {liveResults.length > 0 ? (
              <Stack spacing={1.5} divider={<Divider />}>
                {liveResults.map((product) => (
                  <Box
                    key={product.id}
                    component={Link}
                    href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                    onClick={() => {
                      onClose();
                      setQuery('');
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'text.primary',
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box
                      component="img"
                      src={product.imageUrl}
                      alt={product.title}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '6px',
                        objectFit: 'cover',
                        bgcolor: 'action.hover',
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {product.category}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
                Try searching for audio, watch, accessories, or other keywords.
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Footer CTA */}
      {query.trim() && (
        <Box
          sx={{
            p: 1.5,
            px: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Press <Box component="kbd" sx={{ bgcolor: 'background.paper', px: 0.8, py: 0.2, borderRadius: 1, border: '1px solid', borderColor: 'divider', fontWeight: 600 }}>Enter</Box> to search all
          </Typography>
          <Button
            size="small"
            onClick={() => handleSearchSubmit(query)}
            endIcon={<ArrowRight size={16} />}
            sx={{ fontWeight: 600 }}
          >
            View All Results
          </Button>
        </Box>
      )}
    </Dialog>
  );
}
