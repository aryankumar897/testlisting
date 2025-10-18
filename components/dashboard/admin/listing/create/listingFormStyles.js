export const formContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: 2,
};

export const formInnerStyles = {
  backgroundColor: "white",
  padding: 4,
  borderRadius: 2,
  boxShadow: 3,
  width: "100%",
  maxWidth: 800,
};

export const titleStyles = {
  textAlign: "center",
  marginBottom: 3,
  color: "#ff9a00",
  fontWeight: "bold",
};

export const textFieldStyles = {
  marginBottom: 3,
};

export const alertStyles = {
  marginBottom: 3,
};

export const submitButtonStyles = {
  padding: "10px 20px",
  fontSize: "1rem",
  backgroundColor: "#ff9a00",
};

export const switchStyles = {
  marginRight: 1,
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#ff9a00",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#ff9a00",
  },
};

export const uploadAreaStyles = {
  border: "2px dashed #ff9a00",
  borderRadius: 2,
  padding: 3,
  textAlign: "center",
  marginBottom: 3,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#ff9a00",
    backgroundColor: "action.hover",
  },
};

export const imagePreviewStyles = {
  position: "relative",
  marginTop: 2,
  display: "inline-block",
};

export const deleteButtonStyles = {
  position: "absolute",
  top: -10,
  right: -10,
  backgroundColor: "error.main",
  color: "white",
  "&:hover": {
    backgroundColor: "error.dark",
  },
};

// Styles for Attachment Upload (same base as uploadAreaStyles but with tweaks if needed)
export const attachmentAreaStyles = {
  ...uploadAreaStyles, // reuse base styles
  marginTop: 2,
};

export const attachmentLabelStyles = {
  ...textFieldStyles,
  fontStyle: "italic",
};
