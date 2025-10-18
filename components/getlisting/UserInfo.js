"use client";
import {
  Grid,
  Typography,
  Avatar,
  IconButton,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";

const UserInfo = ({ userData, fileUrl }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      const fileName = fileUrl.split("/").pop() || "document.pdf";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // Add your favorite logic here
  };

  return (
    <>
      {/* Header Section with Avatar and Title */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
          {/* Avatar */}
          <Avatar
            alt={userData?.name || "User"}
            src={userData?.image}
            sx={{ 
              width: 100, 
              height: 100,
              border: '3px solid #ff531a',
              boxShadow: '0 4px 12px rgba(255, 83, 26, 0.3)'
            }}
          />
          
          {/* Title and User Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: 1,
                lineHeight: 1.2
              }}
            >
              {userData?.title || "Listing Title"}
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontWeight: '500',
                marginBottom: 2
              }}
            >
              By {userData?.name || "Unknown User"}
            </Typography>

            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {userData?.isVerified && (
                <Chip
                  icon={<VerifiedUserIcon />}
                  label="Verified"
                  size="small"
                  sx={{
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontWeight: '500'
                  }}
                />
              )}
              <Chip
                label="Active"
                size="small"
                sx={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: '500'
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Grid>

      {/* Action Buttons Row */}
      <Grid item xs={12}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          padding: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}>
          {/* Views */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon sx={{ color: "#ff531a", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: '500' }}>
              {userData?.views || 0} views
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Favorite */}
          <IconButton 
            aria-label="Add to Favorites"
            onClick={handleFavoriteClick}
            sx={{ 
              color: isFavorite ? "#ff531a" : "#666",
              '&:hover': {
                backgroundColor: 'rgba(255, 83, 26, 0.1)'
              }
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: '500' }}>
            {isFavorite ? "Added to Favorites" : "Add to Favorites"}
          </Typography>

          <Divider orientation="vertical" flexItem />

          {/* Share (Optional) */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#ff531a',
              color: '#ff531a',
              '&:hover': {
                borderColor: '#e04a16',
                backgroundColor: 'rgba(255, 83, 26, 0.1)'
              }
            }}
          >
            Share
          </Button>
        </Box>
      </Grid>

      {/* Description */}
      {userData?.description && (
        <Grid item xs={12}>
          <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: '600',
                  color: '#333'
                }}
              >
                Description
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <div
                dangerouslySetInnerHTML={{ __html: userData.description }}
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: '#555'
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* File Download Section */}
      {fileUrl && (
        <Grid item xs={12}>
          <Card
            sx={{
              border: "2px dashed #ff531a",
              backgroundColor: "#fffaf0",
              mb: 3
            }}
          >
            <CardContent sx={{ padding: "20px !important" }}>
              <Box sx={{ textAlign: 'center' }}>
                <PictureAsPdfIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: "#ff531a",
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    fontWeight: '600'
                  }}
                >
                  Download Document
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Additional information and details about this listing
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  size="large"
                  sx={{
                    backgroundColor: "#ff531a",
                    padding: "10px 30px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: '8px',
                    "&:hover": {
                      backgroundColor: "#e04a16",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255, 83, 26, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default UserInfo;