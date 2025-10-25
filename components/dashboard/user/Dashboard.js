"use client"

import { 
  Box, 
  Grid, 
  Typography, 

  Chip,
 
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EmojiObjects, TrendingUp, Assessment, Star, } from '@mui/icons-material';
import dashboardStyles from './dashboardStyles';

const getRandomColor = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};


export default function Dashboard() {
  const [colors, setColors] = useState([]);
 
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const styles = dashboardStyles;

 
  // Initialize colors
  useEffect(() => {
    const initialStats = [
      { title: 'Total Listings', count: 120, icon: <Assessment /> },
      { title: 'Active Listings', count: 80, icon: <TrendingUp /> },
      { title: 'Pending Listings', count: 20, icon: <EmojiObjects /> },
      { title: 'Total Reviews', count: 250, icon: <Star /> },
    ];
    setColors(initialStats.map(() => getRandomColor()));
  }, []);

  const stats = [
    { title: 'Total Listings', count: 120, icon: <Assessment /> },
    { title: 'Active Listings', count: 80, icon: <TrendingUp /> },
    { title: 'Pending Listings', count: 20, icon: <EmojiObjects /> },
    { title: 'Total Reviews', count: 250, icon: <Star /> },
  ];


  

  return (
    <Box sx={styles.container}>
      {/* Stats Grid */}
      <Typography variant="h4" sx={styles.sectionTitle}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={2} sx={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ ...styles.statCard, background: colors[index] }}>
              {stat.icon}
              <Typography sx={styles.statCount}>
                {stat.count}
              </Typography>
              <Typography sx={styles.statTitle}>
                {stat.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

    
    </Box>
  );
}