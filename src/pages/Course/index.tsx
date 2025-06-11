import { useMemo, useState } from "react";
import { DataTable, HeadCell } from "@components/ui/molecules/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  FormControlLabel,
  Paper,
  Rating,
  Switch,
  TableCell,
  TablePagination,
} from "@mui/material";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import CourseDefaultImage from "@assets/images/its_gamify_course_default.png";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import CourseFilterButton from "@components/ui/molecules/CourseFilterPopper";
interface Course {
  id: number;
  title: string;
  sessions: number;
  department: string;
  reviews: number;
}

const departments = [
  { id: "it", label: "Công nghệ thông tin" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "Nhân sự" },
  { id: "finance", label: "Tài chính" },
  { id: "operations", label: "Vận hành" },
];

const courseData = [
  {
    id: 1,
    title: "Lập trình JavaScript nâng cao",
    sessions: 12,
    department: "it",
    reviews: 4.8,
  },
  {
    id: 2,
    title: "Digital Marketing cơ bản",
    sessions: 8,
    department: "marketing",
    reviews: 4.5,
  },
  {
    id: 3,
    title: "Quản lý nhân sự hiện đại",
    sessions: 10,
    department: "hr",
    reviews: 4.2,
  },
  {
    id: 4,
    title: "Phân tích tài chính doanh nghiệp",
    sessions: 15,
    department: "finance",
    reviews: 4.7,
  },
  {
    id: 5,
    title: "Quản lý chuỗi cung ứng",
    sessions: 9,
    department: "operations",
    reviews: 4.0,
  },
  {
    id: 6,
    title: "Phát triển ứng dụng di động với React Native",
    sessions: 14,
    department: "it",
    reviews: 4.9,
  },
  {
    id: 7,
    title: "Content Marketing chuyên nghiệp",
    sessions: 6,
    department: "marketing",
    reviews: 3.8,
  },
  {
    id: 8,
    title: "Tuyển dụng và đào tạo nhân viên",
    sessions: 8,
    department: "hr",
    reviews: 4.3,
  },
  {
    id: 9,
    title: "Đầu tư chứng khoán cho người mới bắt đầu",
    sessions: 10,
    department: "finance",
    reviews: 4.6,
  },
  {
    id: 10,
    title: "Tối ưu hóa quy trình sản xuất",
    sessions: 12,
    department: "operations",
    reviews: 4.1,
  },
];

const headCells: HeadCell[] = [
  {
    id: "title",
    numeric: false,
    align: "left",
    disablePadding: true,
    label: "Tên khóa học",
  },
  {
    id: "sessions",
    numeric: true,
    align: "left",
    disablePadding: true,
    label: "Số chương",
  },
  {
    id: "department",
    numeric: false,
    align: "left",
    disablePadding: true,
    label: "Phòng ban",
  },
  {
    id: "reviews",
    numeric: true,
    align: "left",
    disablePadding: true,
    label: "Đánh giá",
  },
  {
    id: "action",
    numeric: false,
    align: "right",
    disablePadding: true,
    label: "",
  },
];

type Order = "asc" | "desc";

interface CourseFilterValues {
  departments: string[];
}

const CoursePage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  //#region table

  const handleCreateCouse = () => {
    navigate(PATH.COURSES_CREATE);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // const newSelected = Array.from(
      //   { length: courseData.length },
      //   (_, index) => index
      // );
      // setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>(headCells[0]?.id || "");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  //#endregion

  //#region Thu gọn
  const [dense, setDense] = useState(false);

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };
  //#endregion

  const menuItems = [
    {
      icon: <VisibilityIcon color="action" />,
      label: "Xem chi tiết",
      onClick: () => {},
    },
    {
      icon: <EditIcon color="action" />,
      label: "Chỉnh sửa",
      onClick: () => {},
    },
    {
      icon: <DeleteOutlineIcon color="error" />,
      label: "Tạm ngưng",
      onClick: () => {},
      sx: { color: "red" },
    },
  ];

  const visibleRows = useMemo(
    () =>
      courseData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [ page, rowsPerPage]
  );

  const dataTable = visibleRows.map((row: Course) => {
    return [
      <TableCell key="name" component="th" scope="row" padding="none">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>
            <img
              src={CourseDefaultImage}
              alt={row.title}
              style={{
                width: 40,
                height: 40,
                borderRadius: "4px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "@assets/images/its_gamify_course_default.png";
              }}
            />
          </Box>
          {row.title}
        </Box>
      </TableCell>,
      <TableCell key="email" align="left">
        {row.sessions}
      </TableCell>,
      <TableCell key="department" align="left">
        {row.department}
      </TableCell>,
      <TableCell key="role" align="left">
        <Rating name="read-only" value={row.reviews} readOnly />
      </TableCell>,
      <TableCell key="action" align="right">
        <TableActionButton menuItems={menuItems} />
      </TableCell>,
    ];
  });

  const [filters, setFilters] = useState<CourseFilterValues>({
    departments: [],
  });

  const handleFilterChange = (newFilters: CourseFilterValues) => {
    setFilters(newFilters);
    console.log("Filters applied:", newFilters);
    // Thực hiện logic lọc dữ liệu ở đây
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            numSelected={selected.length}
            onCreate={handleCreateCouse}
            createLabel="Tạo khóa học"
            filterButton={
              <CourseFilterButton
                departments={departments}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            }
          />
          <DataTable
            headCells={headCells}
            data={dataTable}
            dense={dense}
            page={page}
            rowsPerPage={rowsPerPage}
            selected={selected}
            order={order}
            orderBy={orderBy}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleRequestSort}
            handleClick={handleClick}
          />

          <TablePagination
            labelRowsPerPage="Số dòng mỗi trang:"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courseData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Làm gọn"
        />
      </Box>
    </>
  );
};

export default CoursePage;
