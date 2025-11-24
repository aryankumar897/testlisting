"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Top from "@/components/topimage/Top";
import Listing from "@/components/listings/ProductCard";
import { useSearchParams } from "next/navigation";

const CategoryListingsPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const amenity = searchParams.get("amenities");

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Trigger search when ANY of the parameters are present
    if (!category && !keyword && !location && !amenity) {
      setLoading(false);
      return;
    }

    const loadListings = async () => {
      setLoading(true);
      try {
        // ✅ Build query parameters (only include present parameters)
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (category) params.append("category", category);
        if (location) params.append("location", location);
        if (amenity) params.append("amenity", amenity);
        // ✅ Direct fetch API call
        const response = await fetch(
          `${process.env.API}/listings/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }

        const result = await response.json();
        setListings(result.data || result || []);
      } catch (err) {
        console.log("Error fetching listings:", err);
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [keyword, category, location]);

  // Display current search criteria
  console.log("Searching with:", { keyword, category, location ,amenity});

  // --- UI states ---
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress size={80} sx={{ color: "gold" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="white">
          {error}
        </Typography>
      </Box>
    );
  }

  // Show message when no parameters are provided
  if (!category && !keyword && !location && !amenity) {
    return (
      <>
        <Top />
        <Box sx={{ textAlign: "center", mt: 4, color: "white" }}>
          <Typography variant="h6">
            Please provide search criteria (keyword, category, or location, or amenity)
          </Typography>
        </Box>
      </>
    );
  }

  if (!listings.length) {
    return (
      <>
        <Top />
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">
            {`No listings found for ${keyword ? `"${keyword}"` : ""} ${
              category ? `in ${category}` : ""
            } ${location ? `at ${location}` : ""}`}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Top />
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom color="white">
          Search Results
        </Typography>
        <Typography variant="body1" color="white">
          {keyword && `Keyword: "${keyword}"`}
          {category && ` • Category: ${category}`}
          {location && ` • Location: ${location}`}
          {` • Found ${listings.length} listings`}
        </Typography>
      </Box>
      <Listing data={listings} />
    </>
  );
};

export default CategoryListingsPage;
