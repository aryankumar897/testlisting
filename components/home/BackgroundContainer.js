"use client";

import { styled } from '@mui/system';
import { motion } from 'framer-motion';

export const BackgroundContainer = styled(motion.div)({
  position: 'relative',
  backgroundImage: 'url(/images/home2.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  }
});

export const FloatingElement = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  zIndex: 1,
});