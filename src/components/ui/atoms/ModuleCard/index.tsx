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

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

interface ModuleCardProps {
  module: Module;
  handleModuleChange: (moduleId: string, field: string, value: string) => void;
  handleDeleteModule: (moduleId: string) => void;
  handleAddLesson: (moduleId: string) => void;
  handleLessonChange: (
    moduleId: string,
    lessonId: string,
    field: string,
    value: unknown
  ) => void;
  handleDeleteLesson: (moduleId: string, lessonId: string) => void;
  isLast: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  handleModuleChange,
  handleDeleteModule,
  handleAddLesson,
  handleLessonChange,
  handleDeleteLesson,
  isLast,
}) => {
  return (
    <StyledCard>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Tiêu đề module"
            value={module.title}
            onChange={(e) =>
              handleModuleChange(module.id, "title", e.target.value)
            }
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mô tả module"
            value={module.description}
            onChange={(e) =>
              handleModuleChange(module.id, "description", e.target.value)
            }
            variant="outlined"
            multiline
            rows={2}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle2">
            Bài học ({module.lessons.length})
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => handleAddLesson(module.id)}
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
                onClick={() => handleDeleteModule(module.id)}
              >
                Xóa module
              </Button>
            )}
          </Box>
        </Box>
        <Droppable
          droppableId={`${module.id}`}
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
              {module.lessons.map((lesson, index) => (
                <LessonCard
                  key={index}
                  lesson={lesson}
                  index={index}
                  moduleId={module.id}
                  handleLessonChange={handleLessonChange}
                  handleDeleteLesson={handleDeleteLesson}
                />
              ))}
              {provided.placeholder}
              {module.lessons.length === 0 && (
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
