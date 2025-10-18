// components/VideoGallery.js
"use client";
import { Grid, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styles } from './styles';
const VideoGallery = ({ videos, onVideoClick }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {videos.map((video,index) => (
            <Grid item xs={12} sm={4} key={index} style={{ position: 'relative' }}>
              <IconButton
                aria-label={video?.title}
                onClick={() => onVideoClick(video.url)}
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)' 
                }}
              >
                <PlayArrowIcon style={{ color: '#fff', fontSize: 64 }} />
              </IconButton>
              <img src="/images/list2.jpg" alt={video?.title} style={{ width: '100%', display: 'block' }} />
              <Typography variant="body2" align="center">{video?.title}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoGallery;