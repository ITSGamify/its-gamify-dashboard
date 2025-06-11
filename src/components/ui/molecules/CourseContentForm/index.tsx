// src/sections/course/create/CourseContentForm.tsx
import React from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import ModuleCard from "@components/ui/atoms/ModuleCard";
import { Module } from "@interfaces/dom/course";

interface CourseContentFormProps {
  modules: Module[];
  handleModuleChange: (moduleId: string, field: string, value: string) => void;
  handleAddModule: () => void;
  handleDeleteModule: (moduleId: string) => void;
  handleAddLesson: (moduleId: string) => void;
  handleLessonChange: (
    moduleId: string,
    lessonId: string,
    field: string,
    value: unknown
  ) => void;
  handleDeleteLesson: (moduleId: string, lessonId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const CourseContentForm: React.FC<CourseContentFormProps> = ({
  modules,
  handleModuleChange,
  handleAddModule,
  handleDeleteModule,
  handleAddLesson,
  handleLessonChange,
  handleDeleteLesson,
  onDragEnd,
}) => {
  // Xử lý kéo thả với try-catch để bắt lỗi
  const handleDragEnd = (result: DropResult) => {
    try {
      onDragEnd(result);
    } catch (error) {
      console.error("Drag and drop error:", error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <SectionTitle variant="h6" fontWeight={600}>
            Nội dung khóa học
          </SectionTitle>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddModule}
          >
            Thêm module
          </Button>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              handleModuleChange={handleModuleChange}
              handleDeleteModule={handleDeleteModule}
              handleAddLesson={handleAddLesson}
              handleLessonChange={handleLessonChange}
              handleDeleteLesson={handleDeleteLesson}
              isLast={modules.length === 1}
            />
          ))}
        </DragDropContext>

        {modules.length === 0 && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Chưa có module nào
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddModule}
            >
              Thêm module đầu tiên
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default CourseContentForm;
