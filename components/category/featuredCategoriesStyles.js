export const featuredCategoriesStyles = {
  // Main container styles
  mainContainer: {
    margin: "0 auto",
    width: "80%",
    maxWidth: "1070px",
  },

  // Header section styles
  headerBox: {
    textAlign: "center",
    mt: 4,
    margin: "0 auto",
    maxWidth: "600px",
  },

  titleText: {
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ff9a00, #ff6a00, #ff3d00)",
    backgroundClip: "text",
    textFillColor: "transparent",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    mb: 2,
    fontSize: { xs: "2.5rem", md: "3.5rem" },
  },

  subtitleText: {
    color: "rgba(255, 255, 255, 0.7)",
    mb: 6,
    maxWidth: 600,
    mx: "auto",
    fontSize: { xs: "1rem", md: "1.25rem" },
  },

  // Content container
  contentContainer: {
    marginTop: "20px",
  },

  // Card styles
  card: {
    margin: "2px",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    transition: "all 0.4s ease-in-out",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 15px 30px rgba(255, 106, 0, 0.3)",
    },
  },

  // Card media (image) styles
  cardMedia: {
    height: "220px",
    transition: "all 0.5s ease-in-out",
    transform: "scale(1)",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },

  // Overlay for better text readability
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
    zIndex: 1,
  },

  // Card content styles
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    padding: "20px",
    color: "white",
  },

  // Content wrapper inside card
  contentWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },

  // Text section styles
  textSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },

  categoryName: {
    color: "white",
    textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
    fontWeight: "bold",
    fontSize: "1.25rem",
    lineHeight: 1.2,
    mb: 1,
  },

  // Listing count section styles
  listingSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
  },

  listingCount: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff6a00",
    textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
    lineHeight: 1,
  },

  listingText: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.9)",
    textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
    mt: 0.5,
  },

  // Badge styles
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#ff6a00',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      minWidth: '20px',
      height: '20px',
    }
  },

  // Empty state styles
  emptyState: {
    color: 'rgba(255,255,255,0.7)',
    mt: 4,
    textAlign: 'center'
  },

  // Loading and error states
  stateContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px"
  }
};