// src/components/layout/Header/index.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import userSession from "@utils/user-session";
import { PATH } from "@constants/path";
import { getHeaderTitle } from "@utils/header";
// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.text.primary,
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.05)",
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

interface HeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
}

const drawerWidth = 216;
const miniDrawerWidth = 40;

const Header: React.FC<HeaderProps> = ({ onToggleDrawer, isDrawerOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const profile = userSession.getUserProfile();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = useCallback(() => {
    handleMenuClose();
    navigate(PATH.LOGIN);
    userSession.clearUserProfile();
  }, [navigate]);

  const menuId = "primary-account-menu";
  const notificationMenuId = "notification-menu";

  const renderMenu = useMemo(
    () => (
      <Menu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: 200,
            borderRadius: 2,
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {profile?.user.full_name.toUpperCase() || "Người dùng"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile?.user.email || "Người dùng"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    ),
    [
      anchorEl,
      handleLogout,
      isMenuOpen,
      profile?.user.email,
      profile?.user.full_name,
    ]
  );

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      id={notificationMenuId}
      keepMounted
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          minWidth: 320,
          maxWidth: 350,
          borderRadius: 2,
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Thông báo
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          Đánh dấu tất cả đã đọc
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 320, overflow: "auto" }}>
        {[1, 2, 3].map((item) => (
          <MenuItem
            key={item}
            onClick={handleNotificationMenuClose}
            sx={{ py: 1.5 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Khóa học mới đã được thêm
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 giờ trước
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Box>
      <Divider />
      <MenuItem
        onClick={handleNotificationMenuClose}
        sx={{ justifyContent: "center" }}
      >
        <Typography color="primary" sx={{ fontWeight: 500 }}>
          Xem tất cả
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: isMobile
                ? miniDrawerWidth
                : isDrawerOpen
                ? drawerWidth
                : miniDrawerWidth,
              borderRight: isDrawerOpen
                ? "1px solid rgba(0, 0, 0, 0.05)"
                : "none",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onToggleDrawer}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            {!isDrawerOpen || (!isMobile && <Logo />)}
          </Box>

          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              ml: isMobile ? 0 : 3,
            }}
          >
            {getHeaderTitle(window.location.pathname)}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Thông báo">
              <IconButton
                size="large"
                color="inherit"
                aria-label="show notifications"
                aria-controls={notificationMenuId}
                aria-haspopup="true"
                onClick={handleNotificationMenuOpen}
              >
                <StyledBadge badgeContent={3} color="error">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Tài khoản">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt="User Avatar"
                  src="/assets/avatar.jpg"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {renderMenu}
      {renderNotificationMenu}
    </>
  );
};

export default Header;
