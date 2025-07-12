// src/sections/course/components/lesson-types/ArticleLessonContent.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  styled,
} from "@mui/material";
import { Upload as UploadIcon, Image as ImageIcon } from "@mui/icons-material";
import { Lesson, Module } from "@interfaces/dom/course";
import { useFileUpload } from "@services/fileUpload";
import { Control, useFieldArray } from "react-hook-form";
import { StorageFile } from "@interfaces/api/file";

const FilePreview = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const FileChip = styled(Chip)(() => ({
  maxWidth: "100%",
  "& .MuiChip-label": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

interface ArticleLessonContentProps {
  moduleIndex: number;
  lessonIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Module, any, Module>;
  lesson: Lesson;
  isEditing?: boolean;
}

const ArticleLessonContent = ({
  moduleIndex,
  lessonIndex,
  control,
  isEditing = false,
}: ArticleLessonContentProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `lessons.${lessonIndex}.image_files`,
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutateAsync: uploadFile, isPending: isLoading } = useFileUpload();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setUploadError(null);

    try {
      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        setUploadError("Chỉ chấp nhận file hình ảnh");
        return;
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Upload file
      const result = await uploadFile({ file });

      // Thêm file vào danh sách
      append(result);
    } catch (error) {
      console.error("Lỗi khi tải lên file:", error);
      setUploadError("Đã xảy ra lỗi khi tải lên file. Vui lòng thử lại.");
    }

    // Reset input để có thể chọn lại file đó nếu muốn
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    remove(index);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={{ mb: 2, mt: 1 }}>
        <input
          accept="image/*"
          id={`article-image-upload-${moduleIndex}-${lessonIndex}`}
          type="file"
          hidden
          disabled={!isEditing || isLoading}
          onChange={handleFileUpload}
        />

        <Box display="flex" alignItems="center">
          <label htmlFor={`article-image-upload-${moduleIndex}-${lessonIndex}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={
                isLoading ? <CircularProgress size={16} /> : <UploadIcon />
              }
              size="small"
              disabled={!isEditing || isLoading}
            >
              {isLoading ? "Đang tải lên..." : "Tải lên hình ảnh"}
            </Button>
          </label>

          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Định dạng: JPG, PNG, GIF (tối đa 5MB)
          </Typography>
        </Box>

        {uploadError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {uploadError}
          </Alert>
        )}

        {/* Hiển thị danh sách các file đã tải lên */}
        {fields.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Hình ảnh đã tải lên:
            </Typography>

            <FilePreview>
              {fields.map((file: StorageFile, index) => (
                <FileChip
                  key={file.id}
                  icon={<ImageIcon />}
                  label={file.file_name}
                  onDelete={
                    isEditing ? () => handleRemoveFile(index) : undefined
                  }
                  variant="outlined"
                  clickable
                  onClick={() => window.open(file.url, "_blank")}
                />
              ))}
            </FilePreview>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default ArticleLessonContent;
