import React, {
  useState,
  useMemo,
  useRef,
  SetStateAction,
  Dispatch,
} from "react";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuizQuestion } from "@interfaces/dom/course";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { usePreviewChallengeModal } from "@hooks/data/usePreviewChallengeModal";

interface PreviewChallengeTableProps {
  courseId: string;
  onToggleHidden?: (question: ExtendedQuizQuestion) => void;
  isPreview: boolean;
  newQuestions: QuizQuestion[];
  setNewQuestions?: Dispatch<SetStateAction<QuizQuestion[]>>;
  updatedQuestions: QuizQuestion[];
  setUpdatedQuestions?: Dispatch<SetStateAction<QuizQuestion[]>>;
}

// Type extension để thêm flag isNew mà không modify interface gốc
export type ExtendedQuizQuestion = QuizQuestion & { isNew: boolean };

const PreviewChallengeTable: React.FC<PreviewChallengeTableProps> = ({
  courseId,
  onToggleHidden,
  isPreview,
  newQuestions,
  setNewQuestions,
  updatedQuestions,
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    questions,
    activePage,
    rowsPerPage,
    page_index,
    page_size,
    total_items_count,
    handelLimitChange,
    handlePageChange,
    handleSearchChange,
    searchInput,
  } = usePreviewChallengeModal({ courseId });

  // Handle import Excel
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!setNewQuestions) return;

    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any[][];

      // Parse theo mẫu (bỏ header và hàng trống)
      const importedQuestions: QuizQuestion[] = parsedData
        .slice(1) // Bỏ header
        .filter((row) => row.some((cell) => cell)) // Bỏ hàng trống
        .map((row) => ({
          id: uuidv4(), // Id tạm
          content: row[1] || "",
          answer_a: row[2] || "",
          answer_b: row[3] || "",
          answer_c: row[4] || "",
          answer_d: row[5] || "",
          correct_answer: row[6] || "",
          description: row[7] || "",
          is_hidden: false,
          course_id: courseId,
        }));

      setNewQuestions((prev) => [...importedQuestions, ...prev]); // Thêm mới ở trên cùng (nếu import nhiều lần)
      setIsImporting(false);

      event.target.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const handleToggleHidden = (question: ExtendedQuizQuestion) => {
    if (!setNewQuestions || !onToggleHidden) return;
    const newHidden = !question.is_hidden;
    if (question.isNew) {
      // Cập nhật local cho câu hỏi mới
      setNewQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, is_hidden: newHidden } : q
        )
      );
    } else {
      onToggleHidden(question);
    }
  };

  const handleDeleteNewQuestion = (questionId: string) => {
    if (!setNewQuestions) return;
    setNewQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const filteredNewQuestions = useMemo(() => {
    return newQuestions
      .map((q) => ({ ...q, isNew: true }))
      .filter(
        (q) =>
          q.content.toLowerCase().includes(searchInput.toLowerCase()) ||
          q.description.toLowerCase().includes(searchInput.toLowerCase())
      );
  }, [newQuestions, searchInput]);

  const filteredPreviewQuestions = useMemo(() => {
    return questions.map((q) => ({ ...q, isNew: false }));
  }, [questions]);

  const renderVisible = (question: ExtendedQuizQuestion) => {
    const updatedQuestion = updatedQuestions.find((q) => q.id === question.id);
    const is_hidden = updatedQuestion
      ? updatedQuestion.is_hidden
      : question.is_hidden;

    return !is_hidden ? <VisibilityIcon /> : <VisibilityOffIcon />;
  };

  return (
    <Grid container spacing={2} direction="column">
      {/* Header với Button và Search */}
      <Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: !isPreview ? 10 : 12 }}>
            <TextField
              label="Tìm kiếm theo nội dung hoặc mô tả"
              variant="outlined"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              fullWidth
            />
          </Grid>
          {!isPreview && (
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                onClick={() => fileInputRef.current?.click()}
                color="primary"
                variant="contained"
                disabled={isImporting}
                startIcon={isImporting ? <CircularProgress size={20} /> : null}
                fullWidth
                sx={{ padding: "27px" }}
              >
                {isImporting ? "Đang import..." : "Thêm câu hỏi"}
              </Button>
            </Grid>
          )}
        </Grid>
        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </Grid>

      {newQuestions.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Câu hỏi mới
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Nội dung</TableCell>
                  <TableCell>Đáp án A</TableCell>
                  <TableCell>Đáp án B</TableCell>
                  <TableCell>Đáp án C</TableCell>
                  <TableCell>Đáp án D</TableCell>
                  <TableCell>Đáp án đúng</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNewQuestions.length > 0 ? (
                  filteredNewQuestions.map((question, index) => (
                    <TableRow key={question.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{question.content}</TableCell>
                      <TableCell>{question.answer_a}</TableCell>
                      <TableCell>{question.answer_b}</TableCell>
                      <TableCell>{question.answer_c}</TableCell>
                      <TableCell>{question.answer_d}</TableCell>
                      <TableCell>{question.correct_answer}</TableCell>
                      <TableCell>{question.description}</TableCell>

                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleToggleHidden(question)}
                          size="small"
                          disabled={isPreview}
                        >
                          {question.is_hidden ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                        {!isPreview && (
                          <IconButton
                            onClick={() => handleDeleteNewQuestion(question.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography>Không có câu hỏi mới phù hợp</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
      {/* Bảng cho Updated/Existing Questions */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Câu hỏi hiện có
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Đáp án A</TableCell>
                <TableCell>Đáp án B</TableCell>
                <TableCell>Đáp án C</TableCell>
                <TableCell>Đáp án D</TableCell>
                <TableCell>Đáp án đúng</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPreviewQuestions.length > 0 ? (
                filteredPreviewQuestions.map((question, index) => (
                  <TableRow key={question.id || index}>
                    <TableCell>
                      {page_index * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{question.content}</TableCell>
                    <TableCell>{question.answer_a}</TableCell>
                    <TableCell>{question.answer_b}</TableCell>
                    <TableCell>{question.answer_c}</TableCell>
                    <TableCell>{question.answer_d}</TableCell>
                    <TableCell>{question.correct_answer}</TableCell>
                    <TableCell>{question.description}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        disabled={isPreview}
                        onClick={() => {
                          const updatedQuestion = updatedQuestions.find(
                            (q) => q.id === question.id
                          );
                          if (updatedQuestion) {
                            // Giữ nguyên giá trị isNew từ câu hỏi gốc
                            handleToggleHidden({
                              ...updatedQuestion,
                              isNew: question.isNew,
                            });
                          } else {
                            handleToggleHidden(question);
                          }
                        }}
                        size="small"
                      >
                        {renderVisible(question)}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography>Không có dữ liệu phù hợp</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Pagination cho bảng hiện có */}
      <Grid size={{ xs: 12 }}>
        <Grid container justifyContent="flex-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total_items_count}
            rowsPerPage={page_size}
            page={activePage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handelLimitChange}
            labelRowsPerPage="Số hàng mỗi trang"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PreviewChallengeTable;
