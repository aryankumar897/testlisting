"use client"

import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EmojiObjects, TrendingUp, Assessment, Star, CalendarToday, Payment } from '@mui/icons-material';
import dashboardStyles from './dashboardStyles';

const getRandomColor = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Helper function to format values (-1 as Unlimited)
const formatValue = (value) => {
  if (value === -1) return 'Unlimited';
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value;
};

// Helper function to get days remaining
const getDaysRemaining = (expireDate) => {
  if (!expireDate) return 'Unlimited';
  const today = new Date();
  const expiry = new Date(expireDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} days` : 'Expired';
};

export default function Dashboard() {
  const [colors, setColors] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const styles = dashboardStyles;

  // Fetch active subscriptions data
  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/agent/subscriptions/active`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setActiveSubscriptions([]);
            return;
          }
          throw new Error(`Failed to fetch subscriptions: ${response.status}`);
        }

        const subscriptionsData = await response.json();
        setActiveSubscriptions(subscriptionsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSubscriptions();
  }, []);

  // Initialize colors
  useEffect(() => {
    const initialStats = [
      { title: 'Total Listings', count: 120, icon: <Assessment /> },
      { title: 'Active Listings', count: 80, icon: <TrendingUp /> },
      { title: 'Pending Listings', count: 20, icon: <EmojiObjects /> },
      { title: 'Total Reviews', count: 250, icon: <Star /> },
    ];
    setColors(initialStats.map(() => getRandomColor()));
  }, []);

  const stats = [
    { title: 'Total Listings', count: 120, icon: <Assessment /> },
    { title: 'Active Listings', count: 80, icon: <TrendingUp /> },
    { title: 'Pending Listings', count: 20, icon: <EmojiObjects /> },
    { title: 'Total Reviews', count: 250, icon: <Star /> },
  ];

  // Two-column table row component
  const TableRow = ({ label, value, isChip = false, chipProps = {} }) => (
    <Box sx={styles.tableRow}>
      <Box sx={styles.tableHeader}>
        {label}
      </Box>
      <Box sx={styles.tableValue}>
        {isChip ? (
          <Chip 
            label={value} 
            sx={{
              ...styles.chip,
              ...chipProps
            }}
          />
        ) : typeof value === 'number' && value === -1 ? (
          <span sx={styles.unlimitedBadge}>{formatValue(value)}</span>
        ) : (
          value
        )}
      </Box>
    </Box>
  );

  // Mobile subscription card
  const MobileSubscriptionCard = ({ subscription }) => (
    <Card sx={styles.subscriptionCard}>
      <Box sx={styles.cardHeader}>
        <Typography sx={styles.cardTitle}>
          {subscription.package_id?.name}
        </Typography>
        <Typography sx={styles.cardSubtitle}>
          {subscription.package_id?.type === 'paid' ? 'Premium Plan' : 'Basic Plan'}
        </Typography>
      </Box>
      <CardContent sx={styles.cardContent}>
        <TableRow 
          label="Status" 
          value={subscription.status ? 'Active' : 'Inactive'} 
          isChip 
          chipProps={subscription.status ? styles.chipActive : styles.chipInactive}
        />
        <TableRow label="Price" value={`₹${subscription.package_id?.price}`} />
        <TableRow label="Package Type" value={subscription.package_id?.type} isChip chipProps={styles.chipPaid} />
        <TableRow label="Number of Listings" value={formatValue(subscription.package_id?.num_of_listing)} />
        <TableRow label="Photos Allowed" value={formatValue(subscription.package_id?.num_of_photos)} />
        <TableRow label="Videos Allowed" value={formatValue(subscription.package_id?.num_of_video)} />
        <TableRow label="Amenities" value={formatValue(subscription.package_id?.num_of_amenities)} />
        <TableRow label="Featured Listings" value={formatValue(subscription.package_id?.num_of_featured_listing)} />
        <TableRow 
          label="Show at Home" 
          value={formatValue(subscription.package_id?.show_at_home)} 
          isChip 
          chipProps={subscription.package_id?.show_at_home ? styles.chipSuccess : styles.chipInactive}
        />
        <TableRow label="Purchase Date" value={new Date(subscription.purchase_date).toLocaleDateString()} />
        <TableRow label="Expiry Date" value={subscription.expire_date ? new Date(subscription.expire_date).toLocaleDateString() : 'No expiry'} />
        <TableRow label="Days Remaining" value={getDaysRemaining(subscription.expire_date)} />
      </CardContent>
    </Card>
  );

  // Desktop subscription table
  const DesktopSubscriptionTable = ({ subscription }) => (
    <Paper sx={styles.twoColumnTable}>
      <Box sx={styles.tableRow}>
        <Box sx={styles.tableHeader}>
          Package Information
        </Box>
        <Box sx={{...styles.tableValue, backgroundColor: '#f8fafc'}}>
          <Chip 
            label={subscription.status ? 'ACTIVE' : 'INACTIVE'} 
            sx={{
              ...styles.chip,
              ...(subscription.status ? styles.chipActive : styles.chipInactive)
            }}
          />
        </Box>
      </Box>
      <TableRow label="Package Name" value={subscription.package_id?.name} />
      <TableRow label="Package Type" value={subscription.package_id?.type} isChip chipProps={styles.chipPaid} />
      <TableRow label="Price" value={`₹${subscription.package_id?.price}`} />
      <TableRow label="Duration" value={`${subscription.package_id?.number_of_days} days`} />
      <TableRow label="Number of Listings" value={formatValue(subscription.package_id?.num_of_listing)} />
      <TableRow label="Photos Allowed" value={formatValue(subscription.package_id?.num_of_photos)} />
      <TableRow label="Videos Allowed" value={formatValue(subscription.package_id?.num_of_video)} />
      <TableRow label="Amenities Included" value={formatValue(subscription.package_id?.num_of_amenities)} />
      <TableRow label="Featured Listings" value={formatValue(subscription.package_id?.num_of_featured_listing)} />
      <TableRow 
        label="Show at Homepage" 
        value={formatValue(subscription.package_id?.show_at_home)} 
        isChip 
        chipProps={subscription.package_id?.show_at_home ? styles.chipSuccess : styles.chipInactive}
      />
      <TableRow label="Purchase Date" value={new Date(subscription.purchase_date).toLocaleDateString()} />
      <TableRow label="Expiry Date" value={subscription.expire_date ? new Date(subscription.expire_date).toLocaleDateString() : 'No expiry date'} />
      <TableRow label="Days Remaining" value={getDaysRemaining(subscription.expire_date)} />
      <TableRow label="Order ID" value={subscription.order_id?.order_id || 'N/A'} />
      <TableRow label="Payment Status" value={subscription.order_id?.payment_status || 'N/A'} isChip chipProps={styles.chipWarning} />
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress sx={styles.loadingSpinner} size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading subscription data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Stats Grid */}
      <Typography variant="h4" sx={styles.sectionTitle}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={2} sx={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ ...styles.statCard, background: colors[index] }}>
              {stat.icon}
              <Typography sx={styles.statCount}>
                {stat.count}
              </Typography>
              <Typography sx={styles.statTitle}>
                {stat.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Active Subscriptions Section */}
      <Typography variant="h4" sx={styles.sectionTitle}>
        Active Subscriptions
      </Typography>
      
      {error ? (
        <Alert severity="error" sx={styles.errorContainer}>
          Error: {error}
        </Alert>
      ) : activeSubscriptions.length === 0 ? (
        <Box sx={styles.emptyState}>
          <EmojiObjects sx={styles.emptyStateIcon} />
          <Typography variant="h6" gutterBottom>
            No Active Subscriptions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            You don't have any active subscriptions at the moment.
          </Typography>
        </Box>
      ) : (
        <Box>
          {activeSubscriptions.map((subscription) => (
            <Box key={subscription._id} sx={{ mb: 3 }}>
              {isMobile ? (
                <MobileSubscriptionCard subscription={subscription} />
              ) : (
                <DesktopSubscriptionTable subscription={subscription} />
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Additional Subscription Summary */}
      {activeSubscriptions.length > 0 && (
        <Box sx={styles.summarySection}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Subscription Summary
          </Typography>
          <Grid container spacing={2} sx={styles.summaryGrid}>
            <Grid item xs={6} sm={3}>
              <Box sx={styles.summaryItem}>
                <Typography sx={styles.summaryLabel}>
                  Total Active
                </Typography>
                <Typography sx={styles.summaryValue}>
                  {activeSubscriptions.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={styles.summaryItem}>
                <Typography sx={styles.summaryLabel}>
                  Current Package
                </Typography>
                <Typography sx={styles.summaryValue}>
                  {activeSubscriptions[0]?.package_id?.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={styles.summaryItem}>
                <Typography sx={styles.summaryLabel}>
                  Days Remaining
                </Typography>
                <Typography sx={styles.summaryValue}>
                  {getDaysRemaining(activeSubscriptions[0]?.expire_date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={styles.summaryItem}>
                <Typography sx={styles.summaryLabel}>
                  Total Paid
                </Typography>
                <Typography sx={styles.summaryValue}>
                  ₹{activeSubscriptions.reduce((total, sub) => total + (sub.package_id?.price || 0), 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}