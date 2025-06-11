// src/sections/course/components/UploadBox.tsx
import React from "react";
import { Box, Typography, Button, styled, alpha } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

const StyledUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.main,
  },
}));

interface UploadBoxProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  accept: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  id,
  title,
  description,
  icon,
  file,
  onChange,
  onRemove,
  accept,
}) => {
  return (
    <StyledUploadBox onClick={() => document.getElementById(id)?.click()}>
      {file ? (
        <Box>
          <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {file.name}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Thay đổi
          </Button>
        </Box>
      ) : (
        <Box>
          {icon}
          <Typography variant="body1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 1 }}
          >
            Chọn file
          </Button>
        </Box>
      )}
      <input id={id} type="file" accept={accept} hidden onChange={onChange} />
    </StyledUploadBox>
  );
};

export default UploadBox;
