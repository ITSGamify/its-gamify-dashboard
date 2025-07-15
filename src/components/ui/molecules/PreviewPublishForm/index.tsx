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
  Button,
  Alert,
  Paper,
  useTheme,
  CircularProgress,
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
import { Lesson } from "@interfaces/dom/course";
import { StepFormProps } from "@interfaces/api/course";
import { STEPS } from "@constants/course";
import { Save as SaveIcon } from "@mui/icons-material";
import { validateCourseContent } from "@utils/course";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

const PreviewPublishForm = ({
  data,
  handleNextState,
  activeStep,
  handleBack,
  isLoading,
}: StepFormProps) => {
  const totalVideos =
    data?.modules?.reduce(
      (acc, module) =>
        acc +
        (module.lessons?.filter((lesson: Lesson) => lesson.type === "video")
          .length || 0),
      0
    ) || 0;

  const totalDuration =
    data?.modules?.reduce(
      (acc, module) =>
        acc +
        (module.lessons?.reduce(
          (lessonAcc, lesson) => lessonAcc + (lesson.duration || 0),
          0
        ) || 0),
      0
    ) || 0;

  const { isValid, errorMessage } = validateCourseContent(data?.modules || []);

  const handleNext = () => {
    if (!isValid) {
      toast.error(ToastContent, {
        data: {
          message: errorMessage || "Nội dung khóa học chưa đáp ứng yêu cầu!",
        },
      });
      return;
    }

    handleNextState(data);
  };

  const isBasicInfoComplete =
    data?.status === "CONFIRM" || data?.status === "PUBLISHED";

  const isContentComplete = isValid;

  const modules =
    data?.modules && data.modules.length > 0
      ? [...data.modules].sort(
          (a, b) => (a.ordered_number || 0) - (b.ordered_number || 0)
        )
      : [];
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
            {isValid ? (
              <Alert severity="info" sx={{ mb: 0 }}>
                Xem lại thông tin khóa học của bạn trước khi xuất bản. Bạn có
                thể quay lại các bước trước để chỉnh sửa nếu cần.
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 0 }}>
                Mỗi khóa học cần tối thiểu 3 chương. Mỗi chương có ít nhất 1 bài
                học.
              </Alert>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="240"
                image={
                  data
                    ? data.thumbnail_image
                    : "https://etalentcanada.ca/sites/default/files/styles/hero_offset_image/public/2022-12/WIL_eLearning%5B1%5D.jpeg?itok=_hFx7LDi"
                }
                alt={data?.title}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {data?.title || "Tiêu đề khóa học"}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={data?.category?.name || "Danh mục"}
                    color="primary"
                  />
                  <Chip label={"Tất cả cấp độ"} variant="outlined" />
                  <Chip label={"Tiếng Việt"} variant="outlined" />
                  <Chip
                    label="Có chứng chỉ"
                    variant="outlined"
                    color="success"
                  />
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {data?.short_description || "Mô tả ngắn về khóa học"}
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
                      {data?.modules?.length} bài học
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

                <Divider />

                {/* <Typography variant="h6" gutterBottom>
                  Nội dung khóa học
                </Typography> */}

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

                {data?.modules?.length === 0 && (
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 3 }}
                >
                  Khi xuất bản, khóa học sẽ hiển thị cho học viên và có thể được
                  tìm kiếm
                </Typography>

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
          disabled={activeStep === 0 || isLoading}
        >
          Quay lại
        </Button>
        <Box>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            Lưu nháp
          </Button>
          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Đang xử lý..." : " Xuất bản khóa học"}
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
