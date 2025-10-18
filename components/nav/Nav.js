"use client";

import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Link from "next/link"; // Adjust this import based on your routing setup

const MenuWithCategories = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white",}}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        
        
           <Link href="/" passHref>
            <Button  utton sx={{ color: "black" }}>
                          My App


            </Button>
          </Link>

        </Box>

        <Box
          sx={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          
           <Link href="/" passHref>
            <Button  utton sx={{ color: "black" }}>Home</Button>
          </Link>

          <Link href="/about" passHref>
            <Button sx={{ color: "black" }}>Blog</Button>
          </Link>
          <Link href="/contact" passHref>
            <Button sx={{ color: "black" }}>Pages</Button>
          </Link>
          <Link href="/about" passHref>
            <Button sx={{ color: "black" }}>About</Button>
          </Link>
             <Link href="/package" passHref>
            <Button sx={{ color: "black" }}>Pricing</Button>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href="/" passHref>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mr: 2, backgroundColor: "#ff9a00", color: "white" }}
            >
              Listing
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuWithCategories;
