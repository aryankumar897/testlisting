import { useState, useEffect } from "react";
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
import ReviewDisplay from "./ReviewDisplay";

const ReviewsSection = ({ listing_id }) => {
  const { data: session, status } = useSession();
  const [reviewData, setReviewData] = useState({
    rating: 0,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch only approved reviews for this listing
  useEffect(() => {
    fetchReviews();
  }, [listing_id]); // Add listing_id as dependency

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(
        `${process.env.API}/get-review/${listing_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

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
          review: reviewData.message.trim(), // Changed from 'message' to 'review' to match your model
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Review submitted successfully! It will be visible after approval."
        );
        setReviewData({ rating: 0, message: "" });
        // Refresh reviews after submission
        fetchReviews();
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
    


      {/* Review Form */}
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Write a Review
          </Typography>

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
              color: "white",
              "&:hover": {
                backgroundColor: "#e04a16",
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

          {/* Note about approval */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1, textAlign: "center" }}
          >
            Your review will be visible after admin approval.
          </Typography>
        </Box>
      )}

  <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: "600",
          color: "#333",
        }}
      >
        Customer Reviews
      </Typography>

      {/* Display Approved Reviews */}
      {reviewsLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress />
        </Box>
      ) : reviews.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Approved Reviews ({reviews.length})
          </Typography>
          {reviews.map((review) => (
            <ReviewDisplay key={review._id} review={review} />
          ))}
        </Box>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          No approved reviews yet. Be the first to leave a review!
        </Typography>
      )}



    </Grid>
  );
};

export default ReviewsSection;
