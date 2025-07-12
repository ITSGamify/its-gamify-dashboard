// src/sections/course/components/modals/QuizPreviewModal.tsx
import React from "react";
import {
  Box,
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
  IconButton,
  Button,
  styled,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { QuizQuestion } from "@interfaces/dom/course";

const ModalContent = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1200,
  maxHeight: "90vh",
  overflow: "auto",
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
  overflow: "auto",
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

interface QuizPreviewModalProps {
  open: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
}

const QuizPreviewModal: React.FC<QuizPreviewModalProps> = ({
  open,
  onClose,
  questions,
}) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="quiz-preview-modal">
      <ModalContent>
        {/* Modal Header */}
        <ModalHeader>
          <Box>
            <Typography variant="h6" component="h2">
              Xem trước bài kiểm tra
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
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
              Tổng số câu hỏi: <strong>{questions?.length}</strong>
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
                  <StyledTableCell className="correct-cell" align="center">
                    Đáp án đúng
                  </StyledTableCell>
                  <StyledTableCell className="description-cell">
                    Giải thích
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question, idx) => (
                  <TableRow key={idx} hover>
                    <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                    <StyledTableCell>{question.content}</StyledTableCell>
                    <StyledTableCell>{question.answer_a}</StyledTableCell>
                    <StyledTableCell>{question.answer_b}</StyledTableCell>
                    <StyledTableCell>{question.answer_c}</StyledTableCell>
                    <StyledTableCell>{question.answer_d}</StyledTableCell>
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
          <Button variant="contained" onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuizPreviewModal;
