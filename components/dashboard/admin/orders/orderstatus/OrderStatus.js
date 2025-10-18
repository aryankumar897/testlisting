"use client";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Snackbar,
  Alert,
  Chip,
  Card,
} from "@mui/material";
import { useState, useRef } from "react";
import PrintIcon from "@mui/icons-material/Print";
import {
  StyledContainer,
  ProductCell,
  OptionList,
  SectionTitle,
  SummaryBox,
  ColorfulHeader,
  GradientCard,
  StatusChip,
  FeatureBadge,
  UpdateButton,
  PrintButton,
} from "./OrderDetailsstyles";
import InvoicePrint from "./InvoicePrint";

const OrderDetails = ({ order }) => {
  // Access the nested order object from your API response
  const orderData = order;

  const [paymentStatus, setPaymentStatus] = useState(orderData.payment_status);
  const [orderStatus, setOrderStatus] = useState("completed"); // Default for package orders
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const invoiceRef = useRef();

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders/updatestatus/${orderData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
           payment_status  : paymentStatus,
       
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: "Order status updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;

    const style = document.createElement("style");
    style.innerHTML = `
      @page { size: auto; margin: 10mm; }
      body { font-family: Arial; padding: 20px; }
    `;
    document.head.appendChild(style);

    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPackageFeatures = (packageData) => {
    const features = [];

    if (packageData.num_of_listing !== undefined) {
      features.push(
        `${
          packageData.num_of_listing === -1
            ? "Unlimited"
            : packageData.num_of_listing
        } Listings`
      );
    }
    if (packageData.num_of_photos !== undefined) {
      features.push(
        `${
          packageData.num_of_photos === -1
            ? "Unlimited"
            : packageData.num_of_photos
        } Photos`
      );
    }
    if (packageData.num_of_video !== undefined) {
      features.push(
        `${
          packageData.num_of_video === -1
            ? "Unlimited"
            : packageData.num_of_video
        } Videos`
      );
    }
    if (packageData.num_of_amenities !== undefined) {
      features.push(
        `${
          packageData.num_of_amenities === -1
            ? "Unlimited"
            : packageData.num_of_amenities
        } Amenities`
      );
    }
    if (packageData.num_of_featured_listing !== undefined) {
      features.push(
        `${
          packageData.num_of_featured_listing === -1
            ? "Unlimited"
            : packageData.num_of_featured_listing
        } Featured Listings`
      );
    }
    if (packageData.number_of_days) {
      features.push(`${packageData.number_of_days} Days Validity`);
    }
    if (packageData.show_at_home) {
      features.push("Show at Home");
    }

    return features;
  };

  return (
    <StyledContainer>
      {/* Colorful Order Header */}
      <ColorfulHeader>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            🎯 Order #{orderData.order_id}
          </Typography>
          <Box display="flex" gap={1}>
            <StatusChip
              label={`💰 ${orderData.payment_status}`}
              status={orderData.payment_status}
            />
            <Chip
              label={`💳 ${orderData.payment_method}`}
              variant="outlined"
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Box>
      </ColorfulHeader>

      {/* Customer Information */}
      <GradientCard type="customer" sx={{ mb: 4 }}>
        <SectionTitle variant="h6">👤 Customer Information</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={orderData.user_id?.image}
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  border: "3px solid #8b5cf6",
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {orderData.user_id?.name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {orderData.user_id?.email || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ pl: 8 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong style={{ color: "#8b5cf6" }}>Role:</strong>
                <Chip
                  label={orderData.user_id?.role || "N/A"}
                  size="small"
                  sx={{
                    ml: 1,
                    background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    color: "white",
                  }}
                />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: "rgba(99, 102, 241, 0.1)",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong style={{ color: "#6366f1" }}>📅 Purchase Date:</strong>{" "}
                {formatDate(orderData.purchase_date)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong style={{ color: "#6366f1" }}>🕒 Order Created:</strong>{" "}
                {formatDate(orderData.createdAt)}
              </Typography>
              <Typography variant="body1">
                <strong style={{ color: "#6366f1" }}>🔗 Transaction ID:</strong>{" "}
                {orderData.transaction_id}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </GradientCard>

      {/* Package Information */}
      <GradientCard type="package" sx={{ mb: 4 }}>
        <SectionTitle variant="h6">📦 Package Details</SectionTitle>
        <Table
          sx={{ background: "white", borderRadius: 2, overflow: "hidden" }}
        >
          <TableHead>
            <TableRow
              sx={{ background: "linear-gradient(45deg, #8b5cf6, #ec4899)" }}
            >
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Package
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Features
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Currency
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover sx={{ background: "rgba(255,255,255,0.9)" }}>
              <ProductCell>
                <Avatar
                  src="/package-icon.png"
                  alt={orderData.package_id?.name}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    background: "linear-gradient(45deg, #10b981, #14b8a6)",
                    fontSize: "24px",
                  }}
                >
                  📦
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="#10b981">
                    {orderData.package_id?.name || "Unknown Package"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Package Subscription
                  </Typography>
                </Box>
              </ProductCell>
              <TableCell>
                <Chip
                  label={orderData.package_id?.type || "N/A"}
                  sx={{
                    background:
                      orderData.package_id?.type === "paid"
                        ? "linear-gradient(45deg, #f59e0b, #f97316)"
                        : "linear-gradient(45deg, #6b7280, #9ca3af)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </TableCell>
              <TableCell>
                <OptionList>
                  {formatPackageFeatures(orderData.package_id || {}).map(
                    (feature, index) => (
                      <li key={index}>
                        <FeatureBadge>{feature}</FeatureBadge>
                      </li>
                    )
                  )}
                </OptionList>
              </TableCell>
              <TableCell>
                <Typography variant="h5" fontWeight="bold" color="#ef4444">
                  ${orderData.base_amount}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={orderData.base_currency}
                  size="small"
                  sx={{
                    background: "linear-gradient(45deg, #3b82f6, #0ea5e9)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </GradientCard>

      {/* Status Update */}
      <GradientCard type="status" sx={{ mb: 4 }}>
        <SectionTitle variant="h6">⚡ Update Status</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="body1"
              fontWeight="bold"
              mb={1}
              color="#8b5cf6"
            >
              💳 Payment Status
            </Typography>
            <Select
              fullWidth
              size="medium"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              sx={{
                background: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8b5cf6",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7c3aed",
                },
              }}
            >
              <MenuItem value="pending">⏳ Pending</MenuItem>
              <MenuItem value="completed">✅ Completed</MenuItem>
              <MenuItem value="failed">❌ Failed</MenuItem>
            </Select>
          </Grid>



       
        </Grid>

        <UpdateButton
          variant="contained"
          onClick={handleStatusUpdate}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "🔄 Updating..." : "🚀 Update Status"}
        </UpdateButton>
      </GradientCard>

      {/* Order Summary */}
      <SummaryBox>
        <SectionTitle variant="h6">💰 Order Summary</SectionTitle>
        <Box textAlign="right">
          <Typography variant="h6" mb={2} color="#ef4444">
            Package Price: <strong>${orderData.base_amount}</strong>
          </Typography>
          <Box
            sx={{
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              p: 3,
              borderRadius: 3,
              color: "white",
              mb: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Total Amount: ${orderData.base_amount} {orderData.base_currency}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              📦 Package: {orderData.package_id?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ⏳ Valid for: {orderData.package_id?.number_of_days} days
            </Typography>
          </Box>
        </Box>
      </SummaryBox>

      {/* Print Invoice Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <PrintButton
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          🖨️ Print Invoice
        </PrintButton>
      </Box>

      {/* Hidden Invoice Print Component */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <InvoicePrint order={orderData} />
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default OrderDetails;
