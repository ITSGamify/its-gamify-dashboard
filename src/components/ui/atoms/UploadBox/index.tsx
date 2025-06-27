// src/sections/course/components/UploadBox.tsx
import React, { useCallback } from "react";
import { Box, Typography, Button, styled, alpha } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useFileUpload } from "@services/fileUpload";

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

const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "200px",
  objectFit: "contain",
  // marginBottom: 8,
  margin: "auto auto",
  borderRadius: 4,
});

const PreviewVideo = styled("video")({
  maxWidth: "100%",
  maxHeight: "200px",
  objectFit: "contain",
  // marginBottom: 8,
  margin: "auto auto",
  borderRadius: 4,
});

const PreviewContainer = styled(Box)({
  width: "100%",
  height: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
});

interface UploadBoxProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onChange: (id: string) => void;
  accept: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  id,
  title,
  description,
  icon,
  onChange,
  accept,
}) => {
  const isImage = accept.includes("image");
  const isVideo = accept.includes("video");
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(
    undefined
  );

  const upload = useFileUpload();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const previewUrl = URL.createObjectURL(files[0]);
        setPreviewUrl(previewUrl);
        const result = await upload.mutateAsync({ file: files[0] });
        onChange(result.id);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const renderPreview = useCallback(() => {
    if (previewUrl) {
      if (isImage) {
        return <PreviewImage src={previewUrl} alt="Preview" />;
      } else if (isVideo) {
        return <PreviewVideo src={previewUrl} controls />;
      }
    }
    return null;
  }, [isImage, isVideo, previewUrl]);

  return (
    <StyledUploadBox onClick={() => document.getElementById(id)?.click()}>
      {previewUrl ? (
        <PreviewContainer>{renderPreview()}</PreviewContainer>
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
      <input
        id={id}
        type="file"
        accept={accept}
        hidden
        onChange={handleFileChange}
      />
    </StyledUploadBox>
  );
};
export default UploadBox;
