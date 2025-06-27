import { DataTable } from "@components/ui/molecules/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
} from "@mui/material";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";

import { useCoursePage } from "@hooks/data/useCoursePage";
import { Course } from "@interfaces/api/course";
import FilterButton from "@components/ui/molecules/FilterButton";
import { FilterGroup } from "@interfaces/dom/filter";

const departments = [
  { id: "it", name: "Công nghệ thông tin" },
  { id: "marketing", name: "Marketing" },
  { id: "hr", name: "Nhân sự" },
  { id: "finance", name: "Tài chính" },
  { id: "operations", name: "Vận hành" },
];
const filterGroups: FilterGroup[] = [
  {
    id: "department",
    title: "Phòng ban",
    options: departments,
  },
];

const CoursePage: React.FC = () => {
  const {
    courses,
    courseColumns,
    handleApplyFilters,
    activePage,
    handlePageChange,
    handelLimitChange,
    handleColumnSort,
    selected,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleCreateCouse,
    handleClick,
    handleSelectAllClick,
    isLoading,
    handleDeleteAll,
    handleDelete,
    total_page_count,
    page_size,
  } = useCoursePage();

  const menuItems = (course: Course) => [
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
      onClick: () => {
        handleDelete(course.id);
      },
      sx: { color: "red" },
    },
  ];

  const dataTable = courses.map((row: Course, index) => {
    return [
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selected.indexOf(row.id) !== -1}
          inputProps={{
            "aria-labelledby": `enhanced-table-checkbox-${index}`,
          }}
        />
      </TableCell>,
      <TableCell key="name" component="th" scope="row" padding="none">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>
            <img
              src={row.thumbnail_image}
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
      <TableCell key="category" align="left">
        {row.category?.name}
      </TableCell>,
      <TableCell key="classify" align="left">
        {row.classify === 0
          ? "Leader"
          : row.classify === 1
          ? "Department"
          : "All"}
      </TableCell>,
      <TableCell key="department" align="center">
        {/* <Rating name="read-only" value={row.reviews} readOnly /> */}
      </TableCell>,
      <TableCell key="sessions" align="center">
        {row.modules?.length}
      </TableCell>,
      <TableCell key="action" align="right">
        <TableActionButton menuItems={menuItems(row)} />
      </TableCell>,
    ];
  });

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            numSelected={selected.length}
            onCreate={handleCreateCouse}
            createLabel="Tạo khóa học"
            searchValue={searchInput}
            onInputChange={handleSearch}
            onEnter={handleSearchResults}
            onDelete={handleDeleteAll}
            filterButton={
              <FilterButton
                filterGroups={filterGroups}
                handleApplyFilters={handleApplyFilters}
              />
            }
          />
          <DataTable
            headCells={courseColumns}
            data={dataTable}
            selected={selected}
            handleClick={handleClick}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleColumnSort}
            isLoading={isLoading}
          />

          {courses.length !== 0 && !isLoading && (
            <TablePagination
              labelRowsPerPage="Số dòng mỗi trang:"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total_page_count}
              rowsPerPage={page_size}
              page={activePage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handelLimitChange}
            />
          )}
        </Paper>
      </Box>
    </>
  );
};

export default CoursePage;
