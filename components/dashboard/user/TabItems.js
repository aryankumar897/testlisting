// TabItems.jsx
import React from "react";
import Link from "next/link";
import { Tab, useTheme } from "@mui/material";
import {
  Dashboard as DashboardIcon,
 
  Lock as PasswordIcon,
  Email as MessagesIcon,

 
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { TabIconContainer } from "./styles";


import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';


export const tabItems = [
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    value: 0,
    path: "/dashboard/user",
  },



  {
    icon: <AssignmentIndOutlinedIcon/>,
    label: "Profile",
    value: 1,
    path: "/dashboard/user/profile",
  },


  

  {
    icon: <PasswordIcon />,
    label: "Password",
    value: 4,
    path: "/dashboard/user/password",
  },


  {
    icon: <MessagesIcon />,
    label: "Messages",
    value: 5,
    path: "/dashboard/user/messages",
  },
 

  {
    icon: <LogoutIcon />,
    label: "Log Out",
    value: 11,
    path: "/dashboard/user/logout",
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
