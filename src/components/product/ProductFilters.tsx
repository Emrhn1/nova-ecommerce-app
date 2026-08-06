'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { FilterX } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mockData';

interface ProductFiltersProps {
  hideCategoryFilter?: boolean;
}

export default function ProductFilters({ hideCategoryFilter = false }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedCategory = searchParams.get('category') || '';
  const onSaleOnly = searchParams.get('sale') === 'true';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // React useTransition: İstemci arayüzü anında tepki verir (0ms), sayfa gecikmesiz güncellenir
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategoryToggle = (catValue: string) => {
    if (selectedCategory === catValue) {
      updateParam('category', null);
    } else {
      updateParam('category', catValue);
    }
  };

  const handleSaleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParam('sale', e.target.checked ? 'true' : null);
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(selectedCategory || onSaleOnly || searchParams.get('search'));

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        position: 'relative',
        opacity: isPending ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Yüklenme İndikatörü (Arka Planda Veri Güncellenirken) */}
      {isPending && (
        <CircularProgress
          size={20}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#6366f1' }}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>

        {hasActiveFilters && (
          <Button
            size="small"
            color="error"
            startIcon={<FilterX size={14} />}
            onClick={handleClearAll}
            sx={{ fontSize: '0.75rem', p: 0.5 }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Kategori Filtresi (Sadece Genel Tüm Ürünler Sayfasında Gösterilir) */}
      {!hideCategoryFilter && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.875rem' }}>
            Categories
          </Typography>
          <FormGroup sx={{ mb: 3 }}>
            {MOCK_CATEGORIES.map((cat) => (
              <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    checked={selectedCategory === cat.slug}
                    onChange={() => handleCategoryToggle(cat.slug)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': { color: '#6366f1' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: selectedCategory === cat.slug ? 600 : 400 }}>
                    {cat.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>

          <Divider sx={{ mb: 2.5 }} />
        </>
      )}

      {/* Promosyon ve İndirim Filtresi */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.875rem' }}>
        Promotions
      </Typography>
      <FormGroup sx={{ mb: hideCategoryFilter ? 3 : 0 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={onSaleOnly}
              onChange={handleSaleToggle}
              size="small"
              sx={{
                color: 'text.secondary',
                '&.Mui-checked': { color: '#6366f1' },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: onSaleOnly ? 600 : 400 }}>
              On Sale Items Only
            </Typography>
          }
        />
      </FormGroup>

      {/* Kategori Sayfasındaysak: Diğer Kategorilere Hızlı Geçiş Linkleri */}
      {hideCategoryFilter && (
        <>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.875rem' }}>
            Explore Other Categories
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {MOCK_CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    transition: 'all 0.15s ease',
                    '&:hover': { color: '#6366f1', transform: 'translateX(3px)' },
                  }}
                >
                  {cat.name} ({cat.itemCount})
                </Typography>
              </Link>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
