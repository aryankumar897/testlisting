import React from "react";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Home as ListingIcon,
} from "@mui/icons-material";
import {
  reviewCardStyles,
  userInfoStyles,
  listingInfoStyles,
  mobileCellStyles,
  mobileLabelStyles,
  ratingStyles,
} from "./reviewTableStyles";

const ReviewMobileView = ({ 
  reviews, 
  onViewClick, 
  onDeleteClick, 
  onListingClick,
  updateApproval, 
  updatingApproval,
  formatDate 
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {reviews.map((review) => (
        <Paper key={review._id} sx={reviewCardStyles}>
          {/* User Info */}
          <Box sx={userInfoStyles}>
            <Avatar 
              src={review.user_id?.image} 
              sx={{ width: 50, height: 50 }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.user_id?.name || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {review.user_id?.email}
              </Typography>
              <Chip 
                label={review.user_id?.role} 
                size="small" 
                color="primary" 
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          {/* Listing Info */}
          <Box sx={listingInfoStyles}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Listing:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar 
                src={review.listing_id?.thumbnail_image} 
                sx={{ width: 40, height: 40 }}
                variant="rounded"
              >
                <ListingIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {review.listing_id?.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => onListingClick(review.listing_id?.slug)}
                >
                  View Listing
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Review Content */}
          <Box sx={mobileCellStyles}>
            <Typography sx={mobileLabelStyles}>
              Rating & Review
            </Typography>
            <Box sx={ratingStyles}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {review.rating}/5
              </Typography>
              {Array.from({ length: review.rating }, (_, i) => (
                <span key={i} style={{ fontSize: "18px", color: "#ffc107" }}>⭐</span>
              ))}
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "{review.review}"
            </Typography>
          </Box>

          <Box sx={mobileCellStyles}>
            <Typography sx={mobileLabelStyles}>
              Created Date
            </Typography>
            <Typography variant="body2">
              {formatDate(review.createdAt?.$date || review.createdAt)}
            </Typography>
          </Box>

          <Box sx={mobileCellStyles}>
            <Typography sx={mobileLabelStyles}>
              Status
            </Typography>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={review.is_approved ? "approved" : "pending"}
                label="Status"
                onChange={(e) =>
                  updateApproval(review._id, e.target.value === "approved")
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
              </Select>
            </FormControl>
            {updatingApproval[review._id] && (
              <CircularProgress size={18} sx={{ mt: 1 }} />
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onViewClick(review)}
              color="info"
            >
              <ViewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDeleteClick(review._id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ReviewMobileView;