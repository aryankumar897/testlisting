

"use client";

import Filter from "./Filter";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
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
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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






const PostCard = ({ post }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // safe getters
  const imageUrl = post?.thumbnail_image || post?.image || "/images/list2.jpg";
  const title = post?.title || "Untitled listing";
  const categoryName = post?.category_id?.name || "Uncategorized";
  const locationName =
    post?.location_id?.name || post?.address || "Unknown location";
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

        {/* Image */}
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={title}
          sx={cardMediaStyle}
        />
      </Box>

      {/* Card Content */}
      <CardContent sx={cardContentStyle}>
        <Box>
          <Rating name="read-only" value={post?.rating || 4} readOnly />
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {locationName}
        </Typography>
      </CardContent>

      {/* Modal for quick details */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box sx={modalContentStyle}>
            <CardMedia
              component="img"
              height="120"
              image={imageUrl}
              alt={title}
              sx={modalImageStyle}
            />

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
              <>
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
              </>
            ) : null}

               <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleLearnMore}
                sx={{ color: "white", background: "#ff531a" }}
              >
                Learn More
              </Button>

              {/* <Button variant="outlined" onClick={handleClose}>
                Close
              </Button> */}
            </Box>
          </Box>
        </Box>
      </Modal>
    </StyledCard>
  );
};






export default function Listings({ data = [] }) {
  // data should be the array you get from server (populated listings)
  const listings = Array.isArray(data) ? data : [];

  return (
    <Box sx={mainContainerStyle}>
      <Box textAlign="center" mt={14} sx={headerContainerStyle}></Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Filter />
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={1}>
            {listings.length === 0 ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 6 }}>
                <Typography variant="h6">
                  No listings found for this category.
                </Typography>
              </Box>
            ) : (
              listings.map((post) => (
                <Box key={post._id || post.id} sx={{ padding: 1 }}>
                  <PostCard post={post} />
                </Box>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
