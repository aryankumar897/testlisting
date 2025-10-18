// app/dashboard/amenities/page.jsx
"use client";
import AmenityTable from "@/components/dashboard/admin/amenity/list/AmenityTable";
import React, { useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { fetchAmenities } from "@/slice/amenitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const AmenitiesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: amenities, loading } = useSelector((state) => state.amenities);

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/amenity/edit/${id}`);
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
          Amenities Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": {
              backgroundColor: "#ff9a00",
            },
          }}
          onClick={() => router.push("/dashboard/admin/amenity/create")}
        >
          Add New Amenity
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={80} sx={{ color: "yellow" }} />
        </Box>
      ) : (
        <AmenityTable amenities={amenities} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default AmenitiesPage;
