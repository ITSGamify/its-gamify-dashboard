// src/components/ui/Button.tsx
import React from "react";
import { Button as MuiButton, type ButtonProps } from "@mui/material";

interface CustomButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outline";
}

const LoginButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  // Map custom variants to Material UI variants
  const muiVariant = variant === "outline" ? "outlined" : "contained";

  // Map custom colors
  const color = variant === "secondary" ? "secondary" : "primary";

  return (
    <MuiButton
      fullWidth
      variant={muiVariant}
      color={color}
      sx={{
        borderRadius: "8px",
        padding: "12px 16px",
        textTransform: "none",
        fontWeight: 600,
        boxShadow:
          variant !== "outline"
            ? "0px 4px 12px rgba(67, 97, 238, 0.3)"
            : "none",
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default LoginButton;
