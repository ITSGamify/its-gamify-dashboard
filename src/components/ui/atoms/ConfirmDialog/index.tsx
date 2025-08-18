import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận tạm ngưng",
  message = "Bạn có chắc chắn muốn tạm ngưng danh mục này không? Hành động này có thể ảnh hưởng đến các khóa học và thử thách liên quan.",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
