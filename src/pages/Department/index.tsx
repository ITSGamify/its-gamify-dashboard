import { DataTable } from "@components/ui/molecules/DataTable";
import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
} from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import { Department } from "@interfaces/api/department";
import DepartmentModalForm from "@components/ui/molecules/DepartmentModalForm";
import { useDepartmentPage } from "@hooks/data/useDepartmentPage";
import userSession from "@utils/user-session";
import { RoleEnum } from "@interfaces/api/user";
import ConfirmDialog from "@components/ui/atoms/ConfirmDialog";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

const DepartmentPage: React.FC = () => {
  const {
    departments,
    activePage,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleColumnSort,
    departmentColumns,
    selected,
    handleClick,
    handleSelectAllClick,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleDelete,
    handleDeleteAll,
    department,
    handleUpdate,
    onActionSuccess,
    isLoading,
    page_size,
    handlePageChange,
    handelLimitChange,
    total_items_count,
  } = useDepartmentPage();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const menuItems = (department: Department) => [
    {
      icon: <EditIcon color="action" />,
      label: "Chỉnh sửa",
      onClick: () => {
        handleUpdate(department);
      },
    },
    {
      icon: <DeleteOutlineIcon color="error" />,
      label: "Xóa phòng ban",
      onClick: () => {
        if (department.employee_count > 0) {
          toast.warning(ToastContent, {
            data: {
              message: "Phòng ban này còn nhân viên, không thể xóa!",
            },
          });
          return;
        }
        setIdToDelete(department.id);
        setOpenConfirm(true);
      },
      sx: { color: "red" },
    },
  ];

  const dataTable =
    departments.length > 0
      ? departments.map((row: Department, index) => {
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
              {row.name}
            </TableCell>,
            <TableCell key="leader" align="left">
              {row.leader?.full_name || ""}
            </TableCell>,
            <TableCell key="employeesleft" align="center">
              {row.employee_count}
            </TableCell>,
            <TableCell key="action" align="right">
              <TableActionButton menuItems={menuItems(row)} />
            </TableCell>,
          ];
        })
      : [];
  //#endregion
  const profile = userSession.getUserProfile();
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            filterTitle="Tìm kiếm:"
            numSelected={selected.length}
            onCreate={handleOpenModal}
            createLabel="Tạo phòng ban"
            searchValue={searchInput}
            onInputChange={handleSearch}
            onEnter={handleSearchResults}
            onDelete={handleDeleteAll}
            isHiddenCreateButton={profile?.user.role !== RoleEnum.ADMIN}
          />
          <DataTable
            headCells={departmentColumns}
            data={dataTable}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleColumnSort}
            handleClick={handleClick}
            isLoading={isLoading}
          />

          {departments.length !== 0 && !isLoading && (
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
      <DepartmentModalForm
        data={department}
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={onActionSuccess}
      />
      <ConfirmDialog
        open={openConfirm}
        title="Xác nhận xóa phòng ban"
        message="Bạn có chắc chắn muốn xóa phòng ban này không?"
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

export default DepartmentPage;
