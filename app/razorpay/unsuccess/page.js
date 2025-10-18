"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { ErrorOutline, Home, Refresh, Support } from "@mui/icons-material";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export default function RazorpayFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorMessage =
    searchParams.get("error") || "Payment processing was unsuccessful.";

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial="initial"
        animate="animate"
        style={{ textAlign: "center" }}
      >
        {/* Error Icon */}
        <motion.div variants={shakeAnimation} style={{ marginBottom: "2rem" }}>
          <ErrorOutline
            sx={{
              fontSize: 120,
              color: "error.main",
              filter: "drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))",
            }}
          />
        </motion.div>

        {/* Error Message */}
        <motion.div variants={fadeInUp} style={{ marginBottom: "3rem" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #F44336, #EF5350)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Payment Failed
          </Typography>
          <Typography variant="h6" color="white" sx={{ mb: 3 }}>
            We couldn't process your payment. Please try again.
          </Typography>
        </motion.div>

        {/* Error Details Card */}
        <motion.div variants={fadeInUp} style={{ marginBottom: "3rem" }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #ffebee 0%, #ffffff 100%)",
              border: "1px solid #ffcdd2",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(244, 67, 54, 0.1)",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  Transaction Declined
                </Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Common Reasons */}
        <motion.div
          variants={fadeInUp}
          style={{
            marginBottom: "3rem",
            textAlign: "left",
            maxWidth: 500,
            margin: "0 auto 3rem",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Common reasons for failure:
          </Typography>
          <Box component="ul" sx={{ color: "white", pl: 2 }}>
            <li>Insufficient funds in your account</li>
            <li>Incorrect card details or CVV</li>
            <li>Network issues during transaction</li>
            <li>Bank server timeout</li>
            <li>Daily transaction limit exceeded</li>
          </Box>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            size="large"
            startIcon={<Refresh />}
            onClick={() => router.back()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,

              borderWidth: 2,
 color:"white",
              background: "linear-gradient(45deg, #f3bd0aff, #f7bf06ff)",
              "&:hover": {
                background: "linear-gradient(45deg, #fdd009ff, #f7bf06ff)",
              },
            }}
          >
            Try Again
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Support />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(45deg, #F44336, #EF5350)",
              "&:hover": {
                background: "linear-gradient(45deg, #E53935, #e57373)",
              },
            }}
          >
            Contact Support
          </Button>
          <Button
            variant="text"
            size="large"
            startIcon={<Home />}
            onClick={() => router.push("/")}
            sx={{
              px: 4,
              py: 1.5,
              color:"white",
              borderRadius: 2,
              background: "linear-gradient(45deg, #f3bd0aff, #f7bf06ff)",
              "&:hover": {
                background: "linear-gradient(45deg, #fdd009ff, #f7bf06ff)",
              },
            }}
          >
            Go Home
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
