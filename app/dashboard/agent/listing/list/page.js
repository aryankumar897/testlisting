// app/dashboard/listings/page.jsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

import ListingTable from "@/components/dashboard/agent/listing/list/ListingTable";
import { fetchListings } from "@/slice/agentlistingSlice";
import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

const ListingsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { list: listings = [], loading } = useSelector((state) => state.listings || {});

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/agent/listing/edit/${id}`);
  };

  return (

<VerticalTabs>
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
          Listings Management
        </Typography>

        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": { backgroundColor: "#ff9a00" },
          }}
          onClick={() => router.push("/dashboard/agent/listing/create")}
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
</VerticalTabs>


  );
};

export default ListingsPage;
