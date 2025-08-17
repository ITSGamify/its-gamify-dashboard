// src/components/layout/Sidebar/index.tsx
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Tooltip,
  Popover,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
  Apartment as ApartmentIcon,
  School as SchoolIcon,
  SportsEsports as SportsEsportsIcon,
} from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";

import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useCustomTranslation from "@hooks/shared/useTranslation";
import { TRANSLATION_NAME_SPACES } from "@i18n/config";
import { PATH } from "@constants/path";
import userSession from "@utils/user-session";
import { RoleEnum } from "@interfaces/api/user";
interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  isDisabled?: boolean; // Thêm thuộc tính isDisabled
  children?: {
    text: string;
    icon: React.ReactNode;
    path: string;
    isDisabled?: boolean; // Thêm thuộc tính isDisabled cho children
  }[];
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useCustomTranslation(TRANSLATION_NAME_SPACES.SIDEBAR);
  const profile = userSession.getUserProfile();
  // Thay đổi từ một state duy nhất sang một object quản lý nhiều submenu
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
  const [popoverState, setPopoverState] = React.useState<{
    anchorEl: HTMLElement | null;
    menuText: string | null;
  }>({
    anchorEl: null,
    menuText: null,
  });
  const handleMenuClick = (
    menuText: string,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    if (isOpen) {
      // Khi sidebar mở, chuyển đổi trạng thái của menu được click
      setOpenMenus((prev) => ({
        ...prev,
        [menuText]: !prev[menuText],
      }));
    } else if (event) {
      // Khi sidebar thu nhỏ, mở popover cho menu được click
      setPopoverState({
        anchorEl: event.currentTarget,
        menuText: menuText,
      });
    }
  };

  const handlePopoverClose = () => {
    setPopoverState({
      anchorEl: null,
      menuText: null,
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems: MenuItem[] = [
    {
      text: t("dashboard"),
      icon: <DashboardIcon />,
      path: PATH.HOME,
      isDisabled: profile?.user.role === RoleEnum.TRAINER,
    },
    {
      text: t("department"),
      icon: <ApartmentIcon />,
      path: PATH.DEPARTMENTS,
      isDisabled: profile?.user.role !== RoleEnum.ADMIN,
    },
    {
      text: "Danh mục",
      icon: <CategoryIcon />,
      path: PATH.CATEGORIES,
      isDisabled: profile?.user.role === RoleEnum.TRAINER,
    },
    {
      text: t("account"),
      icon: <PeopleIcon />,
      path: PATH.ACCOUNTS,
      isDisabled: profile?.user.role !== RoleEnum.ADMIN,
    },
    {
      text: t("course"),
      icon: <SchoolIcon />,
      path: PATH.COURSES,
    },
    {
      text: "Giải đấu",
      icon: <SportsEsportsIcon />,
      path: PATH.TOURNAMENT,
    },
  ];

  return (
    <>
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List>
          {menuItems
            .filter((item) => !item.isDisabled) // Lọc ra các menu item không bị disabled
            .map((item) => {
              const isMenuOpen = openMenus[item.text] || false;
              const isCurrentPopoverMenu = popoverState.menuText === item.text;
              if (item.children) {
                // Lọc ra các children không bị disabled
                const enabledChildren = item.children.filter(
                  (child) => !child.isDisabled
                );

                // Nếu không có children nào được hiển thị, bỏ qua menu này
                if (enabledChildren.length === 0) {
                  return null;
                }

                // Nếu là menu có submenu
                return isOpen ? (
                  // Hiển thị đầy đủ khi drawer mở
                  <React.Fragment key={item.text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleMenuClick(item.text)}
                      >
                        <ListItemIcon
                          sx={{
                            color: isMenuOpen
                              ? theme.palette.primary.main
                              : "inherit",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isMenuOpen ? 600 : 400,
                            color: isMenuOpen
                              ? theme.palette.primary.main
                              : "inherit",
                          }}
                        />
                        {isMenuOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {enabledChildren.map((child) => (
                          <ListItemButton
                            key={child.text}
                            sx={{ pl: 4 }}
                            selected={isActive(child.path)}
                            onClick={() => navigate(child.path)}
                          >
                            <ListItemIcon
                              sx={{
                                color: isActive(child.path)
                                  ? theme.palette.primary.main
                                  : "inherit",
                                minWidth: 36,
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              primaryTypographyProps={{
                                fontWeight: isActive(child.path) ? 600 : 400,
                                color: isActive(child.path)
                                  ? theme.palette.primary.main
                                  : "inherit",
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ) : (
                  // Chỉ hiển thị icon khi drawer thu nhỏ, với popover cho submenu
                  <React.Fragment key={item.text}>
                    <Tooltip title={item.text} placement="right">
                      <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: "center",
                            px: 2.5,
                          }}
                          onClick={(event) => handleMenuClick(item.text, event)}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: "auto",
                              justifyContent: "center",
                              color: isCurrentPopoverMenu
                                ? theme.palette.primary.main
                                : "inherit",
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  </React.Fragment>
                );
              }

              // Nếu là menu thông thường
              return isOpen ? (
                // Hiển thị đầy đủ khi drawer mở
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={item.path ? isActive(item.path) : false}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          item.path && isActive(item.path)
                            ? theme.palette.primary.main
                            : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight:
                          item.path && isActive(item.path) ? 600 : 400,
                        color:
                          item.path && isActive(item.path)
                            ? theme.palette.primary.main
                            : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : (
                // Chỉ hiển thị icon khi drawer thu nhỏ
                <Tooltip key={item.text} title={item.text} placement="right">
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: "center",
                        px: 2.5,
                      }}
                      selected={item.path ? isActive(item.path) : false}
                      onClick={() => item.path && navigate(item.path)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: "auto",
                          justifyContent: "center",
                          color:
                            item.path && isActive(item.path)
                              ? theme.palette.primary.main
                              : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })}
        </List>
      </Box>

      {/* Popover dùng chung cho tất cả các submenu */}
      <Popover
        open={Boolean(popoverState.anchorEl)}
        anchorEl={popoverState.anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <List sx={{ py: 0, width: 200 }}>
          {menuItems
            .find((item) => item.text === popoverState.menuText)
            ?.children?.filter((child) => !child.isDisabled) // Lọc ra các children không bị disabled trong popover
            .map((child) => (
              <ListItemButton
                key={child.text}
                selected={isActive(child.path)}
                onClick={() => {
                  navigate(child.path);
                  handlePopoverClose();
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(child.path)
                      ? theme.palette.primary.main
                      : "inherit",
                  }}
                >
                  {child.icon}
                </ListItemIcon>
                <ListItemText
                  primary={child.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(child.path) ? 600 : 400,
                    color: isActive(child.path)
                      ? theme.palette.primary.main
                      : "inherit",
                  }}
                />
              </ListItemButton>
            ))}
        </List>
      </Popover>

      {isOpen && (
        <Box sx={{ p: 2, mt: "auto" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center" }}
          >
            {t("license")}
          </Typography>
        </Box>
      )}
    </>
  );
};
export default Sidebar;
