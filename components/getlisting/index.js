"use client";
import { Grid, Typography, Box, Chip } from "@mui/material";
import { useState, useEffect } from "react";

// Import components
import UserInfo from "./UserInfo";
import ImageGallery from "./ImageGallery";
import Amenities from "./Amenities";
import VideoGallery from "./VideoGallery";
import VideoModal from "./VideoModal";
import ContactInfo from "./ContactInfo";
import SocialIcons from "./SocialIcons";
import OpeningHours from "./OpeningHours";
import ActionButton from "./ActionButton";
import SimilarListings from "./SimilarListings";
import MapIcon from "@mui/icons-material/Map";
import Reviews from "./Reviews"

// Import styles
import { styles } from "./styles";
import ClaimAction from "./ClaimAction";

export default function ListingDetailPage({ data }) {
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [listingData, setListingData] = useState(null);

  // Fetch videos and images based on listing ID
  useEffect(() => {
    const fetchListingMedia = async () => {
      if (!data?._id) return;

      try {
        setLoading(true);

        // Fetch videos
        const response = await fetch(
          `${process.env.API}/listings-details/${data?._id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const otherdata = await response.json();
        console.log("otherdata*****", otherdata);

        setListingData(otherdata);
      } catch (error) {
        console.log("Error fetching media:", error);
        setListingData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListingMedia();
  }, [data?._id]);

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setOpenVideoModal(true);
  };

  const handleCloseModal = () => {
    setOpenVideoModal(false);
    setSelectedVideo(null);
  };

  // Prepare amenities data from props
  const amenitiesData =
    data?.amenities?.map((amenity, index) => ({
      id: index + 1,
      name: amenity,
    })) || [];

  // Prepare contact information
  const contactInfo = {
    phone: data?.phone || "+1 (899) 745-3137",
    email: data?.email || "rufiwefel@mailinator.com",
    address: data?.address || "Qui cupiditate modi",
    website: data?.website || "https://www.gyxabizacaricum.co",
  };

  // Prepare social links
  const socialLinks = {
    facebook: data?.facebook_link,
    twitter: data?.x_link,
    linkedin: data?.linkedin_link,
    whatsapp: data?.whatsapp_link,
  };

  if (!data) {
    return (
      <Box sx={styles.container}>
        <Typography variant="h6">Loading listing data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Grid container spacing={3} style={{ marginTop: "30px" }}>
        {/* Left Side */}
        <Grid item xs={12} md={8}>
          <Box sx={styles.leftSideContainer}>
            <Grid container spacing={2}>
              {/* User Info with actual data */}
              <UserInfo
                userData={{
                  name: data?.user_id?.name,
                  image: data?.user_id?.image,
                  isVerified: data?.is_verified,
                  views: data?.views,
                  description: data?.description,
                  file: data?.file,
                  title: data?.title,
                }}
                fileUrl={data.file}
              />

              {/* Image Gallery with Title */}
              <Grid item xs={12}>
                {loading ? (
                  <Typography>Loading images...</Typography>
                ) : listingData?.images && listingData.images.length > 0 ? (
                  <ImageGallery images={listingData.images} />
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No images available
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Amenities with Title */}
              <Grid item xs={12}>
                <Amenities amenities={amenitiesData} />
              </Grid>

              {/* Videos with Title */}
              <Grid item xs={12}>
                {loading ? (
                  <Typography>Loading videos...</Typography>
                ) : listingData?.videos && listingData.videos.length > 0 ? (
                  <VideoGallery
                    videos={listingData?.videos}
                    onVideoClick={handleVideoClick}
                  />
                ) : (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body1" color="textSecondary">
                      No videos available
                    </Typography>
                  </Box>
                )}
                <VideoModal
                  open={openVideoModal}
                  handleClose={handleCloseModal}
                  videoUrl={selectedVideo}
                />
              </Grid>

              {/* Location Section with Title */}
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <MapIcon />
                  <Typography variant="body2" style={{ marginLeft: "8px" }}>
                    View on Google Map
                  </Typography>
                </div>
                <Box
                  sx={{ height: 200, border: "1px solid #ccc", marginTop: 2 }}
                >
                  <iframe
                    src={
                      data?.google_map_embed_code ||
                      "https://www.google.com/maps/embed?pb=..."
                    }
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </Box>
              </Grid>

              {/* Reviews Section */}
              <Grid item xs={12}>
          <Reviews  
          listing_id={data?._id}
          
          />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Contact Information with Title */}
            <Grid item xs={12}>
              <ContactInfo contactInfo={contactInfo} />
            </Grid>

            {/* Social Links with Title */}
            <Grid item xs={12}>
              <SocialIcons socialLinks={socialLinks} />
            </Grid>

            {/* Opening Hours with Title */}
            <Grid item xs={12}>
              {listingData?.openingHours &&
              listingData.openingHours.length > 0 ? (
                <OpeningHours openingHours={listingData.openingHours} />
              ) : (
                <Box sx={styles.infoBox}>
                  <Typography variant="body2">
                    Opening hours not specified
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Quick Actions with Title */}
            <Grid item xs={12}>
              <ActionButton
                title="send message"
                buttonText="send message"
                onClick={() => console.log("Send message clicked")}
              />
            </Grid>

            <Grid item xs={12}>
              <ClaimAction
                listing_id={data?._id}
              
             />
            </Grid>

            {/* Similar Listings with Title */}
            <Grid item xs={12}>
              {listingData?.similarListings &&
              listingData.similarListings.length > 0 ? (
                <SimilarListings listings={listingData.similarListings} />
              ) : (
                <Box sx={styles.infoBox}>
                  <Typography variant="body2">
                    No similar listings found
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
