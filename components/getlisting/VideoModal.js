// components/VideoModal.js
"use client";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player';
import { styles } from './styles';
const VideoModal = ({ open, handleClose, videoUrl }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        maxWidth: '100%', 
        maxHeight: '100%', 
        backgroundColor: '#ff531a', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <IconButton 
          aria-label="Close" 
          style={{ position: 'absolute', top: '2px', right: '5px', color: '#fff' }} 
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <ReactPlayer url={videoUrl} controls width="800px" height="600px" />
      </div>
    </Modal>
  );
};

export default VideoModal;