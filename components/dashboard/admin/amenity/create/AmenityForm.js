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
import { createAmenity } from "@/slice/amenitySlice";
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
} from "./amenityFormStyles";

// Updated amenity types for a buy/sell listing website
const amenityTypes = [
  "Property & Real Estate",
  "Vehicle & Transportation",
  "Electronics & Gadgets",
  "Home & Furniture",
  "Fashion & Apparel",
  "Sports & Recreation",
  "Business & Office",
  "Services & Professional",
  "Entertainment & Media",
  "Community & Events",
];

const AmenityForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.amenities);

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    status: true,
  });

  const [amenityType, setAmenityType] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityTypeChange = (e) => {
    setAmenityType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const generateAmenitySuggestion = async () => {
    setIsGenerating(true);
    setLocalError("");

    try {
      if (!amenityType) {
        setLocalError("Please select an amenity type first");
        return;
      }

      const prompt = `Generate 15 UNIQUE amenity names for ${amenityType} on a buy/sell marketplace. STRICT RULES:

      1. FORMAT: Exactly 15 options, comma-separated, NO numbering
      2. LENGTH: 2-3 words each, under 25 characters
      3. STYLES: Mix these approaches equally:
         - Functional (what it provides)
         - Premium (luxury features)
         - Technical (specific capabilities)
         - Convenience (time-saving benefits)
      4. NEVER USE: "Basic, General, Standard, Normal, Regular"

      INDUSTRY-SPECIFIC EXAMPLES:
      - Property: "Swimming Pool, Gym Facility, Parking Space"
      - Vehicles: "GPS Navigation, Leather Seats, Sunroof"
      - Electronics: "Wireless Charging, Water Resistance, Voice Control"
      - Home: "Air Conditioning, Security System, Smart Lighting"
      - Fashion: "Size Options, Customization, Gift Wrapping"
      - Services: "24/7 Support, Free Consultation, Installation"

      Generate ONLY for ${amenityType}:`;

      const aiResponse = await runAi(prompt);
      const suggestions = aiResponse
        .split(",")
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length > 2 && s.length <= 25);

      if (suggestions.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * Math.min(suggestions.length, 5)
        );
        setFormData((prev) => ({ ...prev, name: suggestions[randomIndex] }));
      }
    } catch (error) {
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate suggestions. ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadToCloudinary = async (file) => {
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

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setLocalError("Image size should be less than 5MB");
      return;
    }

    setUploadingIcon(true);
    setLocalError("");

    try {
      const imageUrl = await uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,
        icon: imageUrl,
      }));
    } catch (error) {
      setLocalError(error.message || "Failed to upload icon");
    } finally {
      setUploadingIcon(false);
    }
  };

  const removeIcon = () => {
    setFormData((prev) => ({
      ...prev,
      icon: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.name) {
      setLocalError("Amenity name is required");
      return;
    }

    if (!formData.icon) {
      setLocalError("Icon is required");
      return;
    }

    try {
      await dispatch(createAmenity(formData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        name: "",
        icon: "",
        status: true,
      });
      setAmenityType("");
    } catch (error) {
      setLocalError(error.message || "Failed to create amenity");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Amenity
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Amenity created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Amenity Type</InputLabel>
            <Select
              value={amenityType}
              onChange={handleAmenityTypeChange}
              label="Amenity Type"
              size={isSmallScreen ? "small" : "medium"}
            >
              {amenityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Amenity Name*"
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
                  <Tooltip title="Generate amenity suggestions with AI">
                    <IconButton
                      onClick={generateAmenitySuggestion}
                      disabled={!amenityType || isGenerating}
                      edge="end"
                    >
                      {isGenerating ? (
                        <CircularProgress size={24} />
                      ) : (
                        <AutoFixHigh sx={{ color: "red" }} />
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
              Icon Image*
            </Typography>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-upload"
              type="file"
              onChange={handleIconUpload}
            />
            <label htmlFor="icon-upload">
              <Box sx={uploadAreaStyles}>
                {uploadingIcon ? (
                  <CircularProgress />
                ) : formData.icon ? (
                  <Box sx={imagePreviewStyles}>
                    <Card sx={{ maxWidth: 100 }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={formData.icon}
                        alt="Amenity icon"
                      />
                    </Card>
                    <IconButton
                      sx={deleteButtonStyles}
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        removeIcon();
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
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
            label="Active Amenity"
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
              {loading ? "Creating..." : "Create Amenity"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AmenityForm;