import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Avatar,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

const ReviewDisplay = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={review.user_id?.image}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.user_id?.name || 'Anonymous'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(review.createdAt?.$date || review.createdAt)}
            </Typography>
          </Box>
          <Rating value={review.rating} readOnly />
        </Box>
        
        <Typography variant="body1">
          {review.review}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewDisplay;