// "use client";
// import Filter from "./Filter";
// import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import {
//   Tooltip,
//   Stack,
//   IconButton,
//   Grid,
//   Box,
//   CardMedia,
//   CardContent,
//   Typography,
//   Badge,
//   Rating,
// } from "@mui/material";
// import FilePresentIcon from "@mui/icons-material/FilePresent";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import Modal from "@mui/material/Modal";

// // Import styles
// import {
//   StyledCard,
//   StyledBadge,
//   StyledsBadge,
//   modalContentStyle,
//   mainContainerStyle,
//   headerContainerStyle,
//   iconStackStyle,
//   iconButtonStyle,
//   categoryBadgeStyle,
//   cardMediaStyle,
//   cardContentStyle,
//   modalStyle,
//   modalImageStyle,
//   verifiedBadgeStyle,
//   infoBoxStyle,
//   learnMoreButtonStyle,
//   mapContainerStyle,
//   fileIconStyle,
//   favoriteIconStyle,
//   iconMarginStyle,
// } from "./listingsStyles";
// const PostCard = ({ post }) => {
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <StyledCard>
//       <Box sx={{ position: "relative" }}>
//         {/* Icon badges container */}
//         <Stack direction="row" spacing={1.2} sx={iconStackStyle}>
//           {/* Save Icon */}
//           <Tooltip title="Save as">
//             <IconButton onClick={handleOpen} size="small" sx={iconButtonStyle}>
//               <Badge color="primary">
//                 <FilePresentIcon sx={fileIconStyle} />
//               </Badge>
//             </IconButton>
//           </Tooltip>

//           {/* Wishlist Icon */}
//           <Tooltip title="Wishlist">
//             <IconButton size="small" sx={iconButtonStyle}>
//               <Badge color="primary">
//                 <FavoriteBorderIcon sx={favoriteIconStyle} />
//               </Badge>
//             </IconButton>
//           </Tooltip>
//         </Stack>

//         {/* Category Badge (top-left corner) */}
//         <Box sx={categoryBadgeStyle}>{post.categories}</Box>

//         {/* Image */}
//         <CardMedia
//           component="img"
//           height="180"
//           image={post.imageUrl}
//           alt={post.title}
//           sx={cardMediaStyle}
//         />
//       </Box>

//       {/* Card Content */}
//       <CardContent sx={cardContentStyle}>
//         <Box>
//           <Rating name="read-only" value={post.rating} readOnly />
//           <Typography gutterBottom variant="h6" component="div">
//             {post.title}
//           </Typography>
//         </Box>

//         <Typography variant="body2" color="text.secondary">
//           {post.location}
//         </Typography>
//       </CardContent>

//       {/* Modal for details */}
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={modalStyle}>
//           <Box sx={modalContentStyle}>
//             <CardMedia
//               component="img"
//               height="120"
//               image="/images/list2.jpg"
//               alt="Dummy Image"
//               sx={modalImageStyle}
//             />

//             <Typography variant="body1" sx={verifiedBadgeStyle} gutterBottom>
//               Verified
//             </Typography>

//             <Typography variant="h5" gutterBottom>
//               {post.title}
//             </Typography>

//             <Box sx={infoBoxStyle}>
//               <EmailIcon fontSize="small" sx={iconMarginStyle} />
//               <Typography variant="body2" color="text.secondary">
//                 {post.email || "test@gmail.com"}
//               </Typography>
//             </Box>

//             <Box sx={infoBoxStyle}>
//               <PhoneIcon fontSize="small" sx={iconMarginStyle} />
//               <Typography variant="body2" color="text.secondary">
//                 {post.phone || "44656565656"}
//               </Typography>
//             </Box>

//             <Typography variant="body1" gutterBottom>
//               {post.description || "No description available."}
//             </Typography>

//             <Button variant="contained" sx={learnMoreButtonStyle}>
//               Learn More
//             </Button>

//             {/* Google Map */}
//             <Box sx={mapContainerStyle}>
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=..."
//                 width="100%"
//                 height="100%"
//                 frameBorder="0"
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 aria-hidden="false"
//                 tabIndex="0"
//               ></iframe>
//             </Box>
//           </Box>
//         </Box>
//       </Modal>
//     </StyledCard>
//   );
// };

// const dummyPosts = [
//   {
//     title: "Beautiful Mountain View",
//     categories: "Travel",
//     rating: 4.5,
//     location: "Swiss Alps",
//     imageUrl: "/images/list2.jpg",
//   },
//   {
//     title: "Sunny Beach",
//     categories: "Vacation",
//     rating: 4.8,
//     location: "Maldives",
//     imageUrl: "/images/list2.jpg",
//   },
//   {
//     title: "City Lights",
//     categories: "Cityscape",
//     rating: 4.2,
//     location: "New York",
//     imageUrl: "/images/list2.jpg",
//   },
//   {
//     title: "Serene Forest",
//     categories: "Nature",
//     rating: 4.6,
//     location: "Amazon",
//     imageUrl: "/images/list2.jpg",
//   },
//   {
//     title: "Desert Adventure",
//     categories: "Adventure",
//     rating: 4.7,
//     location: "Sahara",
//     imageUrl: "/images/list2.jpg",
//   },
// ];

// export default function Listings({data }) {
//   return (
//     <Box sx={mainContainerStyle}>
//       <Box textAlign="center" mt={14} sx={headerContainerStyle}></Box>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={3}>
//           <Filter />
//         </Grid>

//         <Grid item xs={12} md={9}>
//           <Grid container spacing={1}>
//             {dummyPosts.map((post, index) => (
//               <Box key={index} sx={{ padding: 1 }}>
//                 <PostCard post={post} />
//               </Box>
//             ))}
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// components/listings/ProductCard.jsx  (or wherever this component lives)
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
