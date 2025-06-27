// src/sections/course/components/LessonCard.tsx
import React, { useEffect, useState } from "react";
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
  Typography,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  useTheme,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import { Lesson, QuizQuestion } from "@interfaces/dom/course";
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";
import * as XLSX from "xlsx";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%", // Tăng chiều rộng lên 95% của màn hình
  maxWidth: 1200, // Tăng kích thước tối đa lên 1200px
  maxHeight: "90vh",
  overflow: "auto",
  // padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflow: "auto", // Chỉ body có scroll
  flexGrow: 1,
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "flex-end",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  "&.question-cell": {
    minWidth: 250,
    maxWidth: 350,
  },
  "&.answer-cell": {
    minWidth: 120,
    maxWidth: 200,
  },
  "&.correct-cell": {
    width: 100,
  },
  "&.description-cell": {
    minWidth: 200,
  },
}));

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  moduleIndex: number;
  moduleId: string | undefined;
  handleDeleteLesson: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CourseContentForm, any, CourseContentForm>;
  getValues: UseFormGetValues<CourseContentForm>;
  watch: UseFormWatch<CourseContentForm>;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  index,
  moduleIndex,
  handleDeleteLesson,
  control,
  getValues,
  watch,
}) => {
  const theme = useTheme();

  const lessonType = watch(`modules.${moduleIndex}.lessons.${index}.type`);
  const [currentType, setCurrentType] = useState(
    getValues(`modules.${moduleIndex}.lessons.${index}.type`)
  );
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (lessonType !== currentType) {
      setCurrentType(lessonType);
    }
  }, [lessonType, currentType]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (quiz: QuizQuestion[]) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
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
            "index" in row &&
            "question" in row &&
            "answer_A" in row &&
            "answer_B" in row &&
            "answer_C" in row &&
            "answer_D" in row &&
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

  const handlePreviewClick = () => {
    if (quizQuestions.length > 0) {
      setPreviewOpen(true);
    } else {
      setFileError(
        "Chưa có dữ liệu câu hỏi. Vui lòng tải lên file Excel trước."
      );
    }
  };

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
                    <Controller
                      name={`modules.${moduleIndex}.lessons.${index}.title`}
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
                        />
                      )}
                    />
                  </Grid>

                  {/* Lesson type */}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Controller
                      name={`modules.${moduleIndex}.lessons.${index}.type`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Loại bài học"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value === "quiz") {
                              setQuizQuestions([]);
                              setFileName(null);
                            }
                          }}
                          error={!!error}
                          helperText={error?.message}
                        >
                          <MenuItem value="video">Video</MenuItem>
                          <MenuItem value="article">Bài viết</MenuItem>
                          <MenuItem value="quiz">Bài kiểm tra</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Lesson duration */}
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Controller
                      name={`modules.${moduleIndex}.lessons.${index}.duration`}
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
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Action buttons */}
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Xem trước">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={
                            currentType === "quiz"
                              ? handlePreviewClick
                              : undefined
                          }
                        >
                          {currentType === "quiz" ? (
                            <VisibilityIcon />
                          ) : (
                            <PlayArrowIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa bài học">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteLesson(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>

                  {/* Video URL - only shown for video type */}
                  {currentType === "video" && (
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`modules.${moduleIndex}.lessons.${index}.video_url`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            label="URL video"
                            placeholder="Nhập URL video hoặc tải lên"
                            value={field.value || ""}
                            onChange={field.onChange}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button size="small">Tải lên</Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  )}

                  {/* Quiz file upload - only shown for quiz type */}
                  {currentType === "quiz" && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 1 }}>
                        <Controller
                          name={`modules.${moduleIndex}.lessons.${index}.quiz`}
                          control={control}
                          render={({ field }) => (
                            <Box>
                              <input
                                accept=".xlsx,.xls"
                                id={`quiz-file-upload-${moduleIndex}-${index}`}
                                type="file"
                                hidden
                                onChange={(e) => {
                                  handleFileUpload(e, field.onChange);
                                }}
                              />
                              <Box display="flex" alignItems="center">
                                <label
                                  htmlFor={`quiz-file-upload-${moduleIndex}-${index}`}
                                >
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadIcon />}
                                    size="small"
                                  >
                                    Tải lên file Excel
                                  </Button>
                                </label>
                                {fileName && (
                                  <Typography variant="body2" sx={{ ml: 2 }}>
                                    {fileName}
                                  </Typography>
                                )}
                                {quizQuestions.length > 0 && (
                                  <Button
                                    size="small"
                                    sx={{ ml: 2 }}
                                    onClick={handlePreviewClick}
                                    startIcon={<VisibilityIcon />}
                                  >
                                    Xem trước ({quizQuestions.length} câu hỏi)
                                  </Button>
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
                  )}

                  {/* Lesson content */}
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name={`modules.${moduleIndex}.lessons.${index}.content`}
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
                          disabled={currentType === "quiz"}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>

          {/* Modal for quiz preview */}
          <Modal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            aria-labelledby="quiz-preview-modal"
          >
            <ModalContent>
              {/* Modal Header */}
              <ModalHeader>
                <Box>
                  <Typography variant="h6" component="h2">
                    Xem trước bài kiểm tra
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fileName && `File: ${fileName}`}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setPreviewOpen(false)}
                  size="small"
                  sx={{
                    color: theme.palette.grey[500],
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </ModalHeader>

              {/* Modal Body */}
              <ModalBody>
                <Box sx={{ mb: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Tổng số câu hỏi: <strong>{quizQuestions.length}</strong>
                  </Alert>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" sx={{ width: 60 }}>
                          STT
                        </StyledTableCell>
                        <StyledTableCell className="question-cell">
                          Câu hỏi
                        </StyledTableCell>
                        <StyledTableCell className="answer-cell">
                          Đáp án A
                        </StyledTableCell>
                        <StyledTableCell className="answer-cell">
                          Đáp án B
                        </StyledTableCell>
                        <StyledTableCell className="answer-cell">
                          Đáp án C
                        </StyledTableCell>
                        <StyledTableCell className="answer-cell">
                          Đáp án D
                        </StyledTableCell>
                        <StyledTableCell
                          className="correct-cell"
                          align="center"
                        >
                          Đáp án đúng
                        </StyledTableCell>
                        <StyledTableCell className="description-cell">
                          Giải thích
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quizQuestions.map((question, idx) => (
                        <TableRow key={idx} hover>
                          <StyledTableCell align="center">
                            {question.index}
                          </StyledTableCell>
                          <StyledTableCell>{question.question}</StyledTableCell>
                          <StyledTableCell>{question.answer_A}</StyledTableCell>
                          <StyledTableCell>{question.answer_B}</StyledTableCell>
                          <StyledTableCell>{question.answer_C}</StyledTableCell>
                          <StyledTableCell>{question.answer_D}</StyledTableCell>
                          <StyledTableCell
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              color: theme.palette.primary.main,
                            }}
                          >
                            {question.correct_answer}
                          </StyledTableCell>
                          <StyledTableCell>
                            {question.description || "-"}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ModalBody>

              {/* Modal Footer */}
              <ModalFooter>
                <Button
                  variant="contained"
                  onClick={() => setPreviewOpen(false)}
                >
                  Đóng
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </StyledCard>
      )}
    </Draggable>
  );
};

export default LessonCard;
