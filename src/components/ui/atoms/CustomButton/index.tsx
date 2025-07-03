import React, { ReactNode } from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Box,
} from "@mui/material";

export interface ButtonProps extends Omit<MuiButtonProps, "startIcon"> {
  /**
   * Nội dung của button
   */
  children: ReactNode;
  /**
   * Biến thể của button
   * @default 'contained'
   */
  variant?: "text" | "outlined" | "contained";
  /**
   * Icon hiển thị ở đầu button
   */
  startIcon?: ReactNode;
  /**
   * Trạng thái loading của button
   * @default false
   */
  isLoading?: boolean;
  /**
   * Nội dung hiển thị khi đang loading
   * @default 'Đang xử lý...'
   */
  loadingText?: string;
}

/**
 * Component Button tùy chỉnh
 */
export const CustomButton = ({
  children,
  variant = "contained",
  startIcon,
  isLoading = false,
  loadingText = "Đang xử lý...",
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      startIcon={!isLoading ? startIcon : null}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="span"
            sx={{
              width: 16,
              height: 16,
              mr: 1,
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid currentColor",
              display: "inline-block",
            }}
          />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default CustomButton;
