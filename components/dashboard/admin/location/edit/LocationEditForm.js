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
 
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./locationFormStyles"; // You'll need to create this or reuse category styles

const LocationEditForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
 
      show_at_home: false,
      status: true,
    }
  );

  const [error, setError] = useState("");
 
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
      setError(err.message || "Failed to save location");
      toast.error("Failed to save location");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          {initialValues ? "Edit Location" : "Add New Location"}
        </Typography>

        {error && (
          <Alert severity="error" sx={alertStyles}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Location Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
           
            helperText="Enter the location name (e.g., New York, San Francisco)"
          />

       
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
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
              {loading ? "Saving..." : "Save Location"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default LocationEditForm;