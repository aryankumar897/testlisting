"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  Select,
  CircularProgress,
  InputLabel,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Home as ListingIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Import components and styles
import ReviewViewModal from "./ReviewViewModal";
import ReviewMobileView from "./ReviewMobileView";
import {
  tableStyles,
  tableContainerStyles,
  actionButtonStyles,
  statusSelectStyles,
} from "./reviewTableStyles";

const ReviewTable = () => {
  const theme = useTheme();
  const router = useRouter();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [updatingApproval, setUpdatingApproval] = useState({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const rowsPerPage = 5;

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/admin/review`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${process.env.API}/admin/review/${reviewToDelete}`, {
        method: "DELETE",
      });
      setReviews(reviews.filter((review) => review._id !== reviewToDelete));
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Update approval status
  const updateApproval = async (reviewId, newValue) => {
    setUpdatingApproval((prev) => ({ ...prev, [reviewId]: true }));

    // Optimistic update
    setReviews((prev) =>
      prev.map((review) =>
        review._id === reviewId ? { ...review, is_approved: newValue } : review
      )
    );

    try {
      const res = await fetch(`${process.env.API}/admin/review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_approved: newValue }),
      });

      if (!res.ok) {
        // Revert on error
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? { ...review, is_approved: !newValue }
              : review
          )
        );
        console.error("Failed to update approval");
      }
      alert("updated approval")
    } catch (err) {
      // Revert on network error
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, is_approved: !newValue }
            : review
        )
      );
      console.error("Network error updating approval:", err);
    } finally {
      setUpdatingApproval((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleViewClick = (review) => {
    setSelectedReview(review);
    setViewModalOpen(true);
  };

  const handleListingClick = (slug) => {
    router.push(`/get-listing/${slug}`);
  };

  const paginatedReviews = reviews.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Mobile View
  if (isSmallScreen) {
    return (
      <>
        <ReviewMobileView
          reviews={paginatedReviews}
          onViewClick={handleViewClick}
          onDeleteClick={handleDeleteClick}
          onListingClick={handleListingClick}
          updateApproval={updateApproval}
          updatingApproval={updatingApproval}
          formatDate={formatDate}
        />

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(reviews.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />

        {/* View Review Modal */}
        <ReviewViewModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          review={selectedReview}
          onListingClick={handleListingClick}
          formatDate={formatDate}
        />
      </>
    );
  }

  // Desktop View
  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Listing</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReviews.map((review) => (
              <TableRow key={review._id} hover>
                {/* User Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={review.user_id?.image}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {review.user_id?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {review.user_id?.email}
                      </Typography>
                      <Chip
                        label={review.user_id?.role}
                        size="small"
                        sx={{
                          mt: 0.5,
                          color: "white",
                          backgroundColor: "gold",
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>

                {/* Listing Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={review.listing_id?.thumbnail_image}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    >
                      <ListingIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() =>
                          handleListingClick(review.listing_id?.slug)
                        }
                      >
                        {review.listing_id?.title}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Rating Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {review.rating}
                    </Typography>
                    <Box>
                      {Array.from({ length: review.rating }, (_, i) => (
                        <span
                          key={i}
                          style={{ fontSize: "16px", color: "#ffc107" }}
                        >
                          ⭐
                        </span>
                      ))}
                    </Box>
                  </Box>
                </TableCell>

                {/* Review Column */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={review.review}
                  >
                    {review.review}
                  </Typography>
                </TableCell>

                {/* Date Column */}
                <TableCell>
                  {formatDate(review.createdAt?.$date || review.createdAt)}
                </TableCell>

                {/* Status Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FormControl size="small" sx={statusSelectStyles}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={review.is_approved ? "approved" : "pending"}
                        label="Status"
                        onChange={(e) =>
                          updateApproval(
                            review._id,
                            e.target.value === "approved"
                          )
                        }
                        disabled={Boolean(updatingApproval[review._id])}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                      </Select>
                    </FormControl>
                    {updatingApproval[review._id] && (
                      <CircularProgress size={18} />
                    )}
                  </Box>
                </TableCell>

                {/* Actions Column */}
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleViewClick(review)}
                      color="info"
                      title="View Details"
                      sx={actionButtonStyles}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(review._id)}
                      color="error"
                      title="Delete Review"
                      sx={actionButtonStyles}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={Math.ceil(reviews.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* View Review Modal */}
      <ReviewViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        review={selectedReview}
        onListingClick={handleListingClick}
        formatDate={formatDate}
      />
    </>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this review? This action cannot be
        undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ReviewTable;
