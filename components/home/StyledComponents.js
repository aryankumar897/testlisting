"use client";

import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { Box, TextField } from '@mui/material';

export const TransparentBox = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: theme.spacing(4),
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
}));

export const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

export const TitleContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  }
}));

export const SearchButton = styled(motion.button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff531a 0%, #ff6a00 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%',
  marginTop: theme.spacing(2),
  boxShadow: '0 8px 20px rgba(255, 83, 26, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: '0.5s',
  },
  '&:hover::before': {
    left: '100%',
  }
}));