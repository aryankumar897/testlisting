// components/ImageGallery.js - Simple Version
"use client";
import { Grid, Modal, Box, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const ImageGallery = ({ images }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={4} key={index}>
            <Box
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 1,
                '&:hover img': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => handleImageClick(image)}
            >
              <img 
                src={image} 
                alt={`Image ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }} 
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Simple Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <img
            src={selectedImage}
            alt="Enlarged view"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ImageGallery;