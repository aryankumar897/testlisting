"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import Top from "@/components/topimage/Top";

import Listing from "@/components/getlisting";
import { useParams } from "next/navigation";
import { fetchListingsBySlug } from "@/slice/listingSlice";
import { useDispatch } from "react-redux";

const GetListingsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null); 
  
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadListing = async () => {
      setLoading(true);
      try {
        const result = await dispatch(fetchListingsBySlug(slug)).unwrap();
        
        console.log("Single listing result:", result);

        setListing(result); // ✅ Direct single object
      } catch (err) {
        console.log("Error fetching listing:", err);
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [dispatch, slug]);

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
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!listing) {
    return (
      <>
        <Top />
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">No listing found.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Top />
      
      {/* If you want to use the Listing component, wrap in array */}
      <Listing data={listing} /> 
    </>
  );
};

export default GetListingsPage;