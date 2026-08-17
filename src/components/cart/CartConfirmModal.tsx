'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface CartConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'trash' | 'warning';
  onConfirm: () => void;
  onClose: () => void;
}

export default function CartConfirmModal({
  open,
  title,
  description,
  confirmText = 'Remove',
  cancelText = 'Cancel',
  icon = 'trash',
  onConfirm,
  onClose,
}: CartConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: { xs: 2, sm: 2.5 },
            maxWidth: 420,
            width: '100%',
            mx: 2,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 1 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'error.50',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon === 'trash' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </Box>

        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 700, fontSize: '1.2rem' }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            {description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 0, width: '100%' }}>
          <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                fontWeight: 600,
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: 'text.secondary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              {cancelText}
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => {
                onConfirm();
                onClose();
              }}
              sx={{
                fontWeight: 600,
                py: 1,
                borderRadius: '8px',
                boxShadow: 'none',
              }}
            >
              {confirmText}
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
