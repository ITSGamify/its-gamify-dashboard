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
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useGetQuaters } from "@services/quater";
import { useGetStatistics } from "@services/department";
import { formatUtcToLocal } from "@utils/date";
import DepartmentStatsCard from "@components/ui/molecules/DepartmentStatsCard";
import TopPerformersCard from "@components/ui/molecules/TopPerformersCard";
import LearningStatsCard from "@components/ui/molecules/LearningStatsCard";

const StatisticPage: React.FC = () => {
  const theme = useTheme();
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

  // ✅ Prepare data cho BarChart với logic nhất quán
  const chartData = useMemo(() => {
    const deptNames = aggregatedData.map((item) => item.name);
    const series = [
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            return total + (user.user_metrics?.[0]?.point_in_quarter || 0);
          }, 0);
        }),
        label: "Tổng Điểm",
        color: theme.palette.primary.main,
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            return total + (user.user_metrics?.[0]?.course_completed_num || 0);
          }, 0);
        }),
        label: "Tổng Khóa Học Hoàn Thành",
        color: theme.palette.success.main,
      },
      {
        data: aggregatedData.map((item) => {
          return item.users.reduce((total, user) => {
            return (
              total + (user.user_metrics?.[0]?.challenge_participate_num || 0)
            );
          }, 0);
        }),
        label: "Tổng Trận Thử Thách",
        color: theme.palette.warning.main,
      },
    ];
    return { deptNames, series };
  }, [aggregatedData, theme.palette]);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoadingQuarters || isLoadingDepartments) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography variant="body1" color="text.secondary">
          Đang tải dữ liệu thống kê...
        </Typography>
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
        background: theme.palette.background.default,
        py: 0,
        px: { xs: 2, md: 3 },
      }}
    >
      <Card
        sx={{
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3, // Giảm margin bottom
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Thống kê học tập và thử thách theo phòng ban
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">📅 Chọn năm</InputLabel>
                <Select
                  labelId="year-select-label"
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
              <FormControl fullWidth>
                <InputLabel id="quarter-select-label">🗓️ Chọn quý</InputLabel>
                <Select
                  labelId="quarter-select-label"
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
        </CardContent>
      </Card>

      {!selectedQuarter ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              📅 Vui lòng chọn năm và quý để xem thống kê
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chọn thời gian để hiển thị dữ liệu thống kê chi tiết
            </Typography>
          </CardContent>
        </Card>
      ) : aggregatedData.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              📊 Không có dữ liệu thống kê cho quý này
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng thử chọn quý khác hoặc kiểm tra lại dữ liệu
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabs để chuyển đổi giữa các view */}
          <Card sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                px: 3,
                pt: 2,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: theme.palette.text.secondary,
                  minHeight: 56,
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            >
              <Tab label="📈 Tổng quan" />
              <Tab label="📊 Thống kê chi tiết" />
              <Tab label="📋 Biểu đồ" />
            </Tabs>
          </Card>

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
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mt: 3,
                    mb: 3,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  🏢 Thống kê theo phòng ban
                </Typography>
                {aggregatedData.length === 0 ? (
                  <Card sx={{ textAlign: "center", py: 4 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có dữ liệu phòng ban
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
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
                <Card>
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        mb: 3,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📊 Bảng thống kê chi tiết
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Phòng Ban
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Số Khóa Học Tham Gia
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Số Khóa Học Hoàn Thành
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Số Trận Tham Gia
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Tổng Điểm Trong Quý
                            </TableCell>
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
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {item.users.length} nhân viên
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body1" fontWeight={500}>
                                    {courseParticipatedNum}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body1" fontWeight={500}>
                                    {courseCompletedNum}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body1" fontWeight={500}>
                                    {challengeParticipateNum}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    sx={{ color: theme.palette.primary.main }}
                                  >
                                    {pointInQuarter.toLocaleString()}
                                  </Typography>
                                </TableCell>
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
                <Card>
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        mb: 3,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📈 Biểu Đồ So Sánh Giữa Các Phòng Ban
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
                <Card>
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        mb: 3,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      🎯 Biểu Đồ Tham Gia Thử Thách Theo Phòng Ban
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
                          color: theme.palette.error.main,
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
