import { DataTable } from "@components/ui/molecules/DataTable";
import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import { Department } from "@interfaces/api/department";
import DepartmentModalForm from "@components/ui/molecules/DepartmentModalForm";
import { useDepartmentPage } from "@hooks/data/useDepartmentPage";

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
    total_page_count,
    page_size,
    handlePageChange,
    handelLimitChange,
  } = useDepartmentPage();

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
      label: "Tạm ngưng",
      onClick: () => {
        handleDelete(department.id);
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
            <TableCell key="location" align="left">
              {row.location}
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
              count={total_page_count}
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
    </>
  );
};

export default DepartmentPage;
