"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import {
  Tooltip,
  Stack,
  IconButton,
  Grid,
  Box,
  CardMedia,
  CardContent,
  Typography,
  Badge,
  Rating,
  Modal,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Import styles (keep your style exports)
import {
  StyledCard,
  modalContentStyle,
  mainContainerStyle,
  headerContainerStyle,
  iconStackStyle,
  iconButtonStyle,
  categoryBadgeStyle,
  cardMediaStyle,
  cardContentStyle,
  modalStyle,
  modalImageStyle,
  verifiedBadgeStyle,
  infoBoxStyle,
  learnMoreButtonStyle,
  mapContainerStyle,
  fileIconStyle,
  favoriteIconStyle,
  iconMarginStyle,
} from "./listingsStyles";

/**
 * PostCard - renders a single listing card and quick modal
 */
const PostCard = ({ post }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // safe getters
  const imageUrl = post?.thumbnail_image || post?.image || "/images/list2.jpg";
  const title = post?.title || "Untitled listing";
  const categoryName = post?.category_id?.name;
  const locationName = post?.location_id?.name;
  const email = post?.email || "-";
  const phone = post?.phone || "-";
  const descriptionHtml = post?.description || "";
  const address = post?.address || "";
  const googleEmbed = post?.google_map_embed_code || null;
  const slug = post?.slug;

  // excerpt (strip HTML)
  const excerpt = (descriptionHtml || "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .slice(0, 280);

  const handleLearnMore = () => {
    if (slug) {
      router.push(`/get-listing/${slug}`);
    } else {
      // Fallback: open modal if no slug
      setOpen(true);
    }
  };

  return (
    <>
      <StyledCard>
        <Box sx={{ position: "relative" }}>
          {/* Icon badges container */}
          <Stack direction="row" spacing={1.2} sx={iconStackStyle}>
            <Tooltip title="Save as">
              <IconButton onClick={handleOpen} size="small" sx={iconButtonStyle}>
                <Badge color="primary">
                  <FilePresentIcon sx={fileIconStyle} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Wishlist">
              <IconButton size="small" sx={iconButtonStyle}>
                <Badge color="primary">
                  <FavoriteBorderIcon sx={favoriteIconStyle} />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Category Badge (top-left corner) */}
          <Box sx={categoryBadgeStyle}>{categoryName}</Box>

          {/* Featured Chip (top-right) */}
          {post?.is_featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
                backgroundColor: "rgba(255,106,0,0.95)",
                color: "white",
                fontWeight: 700,
              }}
            />
          )}

          {/* Image */}
          <CardMedia component="img" height="180" image={imageUrl} alt={title} sx={cardMediaStyle} />
        </Box>

        {/* Card Content */}
        <CardContent sx={cardContentStyle}>
          <Box>
            <Rating name="read-only" value={post?.rating || 4} readOnly />
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: "600", // Semi-bold
              fontSize: "0.9rem",
            }}
          >
            {locationName || "Location not specified"}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button variant="contained" onClick={handleLearnMore} sx={{ ...learnMoreButtonStyle }}>
              Learn More
            </Button>
          </Box>
        </CardContent>

        {/* Modal for quick details */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Box sx={modalContentStyle}>
              <CardMedia component="img" height="120" image={imageUrl} alt={title} sx={modalImageStyle} />

              <Typography variant="body1" sx={verifiedBadgeStyle} gutterBottom>
                {post?.is_verified ? "Verified" : "Not verified"}
              </Typography>

              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>

              {address ? (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {address}
                </Typography>
              ) : null}

              <Box sx={infoBoxStyle}>
                <EmailIcon fontSize="small" sx={iconMarginStyle} />
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </Box>

              <Box sx={infoBoxStyle}>
                <PhoneIcon fontSize="small" sx={iconMarginStyle} />
                <Typography variant="body2" color="text.secondary">
                  {phone}
                </Typography>
              </Box>

              <Typography variant="body1" gutterBottom>
                {excerpt || "No description available."}
              </Typography>

              {/* Google map embed (if provided). Render raw HTML — only use if trusted */}
              {googleEmbed ? (
                <div style={{ margin: "16px", padding: "8px" }}>
                  <iframe
                    src={googleEmbed}
                    width="500"
                    height="450"
                    style={{
                      border: 0,
                      display: "block",
                      width: "100%",
                      height: "450px",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="map"
                  />
                </div>
              ) : null}

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button variant="contained" onClick={handleLearnMore} sx={{ color: "white", background: "#ff531a" }}>
                  Learn More
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </StyledCard>
    </>
  );
};

/**
 * Listings - simplified Featured Listings view (no location selector)
 * Fetches from: GET ${process.env.API}/featured-listings
 */
export default function Listings() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/featured-listings`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch featured listings");
        }

        // Expecting `data` to be an array of listing objects
        setFeaturedListings(Array.isArray(data) ? data : data.listings || []);
      } catch (err) {
        console.error("Error fetching featured listings:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={mainContainerStyle}>
      {/* Header */}
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(45deg, #ff9a00, #ff6a00, #ff3d00)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "2.5rem", md: "3.5rem" },
        }}
      >
        Featured Listings
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Explore top-rated properties handpicked just for you.
      </Typography>

      {/* Listings Grid */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {featuredListings && featuredListings.length > 0 ? (
          featuredListings.map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
              <PostCard post={post} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ width: "100%", textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="rgba(255,255,255,0.7)">
                No featured listings available
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
