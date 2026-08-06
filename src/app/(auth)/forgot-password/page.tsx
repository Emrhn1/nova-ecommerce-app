import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
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

        <Box sx={{ width: '100%', maxWidth: '440px' }}>
          <Card
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <KeyRound size={28} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Forgot Your Password?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              You can reset your password directly from the Sign In page using Clerk&apos;s secure multi-factor authentication flow.
            </Typography>

            <Link href="/login" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  backgroundColor: '#111827',
                  '&:hover': { backgroundColor: '#1f2937' },
                  borderRadius: '8px',
                }}
              >
                Go to Sign In
              </Button>
            </Link>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
