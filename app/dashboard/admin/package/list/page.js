"use client";
import React, { useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { fetchPackages } from "@/slice/packageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PackageTable from "@/components/dashboard/admin/package/list/PackageTable";

const PackagesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: packages, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/package/edit/${id}`);
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
          Packages Management
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
          onClick={() => router.push("/dashboard/admin/package/create")}
        >
          Add New Package
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={80} sx={{ color: "yellow" }} />
        </Box>
      ) : (
        <PackageTable packages={packages} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default PackagesPage;
