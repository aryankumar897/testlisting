"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Paper,
  Box,
  useMediaQuery,
  Dialog,
  DialogContent,
  CircularProgress,
  Card,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InvoiceDetails from "./InvoiceDetails";
import { orderStyles } from "./orderStyles";

const OrderList = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.API}/agent/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bgcolor: '#fff3cd', color: '#856404' },
      completed: { bgcolor: '#d1edff', color: '#0c5460' },
      cancelled: { bgcolor: '#f8d7da', color: '#721c24' },
      processing: { bgcolor: '#ffeaa7', color: '#5d5402' },
    };
    return colors[status.toLowerCase()] || { bgcolor: '#e2e3e5', color: '#383d41' };
  };

  if (loading) {
    return (
      <Box sx={orderStyles.loadingContainer}>
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ ...orderStyles.card, textAlign: 'center', color: '#ef4444' }}>
        <Typography variant="h6">Error Loading Orders</Typography>
        <Typography>{error}</Typography>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card sx={orderStyles.emptyState}>
        <Typography variant="h6" color="textSecondary">
          No orders found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Your orders will appear here once you make a purchase.
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={orderStyles.container}>
      <Card sx={orderStyles.header}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Order History
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Manage and view your package purchases
        </Typography>
      </Card>

      <Box sx={orderStyles.responsiveTable}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="order table">
            <TableHead>
              <TableRow sx={orderStyles.tableHeader}>
                <TableCell>Order ID</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} sx={orderStyles.tableRow}>
                  <TableCell sx={orderStyles.tableCell}>
                    <Typography fontWeight="bold" fontSize="0.8rem" sx={orderStyles.highlightText}>
                      {order.order_id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={orderStyles.tableCell}>
                    <Typography fontWeight="600" fontSize="0.8rem">
                      {order.package_id?.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={orderStyles.tableCell}>
                    <Typography fontSize="0.8rem">
                      {formatDate(order.purchase_date)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={orderStyles.tableCell}>
                    <Box
                      sx={{
                        ...orderStyles.statusBadge,
                        ...getStatusColor(order.payment_status)
                      }}
                    >
                      {order.payment_status}
                    </Box>
                  </TableCell>
                  <TableCell sx={orderStyles.tableCell}>
                    <Typography fontWeight="bold" fontSize="0.8rem">
                    
                      
                      
                     $  {order.base_amount}
                    </Typography>
                  </TableCell>
                  <TableCell sx={orderStyles.tableCell}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpen(order)}
                      sx={orderStyles.primaryButton}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedOrder && <InvoiceDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderList;