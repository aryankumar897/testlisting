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
  CircularProgress,
  Chip,
  Link,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";

import {
  tableContainerStyles,
  tableStyles,

  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./ordersTableStyles";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClaimTable = () => {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(
          `${process.env.API}/admin/claim/all-claim`
        );

        const data = await response.json();

        if (response.ok) {
          setClaims(data || []);
        } else {
          throw new Error("Failed to fetch claims");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewListing = (slug) => {
    if (slug) {
      router.push(`/get-listing/${slug}`);
    }
  };

  const handleDeleteClick = (claimId) => {
    setClaimToDelete(claimId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!claimToDelete) return;

    try {
      const response = await fetch(
        `${process.env.API}/admin/claim/${claimToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setClaims(claims.filter(claim => claim._id !== claimToDelete));
        toast.success("Claim deleted successfully");
      } else {
        throw new Error("Failed to delete claim");
      }
    } catch (error) {
      toast.error("Failed to delete claim");
    } finally {
      setDeleteConfirmOpen(false);
      setClaimToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const paginatedClaims = claims.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress 
          size={80} 
          sx={{ color: "yellow" }} 
        />
      </Box>
    );
  }

  if (error) return <Typography color="white">Error: {error}</Typography>;

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedClaims.map((claim) => (
          <Box key={claim._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Listing</Typography>
              <Link
                component="button"
                onClick={() => handleViewListing(claim.listing_id?.slug)}
                sx={{ 
                  textDecoration: "none", 
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5
                }}
              >
                {claim.listing_id?.slug || "N/A"}
                <OpenIcon fontSize="small" />
              </Link>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Name</Typography>
              <Typography>{claim.name}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Email</Typography>
              <Typography>{claim.email}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Claim</Typography>
              <Typography sx={{ 
                maxWidth: "200px", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                whiteSpace: "nowrap" 
              }}>
                {claim.claim}
              </Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Date</Typography>
              <Typography>{formatDate(claim.createdAt)}</Typography>
            </Box>
            <Box sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleViewListing(claim.listing_id?.slug)}
                sx={actionButtonStyles}
                color="primary"
                disabled={!claim.listing_id?.slug}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(claim._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(claims.length / rowsPerPage)}
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
              Are you sure you want to delete this claim? This action cannot be
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

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="claims table">
          <TableHead>
            <TableRow>
              <TableCell>Listing Slug</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Claim Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClaims.map((claim) => (
              <TableRow key={claim._id}>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => handleViewListing(claim.listing_id?.slug)}
                    sx={{ 
                      textDecoration: "none", 
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5
                    }}
                  >
                    {claim.listing_id?.slug || "N/A"}
                    <OpenIcon fontSize="small" />
                  </Link>
                </TableCell>
                <TableCell>{claim.name}</TableCell>
                <TableCell>{claim.email}</TableCell>
                <TableCell sx={{ maxWidth: "300px" }}>
                  <Typography 
                    sx={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap" 
                    }}
                    title={claim.claim}
                  >
                    {claim.claim}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(claim.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewListing(claim.listing_id?.slug)}
                    sx={actionButtonStyles}
                    color="primary"
                    disabled={!claim.listing_id?.slug}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(claim._id)}
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
            count={Math.ceil(claims.length / rowsPerPage)}
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
            Are you sure you want to delete this claim? This action cannot be
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

export default ClaimTable;