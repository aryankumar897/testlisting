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
import { CloudUpload, Delete } from "@mui/icons-material";
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

const AmenityEditForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
      icon: "",
      status: true,
    }
  );

  const [error, setError] = useState("");
  const [uploadingIcon, setUploadingIcon] = useState(false);

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
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingIcon(true);
    setError("");

    try {
      const imageUrl = await uploadToCloudinary(file);
      
      setFormData(prev => ({
        ...prev,
        icon: imageUrl
      }));
    } catch (error) {
      setError(error.message || "Failed to upload icon");
    } finally {
      setUploadingIcon(false);
    }
  };

  const removeIcon = () => {
    setFormData(prev => ({
      ...prev,
      icon: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Amenity name is required");
      return;
    }

    if (!formData.icon) {
      setError("Icon is required");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save amenity");
      toast.error("Failed to save amenity");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          {initialValues ? "Edit Amenity" : "Add New Amenity"}
        </Typography>

        {error && (
          <Alert severity="error" sx={alertStyles}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
            helperText="Slug will be auto-generated from the name"
          />

          {/* Icon Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Icon Image*
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
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
              {loading ? "Saving..." : "Save Amenity"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AmenityEditForm;