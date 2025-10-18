"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PackageEditForm from "@/components/dashboard/admin/package/edit/PackageEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchPackageById, updatePackage } from "@/slice/packageSlice";
import { useDispatch, useSelector } from "react-redux";

const EditPackagePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.packages);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchPackageById(id)).unwrap();
        setPackageData(data);
      } catch (error) {
        console.error("Failed to fetch package:", error);
        router.push("/dashboard/admin/package");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updatePackage({
          id,
          packageData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/package/list");
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={80} sx={{ color: "yellow" }} />
      </Box>
    );
  }

  if (!packageData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Package not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Package
      </Typography>
      <PackageEditForm
        initialValues={packageData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/package/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditPackagePage;
