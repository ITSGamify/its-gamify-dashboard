import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import { DepartmentStat } from "@interfaces/api/department";

interface DepartmentStatsCardProps {
  department: DepartmentStat;
}

const DepartmentStatsCard: React.FC<DepartmentStatsCardProps> = ({
  department,
}) => {
  // Tính toán các metrics
  const totalEmployees = department.users.length;
  const activeLearners = department.users.filter(
    (user) =>
      user.user_metrics &&
      user.user_metrics.length > 0 &&
      user.user_metrics[0].course_participated_num > 0
  ).length;
  const challengeParticipants = department.users.filter(
    (user) =>
      user.user_metrics &&
      user.user_metrics.length > 0 &&
      user.user_metrics[0].challenge_participate_num > 0
  ).length;

  const participationRate =
    totalEmployees > 0 ? (activeLearners / totalEmployees) * 100 : 0;
  const challengeRate =
    totalEmployees > 0 ? (challengeParticipants / totalEmployees) * 100 : 0;

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        borderRadius: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🏢 {department.name}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
          👥 {totalEmployees} nhân viên
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              📊 Tỷ lệ tham gia
            </Typography>
            <Chip
              label={`${participationRate.toFixed(0)}%`}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
              }}
              size="small"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={participationRate}
            sx={{
              mb: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50",
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              🎓 Người học
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "white" }}
            >
              {activeLearners} ({participationRate.toFixed(0)}% tổng số)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              🏆 Thử thách
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "white" }}
            >
              {challengeParticipants} ({challengeRate.toFixed(0)}% tổng số)
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatsCard;
