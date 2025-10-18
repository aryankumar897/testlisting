"use client";

import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { motion, useInView } from 'framer-motion';

const IndexPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  const stats = [
    { value: 100, label: 'Total Happy Customers', suffix: 'K+', color: '#4fc3f7' },
    { value: 10, label: 'All Categories', suffix: '', color: '#4caf50' },
    { value: 500, label: 'Total Listings', suffix: '+', color: '#ff9800' },
    { value: 1000, label: 'Team Members', suffix: '+', color: '#f44336' }
  ];

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
        damping: 12
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <Box 
      ref={ref}
      sx={{ 
       // background: 'linear-gradient(135deg, #ff6a00 0%, #ff3d00 50%, #ff1a00 100%)',
        padding: { xs: '40px 20px', md: '80px 40px' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '-5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <Grid 
        container 
        spacing={3} 
        justifyContent="center"
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div variants={itemVariants}>
              <Box 
                textAlign="center" 
                color="white"
                sx={{
                  padding: { xs: '20px', md: '30px' },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    background: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                <motion.div
                  variants={numberVariants}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline'
                  }}
                >
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', md: '3rem' },
                      background: `linear-gradient(180deg, #ffffff 0%, ${stat.color} 100%)`,
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                  >
                    {isVisible ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 10,
                          delay: index * 0.1
                        }}
                      >
                        {stat.value}
                      </motion.span>
                    ) : 0}
                  </Typography>
                  {stat.suffix && (
                    <Typography 
                      variant="h5" 
                      component="span" 
                      sx={{ 
                        ml: 0.5,
                        fontWeight: 'bold',
                        color: stat.color
                      }}
                    >
                      {stat.suffix}
                    </Typography>
                  )}
                </motion.div>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 1,
                    fontWeight: 'medium',
                    fontSize: { xs: '0.9rem', md: '1.1rem' }
                  }}
                >
                  {stat.label}
                </Typography>
                
                {/* Animated progress bar */}
                <Box sx={{ mt: 2, width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isVisible ? { width: '100%' } : { width: 0 }}
                    transition={{ duration: 2, delay: index * 0.2 }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${stat.color}, #ffffff)`,
                      borderRadius: '2px'
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      {/* Floating particles */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </Box>
  );
};

export default IndexPage;