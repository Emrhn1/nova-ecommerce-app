import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function CreateAccountPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              NOVA
            </Typography>
          </Link>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Everyday essentials, exceptionally considered
          </Typography>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SignUp
            path="/create-account"
            routing="path"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                },
                cardBox: {
                  width: '100%',
                  maxWidth: '440px',
                },
                card: {
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid var(--mui-palette-divider)',
                  borderRadius: '12px',
                  width: '100%',
                  margin: '0 auto',
                },
                formButtonPrimary: {
                  backgroundColor: '#111827',
                  '&:hover': { backgroundColor: '#1f2937' },
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
