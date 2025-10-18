// app/dashboard/listings/page.jsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

import ListingTable from "@/components/dashboard/admin/listing/pending/ListingTable";
import { fetchPendingListings } from "@/slice/listingSlice";

const ListingsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { list: listings = [], loading } = useSelector((state) => state.listings || {});

  useEffect(() => {
    dispatch(fetchPendingListings());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/listing/edit/${id}`);
  };


  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
         Pending Listings Management
        </Typography>

        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": { backgroundColor: "#ff9a00" },
          }}
          onClick={() => router.push("/dashboard/admin/listing/create")}
        >
          Add New Listing
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={80} sx={{ color: "yellow" }} />
        </Box>
      ) : (
        <ListingTable listings={listings} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default ListingsPage;
