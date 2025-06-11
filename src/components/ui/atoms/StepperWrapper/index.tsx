// src/components/common/StepperWrapper.tsx
import { Box, styled } from "@mui/material";

export const StepperWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  "& .MuiStepLabel-root .Mui-completed": {
    color: theme.palette.success.main,
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: theme.palette.primary.main,
  },
}));
