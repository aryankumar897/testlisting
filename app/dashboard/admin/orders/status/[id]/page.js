"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import OrderDetails from "@/components/dashboard/admin/orders/orderstatus/OrderStatus";
import { useParams, useRouter } from "next/navigation";

const ViewOrderPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${process.env.API}/admin/orders/status/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        console.log("order data", data);

        // Pass all data as props without formatting
        setOrderData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography>{error}</Typography>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.push("/dashboard/admin/orders")}
        >
          Back to orders
        </Button>
      </Box>
    );
  }

  if (!orderData) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return <OrderDetails order={orderData} />;
};

export default ViewOrderPage;