// src/sections/course/create/PreviewPublishForm.tsx
import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PlayArrow as PlayArrowIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import { Module, Lesson, CourseDataProps } from "@interfaces/dom/course";
import { StepFormProps } from "@interfaces/api/course";
import { STEPS } from "@constants/course";
import { Save as SaveIcon } from "@mui/icons-material";

const PreviewPublishForm = ({
  data,
  handleNextState,
  activeStep,
  handleBack,
}: StepFormProps) => {
  const modules: Module[] = [
    {
      id: "3c9692a3-8ee5-41ab-a351-c1faebc92eb7",
      title: "Module 1: Giới thiệu",
      description: "Giới thiệu tổng quan về khóa học",
      lessons: [
        {
          id: "lession-1",
          title: "Bài 1: Giới thiệu khóa học",
          type: "video",
          duration: 10,
          content: "Nội dung giới thiệu khóa học",
          video_url: "",
        },
        {
          id: "lession-2",
          title: "Bài 2: Cài đặt môi trường",
          type: "article",
          duration: 15,
          content: "Hướng dẫn cài đặt môi trường làm việc",
        },
      ],
    },
  ];

  const courseData: CourseDataProps = {
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    language: "vietnamese",
    thumbnail: null,
    previewVideo: null,
    tags: [] as string[],
    hasCertificate: true,
    isPublished: false,
  };
  // Calculate course statistics
  const totalLessons = modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const totalVideos = modules.reduce(
    (acc, module) =>
      acc +
      module.lessons.filter((lesson: Lesson) => lesson.type === "video").length,
    0
  );
  const totalDuration = modules.reduce(
    (acc, module) =>
      acc +
      module.lessons.reduce(
        (sum: number, lesson: Lesson) => sum + lesson.duration,
        0
      ),
    0
  );

  // Check for completeness
  const isBasicInfoComplete =
    courseData.title &&
    courseData.shortDescription &&
    courseData.description &&
    courseData.category &&
    courseData.thumbnail;
  const isContentComplete = modules.length > 0 && totalLessons > 0;

  const theme = useTheme();

  return (
    <>
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
              Xem trước & Xuất bản
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ mb: 0 }}>
              Xem lại thông tin khóa học của bạn trước khi xuất bản. Bạn có thể
              quay lại các bước trước để chỉnh sửa nếu cần.
            </Alert>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="240"
                image={
                  courseData.thumbnail
                    ? URL.createObjectURL(courseData.thumbnail)
                    : "https://etalentcanada.ca/sites/default/files/styles/hero_offset_image/public/2022-12/WIL_eLearning%5B1%5D.jpeg?itok=_hFx7LDi"
                }
                alt={courseData.title}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {courseData.title || "Tiêu đề khóa học"}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={courseData.category || "Danh mục"}
                    color="primary"
                  />
                  <Chip
                    label={
                      courseData.level === "beginner"
                        ? "Cơ bản"
                        : courseData.level === "intermediate"
                        ? "Trung cấp"
                        : courseData.level === "advanced"
                        ? "Nâng cao"
                        : "Tất cả cấp độ"
                    }
                    variant="outlined"
                  />
                  <Chip
                    label={
                      courseData.language === "vietnamese"
                        ? "Tiếng Việt"
                        : "Tiếng Anh"
                    }
                    variant="outlined"
                  />
                  {courseData.hasCertificate && (
                    <Chip
                      label="Có chứng chỉ"
                      variant="outlined"
                      color="success"
                    />
                  )}
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {courseData.shortDescription || "Mô tả ngắn về khóa học"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Thông tin khóa học
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số bài học
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {totalLessons} bài học
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số video
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {totalVideos} video
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Thời lượng
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {totalDuration} phút
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Nội dung khóa học
                </Typography>

                {modules.map((module, index) => (
                  <Accordion key={module.id} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight={600}>{module.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {module.description}
                      </Typography>
                      <List dense disablePadding>
                        {module.lessons.map((lesson: Lesson) => (
                          <ListItem key={lesson.id}>
                            <ListItemIcon>
                              {lesson.type === "video" ? (
                                <PlayArrowIcon color="primary" />
                              ) : lesson.type === "article" ? (
                                <ArticleIcon color="info" />
                              ) : (
                                <QuizIcon color="warning" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={`${lesson.duration} phút`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {modules.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 2 }}
                  >
                    Chưa có nội dung nào được thêm vào khóa học
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trạng thái xuất bản
                </Typography>

                <List
                  subheader={<ListSubheader>Kiểm tra hoàn thành</ListSubheader>}
                >
                  <ListItem>
                    <ListItemIcon>
                      {isBasicInfoComplete ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <WarningIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Thông tin cơ bản"
                      secondary={
                        isBasicInfoComplete
                          ? "Đã hoàn thành"
                          : "Chưa hoàn thành"
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      {isContentComplete ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <WarningIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Nội dung khóa học"
                      secondary={
                        isContentComplete ? "Đã hoàn thành" : "Chưa hoàn thành"
                      }
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Switch checked={courseData.isPublished} color="primary" />
                  }
                  label="Xuất bản khóa học"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 3 }}
                >
                  Khi xuất bản, khóa học sẽ hiển thị cho học viên và có thể được
                  tìm kiếm
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!(isBasicInfoComplete && isContentComplete)}
                >
                  Xuất bản khóa học
                </Button>

                {!(isBasicInfoComplete && isContentComplete) && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Vui lòng hoàn thành tất cả các phần trước khi xuất bản khóa
                    học
                  </Alert>
                )}
              </CardContent>
            </Card>
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
            <Button variant="contained" onClick={handleNextState}>
              Tiếp theo
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PreviewPublishForm;
