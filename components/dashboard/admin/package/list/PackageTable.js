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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deletePackage } from "@/slice/packageSlice";
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
} from "./packageTableStyles";

const PackageTable = ({ packages, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const rowsPerPage = 5;
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDeleteClick = (id) => {
    setPackageToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePackage(packageToDelete));
    setDeleteConfirmOpen(false);
    setPackageToDelete(null);
  };

  const paginatedPackages = packages.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // ✅ Mobile View
  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedPackages.map((pkg) => (
          <Box key={pkg._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Name</Typography>
              <Typography>{pkg.name}</Typography>
            </Box>

            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Type</Typography>
              <Chip
                label={pkg.type === "free" ? "Free" : "Paid"}
                size="small"
                color={pkg.type === "paid" ? "primary" : "default"}
              />
            </Box>

            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Price</Typography>
              <Typography>₹{pkg.price || 0}</Typography>
            </Box>

            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Days</Typography>
              <Typography>{pkg.number_of_days || "-"}</Typography>
            </Box>

            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(pkg.status)}>
                {pkg.status ? "Active" : "Inactive"}
                {pkg.show_at_home && (
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label="Home"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Limits</Typography>
              <Typography variant="body2" color="text.secondary">
                {pkg.num_of_listing} listings, {pkg.num_of_photos} photos,{" "}
                {pkg.num_of_video} videos
              </Typography>
            </Box>

            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(pkg._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(pkg._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(packages.length / rowsPerPage)}
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
              Are you sure you want to delete this package? This action cannot be
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
      </Box>
    );
  }

  // ✅ Desktop View
  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="packages table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Listings</TableCell>
              <TableCell>Photos</TableCell>
              <TableCell>Videos</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Show at Home</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPackages.map((pkg) => (
              <TableRow key={pkg._id}>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.type}</TableCell>
                <TableCell>₹{pkg.price}</TableCell>
                <TableCell>{pkg.number_of_days}</TableCell>
                <TableCell>{pkg.num_of_listing}</TableCell>
                <TableCell>{pkg.num_of_photos}</TableCell>
                <TableCell>{pkg.num_of_video}</TableCell>
                <TableCell>
                  <Box sx={statusStyles(pkg.status)}>
                    {pkg.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={pkg.show_at_home ? "Yes" : "No"}
                    size="small"
                    sx={statusStyles(pkg.show_at_home)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(pkg._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(pkg._id)}
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
            count={Math.ceil(packages.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this package? This action cannot be
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
    </>
  );
};

export default PackageTable;
