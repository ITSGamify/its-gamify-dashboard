import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  IconButton,
  TextField,
  // FormControl,
  Button,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Department } from "@interfaces/api/department";
import { useDepartmentModal } from "@hooks/data/useDepartmentModal";
import { Controller } from "react-hook-form";
// import AutocompleteAsync from "@components/ui/atoms/AutocompleteAsync";
// import { useGetAccounts } from "@services/account";
// import { useGetOptions } from "@hooks/shared/useGetOptions";
// import { accountOptionField } from "@constants/accounts";
// Định nghĩa các kiểu dữ liệu

interface DepartmentModalProps {
  open: boolean;
  data: Department | null;
  onClose: () => void;
  onSuccess: () => void;
}

//#region  Styled components
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 12,
    maxWidth: 600,
    width: "100%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 3),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
}));
//#endregion

// Component chính
const DepartmentModalForm: React.FC<DepartmentModalProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
  const { control, isSaving, handleSubmit } = useDepartmentModal({
    data,
    onActionSuccess: onSuccess,
  });

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="create-user-dialog-title"
    >
      <StyledDialogTitle id="create-user-dialog-title">
        <Typography variant="h6" component="div" fontWeight={600}>
          {data ? "Cập nhật phòng ban" : "Tạo phòng ban mới"}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <form onSubmit={handleSubmit}>
        <StyledDialogContent dividers>
          <Grid container spacing={2}>
            <Grid container size={{ md: 12 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Tên phòng ban"
                    name="name"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </StyledDialogContent>

        <StyledDialogActions>
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disableElevation
            disabled={isSaving}
          >
            {data ? "Cập nhật" : "Tạo phòng ban"}
          </Button>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  );
};
export default DepartmentModalForm;
