// src/sections/course/components/modals/QuizPreviewModal.tsx
import React, { Fragment } from "react";
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
import { PreviewHeadCell } from "@interfaces/dom/preview";

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

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: React.ReactNode[][];
  headCells: PreviewHeadCell[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  data,
  headCells,
}) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="quiz-preview-modal">
      <ModalContent>
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
              Tổng số: <strong>{data.length}</strong>
            </Alert>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" sx={{ width: 60 }}>
                    STT
                  </StyledTableCell>
                  {headCells.map((head, index) => (
                    <StyledTableCell key={index} className={head.type}>
                      {head.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    {row.map((cell, cellIndex) => (
                      <Fragment key={cellIndex}>{cell}</Fragment>
                    ))}
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

export default PreviewModal;
