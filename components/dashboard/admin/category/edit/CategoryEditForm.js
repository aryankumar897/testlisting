"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardMedia,
  IconButton,
 
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {  CloudUpload, Delete } from "@mui/icons-material";


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



const CategoryEditForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
      slug: "",
      show_at_home: false,
      status: true,
      image_icon: "",
      background_image: "",
    }
  );

 
  const [error, setError] = useState("");

  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

   
  };

 

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    if (isBackground) {
      setUploadingBg(true);
    } else {
      setUploadingIcon(true);
    }

    setError("");

    try {
      const imageUrl = await uploadToCloudinary(file, isBackground);
      
      setFormData(prev => ({
        ...prev,
        [isBackground ? "background_image" : "image_icon"]: imageUrl
      }));
    } catch (error) {
      setError(error.message || "Failed to upload image");
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
    setError("");

    if (!formData.name ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save category");
      toast.error("Failed to save category");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          {initialValues ? "Edit Category" : "Add New Category"}
        </Typography>

        {error && (
          <Alert severity="error" sx={alertStyles}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
         
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
                checked={formData.show_at_home}
                onChange={handleToggleChange}
                name="show_at_home"
                sx={switchStyles}
              />
            }
            label="Show on Homepage"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={handleToggleChange}
                name="status"
                sx={switchStyles}
              />
            }
            label="Active Status"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={submitButtonStyles}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CategoryEditForm;