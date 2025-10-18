"use client";
import { Box, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import { styles } from "./styles";
const ContactInfo = ({ contactInfo }) => {
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
        Contact Information
      </Typography>

      <Typography variant="body2" sx={{ color: "#000" }}>
        {contactInfo?.phone && (
          <>
            <strong>
              <PhoneIcon style={{ color: "#ff531a" }} />
            </strong>{" "}
            {contactInfo.phone}
            <br />
          </>
        )}
        {contactInfo?.email && (
          <>
            <strong>
              <EmailIcon style={{ color: "#ff531a" }} />{" "}
            </strong>{" "}
            {contactInfo.email}
            <br />
          </>
        )}
        {contactInfo?.address && (
          <>
            <strong>
              <LocationOnIcon style={{ color: "#ff531a" }} />{" "}
            </strong>{" "}
            {contactInfo.address}
            <br />
          </>
        )}
        {contactInfo?.website && (
          <>
            <strong>
              <LanguageIcon style={{ color: "#ff531a" }} />{" "}
            </strong>{" "}
            {contactInfo.website}
          </>
        )}
      </Typography>
    </Box>
  );
};

export default ContactInfo;
