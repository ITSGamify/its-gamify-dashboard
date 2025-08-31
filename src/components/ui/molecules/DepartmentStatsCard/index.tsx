import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { DepartmentStat } from "@interfaces/api/department";

interface DepartmentStatsCardProps {
  department: DepartmentStat;
}

const DepartmentStatsCard: React.FC<DepartmentStatsCardProps> = ({
  department,
}) => {
  // Tính toán các metrics với logic nhất quán
  const totalEmployees = department.users.length;

  // ✅ Tổng khóa học hoàn thành
  const totalCoursesCompleted = department.users.reduce(
    (total, user) =>
      total + (user.user_metrics?.[0]?.course_completed_num || 0),
    0
  );

  // ✅ Tổng trận thử thách
  const totalChallengesParticipated = department.users.reduce(
    (total, user) =>
      total + (user.user_metrics?.[0]?.challenge_participate_num || 0),
    0
  );

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
          {/* Tổng khóa học hoàn thành */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              🎓 Tổng khóa học hoàn thành
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "white" }}
            >
              {totalCoursesCompleted}
            </Typography>
          </Box>

          {/* Tổng trận thử thách */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              🏆 Tổng trận thử thách
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "white" }}
            >
              {totalChallengesParticipated}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatsCard;
