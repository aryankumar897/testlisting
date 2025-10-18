"use client";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const SocialIcons = ({ socialLinks }) => {
  return (
    <Box sx={{ 
      padding: 3,
      backgroundColor: '#f8f9fa',
      borderRadius: 2,
      border: '1px solid #e9ecef'
    }}>
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          fontWeight: "600",
          color: "#333",
        }}
      >
        Connect With Us
      </Typography>

      <Stack direction="row" spacing={2}>
        {socialLinks?.facebook && (
          <IconButton
            onClick={() => window.open(socialLinks.facebook, "_blank")}
            sx={{
              color: '#f09308ff',
              backgroundColor: 'white',
              border: '2px solid #f08903ff',
              '&:hover': {
                backgroundColor: '#000',
                color: 'white'
              }
            }}
          >
            <Facebook />
          </IconButton>
        )}
        
        {socialLinks?.twitter && (
          <IconButton
            onClick={() => window.open(socialLinks.twitter, "_blank")}
            sx={{
              color: '#e78403ff',
              backgroundColor: 'white',
              border: '2px solid #e98f09ff',
              '&:hover': {
                backgroundColor: '#000',
                color: 'white'
              }
            }}
          >
            <Twitter />
          </IconButton>
        )}
        
        {socialLinks?.linkedin && (
          <IconButton
            onClick={() => window.open(socialLinks.linkedin, "_blank")}
            sx={{
              color: '#ec8d10ff',
              backgroundColor: 'white',
              border: '2px solid #eea507ff',
              '&:hover': {
                backgroundColor: '#000',
                color: 'white'
              }
            }}
          >
            <LinkedIn />
          </IconButton>
        )}
        
        {socialLinks?.instagram && (
          <IconButton
            onClick={() => window.open(socialLinks.instagram, "_blank")}
            sx={{
              color: '#e4405f',
              backgroundColor: 'white',
              border: '2px solid #e4405f',
              '&:hover': {
                backgroundColor: '#e4405f',
                color: 'white'
              }
            }}
          >
            <Instagram />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default SocialIcons;