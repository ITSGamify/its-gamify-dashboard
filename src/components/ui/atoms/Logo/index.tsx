// src/components/common/Logo/index.tsx
import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import logoImage from "@assets/images/f-study_official_logo.png";
import userSession from "@utils/user-session";
import { RoleEnum } from "@interfaces/api/user";
import { PATH } from "@constants/path";

const Logo: React.FC = () => {
  const profile = userSession.getUserProfile();

  return (
    <Box
      component={Link}
      to={
        profile?.user.role === RoleEnum.TRAINER
          ? PATH.COURSES
          : profile?.user.role === RoleEnum.MANAGER
          ? PATH.HOME
          : PATH.DEPARTMENTS
      }
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        margin: "5px 0px 5px 5px",
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="F-Study Logo"
        sx={{
          height: 55,
          width: 120,
        }}
      />
    </Box>
  );
};

export default Logo;
