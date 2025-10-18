// app/dashboard/locations/page.jsx
"use client";
import LocationTable from "@/components/dashboard/admin/location/list/LocationTable";
import React, { useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { fetchLocations } from "@/slice/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const LocationsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: locations, loading } = useSelector((state) => state.locations);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/location/edit/${id}`);
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
          Locations Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": {
              backgroundColor: "#ff9a00"
            }
          }}
          onClick={() => router.push("/dashboard/admin/location/create")}
        >
          Add New Location
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress 
            size={80} 
            sx={{ color: "yellow" }} 
          />
        </Box>
      ) : (
        <LocationTable
          locations={locations}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default LocationsPage;