"use client";

import React from 'react';
import { MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Place, Category } from '@mui/icons-material';
import { StyledTextField, SearchButton } from './StyledComponents';
import { containerVariants, itemVariants, buttonVariants } from './animationVariants';

const SearchForm = ({ 
  keyword, 
  setKeyword, 
  category, 
  setCategory, 
  location, 
  setLocation, 
  categories = [], 
  locations = [], 
  onSearch 
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
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
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id || cat._id} value={cat.slug || cat.name}>
              {cat.name}
            </MenuItem>
          ))}
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
          <MenuItem value="">
            <em>All Locations</em>
          </MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc.id || loc._id} value={loc.slug || loc.name}>
              {loc.name}
            </MenuItem>
          ))}
        </StyledTextField>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <SearchButton
          type="submit"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          Search Now
        </SearchButton>
      </motion.div>
    </motion.form>
  );
};

export default SearchForm;