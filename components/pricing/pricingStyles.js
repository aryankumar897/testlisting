// components/pricing/pricingStyles.js

const containerSx = {
  minHeight: "100vh",
  py: 8,
  position: "relative",
  overflow: "hidden",
};

const bgCircle1Sx = {
  position: "absolute",
  top: "10%",
  left: "5%",
  width: 300,
  height: 300,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255, 154, 0, 0.2) 0%, transparent 70%)",
};

const bgCircle2Sx = {
  position: "absolute",
  bottom: "15%",
  right: "5%",
  width: 400,
  height: 400,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255, 106, 0, 0.15) 0%, transparent 70%)",
};

const containerInnerSx = {
  position: "relative",
  zIndex: 1,
};

const titleSx = {
  fontWeight: "bold",
  background: "linear-gradient(45deg, #ff9a00, #ff6a00, #ff3d00)",
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  mb: 2,
  fontSize: { xs: "2.5rem", md: "3.5rem" },
};

const subtitleSx = {
  color: "rgba(255, 255, 255, 0.7)",
  mb: 6,
  maxWidth: 600,
  mx: "auto",
  fontSize: { xs: "1rem", md: "1.25rem" },
};

const gridSx = {
  mt: 2,
};

const cardBaseSx = {
  position: "relative",
  overflow: "visible",
  borderRadius: "20px",
  background: "linear-gradient(145deg, rgba(45, 45, 68, 0.9), rgba(26, 26, 46, 0.9))",
  height: "100%",
  backdropFilter: "blur(10px)",
  transformStyle: "preserve-3d",
  perspective: 1000,
};

const cardContentSx = {
  textAlign: "center",
  padding: "3rem 2rem",
  position: "relative",
  zIndex: 1,
};

const titleTextSx = {
  fontWeight: "bold",
  mb: 2,
  color: "white",
};

const priceTextSx = (plan) => ({
  background: plan.buttonColor,
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
  fontSize: "3rem",
});

const periodTextSx = {
  color: "rgba(255,255,255,0.7)",
  ml: 1,
};

const featuresBoxSx = {
  my: 4,
};

const featureRowSx = {
  display: "flex",
  alignItems: "center",
  mb: 1.5,
  padding: "0.5rem",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.05)",
  "&:hover": {
    background: "rgba(255, 154, 0, 0.1)",
  },
};

const limitationRowSx = {
  display: "flex",
  alignItems: "center",
  mb: 1.5,
  padding: "0.5rem",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.05)",
  opacity: 0.7,
  "&:hover": {
    background: "rgba(255, 154, 0, 0.1)",
  },
};

const badgeSx = (gradient) => ({
  background: gradient,
  color: "white",
  padding: "0.5rem 1.5rem",
  borderRadius: "20px",
  fontSize: "0.8rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
});

const primaryButtonSx = (plan) => ({
  background: plan.buttonColor,
  borderRadius: "12px",
  padding: "1rem 2rem",
  fontWeight: "bold",
  marginTop: "2rem",
  fontSize: "1.1rem",
  boxShadow: "0 8px 20px rgba(255, 106, 0, 0.4)",
  "&:hover": {
    background: plan.buttonColor,
    boxShadow: "0 12px 25px rgba(255, 106, 0, 0.6)",
  },
});

const floatingCTATextSx = {
  color: "rgba(255, 255, 255, 0.7)",
  mb: 2,
};

const floatingCTAButtonSx = {
  color: "#ff9a00",
  borderColor: "#ff9a00",
  borderRadius: "12px",
  padding: "0.8rem 2rem",
  fontWeight: "bold",
  "&:hover": {
    borderColor: "#ff6a00",
    background: "rgba(255, 154, 0, 0.1)",
  },
};

const borderHighlightSx = (selected) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "20px",
  padding: "2px",
  background: selected
    ? "linear-gradient(135deg, #ff9a00, #ff6a00, #ff3d00)"
    : "linear-gradient(135deg, rgba(255,154,0,0.3), rgba(255,106,0,0.3))",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  zIndex: 0,
  opacity: selected ? 1 : 0.5,
});

export {
  containerSx,
  bgCircle1Sx,
  bgCircle2Sx,
  containerInnerSx,
  titleSx,
  subtitleSx,
  gridSx,
  cardBaseSx,
  cardContentSx,
  titleTextSx,
  priceTextSx,
  periodTextSx,
  featuresBoxSx,
  featureRowSx,
  limitationRowSx,
  badgeSx,
  primaryButtonSx,
  floatingCTATextSx,
  floatingCTAButtonSx,
  borderHighlightSx,
};