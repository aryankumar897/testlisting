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
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./packageFormStyles";

const PackageEditForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState(
    initialValues || {
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
    }
  );

  const [error, setError] = useState("");

  // Prefill form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        type: initialValues.type ?? "free",
        name: initialValues.name ?? "",
        price:
          initialValues.price !== undefined && initialValues.price !== null
            ? String(initialValues.price)
            : "",
        number_of_days:
          initialValues.number_of_days !== undefined &&
          initialValues.number_of_days !== null
            ? String(initialValues.number_of_days)
            : "",
        num_of_listing:
          initialValues.num_of_listing !== undefined &&
          initialValues.num_of_listing !== null
            ? String(initialValues.num_of_listing)
            : "",
        num_of_photos:
          initialValues.num_of_photos !== undefined &&
          initialValues.num_of_photos !== null
            ? String(initialValues.num_of_photos)
            : "",
        num_of_video:
          initialValues.num_of_video !== undefined &&
          initialValues.num_of_video !== null
            ? String(initialValues.num_of_video)
            : "",
        num_of_amenities:
          initialValues.num_of_amenities !== undefined &&
          initialValues.num_of_amenities !== null
            ? String(initialValues.num_of_amenities)
            : "",
        num_of_featured_listing:
          initialValues.num_of_featured_listing !== undefined &&
          initialValues.num_of_featured_listing !== null
            ? String(initialValues.num_of_featured_listing)
            : "",
        show_at_home: !!initialValues.show_at_home,
        status:
          initialValues.status === undefined ? true : !!initialValues.status,
      }));
    }
  }, [initialValues]);

  // Normal text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Allow negative and positive numbers
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Allow empty, "-" (for typing), or valid number
    if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Please provide a package name");
      return;
    }

    // ✅ Safely convert string numbers (including -1) to real numbers
    const payload = {
      type: formData.type,
      name: formData.name,
      price:
        formData.price !== "" && formData.price !== "-"
          ? parseFloat(formData.price)
          : undefined,
      number_of_days:
        formData.number_of_days !== "" && formData.number_of_days !== "-"
          ? parseFloat(formData.number_of_days)
          : undefined,
      num_of_listing:
        formData.num_of_listing !== "" && formData.num_of_listing !== "-"
          ? parseFloat(formData.num_of_listing)
          : undefined,
      num_of_photos:
        formData.num_of_photos !== "" && formData.num_of_photos !== "-"
          ? parseFloat(formData.num_of_photos)
          : undefined,
      num_of_video:
        formData.num_of_video !== "" && formData.num_of_video !== "-"
          ? parseFloat(formData.num_of_video)
          : undefined,
      num_of_amenities:
        formData.num_of_amenities !== "" && formData.num_of_amenities !== "-"
          ? parseFloat(formData.num_of_amenities)
          : undefined,
      num_of_featured_listing:
        formData.num_of_featured_listing !== "" &&
        formData.num_of_featured_listing !== "-"
          ? parseFloat(formData.num_of_featured_listing)
          : undefined,
      show_at_home: !!formData.show_at_home,
      status: !!formData.status,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      const msg = err?.message || "Failed to save package";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          {initialValues ? "Edit Package" : "Add New Package"}
        </Typography>

        {error && (
          <Alert severity="error" sx={alertStyles}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Type */}
          <TextField
            select
            fullWidth
            label="Package Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
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
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          {/* Price */}
          <TextField
            fullWidth
            label="Price (₹)"
            name="price"
            value={formData.price}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          {/* Number of Days */}
          <TextField
            fullWidth
            label="Number of Days"
            name="number_of_days"
            value={formData.number_of_days}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          {/* Package Limits */}
          <TextField
            fullWidth
            label="Number of Listings"
            name="num_of_listing"
            value={formData.num_of_listing}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          <TextField
            fullWidth
            label="Number of Photos"
            name="num_of_photos"
            value={formData.num_of_photos}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          <TextField
            fullWidth
            label="Number of Videos"
            name="num_of_video"
            value={formData.num_of_video}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          <TextField
            fullWidth
            label="Number of Amenities"
            name="num_of_amenities"
            value={formData.num_of_amenities}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          <TextField
            fullWidth
            label="Number of Featured Listings"
            name="num_of_featured_listing"
            value={formData.num_of_featured_listing}
            onChange={handleNumberChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            inputProps={{ inputMode: "numeric", pattern: "-?[0-9]*" }}
          />

          {/* Switches */}
          <FormControlLabel
            control={
              <Switch
                checked={!!formData.status}
                onChange={handleToggleChange}
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
                checked={!!formData.show_at_home}
                onChange={handleToggleChange}
                name="show_at_home"
                sx={switchStyles}
              />
            }
            label="Show on Homepage"
            sx={{ mb: 3 }}
          />

          {/* Actions */}
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
              {loading ? "Saving..." : "Save Package"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PackageEditForm;
