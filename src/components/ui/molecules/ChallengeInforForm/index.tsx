// src/sections/course/create/BasicInfoForm.tsx
import {
  Grid,
  TextField,
  FormControl,
  Typography,
  Divider,
  Box,
  Button,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import UploadBox from "@components/ui/atoms/UploadBox";
import { Controller } from "react-hook-form";
import { courseOptionField, STEPS } from "@constants/course";
import AutocompleteAsync from "@components/ui/atoms/AutocompleteAsync";
import { useGetOptions } from "@hooks/shared/useGetOptions";

import { useGetCourses } from "@services/course";
import { ChallengeStepFormProps } from "@interfaces/api/challenge";
import { useChallengeForm } from "@hooks/data/useChallengeForm";
import { useGetCategories } from "@services/category";
import { categoryOptionField } from "@constants/category";

const ChallengeInforForm = ({
  data,
  handleNextState,
  activeStep,
  handleBack,
  isLoading,
  isCreateMode,
  formData,
}: ChallengeStepFormProps) => {
  const { control, handleSubmit, isLoadingCourse, courseId, setValue, watch } =
    useChallengeForm({
      data,
      handleNextState,
      isLoading,
      formData,
    });

  const {
    options: courseOptions,
    handleSearchOptions: handleSearchCourses,
    isLoading: isLoadingCourses,
  } = useGetOptions(useGetCourses, courseOptionField);

  const {
    options: categoryOptions,
    handleSearchOptions: handleSearchCategoryOptions,
    isLoading: isLoadingCategories,
  } = useGetOptions(useGetCategories, categoryOptionField);

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
              Thông tin cơ bản
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Controller
              name="course_id"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} required>
                  <AutocompleteAsync
                    options={courseOptions}
                    label="Chọn khóa học"
                    value={
                      field.value
                        ? courseOptions.find((x) => x.id === field.value) ||
                          null
                        : null
                    }
                    onChange={field.onChange}
                    onSearch={handleSearchCourses}
                    loading={isLoadingCourses}
                    required
                  />
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Tiêu đề thử thách"
                  name="title"
                  fullWidth
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  disabled={!courseId}
                  inputProps={{ maxLength: 100 }}
                  helperText={
                    error?.message ||
                    `${
                      field.value?.length || 0
                    }/100 - Tiêu đề rõ ràng và hấp dẫn sẽ thu hút nhiều học viên hơn`
                  }
                  placeholder="Ví dụ: Thiết kế UI/UX với Figma từ cơ bản đến nâng cao"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Controller
              name="category_id"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} required>
                  <AutocompleteAsync
                    options={categoryOptions}
                    label="Phân loại"
                    value={
                      field.value
                        ? categoryOptions.find((x) => x.id === field.value) ||
                          null
                        : null
                    }
                    disabled={true}
                    onChange={field.onChange}
                    onSearch={handleSearchCategoryOptions}
                    loading={isLoadingCategories}
                    required
                  />
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              rules={{ required: true, maxLength: 500 }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  name="description"
                  label="Mô tả chi tiết"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  disabled={!courseId}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  inputProps={{ maxLength: 500 }}
                  helperText={
                    error?.message ||
                    `${
                      field.value?.length || 0
                    }/500 - Sử dụng định dạng văn bản phong phú để làm nổi bật các điểm quan trọng`
                  }
                  placeholder="Mô tả chi tiết về khóa học, những gì học viên sẽ học được, yêu cầu tiên quyết, v.v."
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Hình ảnh
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh thumbnail khóa học
            </Typography>
            <Controller
              name="thumbnail_image_id"
              control={control}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <>
                  <UploadBox
                    id="thumbnail_image_id"
                    title="Tải lên ảnh thumbnail"
                    description="Kích thước khuyến nghị: 1280x720 px (tỷ lệ 16:9)"
                    icon={
                      <ImageIcon
                        sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                      />
                    }
                    defaultUrl={
                      watch("thumbnail_image") ||
                      formData?.thumbnail_image ||
                      data?.thumbnail_image
                    }
                    onChange={onChange}
                    onChangeUrl={(url) => setValue("thumbnail_image", url)}
                    accept="image/*"
                  />
                  {error && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {error.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || isLoading || isLoadingCourse}
        >
          Quay lại
        </Button>
        <Box>
          {activeStep === STEPS.length - 1 ? (
            <Button variant="contained" color="primary">
              Xác nhận
            </Button>
          ) : (
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || isLoadingCourse}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading
                ? "Đang xử lý..."
                : isCreateMode
                ? "Tạo thử thách"
                : "Tiếp theo"}
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default ChallengeInforForm;
