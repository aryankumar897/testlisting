// components/Amenities.js
"use client";
import { Grid, Typography, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { styles } from './styles';
const Amenities = ({ amenities }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        {amenities.map((amenity) => (
          <Grid item xs={6} sm={4} key={amenity.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label={amenity.name} style={{ color: '#ff531a' }}>
                <MapIcon />
              </IconButton>
              <Typography 
                variant="body2" 
                style={{ 
                  backgroundColor: '#ff531a', 
                  color: '#fff', 
                  padding: '5px', 
                  borderRadius: '4px', 
                  marginLeft: '10px' 
                }}
              >
                {amenity.name}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Amenities;