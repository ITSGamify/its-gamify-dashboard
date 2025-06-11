// src/sections/course/create/BasicInfoForm.tsx
import React, { useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  Divider,
} from "@mui/material";
import {
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import UploadBox from "@components/ui/atoms/UploadBox";
import TagInput from "@components/ui/atoms/TagInput";
import { CourseDataProps } from "@interfaces/dom/course";
interface BasicInfoFormProps {
  courseData: CourseDataProps;
  handleCourseDataChange: (
    field: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  courseData,
  handleCourseDataChange,
}) => {
  const [currentTag, setCurrentTag] = useState("");

  // Categories for dropdown
  const categories = [
    "UI/UX Design",
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "Graphic Design",
    "Programming",
    "Data Science",
    "Business",
    "Marketing",
  ];

  // Handle file uploads
  const handleFileUpload =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        // Normally this would update courseData, but for simplicity we'll just log it
        console.log(`Uploaded file for ${field}:`, event.target.files[0]);
      }
    };

  // Handle tags
  const handleAddTag = () => {
    if (
      currentTag.trim() !== "" &&
      !courseData.tags.includes(currentTag.trim())
    ) {
      //   const newTags = [...courseData.tags, currentTag.trim()];
      // Update courseData.tags here
      setCurrentTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    // const newTags = courseData.tags.filter(
    //   (tag: string) => tag !== tagToDelete
    // );
    console.log(`Deleted tag: ${tagToDelete}`);
    // Update courseData.tags here
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <SectionTitle variant="h6" fontWeight={600}>
          Thông tin cơ bản
        </SectionTitle>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Tiêu đề khóa học"
          fullWidth
          required
          value={courseData.title}
          onChange={handleCourseDataChange("title")}
          placeholder="Ví dụ: Thiết kế UI/UX với Figma từ cơ bản đến nâng cao"
          helperText="Tiêu đề rõ ràng và hấp dẫn sẽ thu hút nhiều học viên hơn"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Mô tả ngắn"
          fullWidth
          required
          value={courseData.shortDescription}
          onChange={handleCourseDataChange("shortDescription")}
          placeholder="Mô tả ngắn gọn về khóa học (hiển thị trong kết quả tìm kiếm)"
          helperText="Tối đa 160 ký tự"
          inputProps={{ maxLength: 160 }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Mô tả chi tiết"
          fullWidth
          required
          multiline
          rows={6}
          value={courseData.description}
          onChange={handleCourseDataChange("description")}
          placeholder="Mô tả chi tiết về khóa học, những gì học viên sẽ học được, yêu cầu tiên quyết, v.v."
          helperText="Sử dụng định dạng văn bản phong phú để làm nổi bật các điểm quan trọng"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          label="Danh mục"
          fullWidth
          required
          value={courseData.category}
          onChange={handleCourseDataChange("category")}
          helperText="Chọn danh mục phù hợp nhất với nội dung khóa học"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Phân loại</FormLabel>
          <RadioGroup
            row
            value={courseData.level}
            onChange={handleCourseDataChange("level")}
          >
            <FormControlLabel
              value="leader"
              control={<Radio />}
              label="Leader Only"
            />
            <FormControlLabel
              value="department"
              control={<Radio />}
              label="Department Only"
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All Levels"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

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
        <UploadBox
          id="thumbnail-upload"
          title="Tải lên ảnh thumbnail"
          description="Kích thước khuyến nghị: 1280x720 px (tỷ lệ 16:9)"
          icon={
            <ImageIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
          }
          file={courseData.thumbnail}
          onChange={handleFileUpload("thumbnail")}
          onRemove={() => {
            // Remove thumbnail logic
          }}
          accept="image/*"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="subtitle2" gutterBottom>
          Video giới thiệu khóa học
        </Typography>
        <UploadBox
          id="preview-video-upload"
          title="Tải lên video giới thiệu"
          description="Thời lượng khuyến nghị: 2-5 phút"
          icon={
            <VideoLibraryIcon
              sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
            />
          }
          file={courseData.previewVideo}
          onChange={handleFileUpload("previewVideo")}
          onRemove={() => {
            // Remove preview video logic
          }}
          accept="video/*"
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
          tags={courseData.tags}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
          handleAddTag={handleAddTag}
          handleDeleteTag={handleDeleteTag}
          maxTags={5}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoForm;
