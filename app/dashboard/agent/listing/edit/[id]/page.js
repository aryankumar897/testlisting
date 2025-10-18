// app/dashboard/admin/listing/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ListingEditForm from "@/components/dashboard/agent/listing/edit/ListingEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchListingById, updateListing } from "@/slice/agentlistingSlice";
import { useDispatch, useSelector } from "react-redux";

import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

const EditListingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [listingData, setListingData] = useState(null);

  // Use slice loading state for update submit
  const { loading: updateLoading } = useSelector(
    (state) => state.listings || {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchListingById(id)).unwrap();
        setListingData(data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        router.push("/dashboard/agent/listing/list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateListing({
          id,
          listingData: values,
        })
      ).unwrap();

      router.push("/dashboard/agent/listing/list");
    } catch (error) {
      console.error("Failed to update listing:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={80} sx={{ color: "yellow" }} />
      </Box>
    );
  }

  if (!listingData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Listing not found</Typography>
      </Box>
    );
  }

  return (
    <VerticalTabs>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Edit Listing
        </Typography>

        <ListingEditForm
          initialValues={listingData}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard/agent/listing/list")}
          loading={updateLoading}
        />
      </Box>
    </VerticalTabs>
  );
};

export default EditListingPage;
