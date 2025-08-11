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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
  CircularProgress,
  ListItemButton, // Thêm để làm link cho materials
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
  Download as DownloadIcon, // Thêm icon cho materials
  CheckCircle as CheckIcon, // Cho targets
} from "@mui/icons-material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import { Lesson } from "@interfaces/dom/course";
import { useGetCourseDetail } from "@services/course";
import { useParams } from "react-router-dom";
import { convertUTCToFormattedLocalTime } from "@utils/date";

const CourseDetailPage = () => {
  const { courseId } = useParams();

  const { data, isFetching } = useGetCourseDetail(courseId || "");

  // Tính toán tổng hợp
  const totalLessons =
    data?.modules?.reduce(
      (acc, module) => acc + (module.lessons?.length || 0),
      0
    ) || 0;
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

  const modules =
    data?.modules && data.modules.length > 0
      ? [...data.modules].sort(
          (a, b) => (a.ordered_number || 0) - (b.ordered_number || 0)
        )
      : [];
  const theme = useTheme();

  // Xử lý loading
  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin khóa học...
        </Typography>
      </Box>
    );
  }

  // Nếu không có data sau khi fetch
  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Không tìm thấy thông tin khóa học.
        </Typography>
      </Box>
    );
  }

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
            <SectionTitle variant="h3" fontWeight={600}>
              {data.title}
            </SectionTitle>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="240"
                image={
                  data.thumbnail_image ||
                  "https://etalentcanada.ca/sites/default/files/styles/hero_offset_image/public/2022-12/WIL_eLearning%5B1%5D.jpeg?itok=_hFx7LDi"
                }
                alt={data?.title}
              />
              <CardContent>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={data?.category?.name || "Danh mục"}
                    color="primary"
                  />
                  <Chip label={"Tiếng Việt"} variant="outlined" />
                  <Chip
                    label="Có chứng chỉ"
                    variant="outlined"
                    color="success"
                  />
                  {data.level && (
                    <Chip label={`Level: ${data.level}`} variant="outlined" />
                  )}
                  {data.drafted ? (
                    <Chip label="Bản nháp" color="warning" />
                  ) : (
                    data.status && (
                      <Chip
                        label={`Trạng thái: ${data.status}`}
                        color="secondary"
                      />
                    )
                  )}

                  <Chip
                    label={data.is_optional ? "Tùy chọn" : "Bắt buộc"}
                    color={data.is_optional ? "default" : "error"}
                  />
                </Box>

                {/* Thêm mô tả dài */}
                {data.description && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Mô tả chi tiết
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {data.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}
                {data.description && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Thời gian khóa học
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {convertUTCToFormattedLocalTime(data.quarter.start_date)}{" "}
                      - {convertUTCToFormattedLocalTime(data.quarter.end_date)}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Thêm tags */}
                {data.tags && data.tags.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Tags
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {data.tags.map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" />
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Thông tin khóa học (mở rộng) */}
                <Typography variant="h6" gutterBottom>
                  Thông tin khóa học
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số chương
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {data?.modules?.length || 0} chương
                    </Typography>
                  </Grid>
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
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Đánh giá
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {data.reviews || 0} đánh giá
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phân loại
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {data.classify || "Không xác định"}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Quý
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {data.quarter?.name || "Không xác định"}{" "}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Video giới thiệu */}
                {data.introduction_video && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Video giới thiệu
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={data.introduction_video}
                        style={{ borderRadius: "8px" }}
                      >
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Yêu cầu */}
                {data.requirement && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Yêu cầu
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {data.requirement}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Mục tiêu */}
                {data.targets && data.targets.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Mục tiêu khóa học
                    </Typography>
                    <List dense>
                      {data.targets.map((target, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={target} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Tài liệu học tập */}
                {data.learning_materials &&
                  data.learning_materials.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Tài liệu học tập
                      </Typography>
                      <List dense>
                        {data.learning_materials.map((material) => (
                          <ListItemButton
                            key={material.id}
                            component="a"
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ListItemIcon>
                              <DownloadIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={material.name}
                              secondary={`${material.type} - ${material.size} bytes`}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}

                {/* Danh sách modules (giữ nguyên) */}
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
        </Grid>
      </Paper>
    </>
  );
};

export default CourseDetailPage;
