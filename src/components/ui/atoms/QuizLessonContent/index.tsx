// src/sections/course/components/lesson-types/QuizLessonContent.tsx
import React, { useState } from "react";
import { Box, Grid, Button, Typography, Alert } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";
import * as XLSX from "xlsx";
import { Lesson, QuizQuestion } from "@interfaces/dom/course";

interface QuizLessonContentProps {
  moduleIndex: number;
  lessonIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CourseContentForm, any, CourseContentForm>;
  lesson: Lesson;
  isEditing?: boolean;
}

const QuizLessonContent: React.FC<QuizLessonContentProps> = ({
  moduleIndex,
  lessonIndex,
  control,
  lesson,
  isEditing = false,
}) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    lesson.questions || []
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (quiz: QuizQuestion[]) => void
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
        const jsonData = XLSX.utils.sheet_to_json<QuizQuestion>(worksheet);

        // Validate the data format
        const isValid = jsonData.every(
          (row: QuizQuestion) =>
            "content" in row &&
            "answer_a" in row &&
            "answer_b" in row &&
            "answer_c" in row &&
            "answer_d" in row &&
            "correct_answer" in row
        );

        if (!isValid) {
          setFileError(
            "File Excel không đúng định dạng. Vui lòng kiểm tra lại."
          );
          return;
        }

        setQuizQuestions(jsonData);
        onChange(jsonData);
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
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.questions`}
          control={control}
          render={({ field }) => (
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
                {quizQuestions.length > 0 && (
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {`Tổng số câu hỏi: ${quizQuestions.length}`}
                  </Typography>
                )}
              </Box>
              {fileError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {fileError}
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

export default QuizLessonContent;
