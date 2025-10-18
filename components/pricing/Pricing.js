"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { HighlightOff, CheckCircle, Star } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePackages } from "@/slice/packageSlice";
import { useRouter } from "next/navigation";

// Import all styles
import {
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
} from "./pricingStyles";

// Animation variants
import {
  cardVariants,
  buttonVariants,
} from "./pricingAnimations";

const Pricing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { homePackages, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchHomePackages());
    setIsVisible(true);
  }, [dispatch]);

  const formatValue = (value, label) => {
    if (value === -1) return `Unlimited ${label}`;
    if (value === 0 || value === null || value === undefined) return null;
    return `${value} ${label}`;
  };

  const handleChoosePlan = (pkgId) => {
    if (!pkgId) return;
    router.push(`/checkout/${pkgId}`);
  };

  if (loading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress size={80} sx={loadingSpinnerSx} />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      {/* Animated background circles */}
      <motion.div
        style={bgCircle1Sx}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={bgCircle2Sx}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <Container maxWidth="lg" sx={containerInnerSx}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h2" align="center" gutterBottom sx={titleSx}>
            Choose Your Plan
          </Typography>
          <Typography variant="h6" align="center" sx={subtitleSx}>
            Select the perfect plan for your business needs. All packages include
            essential features — no hidden fees.
          </Typography>
        </motion.div>

        {/* Package Cards */}
        <Grid container spacing={4} justifyContent="center" sx={gridSx}>
          {homePackages && homePackages.length > 0 ? (
            homePackages.map((pkg, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={pkg._id || index}
                sx={gridItemSx}
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  whileHover="hover"
                  style={motionCardSx}
                  onClick={() => setSelectedPlan(index)}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card
                    sx={getCardSx(selectedPlan === index)}
                  >
                    {/* Popular or Highlight Badges */}
                    {pkg.type === "paid" && index === 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.2,
                          type: "spring",
                          stiffness: 300,
                        }}
                        style={badgeContainerSx}
                      >
                        <Box
                          sx={badgeSx(
                            "linear-gradient(135deg, #ff9a00, #ff6a00)"
                          )}
                        >
                          <Star sx={starIconSx} />
                          MOST POPULAR
                        </Box>
                      </motion.div>
                    )}

                    <CardContent sx={cardContentSx}>
                      <Typography variant="h4" component="div" sx={titleTextSx}>
                        {pkg.name}
                      </Typography>

                      {/* Price */}
                      <Box sx={priceContainerSx}>
                        <Typography
                          sx={priceTextSx({
                            buttonColor: "linear-gradient(135deg, #ff9a00, #ff6a00)",
                          })}
                          variant="h2"
                          component="div"
                        >
                          {pkg.price === 0 ? "Free" : `₹${pkg.price}`}
                        </Typography>
                        <Typography sx={periodTextSx}>
                          {pkg.number_of_days > 0
                            ? `/ ${pkg.number_of_days} days`
                            : ""}
                        </Typography>
                      </Box>

                      {/* Features */}
                      <Box sx={featuresBoxSx}>
                        <Typography variant="h6" sx={featuresTitleSx}>
                          Features:
                        </Typography>

                        {[
                          formatValue(pkg.num_of_listing, "Listings"),
                          formatValue(pkg.num_of_photos, "Photos"),
                          formatValue(pkg.num_of_video, "Videos"),
                          formatValue(pkg.num_of_amenities, "Amenities"),
                          formatValue(
                            pkg.num_of_featured_listing,
                            "Featured Listings"
                          ),
                        ]
                          .filter(Boolean)
                          .map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.1 + featureIndex * 0.1 + 0.5,
                              }}
                            >
                              <Box sx={featureRowSx}>
                                <CheckCircle sx={checkIconSx} />
                                <Typography variant="body1" sx={featureTextSx}>
                                  {feature}
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                      </Box>

                      {/* Not Included section */}
                      <Box sx={notIncludedContainerSx}>
                        <Typography variant="h6" sx={notIncludedTitleSx}>
                          Not Included:
                        </Typography>

                        {[
                          "Custom Branding",
                          "24/7 Priority Support",
                          "Dedicated Account Manager",
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <Box sx={limitationRowSx}>
                              <HighlightOff sx={crossIconSx} />
                              <Typography variant="body1" sx={limitationTextSx}>
                                {item}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>

                      {/* CTA Button */}
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="contained"
                          sx={primaryButtonSx({
                            buttonColor: "linear-gradient(135deg, #ff9a00, #ff6a00)",
                          })}
                          fullWidth
                          onClick={() => handleChoosePlan(pkg._id)}
                        >
                          {pkg.price === 0 ? "Get Free Plan" : "Choose Plan"}
                        </Button>
                      </motion.div>
                    </CardContent>

                    {/* Animated border highlight */}
                    <Box
                      component={motion.div}
                      sx={borderHighlightSx(selectedPlan === index)}
                      animate={{
                        background:
                          selectedPlan === index
                            ? [
                                "linear-gradient(135deg, #ff9a00, #ff6a00, #ff3d00)",
                                "linear-gradient(135deg, #ff3d00, #ff9a00, #ff6a00)",
                                "linear-gradient(135deg, #ff6a00, #ff3d00, #ff9a00)",
                                "linear-gradient(135deg, #ff9a00, #ff6a00, #ff3d00)",
                              ]
                            : "linear-gradient(135deg, rgba(255,154,0,0.3), rgba(255,106,0,0.3))",
                      }}
                      transition={{
                        duration: 4,
                        repeat: selectedPlan === index ? Infinity : 0,
                        ease: "linear",
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={noPackagesSx}>
              No packages available.
            </Typography>
          )}
        </Grid>

        {/* Floating CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={floatingCTAContainerSx}
        >
          <Typography variant="h6" sx={floatingCTATextSx}>
            Need a custom solution?
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" sx={floatingCTAButtonSx}>
              Contact Sales
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};






























































// Additional styles that were inline
const loadingContainerSx = {
  display: "flex",
  justifyContent: "center",
  mt: 8,
};

const loadingSpinnerSx = {
  color: "#ff9a00",
};

const gridItemSx = {
  display: "flex",
};

const motionCardSx = {
  width: "100%",
};

const getCardSx = (isSelected) => ({
  ...cardBaseSx,
  border: isSelected
    ? "2px solid transparent"
    : "1px solid rgba(255, 154, 0, 0.2)",
  backgroundImage: isSelected
    ? "linear-gradient(rgba(26,26,46,0.95), rgba(26,26,46,0.95)), linear-gradient(135deg, #ff9a00, #ff6a00)"
    : "none",
  boxShadow: isSelected
    ? "0 10px 40px rgba(255, 154, 0, 0.3)"
    : "0 5px 20px rgba(0, 0, 0, 0.2)",
});

const badgeContainerSx = {
  position: "absolute",
  top: -15,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
};

const starIconSx = {
  fontSize: "1rem",
  mr: 0.5,
};

const priceContainerSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "center",
  mb: 1,
};

const featuresTitleSx = {
  color: "white",
  mb: 2,
  textAlign: "left",
};

const checkIconSx = {
  color: "#4caf50",
  mr: 1.5,
  fontSize: "1.2rem",
};

const featureTextSx = {
  color: "rgba(255,255,255,0.9)",
};

const notIncludedContainerSx = {
  my: 4,
};

const notIncludedTitleSx = {
  color: "white",
  mb: 2,
  textAlign: "left",
};

const crossIconSx = {
  color: "#f44336",
  mr: 1.5,
  fontSize: "1.2rem",
};

const limitationTextSx = {
  color: "rgba(255, 255, 255, 0.8)",
  textAlign: "left",
};

const floatingCTAContainerSx = {
  textAlign: "center",
  marginTop: "4rem",
};

const noPackagesSx = {
  color: "white",
  textAlign: "center",
  width: "100%",
  mt: 4,
};

export default Pricing;