
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Top from "@/components/topimage/Top";
import Listing from "@/components/listings/ProductCard"; // ✅ Using your Listing component
import { useParams, useRouter } from "next/navigation";
import { fetchCategoryListingsBySlug } from "@/slice/categorySlice";
import { useDispatch } from "react-redux";

const CategoryListingsPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
 
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]); // ✅ Store listings in local state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadListings = async () => {
      setLoading(true);
      try {
        // Call redux action
        const result = await dispatch(
          fetchCategoryListingsBySlug(slug)
        ).unwrap();
        // ✅ Save in local state

      

        setListings(result || []);
      } catch (err) {
        console.log("Error fetching listings:", err);
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
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

  if (!listings.length) {
    return (
      <>
        <Top />
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">
            No listings found for this category.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Top />

      <Listing data={listings} />
    </>
  );
};

export default CategoryListingsPage;
