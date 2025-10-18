// app/free-package/success/page.js
"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Celebration,
  Rocket,
  ArrowForward,
  Home,
  Dashboard,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 1,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 10,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

// Styles
const styles = {
  container: {
    minHeight: "100vh",
   // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    py: 4,
    position: "relative",
    overflow: "hidden",
  },
  backgroundShape1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
  },
  backgroundShape2: {
    position: "absolute",
    bottom: "-10%",
    left: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)",
  },
  mainCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    maxWidth: "800px",
    width: "100%",
  },
  successIcon: {
    fontSize: "80px",
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    mb: 2,
  },
  title: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
    mb: 2,
  },
  subtitle: {
    color: "text.secondary",
    mb: 4,
    maxWidth: "500px",
    mx: "auto",
    lineHeight: 1.6,
  },
  featureCard: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    border: "1px solid rgba(102, 126, 234, 0.1)",
    borderRadius: "16px",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
    },
  },
  primaryButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "12px",
    padding: "12px 32px",
    fontSize: "1rem",
    fontWeight: "bold",
    textTransform: "none",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
    },
  },
  secondaryButton: {
    background: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "12px",
    padding: "12px 32px",
    fontSize: "1rem",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      background: "rgba(102, 126, 234, 0.1)",
      transform: "translateY(-2px)",
    },
  },
};

export default function FreePackageSuccess() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const features = [
    {
      icon: <Rocket sx={{ fontSize: 40, color: "#667eea" }} />,
      title: "Instant Access",
      description: "Your free package features are available immediately",
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: "#4CAF50" }} />,
      title: "Full Features",
      description: "Access all included features in your free plan",
    },
    {
      icon: <Celebration sx={{ fontSize: 40, color: "#FF6B6B" }} />,
      title: "No Hidden Costs",
      description: "Enjoy your free package with no additional charges",
    },
  ];

  const handleGoToDashboard = () => {
    router.push("/dashboard/agent");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <Box sx={styles.container}>
      {/* Background Shapes */}
      <motion.div
        style={styles.backgroundShape1}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        style={styles.backgroundShape2}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card sx={styles.mainCard}>
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              {/* Success Icon */}
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <CheckCircle sx={styles.successIcon} />
                  </motion.div>
                </Box>
              </motion.div>

              {/* Title */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  align="center"
                  sx={styles.title}
                  gutterBottom
                >
                  🎉 Free Package Activated!
                </Typography>
              </motion.div>

              {/* Subtitle */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={styles.subtitle}
                >
                  Congratulations! Your free package has been successfully activated. 
                  You now have access to premium features that will help you get started.
                </Typography>
              </motion.div>

              {/* Features Grid */}
              <motion.div variants={itemVariants}>
                <Grid container spacing={3} sx={{ mb: 6 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card sx={styles.featureCard}>
                          <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <motion.div
                              animate={{
                                y: [0, -10, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: index * 0.5,
                              }}
                            >
                              {feature.icon}
                            </motion.div>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                mb: 1,
                                mt: 2,
                                color: "text.primary",
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {feature.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* Next Steps */}
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    What's Next?
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 4 }}
                  >
                    Start exploring your new features and make the most of your free package. 
                    Upgrade anytime to unlock even more powerful tools.
                  </Typography>
                </Box>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={styles.primaryButton}
                    onClick={handleGoToDashboard}
                    endIcon={<Dashboard />}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={styles.secondaryButton}
                    onClick={handleBackToHome}
                    startIcon={<Home />}
                  >
                    Back to Home
                  </Button>
                </Box>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    Need help getting started? Check out our{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "#667eea",
                        fontWeight: "bold",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => router.push("/help")}
                    >
                      help center
                    </Typography>
                  </Typography>
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}