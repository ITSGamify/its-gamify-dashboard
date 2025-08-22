import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { DepartmentStat } from "@interfaces/api/department";

interface LearningStatsCardProps {
  departments: DepartmentStat[];
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({
  departments,
}) => {
  // Tính toán thống kê học tập
  const allUsers = departments.flatMap((dept) => dept.users);

  const completedUsers = allUsers.filter(
    (user) =>
      user.user_metrics &&
      user.user_metrics.length > 0 &&
      user.user_metrics[0].course_completed_num > 0
  ).length;

  const inProgressUsers = allUsers.filter(
    (user) =>
      user.user_metrics &&
      user.user_metrics.length > 0 &&
      user.user_metrics[0].course_participated_num > 0 &&
      user.user_metrics[0].course_completed_num === 0
  ).length;

  const notStartedUsers = allUsers.filter(
    (user) =>
      !user.user_metrics ||
      user.user_metrics.length === 0 ||
      (user.user_metrics[0].course_participated_num === 0 &&
        user.user_metrics[0].course_completed_num === 0)
  ).length;

  const pieData = [
    { id: 0, value: completedUsers, label: "Đã hoàn thành", color: "#4caf50" },
    { id: 1, value: inProgressUsers, label: "Đang học", color: "#ff9800" },
    { id: 2, value: notStartedUsers, label: "Chưa bắt đầu", color: "#f44336" },
  ];

  const hasData = pieData.some((item) => item.value > 0);

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
          📚 Thống kê học tập
        </Typography>

        {!hasData ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Chưa có dữ liệu thống kê học tập
          </Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{ height: 300, display: "flex", justifyContent: "center" }}
              >
                <PieChart
                  series={[
                    {
                      data: pieData.filter((item) => item.value > 0),
                    },
                  ]}
                  height={300}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    Đã hoàn thành: <strong>{completedUsers}</strong>
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    Đang học: <strong>{inProgressUsers}</strong>
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    Chưa bắt đầu: <strong>{notStartedUsers}</strong>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
