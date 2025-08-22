import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box, Grid, Chip } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { DepartmentStat } from "@interfaces/api/department";

interface ChallengeStatsCardProps {
  departments: DepartmentStat[];
}

const ChallengeStatsCard: React.FC<ChallengeStatsCardProps> = ({
  departments,
}) => {
  // Tính toán thống kê thử thách - Tổng số lần tham gia/thắng (match với bảng thống kê)
  const allUsers = departments.flatMap((dept) => dept.users);

  const totalParticipants = allUsers.reduce((total, user) => {
    return (
      total +
      (user.user_metrics && user.user_metrics.length > 0
        ? user.user_metrics[0].challenge_participate_num
        : 0)
    );
  }, 0);

  const averagePoints =
    allUsers
      .filter((user) => user.user_metrics && user.user_metrics.length > 0)
      .reduce((sum, user) => sum + user.user_metrics[0].point_in_quarter, 0) /
      allUsers.filter(
        (user) => user.user_metrics && user.user_metrics.length > 0
      ).length || 0;

  // Tạo data cho biểu đồ cột từ dữ liệu thực tế API
  const chartData = useMemo(() => {
    // Hiển thị data thực từ API - so sánh giữa các phòng ban
    return {
      departments: departments.map((dept) => dept.name),
      participants: departments.map((dept) =>
        dept.users.reduce(
          (total, user) =>
            total + (user.user_metrics?.[0]?.challenge_participate_num || 0),
          0
        )
      ),
    };
  }, [departments]);

  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê thử thách (Tổng hợp)
        </Typography>

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 6 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {totalParticipants}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lần tham gia
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 6 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {averagePoints.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm TB
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ChallengeStatsCard;
