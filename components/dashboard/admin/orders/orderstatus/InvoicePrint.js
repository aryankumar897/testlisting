// components/dashboard/admin/orders/InvoicePrint.jsx
"use client";
import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';

const InvoicePrint = React.forwardRef(({ order }, ref) => {
  // Access the nested order object if needed
  const orderData = order.order || order;

  const formatPackageFeatures = (packageData) => {
    if (!packageData) return [];
    
    const features = [];
    
    if (packageData.num_of_listing !== undefined) {
      features.push(`${packageData.num_of_listing === -1 ? 'Unlimited' : packageData.num_of_listing} Listings`);
    }
    if (packageData.num_of_photos !== undefined) {
      features.push(`${packageData.num_of_photos === -1 ? 'Unlimited' : packageData.num_of_photos} Photos`);
    }
    if (packageData.num_of_video !== undefined) {
      features.push(`${packageData.num_of_video === -1 ? 'Unlimited' : packageData.num_of_video} Videos`);
    }
    if (packageData.num_of_amenities !== undefined) {
      features.push(`${packageData.num_of_amenities === -1 ? 'Unlimited' : packageData.num_of_amenities} Amenities`);
    }
    if (packageData.num_of_featured_listing !== undefined) {
      features.push(`${packageData.num_of_featured_listing === -1 ? 'Unlimited' : packageData.num_of_featured_listing} Featured`);
    }
    if (packageData.number_of_days) {
      features.push(`${packageData.number_of_days} Days`);
    }
    if (packageData.show_at_home) {
      features.push('Home Featured');
    }

    return features;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'paid': return 'success';
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'inprocess': return 'info';
      case 'failed': 
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Color palette for vibrant design
  const colors = {
    primary: '#6366f1',
    secondary: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    purple: '#8b5cf6',
    teal: '#14b8a6',
    orange: '#f97316',
    blue: '#0ea5e9'
  };

  return (
    <Box ref={ref} sx={{ 
      p: 3, 
      maxWidth: '100%',
      margin: 0,
      display: 'none',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: 1.2,
      '@media print': {
        display: 'block',
        p: 2,
        margin: 0,
        maxWidth: '100%',
        height: 'auto',
        overflow: 'visible',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }
    }}>
      {/* Compact Header */}
      <Box sx={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.purple} 100%)`,
        color: 'white',
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ 
          fontSize: '20px',
          mb: 1
        }}>
          PACKAGE INVOICE
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            Order: {orderData.order_id}
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            Date: {formatDate(orderData.purchase_date || orderData.createdAt)}
          </Typography>
        </Box>
      </Box>

      {/* Compact Customer and Order Info */}
      <Box display="flex" justifyContent="space-between" mb={2} gap={1} sx={{ fontSize: '10px' }}>
        <Box sx={{
          p: 1.5,
          background: `linear-gradient(135deg, ${colors.teal}15 0%, ${colors.blue}15 100%)`,
          border: `1px solid ${colors.teal}30`,
          borderRadius: 1,
          flex: 1
        }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: colors.teal, mb: 0.5 }}>
            CUSTOMER INFO
          </Typography>
          <Box sx={{ lineHeight: 1.4 }}>
            <Typography sx={{ fontSize: '10px' }}><strong>Name:</strong> {orderData.user_id?.name || 'Unknown'}</Typography>
            <Typography sx={{ fontSize: '10px' }}><strong>Email:</strong> {orderData.user_id?.email || 'N/A'}</Typography>
            <Typography sx={{ fontSize: '10px' }}><strong>Role:</strong> {orderData.user_id?.role || 'N/A'}</Typography>
          </Box>
        </Box>
        
        <Box sx={{
          p: 1.5,
          background: `linear-gradient(135deg, ${colors.orange}15 0%, ${colors.warning}15 100%)`,
          border: `1px solid ${colors.orange}30`,
          borderRadius: 1,
          flex: 1,
          textAlign: 'right'
        }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: colors.orange, mb: 0.5 }}>
            ORDER DETAILS
          </Typography>
          <Box sx={{ lineHeight: 1.4 }}>
            <Typography sx={{ fontSize: '10px' }}><strong>Txn ID:</strong> {orderData.transaction_id}</Typography>
            <Typography sx={{ fontSize: '10px' }}><strong>Method:</strong> {orderData.payment_method}</Typography>
            <Typography sx={{ fontSize: '10px' }}><strong>Currency:</strong> {orderData.base_currency}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Compact Status Indicators */}
      <Box display="flex" gap={1} mb={2} justifyContent="center" flexWrap="wrap">
        <Chip 
          label={`Payment: ${orderData.payment_status?.toUpperCase()}`} 
          color={getStatusColor(orderData.payment_status)}
          sx={{ 
            fontWeight: 'bold',
            fontSize: '10px',
            height: '24px',
            px: 1
          }}
        />
        <Chip 
          label={`Type: ${orderData.package_id?.type?.toUpperCase() || 'N/A'}`} 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '10px',
            height: '24px',
            px: 1,
            background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.secondary} 100%)`,
            color: 'white'
          }}
        />
      </Box>

      {/* Compact Package Details */}
      <Box mb={2} sx={{
        background: 'white',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.primary}20`
      }}>
        <Box sx={{
          background: `linear-gradient(135deg, ${colors.info} 0%, ${colors.blue} 100%)`,
          p: 1,
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            PACKAGE DETAILS
          </Typography>
        </Box>
        
        <Box sx={{ p: 1.5 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 1.5,
            borderBottom: `1px dashed ${colors.primary}30`
          }}>
            <Box sx={{ flex: 2 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary, mb: 0.5 }}>
                {orderData.package_id?.name || 'Unknown Package'}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: colors.secondary, mb: 1, fontWeight: 'bold' }}>
                {orderData.package_id?.type === 'paid' ? 'Premium' : 'Basic'} Package
              </Typography>
              
              {/* Compact Package Features */}
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: colors.success, mb: 0.5 }}>
                  Package Includes:
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: 0.5
                }}>
                  {formatPackageFeatures(orderData.package_id).map((feature, index) => (
                    <Box key={index} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <Box sx={{
                        width: 16,
                        height: 16,
                        background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.teal} 100%)`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </Box>
                      <Typography sx={{ fontSize: '9px', color: colors.success, fontWeight: 'bold' }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ 
              flex: 1, 
              textAlign: 'center',
              p: 1,
              background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.purple}15 100%)`,
              borderRadius: 1,
              border: `1px solid ${colors.primary}30`,
              ml: 1
            }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.primary, mb: 0.5 }}>
                ₹{orderData.base_amount}
              </Typography>
              <Typography sx={{ fontSize: '9px', color: colors.secondary, fontWeight: 'bold', mb: 1 }}>
                One-time
              </Typography>
              <Box sx={{
                p: 0.5,
                background: `linear-gradient(135deg, ${colors.warning}15 0%, ${colors.orange}15 100%)`,
                borderRadius: 1,
                border: `1px solid ${colors.warning}30`
              }}>
                <Typography sx={{ fontSize: '9px', color: colors.warning, fontWeight: 'bold' }}>
                  {orderData.package_id?.number_of_days || 'N/A'} days
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Package Status */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1.5,
            mt: 1,
            borderTop: `1px dashed ${colors.success}30`
          }}>
            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: colors.info }}>
                Package Status
              </Typography>
              <Typography sx={{ fontSize: '9px', color: colors.blue }}>
                Active until: {(() => {
                  const purchaseDate = new Date(orderData.purchase_date);
                  const validityDays = orderData.package_id?.number_of_days || 0;
                  const expiryDate = new Date(purchaseDate);
                  expiryDate.setDate(purchaseDate.getDate() + validityDays);
                  return expiryDate.toLocaleDateString();
                })()}
              </Typography>
            </Box>
            <Chip 
              label="ACTIVE" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '9px',
                height: '20px',
                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.teal} 100%)`,
                color: 'white'
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Compact Order Summary */}
      <Box sx={{
        background: `linear-gradient(135deg, ${colors.purple}15 0%, ${colors.secondary}15 100%)`,
        p: 2,
        borderRadius: 2,
        border: `2px solid ${colors.purple}30`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mb: 1.5, color: colors.purple, textAlign: 'center' }}>
          ORDER SUMMARY
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          mb: 1.5
        }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: colors.purple }}>
            Package Price:
          </Typography>
          <Typography sx={{ fontSize: '11px', textAlign: 'right', fontWeight: 'bold', color: colors.purple }}>
            ₹{orderData.base_amount}
          </Typography>
          
          <Typography sx={{ fontSize: '10px', color: colors.blue, fontWeight: 'bold' }}>
            Validity:
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'right', color: colors.blue, fontWeight: 'bold' }}>
            {orderData.package_id?.number_of_days || 'N/A'} days
          </Typography>
          
          <Typography sx={{ fontSize: '10px', color: colors.teal, fontWeight: 'bold' }}>
            Type:
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'right', color: colors.teal, fontWeight: 'bold' }}>
            {orderData.package_id?.type || 'N/A'}
          </Typography>
          
          <Typography sx={{ fontSize: '10px', color: colors.orange, fontWeight: 'bold' }}>
            Payment:
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'right', color: colors.orange, fontWeight: 'bold' }}>
            {orderData.payment_status?.toUpperCase()}
          </Typography>
        </Box>
        
        <Divider sx={{ 
          my: 1, 
          borderColor: colors.purple,
          borderWidth: 1,
          opacity: 0.3
        }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: colors.purple }}>
            TOTAL AMOUNT
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: colors.success }}>
            ₹{orderData.base_amount} {orderData.base_currency}
          </Typography>
        </Box>
      </Box>

      {/* Compact Terms and Footer */}
      <Box mt={2}>
        <Box sx={{
          p: 1.5,
          background: `linear-gradient(135deg, ${colors.warning}10 0%, ${colors.orange}10 100%)`,
          borderRadius: 1,
          border: `1px solid ${colors.warning}30`,
          mb: 1
        }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: colors.warning, mb: 0.5 }}>
            TERMS & CONDITIONS
          </Typography>
          <Box sx={{ color: colors.orange, lineHeight: 1.3 }}>
            <Typography sx={{ fontSize: '8px' }}>• Digital package subscription invoice</Typography>
            <Typography sx={{ fontSize: '8px' }}>• Validity starts from purchase date</Typography>
            <Typography sx={{ fontSize: '8px' }}>• Subject to terms of service</Typography>
          </Box>
        </Box>

        {/* Compact Footer */}
        <Box textAlign="center" sx={{
          pt: 1,
          borderTop: `1px solid ${colors.primary}20`
        }}>
          <Typography sx={{ fontSize: '9px', color: colors.primary, fontWeight: 'bold', mb: 0.5 }}>
            Thank you for your subscription!
          </Typography>
          <Typography sx={{ fontSize: '7px', color: colors.purple }}>
            Auto-generated invoice • {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            * {
              box-sizing: border-box;
            }
          }
        `}
      </style>
    </Box>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;