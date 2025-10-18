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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteCategory } from "@/slice/categorySlice";
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
} from "./categoryTableStyles";

const CategoryTable = ({ categories, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCategory(categoryToDelete));
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleImagePreview = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setImagePreviewOpen(true);
    }
  };

  const paginatedCategories = categories.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedCategories.map((category) => (
          <Box key={category._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Name</Typography>
              <Typography>{category.name}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Slug</Typography>
              <Typography variant="body2" color="textSecondary">
                {category.slug}
              </Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Images</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {category.image_icon && (
                  <Avatar
                    src={category.image_icon}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={() => handleImagePreview(category.image_icon)}
                  />
                )}
                {category.background_image && (
                  <Avatar
                    src={category.background_image}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={() => handleImagePreview(category.background_image)}
                  />
                )}
                {!category.image_icon && !category.background_image && (
                  <ImageIcon color="disabled" />
                )}
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(category.status)}>
                {category.status ? "Active" : "Inactive"}
                {category.show_at_home && (
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label="Home"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(category._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(category._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(categories.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this category? This action cannot be
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

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={responsiveCellStyles}>Slug</TableCell>
              <TableCell>Icon Image</TableCell>
              <TableCell>Background Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Show at Home</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell sx={responsiveCellStyles}>{category.slug}</TableCell>
                <TableCell>
                  {category.image_icon ? (
                    <Avatar
                      src={category.image_icon}
                      sx={{ width: 40, height: 40, cursor: "pointer" }}
                      onClick={() => handleImagePreview(category.image_icon)}
                    />
                  ) : (
                    <ImageIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  {category.background_image ? (
                    <Avatar
                      src={category.background_image}
                      sx={{ width: 40, height: 40, cursor: "pointer" }}
                      onClick={() => handleImagePreview(category.background_image)}
                    />
                  ) : (
                    <ImageIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={statusStyles(category?.status)}>
                    {category.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.show_at_home ? "Yes" : "No"}
                    size="small"
                    sx={statusStyles(category?.show_at_home)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(category._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(category._id)}
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
            count={Math.ceil(categories.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be
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
    </>
  );
};

export default CategoryTable;