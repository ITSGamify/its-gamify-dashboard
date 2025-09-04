import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { DepartmentStat } from "@interfaces/api/department";
import { useGetCourses } from "@services/course";

interface LearningStatsCardProps {
  departments: DepartmentStat[];
  selectedQuarterId?: string;
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({
  departments,
  selectedQuarterId,
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

  // Filter courses by selected quarter if provided
  const coursesInSelectedQuarter = selectedQuarterId
    ? allCourses.filter((c) => c.quarter_id === selectedQuarterId)
    : allCourses;

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
      const inProgress = Math.max(0, participated - completed);
      return total + inProgress;
    }, 0);

    // Tính tổng số khóa học có sẵn cho phòng ban này
    // = Public courses + Department courses của phòng ban này (chỉ tính khóa học hoạt động)

    // Helper function để kiểm tra khóa học hoạt động
    const isActiveCourse = (course: any) => {
      // Logic: Khóa học hoạt động = không phải draft và không bị xóa
      return !course.drafted && !course.is_deleted;
    };

    const publicCourses = coursesInSelectedQuarter.filter(
      (course) => course.classify === "ALL" && isActiveCourse(course)
    );

    const departmentCourses = coursesInSelectedQuarter.filter((course) => {
      const isAssignedToDept = course.course_departments?.some(
        (cd) => cd.department_id === dept.id
      );
      return (
        isAssignedToDept &&
        isActiveCourse(course) &&
        course.classify !== "LEADERONLY" &&
        course.classify !== "ALL"
      );
    });

    // Leader-only courses: available to leaders across departments.
    // Count them regardless of explicit department assignment
    const leaderOnlyCourses = coursesInSelectedQuarter.filter(
      (course) => course.classify === "LEADERONLY" && isActiveCourse(course)
    );

    const totalAvailableCourses =
      publicCourses.length +
      departmentCourses.length +
      leaderOnlyCourses.length;

    // Tổng số khóa học chưa bắt đầu: tính theo từng nhân viên dựa trên
    // số khóa có sẵn cho vai trò của họ và số khóa đã HOÀN THÀNH
    const totalCoursesNotStarted = dept.users.reduce((sum, user) => {
      const completedCount = user.user_metrics?.[0]?.course_completed_num || 0;
      const roleName =
        typeof (user as any).role === "string"
          ? ((user as any).role as string)
          : (user as any).role?.name || "";
      const isLeader = roleName.toUpperCase().includes("LEADER");
      const availableForUser =
        publicCourses.length +
        departmentCourses.length +
        (isLeader ? leaderOnlyCourses.length : 0);
      const notStarted = Math.max(0, availableForUser - completedCount);
      return sum + notStarted;
    }, 0);

    // Dev-only debug logs to verify calculations
    if (import.meta.env.DEV) {
      try {
        const perUser = dept.users.map((user) => {
          const completedCount =
            user.user_metrics?.[0]?.course_completed_num || 0;
          const participatedCount =
            user.user_metrics?.[0]?.course_participated_num || 0;
          const roleName =
            typeof (user as any).role === "string"
              ? ((user as any).role as string)
              : (user as any).role?.name || "";
          const isLeader = roleName.toUpperCase().includes("LEADER");
          const availableForUser =
            publicCourses.length +
            departmentCourses.length +
            (isLeader ? leaderOnlyCourses.length : 0);
          const notStarted = Math.max(0, availableForUser - completedCount);
          const inProgress = Math.max(0, participatedCount - completedCount);
          return {
            name: user.full_name,
            role: roleName || (user as any).role,
            available: availableForUser,
            completed: completedCount,
            inProgress,
            notStarted,
          };
        });
        console.groupCollapsed(`LearningStats · ${dept.name}`);
        console.log("Quarter:", selectedQuarterId);
        console.log(
          "Public/Dept/Leader:",
          publicCourses.length,
          departmentCourses.length,
          leaderOnlyCourses.length
        );
        console.table(perUser);
        console.log(
          "Totals => available:",
          totalAvailableCourses,
          "completed:",
          totalCoursesCompleted,
          "inProgress:",
          totalCoursesInProgress,
          "notStarted:",
          totalCoursesNotStarted
        );
        console.groupEnd();
      } catch {}
    }

    return {
      department: dept,
      totalEmployees,
      totalCoursesCompleted,
      totalCoursesInProgress,
      totalCoursesNotStarted,
      totalAvailableCourses,
      publicCoursesCount: publicCourses.length,
      departmentCoursesCount: departmentCourses.length,
      leaderOnlyCoursesCount: leaderOnlyCourses.length,
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
                  color: "#2e7d32",
                },
                {
                  id: 1,
                  value: stat.totalCoursesInProgress,
                  label: "Đang học",
                  color: "#f57c00",
                },
                {
                  id: 2,
                  value: stat.totalCoursesNotStarted,
                  label: "Chưa bắt đầu",
                  color: "#d32f2f",
                },
              ].filter((item) => item.value > 0);

              const hasData = pieData.some((item) => item.value > 0);

              // Tính top 3 Nhân viên và Leader theo điểm ngay trong phòng ban
              const usersInDept = stat.department.users || [];
              const parseRoleName = (user: any) => {
                const roleName =
                  typeof user.role === "string"
                    ? (user.role as string)
                    : user.role?.name || "";
                return (roleName || "").toUpperCase();
              };
              const userPoint = (user: any) =>
                user.user_metrics && user.user_metrics[0]
                  ? user.user_metrics[0].point_in_quarter || 0
                  : 0;

              const isLeaderUser = (user: any) =>
                parseRoleName(user).includes("LEADER");

              const top3 = (arr: any[]) =>
                arr
                  .map((u) => ({ user: u, points: userPoint(u) }))
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 3);

              const topEmployees = top3(
                usersInDept.filter((u) => !isLeaderUser(u))
              );
              const topLeaders = top3(
                usersInDept.filter((u) => isLeaderUser(u))
              );
              // Top 3 cao nhất toàn phòng ban (không phân biệt vai trò)
              const topOverall = top3(usersInDept);

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
                    <>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(255,255,255,0.8)",
                              borderRadius: 3,
                              p: 2,
                              border: "1px solid rgba(255,255,255,0.9)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                              maxWidth: "100%",
                              minHeight: 200,
                              overflow: "hidden",
                            }}
                          >
                            {pieData.length > 0 ? (
                              <>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 2,
                                    width: "100%",
                                    "& .MuiChartsLegend-root": {
                                      display: "none !important",
                                    },
                                  }}
                                >
                                  <PieChart
                                    series={[
                                      {
                                        data: pieData,
                                        innerRadius: 40,
                                        outerRadius: 70,
                                        paddingAngle: 3,
                                        cornerRadius: 2,
                                      },
                                    ]}
                                    height={150}
                                    width={150}
                                  />
                                </Box>

                                {/* Legend positioned below the chart */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    mt: 1,
                                    alignItems: "center",
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
                                          boxShadow:
                                            "0 1px 2px rgba(0,0,0,0.1)",
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
                          <Box sx={{ pl: 0 }}>
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
                                  Tất Cả: {stat.publicCoursesCount}
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
                                  Phòng Ban: {stat.departmentCoursesCount}
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
                                      backgroundColor: "#9c27b0",
                                      borderRadius: "50%",
                                    }}
                                  />
                                  Leader: {stat.leaderOnlyCoursesCount}
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

                            {/* Bỏ Top 3 khỏi grid phải */}
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Top 3 full-width dưới grid */}
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: "#1565c0",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            fontSize: { xs: "1rem", md: "1.1rem" },
                          }}
                        >
                          📈 Chi tiết: Top 3 theo điểm
                        </Typography>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg, rgba(21,101,192,0.06), rgba(21,101,192,0.02))",
                            border: "1px solid rgba(21,101,192,0.18)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              color: "#0d47a1",
                              letterSpacing: 0.2,
                              fontSize: { xs: "0.95rem", md: "1rem" },
                            }}
                          >
                            Top 3 điểm cao nhất (phòng ban)
                          </Typography>
                          {topOverall.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              Không có dữ liệu
                            </Typography>
                          ) : (
                            topOverall.map((item: any, idx: number) => (
                              <Box
                                key={item.user.id}
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "auto 1fr auto",
                                  alignItems: "center",
                                  gap: { xs: 1, md: 1.5 },
                                  p: { xs: 0.75, md: 1 },
                                  borderRadius: 1,
                                  transition: "background .2s ease",
                                  "&:not(:last-of-type)": { mb: 1 },
                                  "&:hover": {
                                    background: "rgba(13,71,161,0.06)",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    backgroundColor:
                                      idx === 0
                                        ? "#FFD700"
                                        : idx === 1
                                        ? "#C0C0C0"
                                        : "#CD7F32",
                                    color: "#000",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                                  }}
                                >
                                  {idx + 1}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: "0.95rem", md: "1rem" },
                                    }}
                                  >
                                    {item.user.full_name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {parseRoleName(item.user)}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    textAlign: "right",
                                    minWidth: { xs: 88, md: 100 },
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#1565c0",
                                      fontSize: { xs: "0.95rem", md: "1rem" },
                                    }}
                                  >
                                    {item.points.toLocaleString()} điểm
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                          )}
                        </Box>
                      </Box>
                    </>
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
