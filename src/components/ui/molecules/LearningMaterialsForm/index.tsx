// src/sections/course/create/LearningMaterialsForm.tsx
import React from "react";
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
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";

import { CourseDataProps } from "@interfaces/dom/course";

interface LearningMaterialsFormProps {
  courseData: CourseDataProps;
  handleCourseDataChange: (
    field: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LearningMaterialsForm: React.FC<LearningMaterialsFormProps> = () =>
  //     {
  // //   courseData,
  // //   handleCourseDataChange,
  // }
  {
    // Mock data for attachments
    const [attachments, setAttachments] = React.useState([
      {
        id: "1",
        name: "course_resources.zip",
        size: "15.2 MB",
        type: "application/zip",
      },
      {
        id: "2",
        name: "project_starter_files.zip",
        size: "8.7 MB",
        type: "application/zip",
      },
      {
        id: "3",
        name: "course_slides.pdf",
        size: "3.5 MB",
        type: "application/pdf",
      },
    ]);

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        // Process uploaded files
        const newFiles = Array.from(event.target.files).map((file, index) => ({
          id: `new-${Date.now()}-${index}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type,
        }));

        setAttachments([...attachments, ...newFiles]);
      }
    };

    // Handle file delete
    const handleDeleteFile = (id: string) => {
      setAttachments(attachments.filter((file) => file.id !== id));
    };

    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <SectionTitle variant="h6" fontWeight={600}>
            Tài liệu học tập
          </SectionTitle>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" paragraph>
            Tải lên các tài liệu bổ sung cho khóa học của bạn như tài liệu PDF,
            mã nguồn, tệp thiết kế, v.v.
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
                      <ListItemText primary={file.name} secondary={file.size} />
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
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Mô tả các kiến thức hoặc kỹ năng mà học viên nên có trước khi tham gia khóa học này"
            helperText="Ví dụ: Kiến thức cơ bản về HTML, CSS và JavaScript"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom>
            Mục tiêu học tập
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Thêm mục tiêu học tập"
              sx={{ mb: 1 }}
            />
            <Button variant="outlined" startIcon={<AddIcon />}>
              Thêm mục tiêu
            </Button>
          </Box>
          <List>
            <ListItem>
              <ListItemText primary="Hiểu và áp dụng được các nguyên tắc thiết kế UI/UX" />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Thành thạo công cụ Figma để thiết kế giao diện" />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Tạo được prototype tương tác cho ứng dụng web và mobile" />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  };

export default LearningMaterialsForm;
