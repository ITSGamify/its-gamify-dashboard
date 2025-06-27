import { ToastContentProps, TypeOptions } from "react-toastify";
import { CheckCircle, Info, Warning, Error, Close } from "@mui/icons-material";
import { Box, Typography, IconButton, Stack } from "@mui/material";

interface ToastIconProps {
  severity?: TypeOptions;
}

interface ToastDataProps {
  message: string;
  errorCode?: string;
}

// Component Icon cho Toast
const ToastIcon = ({ severity }: ToastIconProps) => {
  switch (severity) {
    case "success":
      return <CheckCircle sx={{ color: "success.main" }} />;
    case "info":
      return <Info sx={{ color: "info.main" }} />;
    case "warning":
      return <Warning sx={{ color: "warning.main" }} />;
    case "error":
      return <Error sx={{ color: "error.main" }} />;
    default:
      return <Info sx={{ color: "info.main" }} />;
  }
};

const ToastContent = (props: ToastContentProps<ToastDataProps>) => {
  const severity = props.toastProps.type;
  const { message, errorCode } = props.data || { message: "" };
  const isErrorWithCode = errorCode && message;

  return (
    <Stack direction="row" spacing={2} alignItems="center" width="100%">
      {/* Icon bên trái */}
      <Box sx={{ pt: 0.5, flexShrink: 0 }}>
        <ToastIcon severity={severity} />
      </Box>

      {/* Nội dung chính */}
      <Box sx={{ flex: 1 }}>
        {isErrorWithCode ? (
          <>
            <Typography variant="body1" fontWeight="medium">
              Error {errorCode}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {message}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" fontWeight="medium">
            {message}
          </Typography>
        )}
      </Box>

      {/* Nút đóng (tùy chọn - react-toastify đã có sẵn) */}
      {props.closeToast && (
        <IconButton
          onClick={props.closeToast}
          size="small"
          sx={{
            flexShrink: 0,
            opacity: 0.7,
            "&:hover": {
              opacity: 1,
            },
            transition: "opacity 0.2s",
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
};

export default ToastContent;
