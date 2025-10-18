"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress ,
  Chip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  tableContainerStyles,
  tableStyles,
  responsiveCellStyles,
  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./ordersTableStyles";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OrderTable = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const rowsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.API}/admin/orders/all-orders`
        );

        const data = await response.json();

        if (response.ok) {
          // Handle the nested orders array from server response
          setOrders(data || []);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders/${orderToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete));
        toast.success("Order deleted successfully");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete order");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleViewOrder = (orderId) => {
    router.push(`/dashboard/admin/orders/status/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "inprocess":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Map server data to table structure
  const mappedOrders = orders.map(order => ({
    _id: order._id,
    invoice_id: order.order_id || order.transaction_id || "N/A",
    user_id: {
      name: order.user_id?.name || "Unknown User"
    },
    grand_total: order.base_amount || 0,
    order_status: "completed", // You might want to add this field to your server data
    payment_status: order.payment_status || "pending",
    payment_method: order.payment_method || "N/A",
    createdAt: order.purchase_date || order.createdAt,
    package_name: order.package_id?.name || "Unknown Package",
  }));

  const paginatedOrders = mappedOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  
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
  
  if (error) return <Typography color="white">Error: {error}</Typography>;

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedOrders.map((order) => (
          <Box key={order._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Invoice ID</Typography>
              <Typography>{order.invoice_id}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>User</Typography>
              <Typography>{order.user_id?.name || "Unknown User"}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Package</Typography>
              <Typography>{order.package_name}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Total</Typography>
              <Typography>₹{order.grand_total}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Payment Method</Typography>
              <Typography>{formatPaymentMethod(order.payment_method)}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Order Status</Typography>
              <Chip
                label={order.order_status}
                color={getStatusColor(order.order_status)}
                size="small"
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Payment</Typography>
              <Chip
                label={order.payment_status}
                color={getPaymentStatusColor(order.payment_status)}
                size="small"
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Date</Typography>
              <Typography>{formatDate(order.createdAt)}</Typography>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => handleViewOrder(order._id)}
                sx={actionButtonStyles}
                color="primary"
              >
                <ViewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(order._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(mappedOrders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.invoice_id}</TableCell>
                <TableCell>{order.user_id?.name || "Unknown User"}</TableCell>
                <TableCell>{order.package_name}</TableCell>
                <TableCell>₹{order.grand_total}</TableCell>
                <TableCell>{formatPaymentMethod(order.payment_method)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.order_status}
                    color={getStatusColor(order.order_status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.payment_status}
                    color={getPaymentStatusColor(order.payment_status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewOrder(order._id)}
                    sx={actionButtonStyles}
                    color="primary"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(order._id)}
                    sx={{ ...actionButtonStyles, color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(mappedOrders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderTable;