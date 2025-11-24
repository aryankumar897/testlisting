// components/ActionButton.js
"use client";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styles } from "./styles";
import MessageModal from "./MessageModal";

const ActionButton = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box sx={styles.infoBox}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "10px" }}
      >
        Send Message
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          ...styles.button,
          mt: 2,
        }}
      >
        Send Message
      </Button>

      <MessageModal open={isModalOpen} onClose={handleCloseModal} data={data} />
    </Box>
  );
};

export default ActionButton;
