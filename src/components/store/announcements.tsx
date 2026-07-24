import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Announcements() {
  return (
    <Box
      component="aside"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 400, letterSpacing: 0.2 }}>
        Free express shipping over $100 · 30-day returns
      </Typography>
    </Box>
  );
}
