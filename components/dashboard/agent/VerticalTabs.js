// VerticalTabs.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Box,Avatar  } from "@mui/material";
import { usePathname } from "next/navigation";
import { StyledDivider, Root, StyledTabs, TabPanel, StyledAvatar } from "./styles";
import { tabItems, CustomTab } from "./TabItems";

function VerticalTabs({ children }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeTab");
      if (saved !== null) return Number(saved);
    }
    // fallback: derive from pathname
    const active = tabItems.find((it) => pathname?.startsWith(it.path));
    return active ? active.value : 0;
  };

  const [value, setValue] = useState(getInitialValue);

  useEffect(() => {
    // when route changes, sync active tab
    const active = tabItems.find((item) => pathname?.startsWith(item.path));
    if (active && active.value !== value) {
      setValue(active.value);
      if (typeof window !== "undefined") localStorage.setItem("activeTab", String(active.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (typeof window !== "undefined") localStorage.setItem("activeTab", String(newValue));
  };

  return (
    <Box sx={{ margin: "30px auto", width: "92%", maxWidth: 1400 }}>
      <Box sx={{ textAlign: "center", mt: 2 }}>
       

<Avatar alt="User" src="/images/list2.jpg" 
style={{ width: '200px', margin:"auto", height: '200px',
   border: '5px solid #ff531a',
     borderRadius: '50%',
     marginBottom: '16px',
      marginTop:"36px", 
     transition: 'transform 0.2s ease-in-out', 
 transform: 'scale(1.1)', }}
 
 />



      </Box>

      <StyledDivider />

      <Root>
        <StyledTabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          scrollButtons={isMobile ? "auto" : false}
        >
          {tabItems.map((item) => (
            <CustomTab
              key={item.value}
              item={item}
              selectedValue={value}
              handleChange={handleChange}
            />
          ))}
        </StyledTabs>

        <TabPanel>{children}</TabPanel>
      </Root>
    </Box>
  );
}

export default VerticalTabs;




