// styles.js
import { styled } from "@mui/material";
import { Tabs, Box, Avatar } from "@mui/material";

const ACCENT = "#eca202ff";
const SOFT_BG = "rgba(11, 19, 17, 0.9)";

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: "0 auto 16px",
  border: `4px solid ${ACCENT}`,
  borderRadius: "60%",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
  transition: "transform .28s ease, box-shadow .28s ease",
  transform: "translateZ(0)", // avoid blurry borders in some browsers
  "&:hover": {
    transform: "scale(1.04)",
    boxShadow: "0 14px 40px rgba(15, 23, 42, 0.16)",
  },
  [theme.breakpoints.up("sm")]: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
}));

export const StyledDivider = styled("div")(({ theme }) => ({
  width: "70%",
  height: 2,
  margin: "8px auto 20px",
  background: `linear-gradient(90deg, transparent, ${ACCENT}33, transparent)`,
  borderRadius: 2,
  [theme.breakpoints.up("sm")]: {
    marginBottom: 28,
  },
}));

export const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: SOFT_BG,
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(2,6,23,0.06)",
  border: "1px solid rgba(16,24,40,0.04)",
  transition: "transform .25s ease",
  minHeight: "auto",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    minHeight: 600,
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: "100%",
  background: "transparent",
  borderBottom: "1px solid rgba(16,24,40,0.04)",
  "& .MuiTabs-scroller": { display: "flex" },

  // indicator (horizontal)
  "& .MuiTabs-indicator": {
    background: ACCENT,
    height: 3,
    borderRadius: 3,
    transition: "all .25s ease",
  },

  // individual tab styles
  "& .MuiTab-root": {
    textTransform: "none",
    minWidth: 100,
    minHeight: 60,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(12,16,24,0.8)",
    transition: "background .22s ease, color .22s ease, transform .22s ease",
    borderRadius: 10,
    margin: "6px",
    justifyContent: "center",
    "&:hover": {
      background: "rgba(255,107,107,0.06)",
      transform: "translateY(-2px)",
    },
    "&.Mui-selected": {
      color: ACCENT,
      background: "rgba(255,107,107,0.06)",
      boxShadow: "inset 0 0 0 1px rgba(255,107,107,0.06)",
    },
    "& svg": {
      marginBottom: 6,
      fontSize: 20,
      transition: "transform .22s ease, color .22s ease",
      color: "rgba(12,16,24,0.6)",
    },
    "&.Mui-selected svg": {
      color: ACCENT,
      transform: "scale(1.12)",
    },
  },

  // vertical layout for larger screens
  [theme.breakpoints.up("sm")]: {
    width: 280,
    minWidth: 280,
    maxHeight: "none",
    borderRight: "1px solid rgba(16,24,40,0.04)",
    borderBottom: "none",
    padding: "28px 18px",
    "& .MuiTabs-indicator": {
      width: 4,
      height: "auto",
      borderRadius: 6,
      right: 0,
      left: "unset",
    },
    "& .MuiTab-root": {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 18px",
      minHeight: 48,
      margin: "8px 0",
      borderRadius: 10,
      textAlign: "left",
    },
  },
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,250,252,0.9))",
  [theme.breakpoints.up("sm")]: {
    padding: "36px 44px",
  },
}));

export const TabIconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  "& svg": {
    fontSize: 20,
    color: "rgba(12,16,24,0.65)",
  },
  "& span": {
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(12,16,24,0.9)",
    whiteSpace: "nowrap",
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    gap: 12,
    "& svg": { fontSize: 22 },
    "& span": { fontSize: 15 },
  },
}));
























