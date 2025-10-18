// app/dashboard/admin/location/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import LocationForm from "@/components/dashboard/admin/location/edit/LocationEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchLocationById, updateLocation } from "@/slice/locationSlice";
import { useDispatch, useSelector } from "react-redux";

const EditLocationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.locations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchLocationById(id)).unwrap();
        setLocationData(data);
      } catch (error) {
        console.error("Failed to fetch location:", error);
        router.push("/dashboard/admin/location");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateLocation({
          id,
          locationData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/location/list");
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress 
          size={80} 
          sx={{ color: "yellow" }} 
        />
      </Box>
    );
  }

  if (!locationData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Location not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Location
      </Typography>
      <LocationForm
        initialValues={locationData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/location/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditLocationPage;