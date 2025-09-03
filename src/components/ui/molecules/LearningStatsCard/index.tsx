import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { DepartmentStat } from "@interfaces/api/department";
import { useGetCourses } from "@services/course";

interface LearningStatsCardProps {
  departments: DepartmentStat[];
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({
  departments,
}) => {
  // Lấy danh sách tất cả khóa học
  const { data: coursesData } = useGetCourses({
    page: 0,
    limit: 1000, // Lấy tất cả khóa học
    isActive: "true",
    categories: null,
    courseTypes: null,
  });

  const allCourses = coursesData?.data || [];

  // Tính toán thống kê học tập theo từng phòng ban
  const departmentStats = departments.map((dept) => {
    const totalEmployees = dept.users.length;

    // Tổng số khóa học đã hoàn thành của phòng ban
    const totalCoursesCompleted = dept.users.reduce(
      (total, user) =>
        total + (user.user_metrics?.[0]?.course_completed_num || 0),
      0
    );

    // Tổng số khóa học đang học của phòng ban
    const totalCoursesInProgress = dept.users.reduce((total, user) => {
      const participated = user.user_metrics?.[0]?.course_participated_num || 0;
      const completed = user.user_metrics?.[0]?.course_completed_num || 0;
      return total + (participated - completed);
    }, 0);

    // Tính tổng số khóa học có sẵn cho phòng ban này
    // = Public courses + Department courses của phòng ban này (chỉ tính khóa học hoạt động)

    // Helper function để kiểm tra khóa học hoạt động
    const isActiveCourse = (course: any) => {
      // Logic: Khóa học hoạt động = không phải draft và không bị xóa
      return !course.drafted && !course.is_deleted;
    };

    const publicCourses = allCourses.filter(
      (course) =>
        (course.classify === "ALL" || course.classify === "LEADERONLY") &&
        isActiveCourse(course)
    );

    const departmentCourses = allCourses.filter(
      (course) =>
        course.course_departments?.some((cd) => cd.department_id === dept.id) &&
        isActiveCourse(course)
    );

    const totalAvailableCourses =
      publicCourses.length + departmentCourses.length;

    // Tổng số khóa học chưa học (tổng khóa học - đã hoàn thành - đang học)
    const totalCoursesNotStarted = Math.max(
      0,
      totalAvailableCourses - totalCoursesCompleted - totalCoursesInProgress
    );

    return {
      department: dept,
      totalEmployees,
      totalCoursesCompleted,
      totalCoursesInProgress,
      totalCoursesNotStarted,
      totalAvailableCourses,
      publicCoursesCount: publicCourses.length,
      departmentCoursesCount: departmentCourses.length,
    };
  });

  return (
    <Card
      sx={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        borderRadius: 3,
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1565c0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📚 Thống kê học tập theo phòng ban
        </Typography>

        {departmentStats.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Chưa có dữ liệu thống kê học tập
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: 600,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255,255,255,0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                "&:hover": {
                  background: "rgba(0,0,0,0.3)",
                },
              },
            }}
          >
            {departmentStats.map((stat, index) => {
              const pieData = [
                {
                  id: 0,
                  value: stat.totalCoursesCompleted,
                  label: "Đã hoàn thành",
                  color: "#4caf50",
                },
                {
                  id: 1,
                  value: stat.totalCoursesInProgress,
                  label: "Đang học",
                  color: "#ff9800",
                },
                {
                  id: 2,
                  value: stat.totalCoursesNotStarted,
                  label: "Chưa bắt đầu",
                  color: "#f44336",
                },
              ].filter((item) => item.value > 0);

              const hasData = pieData.some((item) => item.value > 0);

              return (
                <Box
                  key={stat.department.id}
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1565c0",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🏢 {stat.department.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "rgba(0,0,0,0.7)" }}
                  >
                    👥 {stat.totalEmployees} nhân viên
                  </Typography>

                  {!hasData ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      Chưa có dữ liệu học tập
                    </Typography>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.4)",
                            borderRadius: 3,
                            p: 2,
                            border: "1px solid rgba(255,255,255,0.6)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          {pieData.length > 0 ? (
                            <>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  mb: 2,
                                  "& .MuiChartsLegend-root": {
                                    display: "none !important",
                                  },
                                }}
                              >
                                <PieChart
                                  series={[
                                    {
                                      data: pieData,
                                      innerRadius: 50,
                                      outerRadius: 80,
                                      paddingAngle: 2,
                                    },
                                  ]}
                                  height={160}
                                  width={160}
                                />
                              </Box>

                              {/* Legend positioned below the chart */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  mt: 1,
                                }}
                              >
                                {pieData.map((item) => (
                                  <Box
                                    key={item.id}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: item.color,
                                        borderRadius: "50%",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 500,
                                        color: "rgba(0,0,0,0.8)",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: "rgba(0,0,0,0.5)",
                              }}
                            >
                              <Typography variant="h4" sx={{ mb: 2 }}>
                                📊
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ textAlign: "center" }}
                              >
                                Chưa có dữ liệu biểu đồ
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ pl: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 3,
                              fontWeight: 600,
                              color: "#1565c0",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            📊 Tổng quan
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                mb: 2,
                                fontWeight: 500,
                                color: "#2e7d32",
                              }}
                            >
                              Tổng khóa học có sẵn:{" "}
                              <strong style={{ fontSize: "1.1rem" }}>
                                {stat.totalAvailableCourses}
                              </strong>
                            </Typography>

                            <Box sx={{ ml: 2, mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 1,
                                  color: "rgba(0,0,0,0.7)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#2196f3",
                                    borderRadius: "50%",
                                  }}
                                />
                                Public: {stat.publicCoursesCount}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 1,
                                  color: "rgba(0,0,0,0.7)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#ff9800",
                                    borderRadius: "50%",
                                  }}
                                />
                                Department: {stat.departmentCoursesCount}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body1"
                              sx={{
                                mb: 2,
                                fontWeight: 500,
                                color: "#2e7d32",
                              }}
                            >
                              Tổng số khóa học đã hoàn thành:{" "}
                              <strong style={{ fontSize: "1.1rem" }}>
                                {stat.totalCoursesCompleted}
                              </strong>
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                mb: 2,
                                fontWeight: 500,
                                color: "#d32f2f",
                              }}
                            >
                              Tổng số Khóa học chưa học:{" "}
                              <strong style={{ fontSize: "1.1rem" }}>
                                {stat.totalCoursesNotStarted}
                              </strong>
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: "#1565c0",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              📈 Chi tiết
                            </Typography>

                            {stat.totalCoursesCompleted > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  p: 1.5,
                                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                                  borderRadius: 1,
                                  border: "1px solid rgba(76, 175, 80, 0.2)",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#4caf50",
                                    borderRadius: "50%",
                                    mr: 2,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Đã hoàn thành:{" "}
                                  <strong style={{ color: "#2e7d32" }}>
                                    {stat.totalCoursesCompleted}
                                  </strong>
                                </Typography>
                              </Box>
                            )}

                            {stat.totalCoursesInProgress > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  p: 1.5,
                                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                                  borderRadius: 1,
                                  border: "1px solid rgba(255, 152, 0, 0.2)",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#ff9800",
                                    borderRadius: "50%",
                                    mr: 2,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Đang học:{" "}
                                  <strong style={{ color: "#f57c00" }}>
                                    {stat.totalCoursesInProgress}
                                  </strong>
                                </Typography>
                              </Box>
                            )}

                            {stat.totalCoursesNotStarted > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  p: 1.5,
                                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                                  borderRadius: 1,
                                  border: "1px solid rgba(244, 67, 54, 0.2)",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#f44336",
                                    borderRadius: "50%",
                                    mr: 2,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Chưa bắt đầu:{" "}
                                  <strong style={{ color: "#d32f2f" }}>
                                    {stat.totalCoursesNotStarted}
                                  </strong>
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
