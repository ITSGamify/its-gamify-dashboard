// src/sections/course/create/LearningMaterialsForm.tsx
import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import { useLearningMaterialsForm } from "@hooks/data/useLearningMaterialsForm";
import { StepFormProps } from "@interfaces/api/course";
import { Controller } from "react-hook-form";
import { STEPS } from "@constants/course";
import { Save as SaveIcon } from "@mui/icons-material";

export const MAX_TARGET_COUNTS = 10;

const LearningMaterialsForm = ({
  data,
  handleNextState,
  activeStep,
  handleBack,
  isLoading,
}: StepFormProps) => {
  const {
    targets,
    handleAddTaget,
    handleRemoveTaget,
    control,
    handleSubmit,
    handleDeleteFile,
    handleFileUpload,
    attachments,
  } = useLearningMaterialsForm({ data, handleNextState });

  const [currentTaget, setCurrentTaget] = useState("");
  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "20px",
          boxShadow: theme.shadows[8],
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Tài liệu học tập
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body1" paragraph>
              Tải lên các tài liệu bổ sung cho khóa học của bạn như tài liệu
              PDF, mã nguồn, tệp thiết kế, v.v.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 3,
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                  <DescriptionIcon
                    sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Tải lên tài liệu
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Kéo và thả tệp vào đây hoặc nhấp để chọn tệp
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="file-upload"
                    startIcon={<CloudUploadIcon />}
                  >
                    Chọn tệp
                  </Button>
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Tài liệu đã tải lên ({attachments.length})
                </Typography>

                <List>
                  {attachments.map((file, index) => (
                    <React.Fragment key={file.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={file.size}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
                  {attachments.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="Chưa có tài liệu nào được tải lên"
                        primaryTypographyProps={{ color: "text.secondary" }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Yêu cầu tiên quyết
            </Typography>
            <Controller
              name="requirement"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  placeholder="Mô tả các kiến thức hoặc kỹ năng mà học viên nên có trước khi tham gia khóa học này"
                  helperText={
                    error?.message ||
                    "Ví dụ: Kiến thức cơ bản về HTML, CSS và JavaScript"
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Mục tiêu học tập
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Thêm mục tiêu học tập"
                value={currentTaget}
                onChange={(e) => setCurrentTaget(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTaget(currentTaget.trim());
                    setCurrentTaget("");
                  }
                }}
                sx={{ mr: 1 }}
                disabled={targets.length >= MAX_TARGET_COUNTS}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  handleAddTaget(currentTaget.trim());
                  setCurrentTaget("");
                }}
                disabled={
                  !currentTaget.trim() || targets.length >= MAX_TARGET_COUNTS
                }
              >
                <AddIcon />
              </Button>
            </Box>
            <List>
              {targets.length > 0 &&
                targets.map((target, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={target} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveTaget(target)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Quay lại
        </Button>
        <Box>
          <Button variant="outlined" sx={{ mr: 1 }} startIcon={<SaveIcon />}>
            Lưu nháp
          </Button>
          {activeStep === STEPS.length - 1 ? (
            <Button variant="contained" color="primary">
              Xuất bản khóa học
            </Button>
          ) : (
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Đang xử lý..." : "Tiếp theo"}
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default LearningMaterialsForm;
