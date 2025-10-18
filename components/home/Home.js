"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, TextField, Button, Typography, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Place, Category } from '@mui/icons-material';

const BackgroundContainer = styled(motion.div)({
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
   // background: 'linear-gradient(135deg, rgba(240, 233, 231, 0.85) 0%, rgba(238, 236, 235, 0.9) 100%)',
    zIndex: 1,
  }
});

const TransparentBox = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: theme.spacing(4),
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
}));

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

const TitleContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const SearchButton = styled(motion.button)(({ theme }) => ({
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

const FloatingElement = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  zIndex: 1,
});

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Preload image for smoother experience
    const img = new Image();
    img.src = '/images/list2.jpg';
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: '0 12px 25px rgba(255, 83, 26, 0.6)'
    },
    tap: { scale: 0.95 }
  };

  return (
    <BackgroundContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating animated elements */}
      <FloatingElement
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '100px',
          height: '100px',
          top: '20%',
          left: '10%',
        }}
      />
      <FloatingElement
        animate={{
          y: [0, 20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          width: '150px',
          height: '150px',
          bottom: '15%',
          right: '10%',
        }}
      />
      <FloatingElement
        animate={{
          y: [0, -30, 0],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          width: '80px',
          height: '80px',
          top: '60%',
          left: '5%',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TitleContainer>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h2" 
                    component="h1"
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    Listify: Discover, Compare, and Choose
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 4,
                      fontSize: { xs: '1.2rem', md: '1.5rem' }
                    }}
                  >
                    Your Ultimate Guide to Finding the Best Products, Services, and Deals Online
                  </Typography>
                </motion.div>
              </motion.div>
            </TitleContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormContainer>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <TransparentBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <StyledTextField 
                        label="Keyword" 
                        variant="outlined" 
                        fullWidth 
                        margin="normal"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        InputProps={{
                          startAdornment: <Search sx={{ color: 'white', mr: 1 }} />
                        }}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StyledTextField
                        select
                        label="Category"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        InputProps={{
                          startAdornment: <Category sx={{ color: 'white', mr: 1 }} />
                        }}
                      >
                        <MenuItem value="electronics">Electronics</MenuItem>
                        <MenuItem value="fashion">Fashion</MenuItem>
                        <MenuItem value="home">Home & Garden</MenuItem>
                        <MenuItem value="services">Services</MenuItem>
                        <MenuItem value="food">Food & Dining</MenuItem>
                      </StyledTextField>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StyledTextField
                        select
                        label="Location"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        InputProps={{
                          startAdornment: <Place sx={{ color: 'white', mr: 1 }} />
                        }}
                      >
                        <MenuItem value="new-york">New York</MenuItem>
                        <MenuItem value="los-angeles">Los Angeles</MenuItem>
                        <MenuItem value="chicago">Chicago</MenuItem>
                        <MenuItem value="miami">Miami</MenuItem>
                        <MenuItem value="san-francisco">San Francisco</MenuItem>
                      </StyledTextField>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <SearchButton
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Search Now
                      </SearchButton>
                    </motion.div>
                  </motion.div>
                </TransparentBox>
              </motion.div>
            </FormContainer>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
}