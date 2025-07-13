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
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { Droppable } from "react-beautiful-dnd";
import LessonCard from "../LessonCard";
import { Module } from "@interfaces/dom/course";
import { Controller } from "react-hook-form";
import { useModuleForm } from "@hooks/data/useModuleForm";
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const ModuleHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  cursor: "pointer",
}));

interface ModuleCardProps {
  module: Module;
  index: number;
  handleDeleteModule: (moduleId: string) => void;
  isLast: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  index: moduleIndex,
  handleDeleteModule,
}) => {
  const {
    handleRemoveModule,
    control,
    getValues,
    watch,
    handleSubmit,
    expanded,
    isEditing,
    handleToggleExpand,
    handleToggleEdit,
    isDisable,
    lessons,
    handleRemoveLesson,
    handleAddLesson,
    isCreateLessonPending,
  } = useModuleForm({
    data: module,
    handleDeleteModule,
  });

  return (
    <StyledCard>
      <form onSubmit={handleSubmit}>
        <ModuleHeader onClick={handleToggleExpand}>
          <Box display="flex" alignItems="center">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {module.title}
            </Typography>
          </Box>
          <Box>
            {!isEditing ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleEdit();
                }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <Box onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  size="small"
                  type="submit"
                  disabled={isDisable}
                  sx={{ mr: 1 }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  size="small"
                  disabled={isDisable}
                  onClick={() => handleRemoveModule(module.id as string)}
                >
                  Xóa
                </Button>
              </Box>
            )}
          </Box>
        </ModuleHeader>

        <Collapse in={expanded}>
          <Divider />
          <CardContent sx={{ pb: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Controller
                name={`title`}
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
                    disabled={!isEditing}
                    sx={{
                      mb: 2,
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: (theme) =>
                          theme.palette.text.primary,
                        opacity: 0.9,
                        fontWeight: "medium",
                      },
                      "& .MuiInputLabel-root.Mui-disabled": {
                        color: (theme) => theme.palette.text.secondary,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name={`description`}
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
                    disabled={!isEditing || isDisable}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: (theme) =>
                          theme.palette.text.primary,
                        opacity: 0.9,
                        fontWeight: "medium",
                      },
                      "& .MuiInputLabel-root.Mui-disabled": {
                        color: (theme) => theme.palette.text.secondary,
                      },
                    }}
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
            </Box>
            <Droppable
              droppableId={`${moduleIndex}`}
              type="LESSON"
              direction="vertical"
              isDropDisabled={!isEditing}
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
                      key={`lesson-${lesson.id}-${moduleIndex}-${index}`}
                      lesson={lesson}
                      index={index}
                      moduleId={module.id}
                      handleDeleteLesson={handleRemoveLesson}
                      control={control}
                      moduleIndex={moduleIndex}
                      getValues={getValues}
                      watch={watch}
                      isEditing={isEditing}
                    />
                  ))}
                  {provided.placeholder}
                  {lessons.length === 0 && (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        border: (theme) =>
                          `1px dashed ${theme.palette.divider}`,
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

            {isEditing && (
              <Box display="flex" justifyContent="center" mt={2} mb={1}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddLesson}
                  disabled={isCreateLessonPending}
                >
                  Thêm bài học
                </Button>
              </Box>
            )}
          </CardContent>
        </Collapse>
      </form>
    </StyledCard>
  );
};

// Sử dụng memo để tránh render không cần thiết
export default memo(ModuleCard, (prevProps, nextProps) => {
  // Chỉ render lại khi có sự thay đổi thực sự
  const prevLessons = prevProps.module;
  const nextLessons = nextProps.module;

  const lessonsEqual =
    JSON.stringify(prevLessons) === JSON.stringify(nextLessons);

  const moduleEqual =
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.module) === JSON.stringify(nextProps.module);

  // Trả về true nếu không có thay đổi (không cần render lại)
  return lessonsEqual && moduleEqual;
});
