'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
        Sort by:
      </Typography>
      <FormControl size="small">
        <Select
          value={currentSort}
          onChange={handleSortChange}
          sx={{
            fontSize: '0.875rem',
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiSelect-select': { py: 1, px: 2 },
          }}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="price-asc">Price: Low to High</MenuItem>
          <MenuItem value="price-desc">Price: High to Low</MenuItem>
          <MenuItem value="rating">Top Rated</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
