// components/ActionButton.js
"use client";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styles } from "./styles";
import ClaimModal from "./ClaimModal";

const ActionButton = ({ listing_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box sx={styles.infoBox}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "10px" }}
      >
        claim this listing
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          ...styles.button,
          mt: 2,
        }}
      >
        Claim This Business
      </Button>

      <ClaimModal
        open={isModalOpen}
        onClose={handleCloseModal}
        listing_id={listing_id}
      />
    </Box>
  );
};

export default ActionButton;
