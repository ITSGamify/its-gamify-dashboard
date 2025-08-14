import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  IconButton,
  Box,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Button,
  styled,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAccountModal } from "@hooks/data/useAccountModal";
import { User } from "@interfaces/api/user";
import { Controller } from "react-hook-form";
import { useGetOptions } from "@hooks/shared/useGetOptions";
import { useGetDeparments } from "@services/department";
import { deparmentOptionField } from "@constants/departments";
import AutocompleteAsync from "@components/ui/atoms/AutocompleteAsync";
import { Role } from "@interfaces/api/role";
import { useFileUpload } from "@services/fileUpload";

//#region Styled components
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

const AvatarUploadBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

const UploadButton = styled("label")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: theme.spacing(1),
  cursor: "pointer",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "0.875rem",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
  position: "relative",
}));

const AvatarOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 1,
  },
}));
//#endregion

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: User | null;
  roles?: Role[];
  isRoleLoading?: boolean;
}

// Component chính
const AccountModalForm: React.FC<CreateUserModalProps> = ({
  data,
  open,
  onClose,
  onSuccess,
  roles,
  isRoleLoading,
}) => {
  const {
    showPassword,
    toggleShowPassword,
    control,
    isSaving,
    handleSubmit,
    reset,
    watch,
  } = useAccountModal({
    user: data,
    onActionSuccess: onSuccess,
  });

  const {
    options: departmentsOptions,
    handleSearchOptions: handleSearchDepartmentsOptions,
    isLoading: isLoadingDepartments,
  } = useGetOptions(useGetDeparments, deparmentOptionField);

  const handleClose = () => {
    reset();
    onClose();
    setAvatarPreview(null);
  };
  const upload = useFileUpload();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    data?.avatar_url || null
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setAvatarPreview(data?.avatar_url || null);
  }, [data]);
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (id?: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Tạo preview URL cho file
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        // Upload file
        const result = await upload.mutateAsync({ file });

        // Cập nhật avatarId trong form
        onChange(result.url);
      } catch (error) {
        console.error("Error uploading file:", error);
        // Xóa preview nếu upload thất bại
        setAvatarPreview(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveAvatar = (onChange: (id?: string | null) => void) => {
    onChange(null);
    setAvatarPreview(null);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="create-user-dialog-title"
    >
      <StyledDialogTitle id="create-user-dialog-title">
        <Typography variant="h6" component="div" fontWeight={600}>
          Tạo tài khoản mới
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <form onSubmit={handleSubmit}>
        <StyledDialogContent dividers>
          <AvatarUploadBox>
            <Controller
              name="avatar_url"
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <>
                    <Box position="relative">
                      <LargeAvatar src={avatarPreview || ""} alt="User Avatar">
                        {!avatarPreview && (
                          <Typography variant="h4" color="text.secondary">
                            {watch("full_name")
                              ? watch("full_name").charAt(0).toUpperCase()
                              : "U"}
                          </Typography>
                        )}
                        <AvatarOverlay>
                          {isUploading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <AddAPhotoIcon sx={{ color: "white" }} />
                          )}
                        </AvatarOverlay>
                      </LargeAvatar>
                      {avatarPreview && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: (theme) =>
                              theme.palette.error.main,
                            color: "white",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.error.dark,
                            },
                          }}
                          onClick={() => handleRemoveAvatar(onChange)}
                          disabled={isUploading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, onChange)}
                      disabled={isUploading}
                    />
                    <UploadButton htmlFor="avatar-upload">
                      <AddAPhotoIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {isUploading
                        ? "Đang tải lên..."
                        : avatarPreview
                        ? "Thay đổi ảnh"
                        : "Tải lên ảnh đại diện"}
                    </UploadButton>
                  </>
                );
              }}
            />
          </AvatarUploadBox>
          <Grid container spacing={2}>
            <Grid container size={{ md: 12 }}>
              <Controller
                name="full_name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="full_name"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid container size={{ md: 12 }}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid container size={{ md: 12 }}>
              <Controller
                name="role_id"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error} required>
                    <InputLabel id="role-select-label">Vai trò</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      label="Vai trò"
                      {...field}
                      disabled={isRoleLoading}
                    >
                      {roles && roles.length > 0 ? (
                        roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          {isRoleLoading
                            ? "Đang tải..."
                            : "Không có vai trò nào"}
                        </MenuItem>
                      )}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid container size={{ md: 12 }}>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error} required>
                    <FormControl fullWidth required>
                      <AutocompleteAsync
                        options={departmentsOptions}
                        label="Phòng ban"
                        value={
                          field.value
                            ? departmentsOptions.find(
                                (x) => x.id === field.value
                              ) || null
                            : null
                        }
                        onChange={field.onChange}
                        onSearch={handleSearchDepartmentsOptions}
                        loading={isLoadingDepartments}
                        required
                      />
                    </FormControl>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid container size={{ md: 12 }}>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </StyledDialogContent>

        <StyledDialogActions>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            Hủy
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disableElevation
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : data ? "Cập nhật" : "Tạo tài khoản"}
          </Button>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  );
};

export default AccountModalForm;
