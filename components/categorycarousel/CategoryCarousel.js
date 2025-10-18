// "use client";
import React, { useEffect } from "react";

import {
  Box,
  Card,
  CardMedia,
 
  Typography,

  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeCategories } from "@/slice/categorySlice";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

/* Styled components */
const StyledCard = styled(Card)({
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
  },
  maxWidth: 320,
  margin: "1rem auto",
});

const CircleImage = styled(CardMedia)({
  borderRadius: "50%",
  width: 120,
  height: 120,
  margin: "18px auto 8px",
  objectFit: "cover",
  display: "block",
});

const CardCenter = styled("div")({
  textAlign: "center",
  paddingBottom: 12,
});


const PostCard = ({ category }) => {
 

  const image = category?.image_icon || category?.image ;
  const name = category?.name || "Untitled";
  const slug = category?.slug || "";

  const href = `/category-listings/${slug}` 

  return (
    <StyledCard>
      {/* Link without passHref or legacyBehavior */}
      <Link href={href}>
        {/* CardActionArea renders a div (not a button/a) so it's safe inside the anchor */}
        <CardActionArea component="div" sx={{ textDecoration: "none" }}>
          <CardCenter>
            <CircleImage component="img" src={image} alt={name} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, mt: 1 }}
            >
              {name}
            </Typography>
          
          </CardCenter>
        </CardActionArea>
      </Link>
    </StyledCard>
  );
};



export default function Category() {
  const dispatch = useDispatch();
  const { homeCategories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    focusOnSelect: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 14 }}>
        <Typography variant="h4">Loading categories...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 14 }}>
        <Typography variant="h4" color="error">
          Error loading categories
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "0 auto", width: "90%", maxWidth: "1100px", mt: 6 }}>
    

      {homeCategories && homeCategories.length ? (
        <Slider {...settings}>
          {homeCategories.map((cat, idx) => (
            <Box key={cat._id || idx} sx={{ padding: 1 }}>
              <PostCard category={cat} />
            </Box>
          ))}
        </Slider>
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">No categories available</Typography>
        </Box>
      )}
    </Box>
  );
}
