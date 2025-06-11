// src/sections/course/components/LessonCard.tsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Tooltip,
  InputAdornment,
  Button,
  styled,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import { Lesson } from "@interfaces/dom/course";
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
}));

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  moduleId: string;
  handleLessonChange: (
    moduleId: string,
    lessonId: string,
    field: string,
    value: unknown
  ) => void;
  handleDeleteLesson: (moduleId: string, lessonId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  index,
  moduleId,
  handleLessonChange,
  handleDeleteLesson,
}) => {
  return (
    <Draggable draggableId={lesson.id} index={index}>
      {(provided, snapshot) => (
        <StyledCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            backgroundColor: snapshot.isDragging
              ? "action.selected"
              : "background.paper",
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { paddingBottom: 2 } }}>
            <Box display="flex" alignItems="flex-start">
              {/* Drag handle outside of Grid */}
              <Box
                {...provided.dragHandleProps}
                sx={{
                  mr: 2,
                  cursor: "grab",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <DragIndicatorIcon color="action" />
              </Box>
              {/* Main content area */}
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {/* Lesson title */}
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tiêu đề bài học"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(
                          moduleId,
                          lesson.id,
                          "title",
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  {/* Lesson type */}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Loại bài học"
                      value={lesson.type}
                      onChange={(e) =>
                        handleLessonChange(
                          moduleId,
                          lesson.id,
                          "type",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="article">Bài viết</MenuItem>
                      <MenuItem value="quiz">Bài kiểm tra</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Lesson duration */}
                  <Grid size={{ xs: 6, md: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Thời lượng (phút)"
                      type="number"
                      value={lesson.duration}
                      onChange={(e) =>
                        handleLessonChange(
                          moduleId,
                          lesson.id,
                          "duration",
                          parseInt(e.target.value) || 0
                        )
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                    />
                  </Grid>

                  {/* Action buttons */}
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Xem trước">
                        <IconButton size="small" color="primary">
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa bài học">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteLesson(moduleId, lesson.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  {/* Video URL - only shown for video type */}
                  {lesson.type === "video" && (
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="URL video"
                        placeholder="Nhập URL video hoặc tải lên"
                        value={lesson.videoUrl || ""}
                        onChange={(e) =>
                          handleLessonChange(
                            moduleId,
                            lesson.id,
                            "videoUrl",
                            e.target.value
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button size="small">Tải lên</Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  )}

                  {/* Lesson content */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      label="Nội dung bài học"
                      placeholder={
                        lesson.type === "video"
                          ? "Mô tả nội dung video"
                          : lesson.type === "article"
                          ? "Nội dung bài viết"
                          : "Nội dung bài kiểm tra"
                      }
                      value={lesson.content}
                      onChange={(e) =>
                        handleLessonChange(
                          moduleId,
                          lesson.id,
                          "content",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      )}
    </Draggable>
  );
};

export default LessonCard;
