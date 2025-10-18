// styles/checkoutStyles.js
export const containerSx = {
  minHeight: "100vh",
 // background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  py: 8,
};

export const bgCircle1Sx = {
  position: "absolute",
  top: "-10%",
  right: "-5%",
  width: "600px",
  height: "600px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255,154,0,0.15) 0%, transparent 70%)",
  zIndex: 0,
};

export const bgCircle2Sx = {
  position: "absolute",
  bottom: "-15%",
  left: "-8%",
  width: "700px",
  height: "700px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)",
  zIndex: 0,
};

export const containerInnerSx = {
  position: "relative",
  zIndex: 1,
};

export const titleSx = {
  fontWeight: "bold",
  background: "linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  textAlign: "center",
  mb: 2,
};

export const subtitleSx = {
  color: "rgba(255,255,255,0.8)",
  textAlign: "center",
  mb: 6,
  maxWidth: "600px",
  mx: "auto",
};

export const gridSx = {
  alignItems: "center",
  justifyContent: "center",
};

export const cardBaseSx = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
};

export const cardContentSx = {
  p: 2,
  "&:last-child": {
    pb: 4,
  },
};

export const titleTextSx = {
  fontWeight: "bold",
  background: "linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

export const priceTextSx = ({ buttonColor }) => ({
  fontWeight: "bold",
  background: buttonColor || "linear-gradient(135deg, #ff9a00, #ff6a00)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  textAlign: "center",
});

export const periodTextSx = {
  color: "rgba(255,255,255,0.7)",
  ml: 1,
  fontSize: "1.2rem",
};

export const featuresBoxSx = {
  my: 3,
};

export const featureRowSx = {
  display: "flex",
  alignItems: "center",
  mb: 1.5,
};

export const badgeSx = (gradient) => ({
  background: gradient,
  color: "white",
  px: 2,
  py: 0.5,
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
});

export const primaryButtonSx = {
  background: "linear-gradient(135deg, #ff9a00, #ff6a00)",
  color: "#fff",
  px: 4,
  py: 1.2,
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "1rem",
  letterSpacing: "0.3px",
  boxShadow: "0 5px 20px rgba(255, 154, 0, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #ff6a00, #ff3d00)",
    boxShadow: "0 10px 25px rgba(255, 106, 0, 0.5)",
    transform: "translateY(-2px)",
  },
};

export const floatingCTATextSx = {
  color: "rgba(255,255,255,0.9)",
  fontWeight: "600",
  textAlign: "center",
  mb: 2,
};

export const floatingCTAButtonSx = {
  background: "linear-gradient(135deg, #ff9a00, #ff6a00)",
  color: "#fff",
  borderRadius: "50px",
  px: 4,
  py: 1.5,
  fontWeight: "bold",
  fontSize: "1.1rem",
  boxShadow: "0 8px 25px rgba(255, 154, 0, 0.4)",
  "&:hover": {
    background: "linear-gradient(135deg, #ff6a00, #ff3d00)",
    boxShadow: "0 12px 30px rgba(255, 106, 0, 0.6)",
    transform: "translateY(-3px)",
  },
};

export const borderHighlightSx = {
  border: "2px solid transparent",
  backgroundImage: "linear-gradient(135deg, #ff9a00, #ff6a00)",
  backgroundOrigin: "border-box",
  backgroundClip: "content-box, border-box",
};

// Checkout page specific styles
export const paymentCardSx = {
  ...cardBaseSx,
  p: 3,
  background: "#000",
  borderRadius: "20px",
  border: "5px solid rgba(238, 215, 7, 0.93)",
  boxShadow: "0 10px 40px rgba(255, 154, 0, 0.15)",
};

export const paymentTitleSx = {
  mb: 4,
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  letterSpacing: "0.5px",
};

export const paymentButtonsContainerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",
  gap: 2.5,
  mb: 4,
};

export const paymentButtonSx = {
  height: 56,
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  fontWeight: 600,
  fontSize: "1rem",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(135deg, #ff9a00, #ff6a00)",
    transform: "translateY(-3px)",
    borderColor: "transparent",
    boxShadow: "0 8px 25px rgba(255, 154, 0, 0.4)",
  },
};

export const noteTextSx = {
  color: "rgba(255,255,255,0.75)",
  textAlign: "center",
  mb: 3,
};

export const detailsCardSx = {
  ...cardBaseSx,
  border: "5px solid rgba(238, 215, 7, 0.93)",
  background: "linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 2, 0.9))",
};

export const detailsHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 2,
};

export const sectionTitleSx = {
  color: "white",
  mb: 2,
  textAlign: "left",
};

export const featureTextSx = {
  color: "rgba(255,255,255,0.9)",
};

export const notIncludedTextSx = {
  color: "rgba(255,255,255,0.8)",
};

// Animation variants
export const cardVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  hover: { scale: 1.02 },
};

export const paymentButtonHover = {
  scale: 1.03,
  boxShadow: "0 0 25px rgba(255, 154, 0, 0.4)",
};

export const paymentButtonTransition = {
  type: "spring",
  stiffness: 250,
  damping: 18,
};