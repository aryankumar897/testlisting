"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { featuredCategoriesStyles } from "./featuredCategoriesStyles";

const HomePage = () => {
  const router = useRouter();
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/categories-featured`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch categories');
        }
        
        setFeaturedCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCategories();
  }, []);

  const handleCardClick = (slug) => {
    router.push(`/category-listings/${slug}`);
  };

  if (loading) {
    return (
      <Box sx={featuredCategoriesStyles.stateContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={featuredCategoriesStyles.stateContainer}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={featuredCategoriesStyles.mainContainer}>
      <Box sx={featuredCategoriesStyles.headerBox}>
        <Typography variant="h2" align="center" gutterBottom sx={featuredCategoriesStyles.titleText}>
          Featured Categories
        </Typography>
        <Typography variant="h6" align="center" sx={featuredCategoriesStyles.subtitleText}>
          Discover our most popular categories with verified listings
        </Typography>
      </Box>

      <Container sx={featuredCategoriesStyles.contentContainer}>
        <Grid container spacing={3}>
          {featuredCategories.map((category) => (
            <Grid item key={category._id} xs={12} sm={6} md={4}>
              <Card 
                sx={featuredCategoriesStyles.card}
                onClick={() => handleCardClick(category?.slug)}
              >
                {/* Image Overlay */}
                <Box sx={featuredCategoriesStyles.imageOverlay} />
                
                {/* Category Image */}
                <CardMedia
                  component="img"
                  image={category.background_image || "/images/list2.jpg"}
                  alt={category.name}
                  sx={featuredCategoriesStyles.cardMedia}
                />
                
                {/* Card Content */}
                <CardContent sx={featuredCategoriesStyles.cardContent}>
                  <Box sx={featuredCategoriesStyles.contentWrapper}>
                    {/* Left side - Category Name */}
                    <Box sx={featuredCategoriesStyles.textSection}>
                      <Typography variant="h6" sx={featuredCategoriesStyles.categoryName}>
                        {category.name}
                      </Typography>
                    </Box>
                    
                    {/* Right side - Listing Count */}
                    <Box sx={featuredCategoriesStyles.listingSection}>
                      <Typography sx={featuredCategoriesStyles.listingCount}>
                        {category.listingsCount}
                      </Typography>
                      <Typography sx={featuredCategoriesStyles.listingText}>
                        Listings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {featuredCategories.length === 0 && (
          <Typography variant="h6" sx={featuredCategoriesStyles.emptyState}>
            No featured categories found
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;