"use client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Card,
  Chip,
  TableHead,
} from "@mui/material";
import { invoiceStyles } from "./invoiceStyles";

const InvoiceDetails = ({ order }) => {
  // Format package features for display
  const getPackageFeatures = () => {
    const pkg = order.package_id;
    if (!pkg) return [];
    
    const features = [
      { label: 'Duration', value: `${pkg.number_of_days} days` },
      { label: 'Listings', value: pkg.num_of_listing === -1 ? 'Unlimited' : pkg.num_of_listing },
      { label: 'Photos', value: pkg.num_of_photos === -1 ? 'Unlimited' : pkg.num_of_photos },
      { label: 'Videos', value: pkg.num_of_video === -1 ? 'Unlimited' : pkg.num_of_video },
      { label: 'Amenities', value: pkg.num_of_amenities },
      { label: 'Featured Listings', value: pkg.num_of_featured_listing === -1 ? 'Unlimited' : pkg.num_of_featured_listing },
      { label: 'Show at Home', value: pkg.show_at_home ? 'Yes' : 'No' }
    ];
    
    return features;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: { bgcolor: '#d1edff', color: '#0c5460' },
      pending: { bgcolor: '#fff3cd', color: '#856404' },
      cancelled: { bgcolor: '#f8d7da', color: '#721c24' },
    };
    return colors[status.toLowerCase()] || { bgcolor: '#e2e3e5', color: '#383d41' };
  };

  return (
    <Box sx={invoiceStyles.container}>
      {/* Header */}
      <Card sx={invoiceStyles.header}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Invoice
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Package Purchase Details
            </Typography>
          </Box>
          <Chip 
            label={order.payment_status} 
            sx={{ 
              ...invoiceStyles.statusBadge,
              ...getStatusColor(order.payment_status)
            }} 
          />
        </Box>
      </Card>

      {/* Invoice Information */}
      <Box sx={invoiceStyles.infoSection}>
        <Card sx={invoiceStyles.infoBlock}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="#667eea">
            Invoice To
          </Typography>
          <Typography fontWeight="600">{order?.user_id?.name || "N/A"}</Typography>
          <Typography color="textSecondary">{order?.user_id?.email || "N/A"}</Typography>
        </Card>

        <Card sx={invoiceStyles.infoBlock}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="#667eea">
            Order Details
          </Typography>
          <Typography>
            <b>Order ID:</b>{" "}
            <span style={invoiceStyles.highlightText}>{order?.order_id}</span>
          </Typography>
          <Typography>
            <b>Payment Method:</b> {order?.payment_method}
          </Typography>
          <Typography>
            <b>Transaction ID:</b>{" "}
            <span style={invoiceStyles.highlightText}>
              {order?.transaction_id || "N/A"}
            </span>
          </Typography>
          <Typography>
            <b>Purchase Date:</b> {new Date(order?.purchase_date).toLocaleDateString()}
          </Typography>
        </Card>
      </Box>

      {/* Package Details Table */}
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={invoiceStyles.tableHeader}>
                <TableCell>#</TableCell>
                <TableCell>Package Details</TableCell>
                <TableCell>Features</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={invoiceStyles.tableRow}>
                <TableCell sx={invoiceStyles.tableCell}>
                  <Typography fontWeight="bold">1</Typography>
                </TableCell>
                <TableCell sx={invoiceStyles.tableCell}>
                  <Typography fontWeight="bold" variant="h6">
                    {order.package_id?.name} Package
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.package_id?.type?.charAt(0).toUpperCase() + order.package_id?.type?.slice(1)} Plan
                  </Typography>
                </TableCell>
                <TableCell sx={invoiceStyles.tableCell}>
                  <Box component="ul" sx={invoiceStyles.featureList}>
                    {getPackageFeatures().map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2">
                          <b>{feature.label}:</b> {feature.value}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={invoiceStyles.tableCell} align="right">
                  <Typography variant="h6" fontWeight="bold" sx={invoiceStyles.highlightText}>
                  
                    
                   $  {order.base_amount}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow sx={invoiceStyles.totalRow}>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">Total Amount</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5" fontWeight="bold" sx={invoiceStyles.highlightText}>
                 
                    
                    $ {order.base_amount}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '12px 24px',
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a6fd8',
              backgroundColor: 'rgba(102, 126, 234, 0.04)',
            },
          }}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          sx={invoiceStyles.printButton}
          onClick={() => window.print()}
        >
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceDetails;