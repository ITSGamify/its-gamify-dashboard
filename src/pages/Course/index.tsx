import { DataTable } from "@components/ui/molecules/DataTable";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import defaultCourseImage from "@assets/images/its_gamify_course_default.png";
import { RoleEnum } from "@interfaces/api/user";
import {
  getClassifyInVietnamese,
  getCourseStatusInVietnamese,
} from "@utils/course";
import StatusBadge from "@components/ui/atoms/TableBadge";
import { truncateText } from "@utils/string";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import { useState } from "react";
import ConfirmDialog from "@components/ui/atoms/ConfirmDialog";

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
    page_size,
    total_items_count,
    handleUpdateCourse,
    handleViewDetail,
    profile,
    handleReActiveCourse,
    // departments,
    categories,
  } = useCoursePage();

  const filterGroups: FilterGroup[] = [
    // {
    //   id: "departments",
    //   title: "Phòng ban",
    //   options: departments.map((department) => ({
    //     id: department.id,
    //     name: department.name,
    //   })),
    // },
    {
      id: "category",
      title: "Danh mục",
      options: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    },
    {
      id: "courseType",
      title: "Phân loại",
      options: [
        { id: "DEPARTMENTONLY", name: "Phòng ban" },
        { id: "LEADERONLY", name: "Trưởng phòng" },
        { id: "ALL", name: "Tất cả" },
      ],
    },
    {
      id: "isActive",
      title: "Trạng thái",
      options: [
        { id: "true", name: "Hoạt động" },
        { id: "false", name: "Đã ngừng" },
      ],
      type: "radio",
    },
  ];
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const menuItems = (course: Course) => {
    const items = [
      {
        icon: <VisibilityIcon color="action" />,
        label: "Xem chi tiết",
        onClick: () => {
          handleViewDetail(course.id);
        },
        sx: {},
      },
    ];

    if (profile?.user.role === RoleEnum.TRAINER) {
      items.push(
        {
          icon: <EditIcon color="action" />,
          label: "Chỉnh sửa",
          onClick: () => {
            handleUpdateCourse(course.id, course.status);
          },
          sx: {},
        },
        {
          icon: course.is_deleted ? (
            <PowerSettingsNewOutlinedIcon color="success" />
          ) : (
            <DeleteOutlineIcon color="error" />
          ),
          label: course.is_deleted ? "  Kích hoạt" : "Tạm ngưng",
          onClick: () => {
            if (course.is_deleted) {
              handleReActiveCourse(course.id);
            } else {
              setIdToDelete(course.id);
              setOpenConfirm(true);
            }
          },
          sx: { color: course.is_deleted ? "green" : "red" },
        }
      );
    }

    return items;
  };

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
                e.currentTarget.src = defaultCourseImage;
              }}
            />
          </Box>
          {truncateText(row.title, 40)}
        </Box>
      </TableCell>,
      <TableCell key="classify" align="left">
        {`${getClassifyInVietnamese(row.classify)} ${
          row.is_optional ? "(Không bắt buộc)" : ""
        }`}
        {row.classify === "DEPARTMENTONLY"
          ? ` : ${row.course_departments[0].department.name}`
          : ""}
      </TableCell>,

      <TableCell key="step" align="left">
        {row.drafted
          ? "Đang chỉnh sửa"
          : getCourseStatusInVietnamese(row.status)}
      </TableCell>,
      <TableCell key="course" align="left">
        {truncateText(row.category?.name || "", 20)}
      </TableCell>,
      <TableCell key="sessions" align="center">
        {row.modules?.length}
      </TableCell>,
      <TableCell key="status" align="center">
        <StatusBadge
          status={
            row.drafted ? "DISABLE" : row.is_deleted ? "CANCELLED" : "ACTIVE"
          }
          label={
            row.drafted
              ? "Đang bị khóa"
              : row.is_deleted
              ? "Đã ngừng"
              : "Hoạt động"
          }
        />
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
            isHiddenCreateButton={profile?.user.role !== RoleEnum.TRAINER}
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
              count={total_items_count}
              rowsPerPage={page_size}
              page={activePage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handelLimitChange}
            />
          )}
        </Paper>
      </Box>
      <ConfirmDialog
        open={openConfirm}
        title="Xác nhận tạm ngưng khóa học"
        message="Bạn có chắc chắn muốn tạm ngưng khóa học này không? Hành động này có thể ảnh hưởng đến các người dùng đang tham gia khóa học."
        onClose={() => {
          setOpenConfirm(false);
          setIdToDelete(null);
        }}
        onConfirm={() => {
          if (idToDelete) {
            handleDelete(idToDelete);
          }
        }}
      />
    </>
  );
};

export default CoursePage;
