import { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";

const ReviewsSection = ({ listing_id }) => {
  const { data: session, status } = useSession();
  const [reviewData, setReviewData] = useState({
    rating: 0,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRatingChange = (event, newValue) => {
    setReviewData((prev) => ({
      ...prev,
      rating: newValue || 0,
    }));
  };

  const handleMessageChange = (event) => {
    setReviewData((prev) => ({
      ...prev,
      message: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!reviewData.rating) {
      setError("Please select a rating");
      return;
    }

    if (!reviewData.message.trim()) {
      setError("Please enter a review message");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id,
          rating: reviewData.rating,
          message: reviewData.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Review submitted successfully!");
        setReviewData({ rating: 0, message: "" });
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch (err) {
      setError("An error occurred while submitting your review");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

  return (
    <Grid item xs={12}>
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: "600",
          color: "#333",
        }}
      >
        Reviews
      </Typography>

      {!session ? (
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Please login to leave a review.
        </Typography>
      ) : (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          {/* Success/Error Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Rating Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Rate your experience
            </Typography>
            <Rating
              value={reviewData.rating}
              onChange={handleRatingChange}
              size="large"
              sx={{
                "& .MuiRating-icon": {
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                },
              }}
            />
          </Box>

          {/* Review Message */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Your Review
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Share your experience..."
              value={reviewData.message}
              onChange={handleMessageChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            sx={{
              backgroundColor: "#ff531a",
              border: "#ff531a",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff531a",
                border: "#ff531a",
              },
              py: 1.5,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Submit Review"
            )}
          </Button>
        </Box>
      )}
    </Grid>
  );
};

export default ReviewsSection;
