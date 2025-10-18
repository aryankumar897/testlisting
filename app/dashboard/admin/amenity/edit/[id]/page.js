// app/dashboard/admin/amenity/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import AmenityForm from "@/components/dashboard/admin/amenity/edit/AmenityEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchAmenityById, updateAmenity } from "@/slice/amenitySlice";
import { useDispatch, useSelector } from "react-redux";

const EditAmenityPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [amenityData, setAmenityData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.amenities);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchAmenityById(id)).unwrap();
        setAmenityData(data);
      } catch (error) {
        console.error("Failed to fetch amenity:", error);
        router.push("/dashboard/admin/amenity");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateAmenity({
          id,
          amenityData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/amenity/list");
    } catch (error) {
      console.error("Failed to update amenity:", error);
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

  if (!amenityData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Amenity not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Amenity
      </Typography>
      <AmenityForm
        initialValues={amenityData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/amenity/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditAmenityPage;