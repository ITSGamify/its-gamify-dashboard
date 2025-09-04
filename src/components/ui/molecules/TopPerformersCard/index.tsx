import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { DepartmentStat } from "@interfaces/api/department";

interface TopPerformersCardProps {
  departments: DepartmentStat[];
}

const TopPerformersCard: React.FC<TopPerformersCardProps> = ({
  departments,
}) => {
  // Tính toán top 3 performers từ tất cả departments
  const allUsers = departments.flatMap((dept) => dept.users);

  const topPerformers = allUsers
    .filter((user) => user.user_metrics && user.user_metrics.length > 0)
    .map((user) => ({
      user,
      points: user.user_metrics[0].point_in_quarter,
      department:
        departments.find((dept) => dept.users.some((u) => u.id === user.id))
          ?.name || "Unknown",
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      case 4:
        return "#2E8B57"; // Sea Green
      default:
        return "#1976d2";
    }
  };

  return (
    <Card
      sx={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🏆 Top 5 Xuất sắc
        </Typography>

        {topPerformers.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Chưa có dữ liệu người dùng xuất sắc
          </Typography>
        ) : (
          topPerformers.map((performer, index) => (
            <Box
              key={performer.user.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(8px)",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ position: "relative", mr: 2 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: getRankColor(index + 1),
                  }}
                >
                  {performer.user.full_name.charAt(0)}
                </Avatar>
                <Chip
                  label={`#${index + 1}`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: getRankColor(index + 1),
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {performer.user.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {performer.department}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {performer.points.toLocaleString()} điểm
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformersCard;
