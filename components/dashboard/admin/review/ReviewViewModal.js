import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { Person as PersonIcon, Home as ListingIcon } from "@mui/icons-material";
import {
  cardStyles,
  avatarStyles,
  reviewContentStyles,
} from "./reviewTableStyles";

const ReviewViewModal = ({
  open,
  onClose,
  review,
  onListingClick,
  formatDate,
}) => {
  if (!review) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Review Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* User Information */}
          <Grid item xs={12}>
            <Card {...cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar src={review.user_id?.image} sx={avatarStyles}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {review.user_id?.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {review.user_id?.email}
                    </Typography>
                    <Chip
                      label={review.user_id?.role}
                      color="gold"
                      variant="outlined"
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Member since: {formatDate(review.user_id?.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Listing Information */}
          <Grid item xs={12}>
            <Card {...cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Listing Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar
                    src={review.listing_id?.thumbnail_image}
                    sx={avatarStyles}
                    variant="rounded"
                  >
                    <ListingIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {review.listing_id?.title}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        onListingClick(review.listing_id?.slug);
                        onClose();
                      }}
                      sx={{
                        mt: 1,

                        color: "white",
                        backgroundColor: "gold",
                      }}
                    >
                      View Listing Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Review Content */}
          <Grid item xs={12}>
            <Card {...cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Review Content
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ mr: 2, color: "primary.main" }}
                  >
                    {review.rating}/5
                  </Typography>
                  <Box>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <span
                        key={i}
                        style={{ fontSize: "28px", color: "#ffc107" }}
                      >
                        ⭐
                      </span>
                    ))}
                  </Box>
                </Box>
                <Typography variant="body1" sx={reviewContentStyles}>
                  "{review.review}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Dates */}
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Review submitted on:{" "}
              {formatDate(review.createdAt?.$date || review.createdAt)}
            </Typography>
            {review.updatedAt && (
              <Typography variant="body2" color="textSecondary">
                Last updated:{" "}
                {formatDate(review.updatedAt?.$date || review.updatedAt)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewViewModal;
