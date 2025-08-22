// src/sections/course/components/lesson-types/QuizLessonContent.tsx
import React, { useState } from "react";
import { Box, Grid, Button, Typography, Alert } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { Control, Controller } from "react-hook-form";
import * as XLSX from "xlsx";
import { Lesson, Module, QuizQuestion } from "@interfaces/dom/course";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface QuizLessonContentProps {
  moduleIndex: number;
  lessonIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Module, any, Module>;
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
  const { courseId } = useParams();
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

        // **Convert tất cả fields thành string**
        const normalizedData = jsonData.map((row: QuizQuestion) => ({
          id: uuidv4(),
          content: String(row.content || ""),
          answer_a: String(row.answer_a || ""),
          answer_b: String(row.answer_b || ""),
          answer_c: String(row.answer_c || ""),
          answer_d: String(row.answer_d || ""),
          correct_answer: String(row.correct_answer || ""),
          description: String(row.description || ""),
          course_id: courseId || "",
          is_hidden: false,
        }));

        // Validate the data format
        const isValid = normalizedData.every(
          (row: QuizQuestion) =>
            "content" in row &&
            "answer_a" in row &&
            "answer_b" in row &&
            "answer_c" in row &&
            "answer_d" in row &&
            "correct_answer" in row &&
            row.content.trim() !== "" &&
            row.answer_a.trim() !== "" &&
            row.answer_b.trim() !== "" &&
            row.answer_c.trim() !== "" &&
            row.answer_d.trim() !== "" &&
            row.correct_answer.trim() !== ""
        );

        if (!isValid) {
          setFileError(
            "File Excel không đúng định dạng. Vui lòng kiểm tra lại."
          );
          return;
        }
        setQuizQuestions(normalizedData);
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
          name={`lessons.${lessonIndex}.questions`}
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
              <Box display="flex" alignItems="center" gap={2}>
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
                  <Typography variant="body1">
                    {`Tổng số câu hỏi: ${quizQuestions.length}`}
                  </Typography>
                )}
              </Box>
              <a
                href="/templates/quiz-template.xlsx" // Giả sử file template được lưu trong thư mục public/templates
                download="quiz-template.xlsx"
                style={{ textDecoration: "underline", color: "blueviolet" }}
              >
                Tải template mẫu
              </a>
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

export default QuizLessonContent;
