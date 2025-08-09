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
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart"; // Import BarChart từ @mui/x-charts

// Interfaces (giữ nguyên từ yêu cầu)
export interface Metric {
  id: string;
  course_participated_num: number;
  course_completed_num: number;
  challenge_participate_num: number;
  challenge_award_num: number;
  point_in_quarter: number;
  user_id: string;
  user: User;
  quarter_id: string;
  quarter: Quarter;
}

export interface Quarter {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  location: string;
  leader: User;
  employee_count: number;
}

interface User {
  id: string;
  full_name: string;
  department_id: string; // Giả định để group by department
  // Các trường khác...
}

// Data mẫu hardcoded
const sampleQuarters: Quarter[] = [
  {
    id: "q1-2024",
    name: "Q1",
    year: 2024,
    start_date: "2024-01-01",
    end_date: "2024-03-31",
  },
  {
    id: "q2-2024",
    name: "Q2",
    year: 2024,
    start_date: "2024-04-01",
    end_date: "2024-06-30",
  },
];

const sampleDepartments: Department[] = [
  {
    id: "dept-hr",
    name: "HR",
    description: "Human Resources",
    location: "Headquarter",
    leader: {
      id: "user-leader-hr",
      full_name: "Leader HR",
      department_id: "dept-hr",
    },
    employee_count: 10,
  },
  {
    id: "dept-it",
    name: "IT",
    description: "Information Technology",
    location: "Tech Building",
    leader: {
      id: "user-leader-it",
      full_name: "Leader IT",
      department_id: "dept-it",
    },
    employee_count: 15,
  },
  {
    id: "dept-sales",
    name: "Sales",
    description: "Sales Department",
    location: "Sales Office",
    leader: {
      id: "user-leader-sales",
      full_name: "Leader Sales",
      department_id: "dept-sales",
    },
    employee_count: 20,
  },
];

// Metrics mẫu cho từng quarter (map từ quarterId đến Metric[])
const sampleMetricsByQuarter: Record<string, Metric[]> = {
  "q1-2024": [
    // HR users
    {
      id: "metric-1",
      course_participated_num: 5,
      course_completed_num: 3,
      challenge_participate_num: 2,
      challenge_award_num: 1,
      point_in_quarter: 150,
      user_id: "user-hr-1",
      user: {
        id: "user-hr-1",
        full_name: "User HR 1",
        department_id: "dept-hr",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
    {
      id: "metric-2",
      course_participated_num: 4,
      course_completed_num: 2,
      challenge_participate_num: 3,
      challenge_award_num: 0,
      point_in_quarter: 120,
      user_id: "user-hr-2",
      user: {
        id: "user-hr-2",
        full_name: "User HR 2",
        department_id: "dept-hr",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
    // IT users
    {
      id: "metric-3",
      course_participated_num: 6,
      course_completed_num: 5,
      challenge_participate_num: 4,
      challenge_award_num: 2,
      point_in_quarter: 200,
      user_id: "user-it-1",
      user: {
        id: "user-it-1",
        full_name: "User IT 1",
        department_id: "dept-it",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
    {
      id: "metric-4",
      course_participated_num: 7,
      course_completed_num: 6,
      challenge_participate_num: 5,
      challenge_award_num: 3,
      point_in_quarter: 250,
      user_id: "user-it-2",
      user: {
        id: "user-it-2",
        full_name: "User IT 2",
        department_id: "dept-it",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
    // Sales users
    {
      id: "metric-5",
      course_participated_num: 3,
      course_completed_num: 1,
      challenge_participate_num: 1,
      challenge_award_num: 0,
      point_in_quarter: 80,
      user_id: "user-sales-1",
      user: {
        id: "user-sales-1",
        full_name: "User Sales 1",
        department_id: "dept-sales",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
    {
      id: "metric-6",
      course_participated_num: 4,
      course_completed_num: 2,
      challenge_participate_num: 2,
      challenge_award_num: 1,
      point_in_quarter: 100,
      user_id: "user-sales-2",
      user: {
        id: "user-sales-2",
        full_name: "User Sales 2",
        department_id: "dept-sales",
      },
      quarter_id: "q1-2024",
      quarter: sampleQuarters[0],
    },
  ],
  "q2-2024": [
    // HR users (data khác để test thay đổi)
    {
      id: "metric-7",
      course_participated_num: 6,
      course_completed_num: 4,
      challenge_participate_num: 3,
      challenge_award_num: 2,
      point_in_quarter: 180,
      user_id: "user-hr-1",
      user: {
        id: "user-hr-1",
        full_name: "User HR 1",
        department_id: "dept-hr",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
    {
      id: "metric-8",
      course_participated_num: 5,
      course_completed_num: 3,
      challenge_participate_num: 4,
      challenge_award_num: 1,
      point_in_quarter: 140,
      user_id: "user-hr-2",
      user: {
        id: "user-hr-2",
        full_name: "User HR 2",
        department_id: "dept-hr",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
    // IT users
    {
      id: "metric-9",
      course_participated_num: 8,
      course_completed_num: 7,
      challenge_participate_num: 6,
      challenge_award_num: 4,
      point_in_quarter: 300,
      user_id: "user-it-1",
      user: {
        id: "user-it-1",
        full_name: "User IT 1",
        department_id: "dept-it",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
    {
      id: "metric-10",
      course_participated_num: 9,
      course_completed_num: 8,
      challenge_participate_num: 7,
      challenge_award_num: 5,
      point_in_quarter: 350,
      user_id: "user-it-2",
      user: {
        id: "user-it-2",
        full_name: "User IT 2",
        department_id: "dept-it",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
    // Sales users
    {
      id: "metric-11",
      course_participated_num: 4,
      course_completed_num: 2,
      challenge_participate_num: 2,
      challenge_award_num: 1,
      point_in_quarter: 100,
      user_id: "user-sales-1",
      user: {
        id: "user-sales-1",
        full_name: "User Sales 1",
        department_id: "dept-sales",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
    {
      id: "metric-12",
      course_participated_num: 5,
      course_completed_num: 3,
      challenge_participate_num: 3,
      challenge_award_num: 2,
      point_in_quarter: 120,
      user_id: "user-sales-2",
      user: {
        id: "user-sales-2",
        full_name: "User Sales 2",
        department_id: "dept-sales",
      },
      quarter_id: "q2-2024",
      quarter: sampleQuarters[1],
    },
  ],
};

const StatisticPage: React.FC = () => {
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("");

  const quarters = sampleQuarters;
  const departments = sampleDepartments;

  // Simulate "fetch" metrics từ data hardcoded dựa trên selectedQuarterId
  const metrics = useMemo(
    () => sampleMetricsByQuarter[selectedQuarterId] || [],
    [selectedQuarterId]
  );

  // Set default quarter khi load
  useEffect(() => {
    if (quarters.length > 0 && !selectedQuarterId) {
      setSelectedQuarterId(quarters[0].id); // Chọn quý đầu tiên mặc định
    }
  }, [quarters, selectedQuarterId]);

  // Tổng hợp metrics theo department (sử dụng useMemo để tối ưu)
  const aggregatedData = useMemo(() => {
    if (!metrics || !departments) return [];

    // Group metrics by department_id (từ user.department_id)
    const deptMetrics = metrics.reduce(
      (acc: Record<string, Metric>, metric: Metric) => {
        const deptId = metric.user.department_id; // Giả định user có department_id
        if (!acc[deptId]) {
          acc[deptId] = {
            id: deptId,
            course_participated_num: 0,
            course_completed_num: 0,
            challenge_participate_num: 0,
            challenge_award_num: 0,
            point_in_quarter: 0,
            user_id: "", // Không cần
            user: {} as User,
            quarter_id: selectedQuarterId,
            quarter: {} as Quarter,
          };
        }
        acc[deptId].course_participated_num += metric.course_participated_num;
        acc[deptId].course_completed_num += metric.course_completed_num;
        acc[deptId].challenge_participate_num +=
          metric.challenge_participate_num;
        acc[deptId].challenge_award_num += metric.challenge_award_num;
        acc[deptId].point_in_quarter += metric.point_in_quarter;
        return acc;
      },
      {}
    );

    // Map với department details
    return departments.map((dept) => ({
      department: dept,
      metrics: deptMetrics[dept.id] || {
        course_participated_num: 0,
        course_completed_num: 0,
        challenge_participate_num: 0,
        challenge_award_num: 0,
        point_in_quarter: 0,
      },
    }));
  }, [metrics, departments, selectedQuarterId]);

  // Prepare data cho BarChart (dùng aggregatedData)
  const chartData = useMemo(() => {
    const deptNames = aggregatedData.map((item) => item.department.name);
    const series = [
      {
        data: aggregatedData.map((item) => item.metrics.point_in_quarter),
        label: "Tổng Điểm",
        color: "#1976d2", // Màu xanh MUI
      },
      {
        data: aggregatedData.map(
          (item) => item.metrics.course_participated_num
        ),
        label: "Khóa Học Tham Gia",
        color: "#388e3c",
      },
      {
        data: aggregatedData.map((item) => item.metrics.course_completed_num),
        label: "Khóa Học Hoàn Thành",
        color: "#fbc02d",
      },
      {
        data: aggregatedData.map(
          (item) => item.metrics.challenge_participate_num
        ),
        label: "Thử Thách Tham Gia",
        color: "#d32f2f",
      },
      {
        data: aggregatedData.map((item) => item.metrics.challenge_award_num),
        label: "Giải Thưởng Thử Thách",
        color: "#7b1fa2",
      },
    ];
    return { deptNames, series };
  }, [aggregatedData]);

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
                  {quarter.name} - Năm {quarter.year} ({quarter.start_date} đến{" "}
                  {quarter.end_date})
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
                Biểu Đồ So Sánh Metrics Giữa Các Phòng Ban
              </Typography>
              <BarChart
                xAxis={[{ scaleType: "band", data: chartData.deptNames }]}
                series={chartData.series}
                height={400} // Chiều cao biểu đồ
                slotProps={{
                  legend: {
                    direction: "horizontal",
                    position: { vertical: "top", horizontal: "center" },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Phần Table (giữ nguyên để xem chi tiết) */}
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
                    {aggregatedData.map(({ department, metrics }) => (
                      <TableRow key={department.id}>
                        <TableCell>
                          {department.name} ({department.employee_count} nhân
                          viên)
                        </TableCell>
                        <TableCell>{metrics.course_participated_num}</TableCell>
                        <TableCell>{metrics.course_completed_num}</TableCell>
                        <TableCell>
                          {metrics.challenge_participate_num}
                        </TableCell>
                        <TableCell>{metrics.challenge_award_num}</TableCell>
                        <TableCell>{metrics.point_in_quarter}</TableCell>
                      </TableRow>
                    ))}
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
