"use client";

import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Grid, 
  IconButton, Avatar, Box, Divider, Link 
} from '@mui/material';
import { 
  LocationOn, Phone, Email, Facebook, Twitter, 
  Instagram, LinkedIn, YouTube, Send,
  LocalHotel, Restaurant, Pool, Wifi, DirectionsCar
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState({});

  const handleMouseEnter = (id) => {
    setIsHovered(prev => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setIsHovered(prev => ({ ...prev, [id]: false }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const iconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2, rotate: 5 }
  };

  // Hotel amenities for display
  const amenities = [
    { icon: <LocalHotel />, text: 'Luxury Rooms' },
    { icon: <Restaurant />, text: 'Fine Dining' },
    { icon: <Pool />, text: 'Swimming Pool' },
    { icon: <Wifi />, text: 'Free WiFi' },
    { icon: <DirectionsCar />, text: 'Parking' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(180deg, #080808ff 0%, #0f1113ff 50%, #2c5364 100%)',
        color: 'white',
        marginTop:"60px",
        padding: { xs: '30px 0', md: '50px 0' },
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ff9a00, #ff6a00, #ff9a00)',
          backgroundSize: '200% 100%',
          animation: 'gradientMove 3s linear infinite',
        }
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Avatar 
                      alt="LuxStay Logo" 
                      src="/images/hotel-icon.png" 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        marginRight: '12px',
                        border: '2px solid #ff9a00',
                        backgroundColor: '#ffffff'
                      }} 
                    />
                  </motion.div>
                  <Typography 
                    variant="h4" 
                    component="div"
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #ff9a00, #ff6a00)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    LuxStay
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
                  Discover luxury accommodations around the world. Book your perfect stay with us and experience unparalleled comfort.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ color: '#ff9a00', mr: 1 }} />
                  <Typography variant="body2">
                    123 Luxury Avenue, Resort City
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ color: '#ff9a00', mr: 1 }} />
                  <Typography variant="body2">
                    +1 (800) LUX-STAY
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: '#ff9a00', mr: 1 }} />
                  <Typography variant="body2">
                    info@luxstay.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mt: 2 }}>
                  {[
                    { icon: <Facebook />, color: '#3b5998', id: 'fb' },
                    { icon: <Twitter />, color: '#1da1f2', id: 'tw' },
                    { icon: <Instagram />, color: '#e1306c', id: 'ig' },
                    { icon: <LinkedIn />, color: '#0077b5', id: 'li' },
                    { icon: <YouTube />, color: '#ff0000', id: 'yt' }
                  ].map((social) => (
                    <motion.div
                      key={social.id}
                      variants={iconVariants}
                      whileHover="hover"
                      initial="rest"
                    >
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(241, 241, 241, 0.1)',
                          marginRight: 1,
                          '&:hover': { backgroundColor: social.color }
                        }}
                        aria-label={social.id}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9a00' }}>
                  Explore
                </Typography>
                {['Destinations', 'Luxury Hotels', 'Beach Resorts', 'City Stays', 'Mountain Lodges'].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    onHoverStart={() => handleMouseEnter(`link-${index}`)}
                    onHoverEnd={() => handleMouseLeave(`link-${index}`)}
                  >
                    <Link 
                      href="#" 
                      variant="body2" 
                      sx={{ 
                        mb: 1, 
                        display: 'block',
                        cursor: 'pointer',
                        color: isHovered[`link-${index}`] ? '#ff9a00' : 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        '&:hover': {
                          color: '#ff9a00'
                        }
                      }}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </Grid>

            {/* Amenities */}
            <Grid item xs={6} md={2}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9a00' }}>
                  Amenities
                </Typography>
                {amenities.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    onHoverStart={() => handleMouseEnter(`amenity-${index}`)}
                    onHoverEnd={() => handleMouseLeave(`amenity-${index}`)}
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
                  >
                    <Box sx={{ color: '#ff9a00', mr: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        cursor: 'pointer',
                        color: isHovered[`amenity-${index}`] ? '#ff9a00' : 'rgba(255,255,255,0.8)',
                        transition: 'color 0.3s'
                      }}
                    >
                      {item.text}
                    </Typography>
                  </motion.div>
                ))}
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9a00' }}>
                  Get Exclusive Deals
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  Subscribe to our newsletter for special offers, new destinations, and luxury travel tips.
                </Typography>
                
                <Box component="form" onSubmit={handleSubscribe}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#ff9a00',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff9a00',
                        },
                      },
                    }}
                    required
                    type="email"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<Send />}
                      type="submit"
                      sx={{
                        background: 'linear-gradient(45deg, #ff9a00, #ff6a00)',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff6a00, #ff9a00)',
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </motion.div>
                </Box>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  style={{ marginTop: '20px' }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
                    "The perfect stay for the perfect getaway."
                  </Typography>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  © {new Date().getFullYear()} LuxStay Hotels. All rights reserved.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                    <Link 
                      key={index} 
                      href="#" 
                      variant="body2" 
                      sx={{ 
                        ml: index > 0 ? 2 : 0,
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        '&:hover': { color: '#ff9a00' }
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;