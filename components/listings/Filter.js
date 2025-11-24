// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   InputLabel,
//   useMediaQuery,
// } from "@mui/material";

// // Import styled components
// import {
//   StyledContainer,
//   StyledTextField,
//   StyledFormControl,
//   StyledCheckbox,
//   StyledButton,
//   StyledCustomFormControl,
// } from "./FilterStyles";
// import { fetchHomeCategories } from "@/slice/categorySlice";
// import { fetchHomeLocations } from "@/slice/locationSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchHomeAmenities } from "@/slice/amenitySlice";
// import { useRouter } from "next/navigation";

// export default function FilterComponent() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   // State for form inputs
//   const [keyword, setKeyword] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [selectedAmenities, setSelectedAmenities] = useState([]);

//   // Store lists from Redux
//   const categories = useSelector(
//     (state) => state.categories.homeCategories || []
//   );
//   const locations = useSelector((state) => state.locations.homeLocations || []);
//   const amenities = useSelector((state) => state.amenities.homeAmenities || []);

//   const isSmallScreen = useMediaQuery("(max-width:600px)");

//   useEffect(() => {
//     dispatch(fetchHomeCategories());
//     dispatch(fetchHomeLocations());
//     dispatch(fetchHomeAmenities());
//   }, [dispatch]);

//   const handleKeywordChange = (event) => {
//     setKeyword(event.target.value);
//   };

//   const handleCategoryChange = (event) => {
//     setSelectedCategory(event.target.value);
//   };

//   const handleLocationChange = (event) => {
//     setSelectedLocation(event.target.value);
//   };

//   const handleAmenityChange = (amenitySlug) => (event) => {
//     if (event.target.checked) {
//       // Add amenity slug to selected list
//       setSelectedAmenities((prev) => [...prev, amenitySlug]);
//     } else {
//       // Remove amenity slug from selected list
//       setSelectedAmenities((prev) => prev.filter((slug) => slug !== amenitySlug));
//     }
//   };

//   const handleSubmit = () => {
//     // Build query parameters
//     const params = new URLSearchParams();
    
//     if (keyword) params.append("keyword", keyword);
//     if (selectedCategory) params.append("category", selectedCategory);
//     if (selectedLocation) params.append("location", selectedLocation);
    
//     // Add amenities as comma-separated slugs
//     if (selectedAmenities.length > 0) {
//       params.append("amenities", selectedAmenities.join(","));
//     }

//     // Redirect to search page with query parameters
//     router.push(`/search?${params.toString()}`);
//   };

//   return (
//     <StyledContainer>
//       <Typography variant="h6">Filters</Typography>

//       {/* Search keyword */}
//       <StyledTextField
//         label="Search Keyword"
//         variant="outlined"
//         fullWidth
//         value={keyword}
//         onChange={handleKeywordChange}
//         placeholder="Search by listing title..."
//       />

//       {/* Category Dropdown */}
//       <StyledFormControl variant="outlined" fullWidth>
//         <InputLabel>Select Category</InputLabel>
//         <Select
//           value={selectedCategory}
//           onChange={handleCategoryChange}
//           label="Select Category"
//         >
//           <MenuItem value="">All Categories</MenuItem>
//           {categories.map((category) => (
//             <MenuItem key={category._id} value={category.slug}>
//               {category.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </StyledFormControl>

//       {/* Location Dropdown */}
//       <StyledFormControl variant="outlined" fullWidth>
//         <InputLabel>Select Location</InputLabel>
//         <Select
//           value={selectedLocation}
//           onChange={handleLocationChange}
//           label="Select Location"
//         >
//           <MenuItem value="">All Locations</MenuItem>
//           {locations.map((location) => (
//             <MenuItem key={location._id} value={location.slug}>
//               {location.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </StyledFormControl>

//       {/* Amenities Checkboxes */}
//       <StyledCustomFormControl component="fieldset">
//         <Typography variant="subtitle1">Amenities</Typography>
//         {amenities.map((amenity) => (
//           <FormControlLabel
//             key={amenity._id}
//             control={
//               <StyledCheckbox
//                 checked={selectedAmenities.includes(amenity.slug)}
//                 onChange={handleAmenityChange(amenity.slug)}
//               />
//             }
//             label={amenity.name}
//           />
//         ))}
//       </StyledCustomFormControl>

//       {/* Submit button */}
//       <StyledButton fullWidth onClick={handleSubmit} variant="outlined">
//         Apply Filters
//       </StyledButton>
//     </StyledContainer>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
} from "@mui/material";

// Import styled components
import {
  StyledContainer,
  StyledTextField,
  StyledFormControl,
  StyledCheckbox,
  StyledButton,
  StyledCustomFormControl,
} from "./FilterStyles";
import { fetchHomeCategories } from "@/slice/categorySlice";
import { fetchHomeLocations } from "@/slice/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeAmenities } from "@/slice/amenitySlice";
import { useRouter } from "next/navigation";

export default function FilterComponent() {
  const dispatch = useDispatch();
  const router = useRouter();

  // State for form inputs
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Store lists from Redux
  const categories = useSelector(
    (state) => state.categories.homeCategories || []
  );
  const locations = useSelector((state) => state.locations.homeLocations || []);
  const amenities = useSelector((state) => state.amenities.homeAmenities || []);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchHomeCategories());
    dispatch(fetchHomeLocations());
    dispatch(fetchHomeAmenities());
  }, [dispatch]);

  // Handle keyword input change
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  // Handle category dropdown change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle location dropdown change
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Handle amenity checkbox change
  const handleAmenityChange = (amenitySlug) => (event) => {
    if (event.target.checked) {
      // Add amenity slug to selected list
      setSelectedAmenities((prev) => [...prev, amenitySlug]);
    } else {
      // Remove amenity slug from selected list
      setSelectedAmenities((prev) => prev.filter((slug) => slug !== amenitySlug));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add keyword if provided
    if (keyword && keyword.trim() !== "") {
      params.append("keyword", keyword.trim());
    }
    
    // Add category if selected
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    
    // Add location if selected
    if (selectedLocation) {
      params.append("location", selectedLocation);
    }
    
    // Add amenities as comma-separated slugs if any selected
    if (selectedAmenities.length > 0) {
      params.append("amenities", selectedAmenities.join(","));
    }

    // Redirect to search page with query parameters
    router.push(`/search?${params.toString()}`);
  };

  return (
    <StyledContainer>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Search keyword input */}
      <StyledTextField
        label="Search Keyword"
        variant="outlined"
        fullWidth
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="Search by listing title..."
      />

      {/* Category dropdown */}
      <StyledFormControl variant="outlined" fullWidth>
        <InputLabel>Select Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Select Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category.slug}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>

      {/* Location dropdown */}
      <StyledFormControl variant="outlined" fullWidth>
        <InputLabel>Select Location</InputLabel>
        <Select
          value={selectedLocation}
          onChange={handleLocationChange}
          label="Select Location"
        >
          <MenuItem value="">All Locations</MenuItem>
          {locations.map((location) => (
            <MenuItem key={location._id} value={location.slug}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>

      {/* Amenities checkboxes */}
      <StyledCustomFormControl component="fieldset">
        <Typography variant="subtitle1" gutterBottom>
          Amenities {selectedAmenities.length > 0 && `(${selectedAmenities.length} selected)`}
        </Typography>
        {amenities.map((amenity) => (
          <FormControlLabel
            key={amenity._id}
            control={
              <StyledCheckbox
                checked={selectedAmenities.includes(amenity.slug)}
                onChange={handleAmenityChange(amenity.slug)}
              />
            }
            label={amenity.name}
          />
        ))}
      </StyledCustomFormControl>

      {/* Submit button */}
      <StyledButton 
        fullWidth 
        onClick={handleSubmit} 
        variant="outlined"
        disabled={!keyword && !selectedCategory && !selectedLocation && selectedAmenities.length === 0}
      >
        Apply Filters
      </StyledButton>
    </StyledContainer>
  );
}