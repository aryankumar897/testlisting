"use client";

import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BackgroundContainer, FloatingElement } from "./BackgroundContainer";
import { TitleContainer } from "./StyledComponents";
import FormContainer from "./FormContainer";
import SearchForm from "./SearchForm";
import {
  backgroundVariants,
  containerVariants,
  itemVariants,
  floatingElementAnimations,
} from "./animationVariants";
import {
  titleStyles,
  containerStyles,
  floatingElementStyles,
} from "./componentStyles";
import { fetchHomeCategories } from "@/slice/categorySlice";
import { fetchHomeLocations } from "@/slice/locationSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  // store lists
  const categories = useSelector(
    (state) => state.categories.homeCategories || []
  );
  const locations = useSelector((state) => state.locations.homeLocations || []);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Preload image for smoother experience
    const img = new Image();
    img.src = "/images/list2.jpg";
  }, []);

  useEffect(() => {
    dispatch(fetchHomeCategories());
    dispatch(fetchHomeLocations());
  }, [dispatch]);

  const handleSearch = () => {
    // Create search params object
    const searchParams = new URLSearchParams();
    
    if (keyword) searchParams.append('keyword', keyword);
    if (category) searchParams.append('category', category);
    if (location) searchParams.append('location', location);

    // Redirect to search results page
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <BackgroundContainer
      variants={backgroundVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating animated elements */}
      <FloatingElement
        {...floatingElementAnimations.first}
        style={floatingElementStyles.first}
      />
      <FloatingElement
        {...floatingElementAnimations.second}
        style={floatingElementStyles.second}
      />
      <FloatingElement
        {...floatingElementAnimations.third}
        style={floatingElementStyles.third}
      />

      <Container maxWidth="lg" sx={containerStyles.mainContainer}>
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
                    sx={titleStyles.mainTitle}
                  >
                    Listify: Discover, Compare, and Choose
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={titleStyles.subtitle}
                  >
                    Your Ultimate Guide to Finding the Best Products, Services,
                    and Deals Online
                  </Typography>
                </motion.div>
              </motion.div>
            </TitleContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormContainer>
              <SearchForm
                keyword={keyword}
                setKeyword={setKeyword}
                category={category}
                setCategory={setCategory}
                location={location}
                setLocation={setLocation}
                categories={categories}
                locations={locations}
                onSearch={handleSearch}
              />
            </FormContainer>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
}