import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useGetQuaters } from "@services/quater";
import { useGetStatistics } from "@services/department";
import { formatUtcToLocal } from "@utils/date";
import DepartmentStatsCard from "@components/ui/molecules/DepartmentStatsCard";
import TopPerformersCard from "@components/ui/molecules/TopPerformersCard";
import LearningStatsCard from "@components/ui/molecules/LearningStatsCard";

const StatisticPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);

  const { data: quarterDatas, isLoading: isLoadingQuarters } = useGetQuaters({
    page: 0,
    limit: 100,
  });

  const { data: departmentDatas, isLoading: isLoadingDepartments } =
    useGetStatistics({
      quarterId: selectedQuarter,
      page: 0,
      limit: 100,
      q: "",
    });

  const quarters = quarterDatas?.data || [];
  const departments = departmentDatas?.data || [];
  const aggregatedData = departments || [];

  // Lấy danh sách năm từ quarters
  const availableYears = useMemo(() => {
    const years = [...new Set(quarters.map((q) => q.year))].sort(
      (a, b) => b - a
    );
    return years;
  }, [quarters]);

  // Lấy quarters theo năm đã chọn
  const quartersByYear = useMemo(() => {
    return quarters.filter((q) => q.year === selectedYear);
  }, [quarters, selectedYear]);

  // Chọn quý mặc định khi năm thay đổi
  useEffect(() => {
    if (quartersByYear.length > 0) {
      const latestQuarter = quartersByYear[quartersByYear.length - 1];
      setSelectedQuarter(latestQuarter.id);
    } else {
      setSelectedQuarter("");
    }
  }, [quartersByYear]);

  // Prepare data cho BarChart
  const chartData = useMemo(() => {
    const deptNames = aggregatedData.map((item) => item.name);
    const series = [
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].point_in_quarter
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Tổng Điểm",
        color: "#1976d2",
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].course_participated_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Khóa Học Tham Gia",
        color: "#4caf50", // Green
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].course_completed_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Khóa Học Hoàn Thành",
        color: "#ffeb3b", // Yellow
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].challenge_participate_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Thử Thách Tham Gia",
        color: "#f44336", // Red
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].challenge_award_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Giải Thưởng Thử Thách",
        color: "#9c27b0", // Purple
      },
    ];
    return { deptNames, series };
  }, [aggregatedData]);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoadingQuarters || isLoadingDepartments) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header với dropdown chọn quý */}
      <Box
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          p: 4,
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 700, position: "relative", zIndex: 1 }}
        >
          📊 Dashboard Manager
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.9, mb: 3, position: "relative", zIndex: 1 }}
        >
          Thống kê học tập và thử thách theo phòng ban
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <InputLabel>📅 Chọn năm</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as number)}
                label="📅 Chọn năm"
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    Năm {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <InputLabel>🗓️ Chọn quý</InputLabel>
              <Select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value as string)}
                label="🗓️ Chọn quý"
                disabled={quartersByYear.length === 0}
              >
                {quartersByYear.map((quarter) => (
                  <MenuItem key={quarter.id} value={quarter.id}>
                    {quarter.name} ({formatUtcToLocal(quarter.start_date)} đến{" "}
                    {formatUtcToLocal(quarter.end_date)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {!selectedQuarter ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Vui lòng chọn năm và quý để xem thống kê.
        </Typography>
      ) : aggregatedData.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Không có dữ liệu thống kê cho quý này.
        </Typography>
      ) : (
        <>
          {/* Tabs để chuyển đổi giữa các view */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 4,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#666",
                  "&.Mui-selected": {
                    color: "#1976d2",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                },
              }}
            >
              <Tab label="📈 Tổng quan" />
              <Tab label="📊 Thống kê chi tiết" />
              <Tab label="📋 Biểu đồ" />
            </Tabs>
          </Box>

          {/* Tab 1: Tổng quan */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Top Performers */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TopPerformersCard departments={aggregatedData} />
              </Grid>

              {/* Learning Stats */}
              <Grid size={{ xs: 12, md: 6 }}>
                <LearningStatsCard departments={aggregatedData} />
              </Grid>

              {/* Department Stats Cards */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Thống kê theo phòng ban
                </Typography>
                {aggregatedData.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Chưa có dữ liệu phòng ban
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {aggregatedData.map((department) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={department.id}>
                        <DepartmentStatsCard department={department} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Thống kê chi tiết */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Bảng thống kê chi tiết
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Phòng Ban</TableCell>
                            <TableCell>Số Khóa Học Tham Gia</TableCell>
                            <TableCell>Số Khóa Học Hoàn Thành</TableCell>
                            <TableCell>Số Thử Thách Tham Gia</TableCell>
                            <TableCell>Tổng Điểm Trong Quý</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {aggregatedData.map((item) => {
                            const pointInQuarter = item.users.reduce(
                              (total, user) => {
                                return (
                                  total +
                                  (user.user_metrics &&
                                  user.user_metrics.length > 0
                                    ? user.user_metrics[0].point_in_quarter
                                    : 0)
                                );
                              },
                              0
                            );

                            const courseParticipatedNum = item.users.reduce(
                              (total, user) => {
                                return (
                                  total +
                                  (user.user_metrics &&
                                  user.user_metrics.length > 0
                                    ? user.user_metrics[0]
                                        .course_participated_num
                                    : 0)
                                );
                              },
                              0
                            );

                            const courseCompletedNum = item.users.reduce(
                              (total, user) => {
                                return (
                                  total +
                                  (user.user_metrics &&
                                  user.user_metrics.length > 0
                                    ? user.user_metrics[0].course_completed_num
                                    : 0)
                                );
                              },
                              0
                            );

                            const challengeParticipateNum = item.users.reduce(
                              (total, user) => {
                                return (
                                  total +
                                  (user.user_metrics &&
                                  user.user_metrics.length > 0
                                    ? user.user_metrics[0]
                                        .challenge_participate_num
                                    : 0)
                                );
                              },
                              0
                            );

                            return (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.name} ({item.users.length} nhân viên)
                                </TableCell>
                                <TableCell>{courseParticipatedNum}</TableCell>
                                <TableCell>{courseCompletedNum}</TableCell>
                                <TableCell>{challengeParticipateNum}</TableCell>
                                <TableCell>{pointInQuarter}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tab 3: Biểu đồ */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              {/* Biểu đồ cột tổng hợp */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Biểu Đồ So Sánh Giữa Các Phòng Ban
                    </Typography>
                    <BarChart
                      xAxis={[{ scaleType: "band", data: chartData.deptNames }]}
                      series={chartData.series}
                      height={400}
                      slotProps={{
                        legend: {
                          direction: "horizontal",
                          position: { vertical: "top", horizontal: "center" },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Biểu đồ cột thử thách */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Biểu Đồ Tham Gia Thử Thách Theo Phòng Ban
                    </Typography>
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: aggregatedData.map((dept) => dept.name),
                          label: "Phòng ban",
                        },
                      ]}
                      series={[
                        {
                          data: aggregatedData.map((dept) =>
                            dept.users.reduce(
                              (total, user) =>
                                total +
                                (user.user_metrics?.[0]
                                  ?.challenge_participate_num || 0),
                              0
                            )
                          ),
                          label: "Lần tham gia thử thách",
                          color: "#d32f2f",
                        },
                      ]}
                      height={400}
                      slotProps={{
                        legend: {
                          direction: "horizontal",
                          position: { vertical: "top", horizontal: "center" },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default StatisticPage;
