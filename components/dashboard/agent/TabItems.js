// TabItems.jsx
import React from "react";
import Link from "next/link";
import { Tab, useTheme } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Lock as PasswordIcon,
  Email as MessagesIcon,
  Fastfood as OrdersIcon,
  EventAvailable as ReservationsIcon,
  Star as ReviewsIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { TabIconContainer } from "./styles";
import AddIcon from '@mui/icons-material/Add';

import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';

import ListAltIcon from '@mui/icons-material/ListAlt';
export const tabItems = [
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    value: 0,
    path: "/dashboard/agent",
  },



  {
    icon: <AssignmentIndOutlinedIcon/>,
    label: "Profile",
    value: 1,
    path: "/dashboard/agent/profile",
  },


   
  {
    icon: <AddIcon  />,
    label: "Create Listing",
    value: 2,
    path: "/dashboard/agent/listing/create",
  },

   
  {
    icon: <ListAltIcon />,
    label: "My Listing",
    value: 3,
    path: "/dashboard/agent/listing/list",
  },



  {
    icon: <PasswordIcon />,
    label: "Password",
    value: 4,
    path: "/dashboard/agent/password",
  },


  {
    icon: <MessagesIcon />,
    label: "Messages",
    value: 5,
    path: "/dashboard/agent/messages",
  },
  {
    icon: <OrdersIcon />,
    label: "My Orders",
    value: 6,
    path: "/dashboard/agent/orders",
  },
  {
    icon: <ReservationsIcon />,
    label: "Reservations",
    value: 7,
    path: "/dashboard/agent/reservations",
  },
  {
    icon: <ReviewsIcon />,
    label: "Reviews",
    value: 8,
    path: "/dashboard/agent/reviews",
  },
  {
    icon: <WishlistIcon />,
    label: "Wishlist",
    value: 9,
    path: "/dashboard/agent/wishlist",
  },
  {
    icon: <AddressIcon />,
    label: "Addresses",
    value: 10,
    path: "/dashboard/agent/addresses",
  },
  {
    icon: <LogoutIcon />,
    label: "Log Out",
    value: 11,
    path: "/dashboard/agent/logout",
  },
];




export const CustomTab = ({ item, selectedValue, handleChange }) => {
  const theme = useTheme();

  return (
    <Tab
      component={Link}
      href={item.path}
      onClick={(e) => {
        handleChange(e, item.value);
      }}
      iconPosition="start"
      label={
        <TabIconContainer>
          {/* make icon yellow */}
          <div
            style={{
              color: "#f8d300ff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {React.cloneElement(item.icon, {
              style: { color: "#f8d40bff", fontSize: "22px" },
            })}
            {/* make label yellow */}
            <span
              style={{
                color: "#ffd700ff",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {item.label}
            </span>
          </div>
        </TabIconContainer>
      }
      value={item.value}
      sx={{
        minHeight: 60,
        padding: "8px 12px",
        [theme.breakpoints.up("sm")]: {
          minHeight: 48,
          padding: "12px 16px",
        },
      }}
    />
  );
};
