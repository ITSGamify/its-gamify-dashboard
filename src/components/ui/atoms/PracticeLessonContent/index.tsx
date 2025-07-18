// src/sections/course/components/lesson-types/QuizLessonContent.tsx
import React, { useState } from "react";
import { Box, Grid, Button, Typography, Alert } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";
import * as XLSX from "xlsx";
import { Lesson, Module, Practice } from "@interfaces/dom/course";

interface PracticeLessonContentProps {
  moduleIndex: number;
  lessonIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Module, any, Module>;
  lesson: Lesson;
  isEditing?: boolean;
}

const PracticeLessonContent: React.FC<PracticeLessonContentProps> = ({
  moduleIndex,
  lessonIndex,
  control,
  lesson,
  isEditing = false,
}) => {
  const [tags, setTags] = useState<Practice[]>(lesson.practices || []);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (quiz: Practice[]) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<Practice>(worksheet);

        // **Convert tất cả fields thành string**
        const normalizedData = jsonData.map((row: Practice) => ({
          question: String(row.question || ""),
          answer: String(row.answer || ""),
        }));

        // Validate the data format
        const isValid = normalizedData.every(
          (row: Practice) =>
            "question" in row &&
            "answer" in row &&
            row.question.trim() !== "" &&
            row.answer.trim() !== ""
        );

        if (!isValid) {
          setFileError(
            "File Excel không đúng định dạng. Vui lòng kiểm tra lại."
          );
          return;
        }
        setTags(normalizedData);
        onChange(normalizedData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setFileError(
          "Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng."
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={{ mb: 1 }}>
        <Controller
          name={`lessons.${lessonIndex}.practices`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Box>
              <input
                accept=".xlsx,.xls"
                id={`quiz-file-upload-${moduleIndex}-${lessonIndex}`}
                type="file"
                hidden
                disabled={!isEditing}
                onChange={(e) => {
                  handleFileUpload(e, field.onChange);
                }}
              />
              <Box display="flex" alignItems="center">
                <label
                  htmlFor={`quiz-file-upload-${moduleIndex}-${lessonIndex}`}
                >
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    size="small"
                    disabled={!isEditing}
                  >
                    Tải lên file Excel
                  </Button>
                </label>
                {tags.length > 0 && (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {`Tổng số: ${tags.length}`}
                  </Typography>
                )}
              </Box>
              {fileError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {fileError}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error.message}
                </Alert>
              )}
            </Box>
          )}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Định dạng file: Excel (.xlsx, .xls)
      </Typography>
    </Grid>
  );
};

export default PracticeLessonContent;
