"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CategoryIcon from "@mui/icons-material/Category";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 100, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -15,
    scale: 1.05,
    rotateZ: 2,
    boxShadow: "0 25px 50px -12px rgba(255, 83, 26, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
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
      damping: 12,
      mass: 0.5,
    },
  },
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, width: 0 },
  visible: {
    opacity: 1,
    width: "auto",
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const dummyData = [
  {
    title: "Category 1",
    subtitle:
      "Description for category 1 with more details about this amazing feature",
    icon: CategoryIcon,
    color: "#ff531a",
  },
  {
    title: "Find a Location",
    subtitle:
      "Description for category 2 with more details about this amazing feature",
    icon: LocalDiningIcon,
    color: "#4caf50",
  },
  {
    title: "Contact New Owner",
    subtitle:
      "Description for category 3 with more details about this amazing feature",
    icon: DirectionsCarIcon,
    color: "#2196f3",
  },
];

const CategoryCard = ({ title, subtitle, Icon, color, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          sx={{
            minHeight: 300,
            borderRadius: "20px",

            //   background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',

            background:
              "linear-gradient(145deg, rgba(45, 45, 68, 0.9), rgba(26, 26, 46, 0.9))",

            border: "1px solid rgba(255, 154, 0, 0.2)",
            backgroundImage:
              "linear-gradient(rgba(26, 26, 46, 0.95), rgba(26, 26, 46, 0.95)), linear-gradient(135deg, #ff9a00, #ff6a00)",

            boxShadow: "0 10px 40px rgba(255, 154, 0, 0.3)",

          //  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background: `linear-gradient(90deg, ${color}, ${color}00)`,
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.3s ease",
            },
            "&:hover::before": {
              transform: "scaleX(1)",
            },
          }}
        >
          <CardContent
            sx={{
              padding: "2.5rem 1.5rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Animated Icon */}
            <motion.div
              variants={iconVariants}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <Icon sx={{ fontSize: "2.5rem", color: color }} />
            </motion.div>

            {/* Title */}
            <motion.div variants={textVariants}>
              <Typography
                variant="h5"
                component="div"
                align="center"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {title}
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={textVariants}>
              <Typography
                variant="body1"
                align="center"
                sx={{
                 color:"white",
                  mb: 3,
                }}
              >
                {subtitle}
              </Typography>
            </motion.div>

            {/* Animated Button */}
            <motion.div
              variants={buttonVariants}
              animate={isHovered ? "hover" : "visible"}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: color,
                  fontWeight: "bold",
                  mt: "auto",
                }}
              >
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Learn more
                </Typography>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <ArrowForwardIcon />
                </motion.div>
              </Box>
            </motion.div>
          </CardContent>

          {/* Hover Effect Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 0,
            }}
            className={isHovered ? "hovered" : ""}
          />
        </Card>
      </motion.div>
    </Grid>
  );
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      sx={{
        //  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,83,26,0.1) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <Container
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #ff9a00, #ff6a00, #ff3d00)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Our New Features
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 6,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Discover all of the powerful features and capabilities available in
            our latest update.
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <Grid container spacing={3}>
            {dummyData.map((item, index) => (
              <CategoryCard
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                Icon={item.icon}
                color={item.color}
                index={index}
              />
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
