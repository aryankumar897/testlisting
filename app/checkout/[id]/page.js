

"use client";

import React, { useEffect, useState } from "react";
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

import { useParams, useRouter } from "next/navigation";
import { fetchCheckOutPackageById } from "@/slice/packageSlice";
import Top from "@/components/topimage/Top";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
// Import all styles from separate file
import {
  containerSx,
  bgCircle1Sx,
  bgCircle2Sx,
  containerInnerSx,
  gridSx,
  cardBaseSx,
  cardContentSx,
  titleTextSx,
  priceTextSx,
  periodTextSx,
  featuresBoxSx,
  featureRowSx,
  badgeSx,
  primaryButtonSx,
  paymentCardSx,
  paymentTitleSx,
  paymentButtonsContainerSx,
  paymentButtonSx,
  noteTextSx,
  detailsCardSx,
  detailsHeaderSx,
  sectionTitleSx,
  featureTextSx,
  notIncludedTextSx,
  cardVariants,
  paymentButtonHover,
  paymentButtonTransition,
} from "./checkoutStyles";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const id = params?.id;
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [freePackageLoading, setFreePackageLoading] = useState(false);
  const packageState = useSelector((state) => state.packages);
  const { loading: pkgLoading } = packageState;
  const [packageData, setPackageData] = useState(null);

  // Fetch package by id
  useEffect(() => {
    if (!id) return;
    const fetchPackage = async () => {
      try {
        const data = await dispatch(fetchCheckOutPackageById(id)).unwrap();
        setPackageData(data);
      } catch (err) {
        console.error("Failed to fetch package:", err);
        router.push("/pricing");
      }
    };

    fetchPackage();
  }, [dispatch, id, router]);

  // Load Razorpay script only if package is not free
  useEffect(() => {
    if (packageData?.type === "free") return;
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [packageData]);

  const formatValue = (value, label) => {
    if (value === -1) return `Unlimited ${label}`;
    if (value === 0 || value === null || value === undefined) return null;
    return `${value} ${label}`;
  };

  // Handle free package activation
  const handleTryFree = async () => {
    if (!packageData || packageData.type !== "free") return;
    
    setFreePackageLoading(true);
    try {
      const resp = await fetch(
        `${process.env.API}/agent/package/activate-free`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            packageId: packageData._id,
            userId: session?.user?.id 
          }),
        }
      );
      
      const data = await resp.json();
      
      if (!resp.ok) {
        console.error("Failed to activate free package:", data);
        toast.error(data?.err)
        return;
      }
      
      // Success - redirect to success page or dashboard
      router.push("/free-package/success");
      
    } catch (err) {
      console.error("Error activating free package:", err);
    } finally {
      setFreePackageLoading(false);
    }
  };

  // Payment handlers (only for paid packages)
  const handleRazorpay = async () => {
    if (!packageData || packageData.type === "free") return;
    setLoadingLocal(true);
    try {
      const resp = await fetch(
        `${process.env.API}/agent/payment/razorpay/createpayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: packageData._id }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        setLoadingLocal(false);
        console.error(data);
        return;
      }

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: "INR",
        name: session?.user.name,
        description:
          "Premium Business Listing Package - Enhanced Visibility & Features",
        order_id: data.id,
        handler: function (response) {
          verifyRazorpay(response.razorpay_payment_id);
        },
        prefill: {
          name: session?.user.name,
          email: session?.user.email,
          contact: session?.user.phone,
        },
        theme: { color: "#ff9a00" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay init error:", err);
    } finally {
      setLoadingLocal(false);
    }
  };

  const verifyRazorpay = async (paymentId) => {
    try {
      const resp = await fetch(
        `${process.env.API}/agent/payment/razorpay/verifypayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
        }
      );
      const json = await resp.json();
      if (json?.err) router.push("/razorpay/unsuccess");
      else router.push("/razorpay/success");
    } catch (err) {
      console.error("verify error", err);
    }
  };

  const handleStripe = async () => {
    if (!packageData || packageData.type === "free") return;
    try {
      const resp = await fetch(
        `${process.env.API}/agent/payment/stripe/createpayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: packageData._id }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        console.log(data.err);
      } else {
        window.location.href = data.id;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaypal = async () => {
    if (!packageData || packageData.type === "free") return;
    try {
      const resp = await fetch(
        `${process.env.API}/agent/payment/paypal/createpayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: packageData._id }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        console.log("paypal error", data);
      } else {
        router.push(data.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (pkgLoading || !packageData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={80} sx={{ color: "#ff9a00" }} />
      </Box>
    );
  }

  // Compose features list
  const featuresList = [
    formatValue(packageData.num_of_listing, "Listings"),
    formatValue(packageData.num_of_photos, "Photos"),
    formatValue(packageData.num_of_video, "Videos"),
    formatValue(packageData.num_of_amenities, "Amenities"),
    formatValue(packageData.num_of_featured_listing, "Featured Listings"),
  ].filter(Boolean);

  const paymentGateways = [
    {
      name: "Pay with PayPal",
      onClick: handlePaypal,
    },
    {
      name: "Pay with Stripe",
      onClick: handleStripe,
    },
    {
      name: "Pay with Razorpay",
      onClick: handleRazorpay,
    },
  ];

  const notIncludedItems = [
    "Custom Branding",
    "24/7 Priority Support",
    "Dedicated Account Manager",
  ];

  const isFreePackage = packageData.type === "free";

  return (
    <>
      <Top />

      <Box sx={containerSx}>
        <motion.div
          style={bgCircle1Sx}
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={bgCircle2Sx}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.15, 0.3] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          }}
        />

        <Container maxWidth="lg" sx={containerInnerSx}>
          <Grid container spacing={4} sx={gridSx}>
            {/* LEFT: Payment Methods or Free Package Activation */}
            <Grid item xs={12} md={5}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card sx={paymentCardSx}>
                  <CardContent sx={{ ...cardContentSx, p: 0 }}>
                    <Typography variant="h5" sx={paymentTitleSx}>
                      {isFreePackage ? "Activate Free Package" : "Choose Payment Method"}
                    </Typography>

                    <Box sx={paymentButtonsContainerSx}>
                      {isFreePackage ? (
                        // Free package activation button
                        <motion.div
                          whileHover={paymentButtonHover}
                          transition={paymentButtonTransition}
                        >
                          <Button
                            onClick={handleTryFree}
                            fullWidth
                            sx={paymentButtonSx}
                            disabled={freePackageLoading}
                          >
                            {freePackageLoading ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Try Free Package"
                            )}
                          </Button>
                        </motion.div>
                      ) : (
                        // Payment gateway buttons for paid packages
                        paymentGateways.map((gateway, i) => (
                          <motion.div
                            key={i}
                            whileHover={paymentButtonHover}
                            transition={paymentButtonTransition}
                          >
                            <Button
                              onClick={gateway.onClick}
                              fullWidth
                              sx={paymentButtonSx}
                            >
                              {gateway.name}
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </Box>

                    <Typography variant="body2" sx={noteTextSx}>
                      {isFreePackage 
                        ? "Get instant access to all free features with no payment required."
                        : "Note: Payment options shown depend on your account's settings."
                      }
                    </Typography>

                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        sx={primaryButtonSx}
                        onClick={() => router.push("/package")}
                      >
                        Back to Plans
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* RIGHT: Package Details */}
            <Grid item xs={12} md={7}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card sx={detailsCardSx}>
                  <CardContent sx={cardContentSx}>
                    <Box sx={detailsHeaderSx}>
                      <Typography variant="h4" sx={titleTextSx}>
                       {packageData.name}
                      </Typography>
                      {packageData.recommended && (
                        <Box
                          sx={badgeSx(
                            "linear-gradient(135deg, #ff9a00,#ff6a00)"
                          )}
                        >
                          <Star sx={{ mr: 0.5 }} /> Recommended
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={priceTextSx({
                          buttonColor:
                            "linear-gradient(135deg,#ff9a00,#ff6a00)",
                        })}
                        variant="h2"
                      >
                        {packageData.price === 0
                          ? "Free"
                          : `₹${packageData.price}`}
                      </Typography>
                      <Typography sx={periodTextSx}>
                        {packageData.number_of_days > 0
                          ? `/ ${packageData.number_of_days} days`
                          : ""}
                      </Typography>
                    </Box>

                    <Box sx={featuresBoxSx}>
                      <Typography variant="h6" sx={sectionTitleSx}>
                        Package details:
                      </Typography>

                      {featuresList.length ? (
                        featuresList.map((f, i) => (
                          <Box key={i} sx={{ mb: 1 }}>
                            <Box sx={featureRowSx}>
                              <CheckCircle sx={{ color: "#4caf50", mr: 1.5 }} />
                              <Typography variant="body1" sx={featureTextSx}>
                                {f}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={notIncludedTextSx}>
                          No details available for this package.
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ my: 3 }}>
                      <Typography variant="h6" sx={sectionTitleSx}>
                        Not Included:
                      </Typography>
                      {notIncludedItems.map((item, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <HighlightOff sx={{ color: "#f44336", mr: 1.5 }} />
                            <Typography variant="body2" sx={notIncludedTextSx}>
                              {item}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
