// components/SimilarListings.js
"use client";
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import Link from 'next/link';

const SimilarListings = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return null; // Or return a message like "No similar listings found"
  }

  return (
    <Box sx={styles.infoBox}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        Similar Listings
      </Typography>
      {listings.map((listing, index) => (
        <Card 
          key={listing._id || index}
          sx={{
            display: 'flex',
            marginBottom: '16px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          {/* Listing Image */}
          <CardMedia
            component="img"
            sx={{
              width: 80,
              height: 80,
              objectFit: 'cover',
            }}
            image={listing.image}
            alt={listing.title}
          />
          
          {/* Listing Content */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            padding: '8px 12px'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '4px'
              }}
            >
              {listing.title}
            </Typography>
            
            {/* Additional info if available */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              {listing.postedDate && (
                <Typography variant="caption" color="textSecondary">
                  {listing.postedDate}
                </Typography>
              )}
              
              {listing.views !== undefined && (
                <Typography variant="caption" color="textSecondary">
                  {listing.views} views
                </Typography>
              )}
            </Box>
            
            {/* View Details Button */}
            <Button
              component={Link}
              href={`/get-listing/${listing.slug}`}
              size="small"
              sx={{
                marginTop: '8px',
                color: '#ff531a',
                fontSize: '12px',
                padding: '2px 8px',
                minWidth: 'auto'
              }}
            >
              View Details
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

// Add these styles to your styles.js
const styles = {
  infoBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    backgroundColor: '#fff',
    flexDirection: 'column'
  }
};

export default SimilarListings;