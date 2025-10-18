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

} from "@mui/material";
import { AutoFixHigh} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createLocation } from "@/slice/locationSlice";
import { runAi } from "@/ai/Ai";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
 
} from "./locationFormStyles"; // You'll need to create this or reuse category styles

const LocationForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.locations);

  const [formData, setFormData] = useState({
    name: "",

    status: true,
    show_at_home: false,
  });

  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const generateLocationSuggestion = async () => {
    setIsGenerating(true);
    setLocalError("");

    try {
      const prompt = `Generate 15 UNIQUE location names for a buy/sell marketplace. STRICT RULES:

      1. FORMAT: Exactly 15 options, comma-separated, NO numbering
      2. LENGTH: 1-3 words each, under 25 characters
      3. TYPES: Mix these approaches equally:
         - Cities & Towns (e.g., "New York", "San Francisco")
         - Neighborhoods & Districts (e.g., "Downtown", "West End")
         - Regions & Areas (e.g., "Bay Area", "Silicon Valley")
         - Landmarks & Points of Interest (e.g., "Times Square", "Golden Gate")
      4. NEVER USE: "Basic, General, Standard, Normal, Regular"

      EXAMPLES:
      - Major Cities: "Los Angeles, Chicago, Miami, Seattle"
      - Tech Hubs: "Silicon Valley, Austin Tech Corridor, Boston Innovation District"
      - Urban Areas: "Manhattan Downtown, Brooklyn Heights, Chicago Loop"
      - Suburban: "Orange County, Fairfax County, Montgomery County"
      - Regional: "New England, Pacific Northwest, Southern California"

      Generate diverse location names:`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.name) {
      setLocalError("Location name is required");
      return;
    }

    try {
      await dispatch(createLocation(formData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        name: "",
        slug: "",
        status: true,
        show_at_home: false,
      });
    } catch (error) {
      setLocalError(error.message || "Failed to create location");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Location
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Location created successfully!
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate location suggestions with AI">
                    <IconButton
                      onClick={generateLocationSuggestion}
                      disabled={isGenerating}
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
            helperText="Enter the location name (e.g., New York, San Francisco)"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={handleStatusChange}
                name="status"
                sx={switchStyles}
              />
            }
            label="Active Location"
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
              {loading ? "Creating..." : "Create Location"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default LocationForm;
