// src/components/layout/MainLayout/index.tsx
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "../../ui/atoms/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/ui/atoms/Sidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const drawerWidth = 240;
const miniDrawerWidth = 64;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const actualDrawerWidth = isMobile
    ? 0
    : isDrawerOpen
    ? drawerWidth
    : miniDrawerWidth;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onToggleDrawer={handleToggleDrawer} isDrawerOpen={isDrawerOpen} />

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isDrawerOpen : true}
        onClose={isMobile ? handleToggleDrawer : undefined}
        sx={{
          width: actualDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile
              ? drawerWidth
              : isDrawerOpen
              ? drawerWidth
              : miniDrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid rgba(0, 0, 0, 0.05)",
            top: isMobile ? "56px" : "64px",
            height: "calc(100% - 56px)",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Sidebar onClose={handleToggleDrawer} isOpen={isDrawerOpen} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${actualDrawerWidth}px)` },
          // marginLeft: { sm: `${actualDrawerWidth}px` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default MainLayout;
