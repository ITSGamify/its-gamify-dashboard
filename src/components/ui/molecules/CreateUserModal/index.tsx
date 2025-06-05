import React, { useState, useRef } from "react";
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
  useTheme,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";

// Định nghĩa các kiểu dữ liệu
interface Role {
  id: string;
  name: string;
}

interface Department {
  id: string;
  label: string;
}

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  roles: Role[];
  departments: Department[];
}

interface UserFormData {
  avatar: File | null;
  avatarPreview: string;
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  roleId?: string;
  departmentId?: string;
}

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
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

const AvatarOverlay = styled(Box)(({ theme }) => ({
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

// Component chính
const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSubmit,
  roles,
  departments,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State cho form data
  const [formData, setFormData] = useState<UserFormData>({
    avatar: null,
    avatarPreview: "",
    fullName: "",
    email: "",
    password: "",
    roleId: "",
    departmentId: "",
  });

  // State cho validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // State cho hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Xóa lỗi khi người dùng bắt đầu nhập
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Xử lý upload avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            avatar: file,
            avatarPreview: event.target?.result as string,
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Xử lý xóa avatar
  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: null,
      avatarPreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle hiển thị mật khẩu
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!formData.roleId) {
      newErrors.roleId = "Vui lòng chọn vai trò";
      isValid = false;
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Vui lòng chọn phòng ban";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      avatar: null,
      avatarPreview: "",
      fullName: "",
      email: "",
      password: "",
      roleId: "",
      departmentId: "",
    });
    setErrors({});
    setShowPassword(false);
  };

  // Xử lý đóng modal
  const handleClose = () => {
    handleReset();
    onClose();
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

      <StyledDialogContent dividers>
        <AvatarUploadBox>
          <Box position="relative">
            <LargeAvatar src={formData.avatarPreview || ""} alt="User Avatar">
              {!formData.avatarPreview && (
                <Typography variant="h4" color="text.secondary">
                  {formData.fullName
                    ? formData.fullName.charAt(0).toUpperCase()
                    : "U"}
                </Typography>
              )}
              <AvatarOverlay>
                <AddAPhotoIcon sx={{ color: "white" }} />
              </AvatarOverlay>
            </LargeAvatar>
            {formData.avatarPreview && (
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: theme.palette.error.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
                onClick={handleRemoveAvatar}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <UploadButton htmlFor="avatar-upload">
            <AddAPhotoIcon fontSize="small" sx={{ mr: 0.5 }} />
            {formData.avatar ? "Thay đổi ảnh" : "Tải lên ảnh đại diện"}
          </UploadButton>
        </AvatarUploadBox>

        <Grid container spacing={2}>
          <Grid container size={{ md: 12 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
            />
          </Grid>

          <Grid container size={{ md: 12 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>

          <Grid container size={{ md: 12 }}>
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
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
          </Grid>

          <Grid container size={{ md: 12 }}>
            <FormControl fullWidth error={!!errors.roleId} required>
              <InputLabel id="role-select-label">Vai trò</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                name="roleId"
                value={formData.roleId}
                label="Vai trò"
                // onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.roleId && (
                <FormHelperText>{errors.roleId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid container size={{ md: 12 }}>
            <FormControl fullWidth error={!!errors.departmentId} required>
              <Autocomplete
                disablePortal
                options={departments}
                renderInput={(params) => (
                  <TextField {...params} label="Phòng ban" />
                )}
              />
              {/* <Autocomplete
                labelId="department-select-label"
                id="department-select"
                name="departmentId"
                value={formData.departmentId}
                label="Phòng ban"
                // onChange={handleChange}
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Autocomplete> */}
              {errors.departmentId && (
                <FormHelperText>{errors.departmentId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </StyledDialogContent>

      <StyledDialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disableElevation
        >
          Tạo người dùng
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default CreateUserModal;
