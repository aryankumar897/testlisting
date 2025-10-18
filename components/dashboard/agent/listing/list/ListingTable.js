"use client";

import React, { useState } from "react";
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
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Visibility as ViewsIcon,
  CheckCircle as VerifiedIcon,
  PhotoLibrary as GalleryIcon,
  Star as FeaturedIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteListing } from "@/slice/agentlistingSlice";
import { useRouter } from "next/navigation";

import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import {
  tableContainerStyles,
  tableStyles,
  responsiveCellStyles,
  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./listingTableStyles";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
const ListingTable = ({ listings, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [selectedListing, setSelectedListing] = useState(null);

  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDeleteClick = (listingId) => {
    setListingToDelete(listingId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteListing(listingToDelete));
    setDeleteConfirmOpen(false);
    setListingToDelete(null);
  };

  const handleImagePreview = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setImagePreviewOpen(true);
    }
  };

  const paginatedListings = listings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSettingsClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleImageGallery = () => {
    if (selectedListing) {
      router.push(`/dashboard/agent/listing/gallery/${selectedListing._id}`);
      handleSettingsClose();
    }
  };

  const handleVideoManagement = () => {
    if (selectedListing) {
      router.push(`/dashboard/agent/listing/video/${selectedListing._id}`);
      handleSettingsClose();
    }
  };

  const handleScheduleManagement = () => {
    if (selectedListing) {
      router.push(`/dashboard/agent/listing/schedule/${selectedListing._id}`);
      handleSettingsClose();
    }
  };

  const handleSettingsClick = (event, listing) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  // Mobile View
  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedListings.map((listing) => (
          <Box key={listing._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Title</Typography>
              <Typography>{listing.title}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Category</Typography>
              <Typography variant="body2" color="textSecondary">
                {listing.category_id?.name || "-"}
              </Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Thumbnail</Typography>
              {listing.thumbnail_image ? (
                <Avatar
                  src={listing.thumbnail_image}
                  sx={{ width: 40, height: 40, cursor: "pointer" }}
                  onClick={() => handleImagePreview(listing.thumbnail_image)}
                />
              ) : (
                <ImageIcon color="disabled" />
              )}
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(listing.status)}>
                {listing.status ? "Active" : "Inactive"}
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Chip
                icon={<FeaturedIcon />}
                label={listing.is_featured ? "Featured" : "Normal"}
                size="small"
                color={listing.is_featured ? "warning" : "default"}
              />
              <Chip
                icon={<VerifiedIcon />}
                label={listing.is_verified ? "Verified" : "Not Verified"}
                size="small"
                color={listing.is_verified ? "success" : "default"}
                sx={{ ml: 1 }}
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <ViewsIcon fontSize="small" sx={{ mr: 0.5 }} />
              {listing.views}
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(listing._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(listing._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(listings.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Image Preview */}
        <Dialog
          open={imagePreviewOpen}
          onClose={() => setImagePreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100%", height: "auto" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImagePreviewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Desktop View
  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="listings table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Approval</TableCell>
              <TableCell>Views</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedListings.map((listing) => (
              <TableRow key={listing._id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell>{listing.category_id?.name || "-"}</TableCell>
                <TableCell>{listing.location_id?.name || "-"}</TableCell>
                <TableCell>
                  {listing.thumbnail_image ? (
                    <Avatar
                      src={listing.thumbnail_image}
                      sx={{ width: 40, height: 40, cursor: "pointer" }}
                      onClick={() =>
                        handleImagePreview(listing.thumbnail_image)
                      }
                    />
                  ) : (
                    <ImageIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={statusStyles(listing.status)}>
                    {listing.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<FeaturedIcon />}
                    label={listing.is_featured ? "Yes" : "No"}
                    size="small"
                    color={listing.is_featured ? "warning" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<VerifiedIcon />}
                    label={listing.is_verified ? "Yes" : "No"}
                    size="small"
                    color={listing.is_verified ? "success" : "default"}
                  />
                </TableCell>

                <TableCell>
                  <Box sx={statusStyles(listing.is_approved)}>
                    {listing.is_approved === true ? "confirm" : "pending"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ViewsIcon fontSize="small" />
                    {listing.views}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleSettingsClick(e, listing)}
                    sx={actionButtonStyles}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onEdit(listing._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(listing._id)}
                    sx={{ ...actionButtonStyles, color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(listings.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview */}
      <Dialog
        open={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImagePreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleVideoManagement}>
          <ListItemIcon>
            <VideoLibraryIcon fontSize="small" />
          </ListItemIcon>
          Video Management
        </MenuItem>

        <MenuItem onClick={handleImageGallery}>
          <ListItemIcon>
            <GalleryIcon fontSize="small" />
          </ListItemIcon>
          Image Gallery
        </MenuItem>

        <MenuItem onClick={handleScheduleManagement}>
          <ListItemIcon>
            <AccessTimeFilledIcon fontSize="small" />
          </ListItemIcon>
          Schedule Management
        </MenuItem>
      </Menu>
    </>
  );
};

export default ListingTable;
