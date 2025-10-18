"use client";

import React, { useState, useRef } from 'react';
import { Box, Card, CardContent, Typography, Rating, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FormatQuote, Star } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  borderRadius: '20px',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  maxWidth: 500,
  margin: '1rem auto',
  padding: '2rem 1.5rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
  },
}));

const CircleImage = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  width: '80px',
  height: '80px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, #ff6a00, #ff3d00)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  boxShadow: '0 5px 15px rgba(255, 106, 0, 0.3)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '2px solid #ff6a00',
    opacity: 0.3,
    animation: 'pulse 2s infinite'
  }
}));

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  fontSize: '4rem',
  color: 'rgba(255, 106, 0, 0.1)',
  transform: 'rotate(180deg)'
}));

const PostCard = ({ post, index, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        y: isActive ? 0 : 20, 
        scale: isActive ? 1 : 0.95 
      }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem' }}
    >
      <StyledCard>
        <QuoteIcon />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          >
            <CircleImage>
              {post.title.charAt(0)}
            </CircleImage>
          </motion.div>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              textAlign: 'center', 
              mt: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ff6a00, #ff3d00)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {post.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Rating 
              value={post.rating} 
              readOnly 
              precision={0.5}
              icon={<Star sx={{ color: '#ff6a00' }} />}
              emptyIcon={<Star sx={{ color: '#ccc' }} />}
            />
            <Typography variant="body2" sx={{ ml: 1, color: '#ff6a00', fontWeight: 'bold' }}>
              {post.rating}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ textAlign: 'center', pt: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic',
              lineHeight: 1.6,
              position: 'relative',
              '&::before, &::after': {
                content: '"\\201C"',
                fontSize: '2rem',
                color: '#ff6a00',
                opacity: 0.3,
                position: 'absolute',
              },
              '&::before': {
                top: -10,
                left: -15,
              },
              '&::after': {
                content: '"\\201D"',
                bottom: -20,
                right: -15,
              }
            }}
          >
            {post.location}
          </Typography>
        </CardContent>
        
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #ff6a00, #ff3d00)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        />
      </StyledCard>
    </motion.div>
  );
};

const dummyPosts = [
  {
    title: "Sarah Johnson",
    rating: 4.5,
    location: "This platform completely transformed how we manage our listings. The interface is intuitive and the customer support is exceptional!",
    imageUrl: "/images/list2.jpg",
  },
  {
    title: "Michael Chen",
    rating: 4.8,
    location: "I've tried many similar services, but none compare to the seamless experience here. The attention to detail is remarkable.",
    imageUrl: "/images/list2.jpg",
  },
  {
    title: "Emma Rodriguez",
    rating: 4.2,
    location: "As a small business owner, this service has been invaluable. It's helped us reach new customers and grow our presence online.",
    imageUrl: "/images/list2.jpg",
  },
  {
    title: "James Wilson",
    rating: 4.6,
    location: "The quality of service exceeded my expectations. Quick responses, professional handling, and great results every time.",
    imageUrl: "/images/list2.jpg",
  },
  {
    title: "Lisa Taylor",
    rating: 4.7,
    location: "I recommend this to all my colleagues. It's reliable, efficient, and has all the features we need in one package.",
    imageUrl: "/images/list2.jpg",
  },
];

export default function ClientSaid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
  
  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = dummyPosts.length - 1;
      if (nextIndex >= dummyPosts.length) nextIndex = 0;
      return nextIndex;
    });
  };
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <Box sx={{
   //   background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: 8,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,61,0,0.1) 0%, transparent 70%)'
      }} />
      
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #ff6a00, #ff3d00)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.2rem', md: '3rem' }
              }}
            >
              What Our Clients Say
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                color: 'white',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Discover why thousands of customers trust us with their business needs
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ position: 'relative' }}>
          {/* Navigation arrows */}
          <IconButton 
            sx={{
              position: 'absolute',
              left: { xs: -10, md: -40 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'linear-gradient(90deg, #ff6a00, #ff3d00)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3d00, #ff6a00)',
              }
            }}
            onClick={() => paginate(-1)}
          >
            <ChevronLeft />
          </IconButton>
          
          <IconButton 
            sx={{
              position: 'absolute',
              right: { xs: -10, md: -40 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'linear-gradient(90deg, #ff6a00, #ff3d00)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3d00, #ff6a00)',
              }
            }}
            onClick={() => paginate(1)}
          >
            <ChevronRight />
          </IconButton>

          <Box sx={{ 
            display: 'flex', 
            overflow: 'hidden',
            justifyContent: 'center',
            mx: 'auto',
            width: '100%',
            maxWidth: { xs: '100%', md: '1200px' }
          }}>
            <AnimatePresence custom={direction} initial={false}>
              {dummyPosts.slice(currentIndex, currentIndex + itemsToShow).map((post, index) => (
                <motion.div
                  key={post.title}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ width: isMobile ? '100%' : isTablet ? '50%' : '33.33%' }}
                >
                  <PostCard 
                    post={post} 
                    index={index} 
                    isActive={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
          
          {/* Dots indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {dummyPosts.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  mx: 0.5,
                  cursor: 'pointer',
                  backgroundColor: index === currentIndex ? '#ff6a00' : '#ccc',
                  transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}