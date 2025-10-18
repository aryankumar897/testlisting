"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
} from "@mui/material";
import { AutoFixHigh, CloudUpload, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "@/slice/categorySlice";



import { runAi } from "@/ai/Ai";


import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
  uploadAreaStyles,
  imagePreviewStyles,
  deleteButtonStyles,
} from "./categoryFormStyles";


// Detailed category types for comprehensive directory listing
const categoryTypes = [
  "Accounting & Tax Services",
  "Banks & Credit Unions",
  "Bars & Nightlife",
  "Bookstores & Libraries",
  "Car Dealers & Rentals",
  "Coffee Shops & Cafes",
  "Contractors & Construction",
  "Dentists & Dental Care",
  "Doctors & Medical Centers",
  "Electricians & Plumbing",
  "Fitness Centers & Gyms",
  "Hotels & Accommodations",
  "Insurance Agencies",
  "Law Firms & Attorneys",
  "Marketing & Advertising",
  "Pet Services & Veterinarians",
  "Real Estate Agencies",
  "Restaurants & Catering",
  "Schools & Universities",
  "Shopping Malls & Stores",
  "Technology & Computer Repair",
  "Travel Agencies & Tours",
  "Wedding Services & Planning"
];


const CategoryForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    status: true,
    show_at_home: false,
    image_icon: "",
    background_image: "",
  });

  const [categoryType, setCategoryType] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryTypeChange = (e) => {
    setCategoryType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const handleShowAtHomeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      show_at_home: e.target.checked,
    }));
  };

  const generateCategorySuggestion = async () => {
    setIsGenerating(true);
    setLocalError("");

    try {
      if (!categoryType) {
        setLocalError("Please select a category type first");
        return;
      }

      const prompt = `Generate 15 UNIQUE subcategory names for ${categoryType} on a buy/sell marketplace. STRICT RULES:

      1. FORMAT: Exactly 15 options, comma-separated, NO numbering
      2. LENGTH: 2-3 words each, under 25 characters
      3. STYLES: Mix these approaches equally:
         - Functional (what it is)
         - Premium (luxury versions)
         - Technical (specific features)
         - Time-based (seasonal/temporal)
      4. NEVER USE: "Basic, General, Standard, Normal, Regular"

      INDUSTRY-SPECIFIC EXAMPLES:
      - Electronics: "Smart Home Devices, Gaming Consoles, Camera & Photography"
      - Vehicles: "Electric Scooters, Vintage Cars, Motorcycle Accessories"
      - Real Estate: "Vacation Rentals, Commercial Properties, Student Housing"
      - Fashion: "Designer Handbags, Vintage Clothing, Sports Apparel"
      - Home & Garden: "Smart Home Systems, Outdoor Furniture, Kitchen Appliances"
      - Sports: "Fitness Equipment, Camping Gear, Water Sports"
      - Collectibles: "Rare Coins, Comic Books, Movie Memorabilia"
      - Services: "Tutoring Services, Home Repair, Graphic Design"

      Generate ONLY for ${categoryType}:`;

      const aiResponse = await runAi(prompt);
      const suggestions = aiResponse.split(',')
        .map(s => s.trim().replace(/\.$/, ''))
        .filter(s => s.length > 2 && s.length <= 25);
      
      if (suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(suggestions.length, 5));
        setFormData(prev => ({ ...prev, name: suggestions[randomIndex] }));
      }
    } catch (error) {
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate suggestions. ${error.message || "Please try again."}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadToCloudinary = async (file, isBackground = false) => {
    const uploadPreset = "ml_default";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    if (!uploadPreset || !cloudName) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleImageUpload = async (e, isBackground = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setLocalError("Image size should be less than 5MB");
      return;
    }

    if (isBackground) {
      setUploadingBg(true);
    } else {
      setUploadingIcon(true);
    }

    setLocalError("");

    try {
      const imageUrl = await uploadToCloudinary(file, isBackground);
      
      setFormData(prev => ({
        ...prev,
        [isBackground ? "background_image" : "image_icon"]: imageUrl
      }));
    } catch (error) {
      setLocalError(error.message || "Failed to upload image");
    } finally {
      if (isBackground) {
        setUploadingBg(false);
      } else {
        setUploadingIcon(false);
      }
    }
  };

  const removeImage = (isBackground = false) => {
    setFormData(prev => ({
      ...prev,
      [isBackground ? "background_image" : "image_icon"]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.name) {
      setLocalError("Category name is required");
      return;
    }

    try {
      await dispatch(createCategory(formData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        name: "",
        status: true,
        show_at_home: false,
        image_icon: "",
        background_image: "",
      });
      setCategoryType("");
    } catch (error) {
      setLocalError(error.message || "Failed to create category");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Category
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Category created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category Type</InputLabel>
            <Select
              value={categoryType}
              onChange={handleCategoryTypeChange}
              label="Category Type"
              size={isSmallScreen ? "small" : "medium"}
            >
              {categoryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Category Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate category suggestions with AI">
                    <IconButton 
                      onClick={generateCategorySuggestion}
                      disabled={!categoryType || isGenerating}
                      edge="end"
                    >
                      {isGenerating ? (
                        <CircularProgress size={24} />
                      ) : (
                        <AutoFixHigh sx={{ color: "red" }}  />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            helperText="Slug will be auto-generated from the name"
          />

          {/* Icon Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Icon Image
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-image-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, false)}
            />
            <label htmlFor="icon-image-upload">
              <Box sx={uploadAreaStyles}>
                {uploadingIcon ? (
                  <CircularProgress />
                ) : formData.image_icon ? (
                  <Box sx={imagePreviewStyles}>
                    <Card sx={{ maxWidth: 100 }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={formData.image_icon}
                        alt="Category icon"
                      />
                    </Card>
                    <IconButton 
                      sx={deleteButtonStyles} 
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(false);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                    <Typography variant="body2">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
          </Box>

          {/* Background Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Background Image
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="bg-image-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, true)}
            />
            <label htmlFor="bg-image-upload">
              <Box sx={uploadAreaStyles}>
                {uploadingBg ? (
                  <CircularProgress />
                ) : formData.background_image ? (
                  <Box sx={imagePreviewStyles}>
                    <Card sx={{ maxWidth: 150 }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={formData.background_image}
                        alt="Category background"
                      />
                    </Card>
                    <IconButton 
                      sx={deleteButtonStyles} 
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                    <Typography variant="body2">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={handleStatusChange}
                name="status"
                sx={switchStyles}
              />
            }
            label="Active Category"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.show_at_home}
                onChange={handleShowAtHomeChange}
                name="show_at_home"
                sx={switchStyles}
              />
            }
            label="Show on Homepage"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size={isSmallScreen ? "medium" : "large"}
              disabled={loading}
              sx={submitButtonStyles}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CategoryForm;