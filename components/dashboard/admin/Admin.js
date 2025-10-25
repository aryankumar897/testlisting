"use client";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Top from "@/components/nav/TopNav";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));


import { useRouter } from "next/navigation";
export default function Sidenav({ children }) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(true);
  const [isCollapse, setIsCollapse] = React.useState(false);

  const [isCollapseLocation, setIsCollapseLocation] = React.useState(false);
  const [isCollapseProduct, setIsCollapseProduct] = React.useState(false);

  const [isCollapseAmenity, setIsCollapseAmenity] = React.useState(false);
  const [isCollapsePackage, setIsCollapsePackage] = React.useState(false);

const [isCollapseOrder, setIsCollapseOrder] = React.useState(false);

const [isCollapselogout, setIsCollapselogout] = React.useState(false);
const [isCollapseCalim, setIsCollapseCalim] = React.useState(false);

const [isCollapseReview , setIsCollapseReview] = React.useState(false);



  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(`/dashboard/admin/${path}`);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  //Amenity

  const handleCollapseLocation = () => {
    setIsCollapseLocation(!isCollapseLocation);
  };

  const handleCollapseAmenity = () => {
    setIsCollapseAmenity(!isCollapseAmenity);
  };

  const handleCollapsePackage = () => {
    setIsCollapsePackage(!isCollapsePackage);
  };


  const handleCollapseOrder = () => {
    setIsCollapseOrder(!isCollapseOrder);
  };
  

  
  const handleCollapselogout = () => {
    setIsCollapselogout(!isCollapselogout);
  };
  
 const handleCollapseCalim = () => {
    setIsCollapseCalim(!isCollapseCalim);
  };
  
 // Review 

   const handleCollapseReview  = () => {
    setIsCollapseReview(!isCollapseReview);
  };
  
  const handleCollapseProduct = () => {
    setIsCollapseProduct(!isCollapseProduct);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{
          backgroundColor: "#ff9a00",
          boxShadow: "none",
          border: "none",
          outline: "none",
        }}
      >
        <Toolbar disableGutters sx={{ px: 0 }}>
          {" "}
          {/* disable default padding */}
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,

              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon sx={{ color: "white" }} /> {/* white menu icon */}
          </IconButton>
          <Top />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            color: "white",
            background: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // keeps text and icon apart
            px: 2, // padding inside header
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#ff9a00", fontWeight: "bold" }}
          >
            Listing
          </Typography>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ fontSize: 40, color: "#ff9a00" }} />
            ) : (
              <ChevronLeftIcon sx={{ fontSize: 40, color: "#ff9a00" }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          {["profile", "change-password"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
               onClick={() => handleNavigation(text)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        {/* category */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapse}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Category"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapse} timeout="auto" unmountOnExit>
            {["category/create", "category/list"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />

        {/* locations */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseLocation}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Locations"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseLocation ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseLocation} timeout="auto" unmountOnExit>
            {["location/create", "location/list"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />

        {/* Amenity */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseAmenity}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Amenity"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseAmenity ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseAmenity} timeout="auto" unmountOnExit>
            {["amenity/create", "amenity/list"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />

        {/* product */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseProduct}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Products"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseProduct ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseProduct} timeout="auto" unmountOnExit>
            {["listing/create", "listing/list", "listing/pending"].map(
              (text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => handleNavigation(text)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </Collapse>
        </List>
        <Divider />
        {/* package */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapsePackage}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Package"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapsePackage ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapsePackage} timeout="auto" unmountOnExit>
            {["package/create", "package/list"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />



    {/* ORDERS */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseOrder}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Order"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseOrder ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseOrder} timeout="auto" unmountOnExit>
            {["orders"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />





 {/* Review */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseReview}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage  Review"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseReview  ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseReview} timeout="auto" unmountOnExit>
            {["reviews"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />










    {/* logout */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapselogout}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapselogout ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapselogout} timeout="auto" unmountOnExit>
            {["logout"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />







 {/* Calim */}

        <List
          sx={{
            color: "white",

            background: `black`,
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapseCalim}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Calim"
                sx={{ opacity: open ? 1 : 0 }}
              />
              {isCollapseCalim ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isCollapseCalim} timeout="auto" unmountOnExit>
            {["claim"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleNavigation(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />


      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pl: 5 }}>
        <DrawerHeader />

        {children}
      </Box>
    </Box>
  );
}
