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
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useGetQuaters } from "@services/quater";
import { useGetStatistics } from "@services/department";
import { formatUtcToLocal } from "@utils/date";

const StatisticPage: React.FC = () => {
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("");

  const { data: quarterDatas, isLoading: isLoadingQuarters } = useGetQuaters({
    page: 0,
    limit: 100,
  });

  const { data: departmentDatas, isLoading: isLoadingDepartments } =
    useGetStatistics({
      quarterId: selectedQuarterId,
      page: 0,
      limit: 100,
      q: "",
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const quarters = quarterDatas?.data || [];

  const departments = departmentDatas?.data || [];
  // Sử dụng departments trực tiếp làm aggregatedData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const aggregatedData = departments || [];

  // Chọn quý mặc định (quý mới nhất) khi quarters tải xong
  useEffect(() => {
    if (quarters?.length > 0 && !selectedQuarterId) {
      const latestQuarter = quarters[quarters.length - 1];
      setSelectedQuarterId(latestQuarter.id);
    }
  }, [quarters, selectedQuarterId]);

  // Prepare data cho BarChart
  const chartData = useMemo(() => {
    const deptNames = aggregatedData.map((item) => item.name);
    const series = [
      {
        data: aggregatedData.map((item) => {
          // Tính tổng điểm từ tất cả users trong department
          return item.users.reduce((total, user) => {
            // Lấy point_in_quarter từ phần tử đầu tiên trong user_metrics (nếu có)
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
          // Tính tổng điểm từ tất cả users trong department
          return item.users.reduce((total, user) => {
            // Lấy point_in_quarter từ phần tử đầu tiên trong user_metrics (nếu có)
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].course_participated_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Khóa Học Tham Gia",
        color: "#388e3c",
      },
      {
        data: aggregatedData.map((item) => {
          // Tính tổng điểm từ tất cả users trong department
          return item.users.reduce((total, user) => {
            // Lấy point_in_quarter từ phần tử đầu tiên trong user_metrics (nếu có)
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].course_completed_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Khóa Học Hoàn Thành",
        color: "#fbc02d",
      },
      {
        data: aggregatedData.map((item) => {
          // Tính tổng điểm từ tất cả users trong department
          return item.users.reduce((total, user) => {
            // Lấy point_in_quarter từ phần tử đầu tiên trong user_metrics (nếu có)
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].challenge_participate_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Thử Thách Tham Gia",
        color: "#d32f2f",
      },
      {
        data: aggregatedData.map((item) => {
          // Tính tổng điểm từ tất cả users trong department
          return item.users.reduce((total, user) => {
            // Lấy point_in_quarter từ phần tử đầu tiên trong user_metrics (nếu có)
            const pointInQuarter =
              user.user_metrics && user.user_metrics.length > 0
                ? user.user_metrics[0].challenge_award_num
                : 0;
            return total + pointInQuarter;
          }, 0);
        }),
        label: "Giải Thưởng Thử Thách",
        color: "#7b1fa2",
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

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Chọn Quý</InputLabel>
            <Select
              value={selectedQuarterId}
              onChange={(e) => setSelectedQuarterId(e.target.value as string)}
              label="Chọn Quý"
            >
              {quarters.map((quarter) => (
                <MenuItem key={quarter.id} value={quarter.id}>
                  {quarter.name} - Năm {quarter.year} (
                  {formatUtcToLocal(quarter.start_date)} đến{" "}
                  {formatUtcToLocal(quarter.end_date)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {aggregatedData.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Không có dữ liệu thống kê cho quý này.
        </Typography>
      ) : (
        <>
          {/* Phần Biểu Đồ */}
          <Card sx={{ mt: 4, boxShadow: 3 }}>
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

          {/* Phần Table */}
          <Card sx={{ mt: 4, boxShadow: 3 }}>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Phòng Ban</TableCell>
                      <TableCell>Số Khóa Học Tham Gia</TableCell>
                      <TableCell>Số Khóa Học Hoàn Thành</TableCell>
                      <TableCell>Số Thử Thách Tham Gia</TableCell>
                      <TableCell>Số Giải Thưởng Thử Thách</TableCell>
                      <TableCell>Tổng Điểm Trong Quý</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aggregatedData.map((item) => {
                      // Tính toán các metrics từ user_metrics của tất cả users trong department
                      const pointInQuarter = item.users.reduce(
                        (total, user) => {
                          return (
                            total +
                            (user.user_metrics && user.user_metrics.length > 0
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
                            (user.user_metrics && user.user_metrics.length > 0
                              ? user.user_metrics[0].course_participated_num
                              : 0)
                          );
                        },
                        0
                      );

                      const courseCompletedNum = item.users.reduce(
                        (total, user) => {
                          return (
                            total +
                            (user.user_metrics && user.user_metrics.length > 0
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
                            (user.user_metrics && user.user_metrics.length > 0
                              ? user.user_metrics[0].challenge_participate_num
                              : 0)
                          );
                        },
                        0
                      );

                      const challengeAwardNum = item.users.reduce(
                        (total, user) => {
                          return (
                            total +
                            (user.user_metrics && user.user_metrics.length > 0
                              ? user.user_metrics[0].challenge_award_num
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
                          <TableCell>{challengeAwardNum}</TableCell>
                          <TableCell>{pointInQuarter}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default StatisticPage;
