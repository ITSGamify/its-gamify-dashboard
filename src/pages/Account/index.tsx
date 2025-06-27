import { DataTable } from "@components/ui/molecules/DataTable";

import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
} from "@mui/material";
import React from "react";
import StatusBadge from "@components/ui/atoms/TableBadge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import AccountModalForm from "@components/ui/molecules/AccountModalForm";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import FilterButton from "@components/ui/molecules/FilterButton";
import { FilterGroup } from "@interfaces/dom/filter";
import { useAccountPage } from "@hooks/data/useAccountPage";
import { User } from "@interfaces/api/user";

export type StatusType =
  | "ACTIVE"
  | "pending"
  | "completed"
  | "cancelled"
  | "error"
  | "banned"
  | "disbaled";

const statuses = [
  { id: "ACTIVE", name: "Đang hoạt động" },
  { id: "inactive", name: "Không hoạt động" },
  { id: "pending", name: "Chờ xác nhận" },
  { id: "blocked", name: "Đã khóa" },
];

const AccountPage: React.FC = () => {
  const {
    accounts,
    isLoading,
    activePage,
    handlePageChange,
    handelLimitChange,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleColumnSort,
    selected,
    handleClick,
    handleSelectAllClick,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleDelete,
    handleDeleteAll,
    accountColumns,
    handleApplyFilters,
    onActionSuccess,
    roles,
    isRoleLoading,
    total_page_count,
    page_size,
  } = useAccountPage();

  const filterGroups: FilterGroup[] = [
    {
      id: "role",
      title: "Vai trò",
      options: roles,
    },
    {
      id: "status",
      title: "Trạng thái",
      options: statuses,
    },
  ];

  const menuItems = (account: User) => [
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
        handleDelete(account.id);
      },
      sx: { color: "red" },
    },
  ];

  const dataTable = accounts.map((row: User, index) => {
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
        {row.full_name}
      </TableCell>,
      <TableCell key="email" align="left">
        {row.email}
      </TableCell>,
      <TableCell key="department" align="left">
        {row.dept_name}
      </TableCell>,
      <TableCell key="role" align="left">
        {row.role}
      </TableCell>,
      <TableCell key="status" align="left">
        <StatusBadge status={row.status as StatusType} label={row.status} />
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
            filterTitle="Bộ lọc:"
            numSelected={selected.length}
            onCreate={handleOpenModal}
            createLabel="Tạo tài khoản"
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
            headCells={accountColumns}
            data={dataTable}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleColumnSort}
            handleClick={handleClick}
            isLoading={isLoading}
          />

          {accounts.length !== 0 && !isLoading && (
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
      <AccountModalForm
        open={openModal}
        onClose={handleCloseModal}
        data={null}
        onSuccess={onActionSuccess}
        isRoleLoading={isRoleLoading}
        roles={roles}
      />
    </>
  );
};

export default AccountPage;
