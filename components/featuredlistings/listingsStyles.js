import { styled } from "@mui/system";
import { Box, Card, Badge, Typography, Button } from "@mui/material";

// Card styles
export const StyledCard = styled(Card)({
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.05)",
    transition: "transform 0.3s ease-in-out",
  },
  maxWidth: 250,
});

// Badge styles
export const StyledBadge = styled(Badge)({
  position: "absolute",
  top: 170,
  left: 20,
  zIndex: 221,
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
});

export const StyledsBadge = styled(Badge)({
  position: "absolute",
  top: 20,
  left: 20,
  zIndex: 221,
  color: "#ffffff",
  padding: "4px 8px",
  "& .MuiBadge-badge": {
    backgroundColor: "",
    color: "white",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      fontSize: "16px",
    },
  },
});

// Modal styles
export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

export const modalContentStyle = {
  outline: "2px solid #ff531a",
  borderRadius: "8px",
  bgcolor: "background.paper",
  p: 2,
};

// Container styles
export const mainContainerStyle = {
  margin: "0 auto",
  width: "80%",
  maxWidth: "1070px",
};

export const headerContainerStyle = {
  margin: "0 auto",
  maxWidth: "600px",
  marginBottom: "60px",
};

// PostCard specific styles
export const iconStackStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 10,
  alignItems: "center",
};

export const iconButtonStyle = {
  bgcolor: "rgba(255,255,255,0.85)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
  border: "1px solid #ddd",
};

export const categoryBadgeStyle = {
  position: "absolute",
  top: 8,
  left: 8,
  bgcolor: "#ff531a",
  color: "white",
  px: 1.5,
  py: 0.5,
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
};

export const cardMediaStyle = {
  width: "100%",
  objectFit: "cover",
};

export const cardContentStyle = {
  backgroundColor: "white",
  color: "black",
};

export const modalImageStyle = {
  marginBottom: 2,
  borderRadius: "8px",
};

export const verifiedBadgeStyle = {
  backgroundColor: "#ff531a",
  width: "90px",
  borderRadius: "28px",
  padding: "4px",
  textAlign: "center",
  color: "white",
  marginBottom: 1,
};

export const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  mb: 1,
};

export const learnMoreButtonStyle = {
  mt: 2,
  backgroundColor: "#ff531a",
  "&:hover": { backgroundColor: "#ff6622" },
};

export const mapContainerStyle = {
  height: 200,
  border: "1px solid #ccc",
  mt: 2,
};

export const fileIconStyle = {
  fontSize: 20,
  color: "#ff531a",
};

export const favoriteIconStyle = {
  fontSize: 20,
  color: "#ff531a",
};

export const iconMarginStyle = {
  mr: 1,
};