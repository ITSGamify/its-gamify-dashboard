// src/sections/course/create/BasicInfoForm.tsx
import { useMemo, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  Divider,
  Box,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import UploadBox from "@components/ui/atoms/UploadBox";
import TagInput from "@components/ui/atoms/TagInput";
import { useBasicForm } from "@hooks/data/useBasicForm";
import { Controller } from "react-hook-form";
import { StepFormProps } from "@interfaces/api/course";
import { STEPS } from "@constants/course";
import AutocompleteAsync from "@components/ui/atoms/AutocompleteAsync";
import { useGetOptions } from "@hooks/shared/useGetOptions";
import { useGetDeparments } from "@services/department";
import { deparmentOptionField } from "@constants/departments";
import { useGetCategories } from "@services/category";
import { categoryOptionField } from "@constants/category";

const BasicInfoForm = ({
  data,
  handleNextState,
  activeStep,
  handleBack,
}: StepFormProps) => {
  const {
    control,
    tags,
    handleAddTag,
    handleSubmit,
    handleRemoveTag,
    classify,
  } = useBasicForm({
    data,
    handleNextState,
  });

  const {
    options: departmentsOptions,
    handleSearchOptions: handleSearchDepartmentsOptions,
    isLoading: isLoadingDepartments,
  } = useGetOptions(useGetDeparments, deparmentOptionField);

  const {
    options: categoryOptions,
    handleSearchOptions: handleSearchCategoryOptions,
    isLoading: isLoadingCategories,
  } = useGetOptions(useGetCategories, categoryOptionField);

  const [currentTag, setCurrentTag] = useState("");

  const theme = useTheme();

  const renderDepartment = useMemo(() => {
    if (classify === "DEPARTMENTONLY") {
      return (
        <Grid container size={{ xs: 12, md: 12 }}>
          <Controller
            name="department_id"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error} required>
                <AutocompleteAsync
                  options={departmentsOptions}
                  label="Phòng ban"
                  value={
                    field.value
                      ? departmentsOptions.find((x) => x.id === field.value) ||
                        null
                      : null
                  }
                  onChange={field.onChange}
                  onSearch={handleSearchDepartmentsOptions}
                  loading={isLoadingDepartments}
                  required
                />
              </FormControl>
            )}
          />
        </Grid>
      );
    }
    return null;
  }, [
    classify,
    control,
    departmentsOptions,
    handleSearchDepartmentsOptions,
    isLoadingDepartments,
  ]);

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

          <Grid size={{ xs: 12 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Tiêu đề khóa học"
                  name="title"
                  fullWidth
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  helperText={
                    error?.message ||
                    "Tiêu đề rõ ràng và hấp dẫn sẽ thu hút nhiều học viên hơn"
                  }
                  placeholder="Ví dụ: Thiết kế UI/UX với Figma từ cơ bản đến nâng cao"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="short_description"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  name="short_description"
                  label="Mô tả ngắn"
                  fullWidth
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  helperText={error?.message}
                  placeholder="Mô tả ngắn gọn về khóa học (hiển thị trong kết quả tìm kiếm)"
                  inputProps={{ maxLength: 160 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  name="description"
                  label="Mô tả chi tiết"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  helperText={
                    error?.message ||
                    "Sử dụng định dạng văn bản phong phú để làm nổi bật các điểm quan trọng"
                  }
                  placeholder="Mô tả chi tiết về khóa học, những gì học viên sẽ học được, yêu cầu tiên quyết, v.v."
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
                    label="Danh mục"
                    value={
                      field.value
                        ? categoryOptions.find((x) => x.id === field.value) ||
                          null
                        : null
                    }
                    onChange={field.onChange}
                    onSearch={handleSearchCategoryOptions}
                    loading={isLoadingCategories}
                    required
                  />
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Controller
              name="classify"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset" error={!!error}>
                  <FormLabel component="legend">Phân loại</FormLabel>
                  <RadioGroup row value={field.value} onChange={field.onChange}>
                    <FormControlLabel
                      value="LEADERONLY"
                      control={<Radio />}
                      label="Leader Only"
                    />
                    <FormControlLabel
                      value="DEPARTMENTONLY"
                      control={<Radio />}
                      label="Department Only"
                    />
                    <FormControlLabel
                      value="ALL"
                      control={<Radio />}
                      label="All Levels"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>

          {renderDepartment}

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Hình ảnh và Video
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh thumbnail khóa học
            </Typography>
            <Controller
              name="thumbnail_image_id"
              control={control}
              render={({ field: { onChange } }) => (
                <UploadBox
                  id="thumbnail"
                  title="Tải lên ảnh thumbnail"
                  description="Kích thước khuyến nghị: 1280x720 px (tỷ lệ 16:9)"
                  icon={
                    <ImageIcon
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
                  }
                  defaultUrl={data?.thumbnail_image}
                  onChange={onChange}
                  accept="image/*"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Video giới thiệu khóa học
            </Typography>
            <Controller
              name="introduction_video_id"
              control={control}
              render={({ field: { onChange } }) => (
                <UploadBox
                  id="video"
                  title="Tải lên video giới thiệu"
                  description="Kích thước khuyến nghị: 1280x720 px (tỷ lệ 16:9)"
                  icon={
                    <VideoLibraryIcon
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
                  }
                  defaultUrl={data?.introduction_video}
                  onChange={onChange}
                  accept="video/*"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
              Thẻ (tags)
            </Typography>
            <TagInput
              tags={tags}
              currentTag={currentTag}
              setCurrentTag={setCurrentTag}
              handleAddTag={handleAddTag}
              handleDeleteTag={handleRemoveTag}
              maxTags={5}
            />
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
            <Button variant="contained" type="submit">
              Tiếp theo
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default BasicInfoForm;
