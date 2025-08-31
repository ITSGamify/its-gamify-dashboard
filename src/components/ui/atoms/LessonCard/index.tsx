// src/sections/course/components/LessonCard.tsx
import React, { useState, useEffect, memo, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import {
  Lesson,
  LessonType,
  Module,
  Practice,
  QuizQuestion,
} from "@interfaces/dom/course";
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import VideoLessonContent from "../VideoLessonContent";
import QuizLessonContent from "../QuizLessonContent";
import { StyledTableCell } from "../PreviewModal";
import ArticleLessonContent from "../ArticleLessonContent";
import { PRACTICE_REVIEW_HEAD, QESTION_REVIEW_HEAD } from "@constants/preview";
import PracticeLessonContent from "../PracticeLessonContent";
import PreviewModal from "../PreviewModal";

// eslint-disable-next-line react-refresh/only-export-components
export const textFieldStyles = {
  "& .MuiInputBase-input.Mui-disabled": {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WebkitTextFillColor: (theme: { palette: { text: { primary: any } } }) =>
      theme.palette.text.primary,
    opacity: 0.9,
    fontWeight: "medium",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    color: (theme: { palette: { text: { secondary: any } } }) =>
      theme.palette.text.secondary,
  },
};

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
}));

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  moduleIndex: number;
  moduleId: string;
  handleDeleteLesson: (index: number, lessonId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Module, any, Module>;
  getValues: UseFormGetValues<Module>;
  watch: UseFormWatch<Module>;
  isEditing?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  index,
  moduleIndex,
  handleDeleteLesson,
  control,
  getValues,
  watch,
  isEditing = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  const [currentType, setCurrentType] = useState<LessonType>(
    getValues(`lessons.${index}.type`) as LessonType
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const type = getValues(`lessons.${index}.type`) as LessonType;
    if (type !== currentType) {
      setCurrentType(type);
    }
  }, [getValues, moduleIndex, index, currentType]);

  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion[]>([]);
  const [tags, setTags] = useState<Practice[]>([]);

  useEffect(() => {
    setPreviewQuestion(getValues(`lessons.${index}.questions`) || []);
    setTags(getValues(`lessons.${index}.practices`) || []);
  }, [
    getValues,
    index,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch(`lessons.${index}.questions`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch(`lessons.${index}.practices`),
  ]);

  const getPreviewData = useMemo(() => {
    if (currentType === "quiz") {
      return previewQuestion.map((row: QuizQuestion, idx) => {
        return [
          <StyledTableCell>{idx + 1}</StyledTableCell>,
          <StyledTableCell>{row.content}</StyledTableCell>,
          <StyledTableCell>{row.answer_a}</StyledTableCell>,
          <StyledTableCell>{row.answer_b}</StyledTableCell>,
          <StyledTableCell>{row.answer_c}</StyledTableCell>,
          <StyledTableCell>{row.answer_d}</StyledTableCell>,
          <StyledTableCell>{row.correct_answer}</StyledTableCell>,
          <StyledTableCell>{row.description}</StyledTableCell>,
        ];
      });
    }

    return tags.map((row: Practice, idx) => {
      return [
        <StyledTableCell>{idx + 1}</StyledTableCell>,
        <StyledTableCell>{row.question}</StyledTableCell>,
        <StyledTableCell>{row.answer}</StyledTableCell>,
      ];
    });
  }, [currentType, previewQuestion, tags]);

  const handleTypeChange = (type: LessonType) => {
    setCurrentType(type);
  };

  const handlePreviewClick = () => {
    setPreviewOpen(true);
  };

  const isPreview = currentType === "quiz" || currentType === "practice";
  return (
    <Draggable draggableId={lesson.id || `lesson-${index}`} index={index}>
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
              {/* Drag handle */}
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
                    <Controller
                      name={`lessons.${index}.title`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          fullWidth
                          size="small"
                          label="Tiêu đề bài học"
                          value={field.value}
                          onChange={field.onChange}
                          error={!!error}
                          helperText={error?.message}
                          disabled={!isEditing}
                          sx={textFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* Lesson type */}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Controller
                      name={`lessons.${index}.type`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Loại bài học"
                          value={field.value}
                          disabled={!isEditing}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTypeChange(e.target.value as LessonType);
                          }}
                          error={!!error}
                          sx={textFieldStyles}
                          helperText={error?.message}
                        >
                          <MenuItem value="video">Video</MenuItem>
                          <MenuItem value="article">Bài viết</MenuItem>
                          <MenuItem value="quiz">Bài kiểm tra</MenuItem>
                          <MenuItem value="practice">Ôn tập</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Lesson duration */}
                  <Grid size={{ xs: 6, md: isPreview ? 2 : 3 }}>
                    <Controller
                      name={`lessons.${index}.duration`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          fullWidth
                          size="small"
                          label="Thời lượng (phút)"
                          type="number"
                          value={field.value}
                          onChange={field.onChange}
                          InputProps={{
                            inputProps: { min: 0 },
                          }}
                          disabled={!isEditing || currentType === "video"}
                          error={!!error}
                          helperText={error?.message}
                          sx={textFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* Action buttons */}
                  <Grid
                    size={{
                      xs: 12,
                      md: isPreview ? 2 : 1,
                    }}
                  >
                    <Box display="flex" justifyContent="flex-end">
                      {isPreview && (
                        <Tooltip title="Xem trước">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handlePreviewClick}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {isEditing ? (
                        <Tooltip title="Xóa bài học">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteLesson(index, lesson.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <IconButton size="small" color="error" disabled={true}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>

                  {/* Nội dung theo loại bài học */}
                  {currentType === "video" && (
                    <VideoLessonContent
                      moduleIndex={moduleIndex}
                      lessonIndex={index}
                      control={control}
                      isEditing={isEditing}
                    />
                  )}

                  {currentType === "quiz" && (
                    <QuizLessonContent
                      moduleIndex={moduleIndex}
                      lessonIndex={index}
                      control={control}
                      lesson={lesson}
                      isEditing={isEditing}
                    />
                  )}

                  {currentType === "practice" && (
                    <PracticeLessonContent
                      moduleIndex={moduleIndex}
                      lessonIndex={index}
                      control={control}
                      lesson={lesson}
                      isEditing={isEditing}
                    />
                  )}

                  {currentType === "article" && (
                    <ArticleLessonContent
                      moduleIndex={moduleIndex}
                      lessonIndex={index}
                      control={control}
                      lesson={lesson}
                      isEditing={isEditing}
                    />
                  )}
                  {/* Nội dung chung cho mọi loại bài học */}
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name={`lessons.${index}.content`}
                      control={control}
                      rules={{ required: currentType !== "quiz" }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={2}
                          label="Nội dung bài học"
                          placeholder={
                            currentType === "video"
                              ? "Mô tả nội dung video"
                              : currentType === "article"
                              ? "Nội dung bài viết"
                              : "Mô tả bài kiểm tra"
                          }
                          value={field.value || ""}
                          onChange={field.onChange}
                          error={!!error}
                          helperText={error?.message}
                          disabled={!isEditing}
                          sx={textFieldStyles}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>

          {/* Modal xem trước bài kiểm tra */}
          {isPreview && (
            <PreviewModal
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              data={getPreviewData}
              headCells={
                currentType === "quiz"
                  ? QESTION_REVIEW_HEAD
                  : PRACTICE_REVIEW_HEAD
              }
            />
          )}
        </StyledCard>
      )}
    </Draggable>
  );
};

export default memo(LessonCard, (prevProps, nextProps) => {
  const prevType = prevProps.watch(`lessons.${prevProps.index}.type`);
  const nextType = nextProps.watch(`lessons.${nextProps.index}.type`);

  const positionEqual =
    prevProps.moduleIndex === nextProps.moduleIndex &&
    prevProps.index === nextProps.index;

  const lessonEqual =
    JSON.stringify(prevProps.lesson) === JSON.stringify(nextProps.lesson);

  const typeEqual = prevType === nextType;
  const quizEqual =
    prevProps.lesson.questions ===
    nextProps.getValues(`lessons.${nextProps.index}.questions`);

  const practiceEqual =
    prevProps.lesson.practices ===
    nextProps.getValues(`lessons.${nextProps.index}.practices`);

  const editingEqual = prevProps.isEditing === nextProps.isEditing;

  // Trả về true nếu không có thay đổi (không cần render lại)
  return (
    positionEqual &&
    lessonEqual &&
    typeEqual &&
    editingEqual &&
    quizEqual &&
    practiceEqual
  );
});
