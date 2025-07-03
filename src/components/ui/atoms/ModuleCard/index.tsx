// src/sections/course/components/ModuleCard.tsx
import React, { memo } from "react";
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
import { LessonType, Module } from "@interfaces/dom/course";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";
import { useCreateLesson, useDeleteLesson } from "@services/lesson";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

interface ModuleCardProps {
  module: Module;
  index: number;
  handleDeleteModule: (index: number, moduleId: string) => void;
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
  control,
  getValues,
  watch,
}) => {
  const { append: appendLesson, remove: removeLesson } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`,
  });

  const watchedLessons = watch(`modules.${moduleIndex}.lessons`) || [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync: createLesson, isPending: isCreatePending } =
    useCreateLesson();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync: deleteLesson, isPending: isDeletePending } =
    useDeleteLesson();

  const handleAddLesson = async () => {
    const param = {
      module_id: module.id,
      title: `Bài ${watchedLessons.length + 1}: Tiêu đề bài học`,
      type: "article" as LessonType,
      duration: 15,
      content: `Nội dung bài học ${watchedLessons.length + 1}`,
      index: watchedLessons.length,
    };
    await createLesson(param, {
      onSuccess: (new_lesson) => {
        appendLesson({
          id: new_lesson.id,
          ...param,
        });
      },
    });
  };

  const handleRemoveLesson = async (lessonIndex: number, lessonId: string) => {
    await deleteLesson(lessonId, {
      onSuccess: () => {
        removeLesson(lessonIndex);
      },
    });
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
            Bài học ({watchedLessons.length})
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
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
              onClick={() =>
                handleDeleteModule(moduleIndex, module.id as string)
              }
            >
              Xóa module
            </Button>
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
              {/* Sử dụng watchedLessons thay vì lessons từ useFieldArray */}
              {watchedLessons.map((lesson, index) => (
                <LessonCard
                  key={`lesson-${moduleIndex}-${index}-${lesson.id || index}`}
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
              {watchedLessons.length === 0 && (
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

// Sử dụng memo để tránh render không cần thiết
export default memo(ModuleCard, (prevProps, nextProps) => {
  // Chỉ render lại khi có sự thay đổi thực sự
  const prevLessons = prevProps.watch(`modules.${prevProps.index}.lessons`);
  const nextLessons = nextProps.watch(`modules.${nextProps.index}.lessons`);

  const lessonsEqual =
    JSON.stringify(prevLessons) === JSON.stringify(nextLessons);

  const moduleEqual =
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.module) === JSON.stringify(nextProps.module);

  // Trả về true nếu không có thay đổi (không cần render lại)
  return lessonsEqual && moduleEqual;
});
