'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Home,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
};

export default function RazorpaySuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderDetails = {
    orderId: searchParams.get('order_id') || 'ORD_123456',
    amount: searchParams.get('amount') || '₹707',
    package: 'Premium Plan',
    duration: '90 Days',
    transactionId: searchParams.get('payment_id') || 'PAY_789012'
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <motion.div
            animate={pulseAnimation}
            style={{ display: 'inline-block' }}
          >
            <CheckCircle
              sx={{
                fontSize: 120,
                color: 'success.main',
                filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="white" sx={{ mb: 3 }}>
            Thank you for your purchase. Your subscription has been activated.
          </Typography>
          <Chip
            label="Active"
            color="success"
            variant="filled"
            sx={{ fontSize: '1rem', padding: '8px 16px' }}
          />
        </motion.div>

        {/* Order Details Card */}
        <motion.div variants={fadeInUp}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              mb: 4
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Order Details
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DetailItem
                  icon={<Person />}
                  label="Order ID"
                  value={orderDetails.orderId}
                />
                <DetailItem
                  icon={<CheckCircle />}
                  label="Package"
                  value={orderDetails.package}
                />
                <DetailItem
                  icon={<CalendarToday />}
                  label="Duration"
                  value={orderDetails.duration}
                />
                <DetailItem
                  icon={<Download />}
                  label="Amount Paid"
                  value={orderDetails.amount}
                  isAmount
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Button
            variant="outlined"
            size="large"
            startIcon={<Download />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Download Invoice
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => router.push('/dashboard/agent')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
              '&:hover': {
                background: 'linear-gradient(45deg, #43A047, #57a857)'
              }
            }}
          >
            Go to Dashboard
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={fadeInUp}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <Typography variant="body2" color="white">
            A confirmation email has been sent to your registered email address.
          </Typography>
        </motion.div>
      </motion.div>
    </Container>
  );
}

const DetailItem = ({ icon, label, value, isAmount = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ color: 'primary.main' }}>{icon}</Box>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body1"
      sx={{
        fontWeight: 'bold',
        fontSize: isAmount ? '1.25rem' : '1rem',
        color: isAmount ? 'success.main' : 'text.primary'
      }}
    >
      {value}
    </Typography>
  </Box>
);