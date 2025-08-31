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

  // Debug: Log để kiểm tra dữ liệu
  console.log("All courses:", allCourses);
  console.log(
    "Course statuses:",
    allCourses.map((c) => ({
      id: c.id,
      status: c.status,
      classify: c.classify,
    }))
  );

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

    // Debug: Log cho từng phòng ban
    console.log(`Department ${dept.name}:`, {
      publicCourses: publicCourses.length,
      departmentCourses: departmentCourses.length,
      totalAvailable: totalAvailableCourses,
      completed: totalCoursesCompleted,
      inProgress: totalCoursesInProgress,
      notStarted: totalCoursesNotStarted,
    });

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

        {/* Debug info */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 2,
            color: "rgba(0,0,0,0.6)",
            fontStyle: "italic",
          }}
        >
          🔍 Debug: Tổng khóa học từ API: {allCourses.length} | Status values:{" "}
          {[...new Set(allCourses.map((c) => c.status))].join(", ")}
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
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            height: 250,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <PieChart
                            series={[
                              {
                                data: pieData,
                              },
                            ]}
                            height={250}
                            width={250}
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 2, fontWeight: "bold" }}
                          >
                            📊 Tổng quan:
                          </Typography>

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Tổng khóa học có sẵn:{" "}
                            <strong>{stat.totalAvailableCourses}</strong>
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              fontSize: "0.8rem",
                              color: "rgba(0,0,0,0.6)",
                            }}
                          >
                            &nbsp;&nbsp;├ Public: {stat.publicCoursesCount}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              fontSize: "0.8rem",
                              color: "rgba(0,0,0,0.6)",
                            }}
                          >
                            &nbsp;&nbsp;└ Department:{" "}
                            {stat.departmentCoursesCount}
                          </Typography>

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Khóa học đã hoàn thành:{" "}
                            <strong>{stat.totalCoursesCompleted}</strong>
                          </Typography>

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Khóa học chưa học:{" "}
                            <strong>{stat.totalCoursesNotStarted}</strong>
                          </Typography>

                          <Box sx={{ mt: 3 }}>
                            <Typography
                              variant="body2"
                              sx={{ mb: 2, fontWeight: "bold" }}
                            >
                              📈 Chi tiết:
                            </Typography>

                            {stat.totalCoursesCompleted > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#4caf50",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  Đã hoàn thành:{" "}
                                  <strong>{stat.totalCoursesCompleted}</strong>
                                </Typography>
                              </Box>
                            )}

                            {stat.totalCoursesInProgress > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#ff9800",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  Đang học:{" "}
                                  <strong>{stat.totalCoursesInProgress}</strong>
                                </Typography>
                              </Box>
                            )}

                            {stat.totalCoursesNotStarted > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: "#f44336",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  Chưa bắt đầu:{" "}
                                  <strong>{stat.totalCoursesNotStarted}</strong>
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
