// components/ActionButton.js
"use client";
import { Box, Typography, Button } from '@mui/material';
import { styles } from './styles';
const ActionButton = ({ title, buttonText, onClick }) => {
  return (
    <Box sx={styles.infoBox}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
        {title}
      </Typography>
      <Button variant="outlined" 
      sx={styles.button} 
      
      onClick={onClick}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default ActionButton;