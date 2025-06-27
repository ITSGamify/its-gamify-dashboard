// src/sections/course/components/ModuleCard.tsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  styled,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Droppable } from "react-beautiful-dnd";
import LessonCard from "../LessonCard";
import { Module } from "@interfaces/dom/course";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

interface ModuleCardProps {
  module: Module;
  index: number;
  handleDeleteModule: (index: number) => void;
  isLast: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CourseContentForm, any, CourseContentForm>;
  getValues: UseFormGetValues<CourseContentForm>;
  watch: UseFormWatch<CourseContentForm>;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  index: moduleIndex,
  handleDeleteModule,
  isLast,
  control,
  getValues,
  watch,
}) => {
  const {
    fields: lessons,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`,
  });

  const handleAddLesson = () => {
    appendLesson({
      ...{
        id: `lession-2`,
        title: `Bài ${lessons.length + 1}: Cài đặt môi trường`,
        type: "article",
        duration: 15,
        content: "Hướng dẫn cài đặt môi trường làm việc",
      },
    });
  };

  const handleRemoveLesson = (lessonIndex: number) => {
    removeLesson(lessonIndex);
  };

  return (
    <StyledCard>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Controller
            name={`modules.${moduleIndex}.title`}
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Tiêu đề module"
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name={`modules.${moduleIndex}.description`}
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Mô tả module"
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message}
                variant="outlined"
                multiline
                rows={2}
              />
            )}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle2">
            Bài học ({lessons.length})
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleAddLesson}
              sx={{ mr: 1 }}
            >
              Thêm bài học
            </Button>
            {!isLast && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                size="small"
                onClick={() => handleDeleteModule(moduleIndex)}
              >
                Xóa module
              </Button>
            )}
          </Box>
        </Box>
        <Droppable
          droppableId={`${moduleIndex}`}
          type="LESSON"
          direction="vertical"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={true}
        >
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                mb: 2,
                minHeight: "50px",
                backgroundColor: snapshot.isDraggingOver
                  ? "action.hover"
                  : "transparent",
                borderRadius: 1,
                transition: "background-color 0.2s ease",
              }}
            >
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={index}
                  lesson={lesson}
                  index={index}
                  moduleId={module.id}
                  handleDeleteLesson={handleRemoveLesson}
                  control={control}
                  moduleIndex={moduleIndex}
                  getValues={getValues}
                  watch={watch}
                />
              ))}
              {provided.placeholder}
              {lessons.length === 0 && (
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center",
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Chưa có bài học nào. Nhấn "Thêm bài học" để bắt đầu.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Droppable>
      </CardContent>
    </StyledCard>
  );
};

export default ModuleCard;
