"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPackage } from "@/slice/packageSlice";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./packageFormStyles";

const PackageForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.packages);

  const [formData, setFormData] = useState({
    type: "free",
    name: "",
    price: "",
    number_of_days: "",
    num_of_listing: "",
    num_of_photos: "",
    num_of_video: "",
    num_of_amenities: "",
    num_of_featured_listing: "",
    show_at_home: false,
    status: true,
  });

  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.name) {
      setLocalError("Package name is required");
      return;
    }

    try {
      await dispatch(createPackage(formData)).unwrap();
      setLocalSuccess(true);

      // Reset form fields
      setFormData({
        type: "free",
        name: "",
        price: "",
        number_of_days: "",
        num_of_listing: "",
        num_of_photos: "",
        num_of_video: "",
        num_of_amenities: "",
        num_of_featured_listing: "",
        show_at_home: false,
        status: true,
      });
    } catch (error) {
      setLocalError(error.message || "Failed to create package");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Package
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Package created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Package Type */}
          <TextField
            select
            fullWidth
            label="Package Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          >
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>

          {/* Name */}
          <TextField
            fullWidth
            label="Package Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            sx={textFieldStyles}
          />

          {/* Price */}
          <TextField
            fullWidth
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          {/* Duration */}
          <TextField
            fullWidth
            label="Number of Days"
            name="number_of_days"
            type="number"
            value={formData.number_of_days}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          {/* Package Limits */}
          <TextField
            fullWidth
            label="Number of Listings"
            name="num_of_listing"
            type="number"
            value={formData.num_of_listing}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Number of Photos"
            name="num_of_photos"
            type="number"
            value={formData.num_of_photos}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Number of Videos"
            name="num_of_video"
            type="number"
            value={formData.num_of_video}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Number of Amenities"
            name="num_of_amenities"
            type="number"
            value={formData.num_of_amenities}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Number of Featured Listings"
            name="num_of_featured_listing"
            type="number"
            value={formData.num_of_featured_listing}
            onChange={handleChange}
            variant="outlined"
            sx={textFieldStyles}
          />

          {/* Switches */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={handleSwitchChange}
                name="status"
                sx={switchStyles}
              />
            }
            label="Active Package"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.show_at_home}
                onChange={handleSwitchChange}
                name="show_at_home"
                sx={switchStyles}
              />
            }
            label="Show on Homepage"
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={submitButtonStyles}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creating..." : "Create Package"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PackageForm;
