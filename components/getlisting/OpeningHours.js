// components/OpeningHours.js
"use client";
import { Box, Typography } from "@mui/material";
import { styles } from "./styles";
const OpeningHours = ({ openingHours }) => {
  return (
    <Box sx={styles.infoBox}>
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          fontWeight: "600",
          color: "#333",
        }}
      >
        Opening Hours
      </Typography>
      {openingHours &&
        openingHours.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "5px",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {entry.day}
            </Typography>
            <Typography variant="body2">{entry.hours}</Typography>
          </Box>
        ))}
    </Box>
  );
};

export default OpeningHours;
