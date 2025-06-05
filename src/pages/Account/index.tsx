import { DataTable, HeadCell } from "@components/ui/molecules/DataTable";
import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  TableCell,
  TablePagination,
} from "@mui/material";
import React, { useState } from "react";
import StatusBadge from "@components/ui/atoms/TableBadge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import CreateUserModal from "@components/ui/molecules/CreateUserModal";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import FilterButton from "@components/ui/molecules/FilterButton";
import { OrderDirection } from "@interfaces/dom/query";
import { FilterGroup } from "@interfaces/dom/filter";
interface Data {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  department: string;
  role: string;
}

type StatusType =
  | "active"
  | "pending"
  | "completed"
  | "cancelled"
  | "error"
  | "banned"
  | "disbaled";

const json = [
  {
    id: "0",
    name: "Alice Nguyen",
    email: "alice.nguyen@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "admin",
  },
  {
    id: "1",
    name: "Alice Nguyen",
    email: "alice.nguyen@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "admin",
  },
  {
    id: "2",
    name: "Bob Tran",
    email: "bob.tran@example.com",
    status: "inactive",
    department: "Công nghệ thông tin",
    role: "user",
  },
  {
    id: "3",
    name: "Charlie Pham",
    email: "charlie.pham@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "moderator",
  },
  {
    id: "4",
    name: "David Le",
    email: "david.le@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "user",
  },
  {
    id: "5",
    name: "Eva Hoang",
    email: "eva.hoang@example.com",
    status: "pending",
    department: "Công nghệ thông tin",
    role: "user",
  },
  {
    id: "6",
    name: "Frank Vu",
    email: "frank.vu@example.com",
    status: "inactive",
    department: "Công nghệ thông tin",
    role: "admin",
  },
  {
    id: "7",
    name: "Grace Do",
    email: "grace.do@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "user",
  },
  {
    id: "8",
    name: "Hannah Bui",
    email: "hannah.bui@example.com",
    status: "pending",
    department: "Công nghệ thông tin",
    role: "moderator",
  },
  {
    id: "9",
    name: "Ian Ngo",
    email: "ian.ngo@example.com",
    status: "active",
    department: "Công nghệ thông tin",
    role: "user",
  },
  {
    id: "10",
    name: "Jenny Tran",
    email: "jenny.tran@example.com",
    status: "inactive",
    department: "Công nghệ thông tin",
    role: "admin",
  },
];

const roles = [
  { id: "admin", name: "Quản trị viên" },
  { id: "employee", name: "Nhân viên" },
  { id: "leader", name: "Trưởng nhóm" },
  { id: "trainer", name: "Nhà đào tạo" },
];

const departments = [
  { id: "it", label: "Công nghệ thông tin" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "Nhân sự" },
  { id: "finance", label: "Tài chính" },
  { id: "operations", label: "Vận hành" },
];

const statuses = [
  { id: "active", name: "Đang hoạt động" },
  { id: "inactive", name: "Không hoạt động" },
  { id: "pending", name: "Chờ xác nhận" },
  { id: "blocked", name: "Đã khóa" },
];

const AccountPage: React.FC = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleCreateUser = () => {
    setOpenCreateModal(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
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
      // Lấy tất cả ID của các mục trong trang hiện tại
      const newSelected = json
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  //#region Thu gọn
  const [dense, setDense] = React.useState(false);

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };
  //#endregion

  //#region  data table
  const headCells: HeadCell[] = [
    {
      id: "name",
      numeric: false,
      align: "left",
      disablePadding: true,
      label: "Họ và tên",
    },
    {
      id: "email",
      numeric: false,
      align: "left",
      disablePadding: true,
      label: "Địa chỉ email",
    },
    {
      id: "department",
      numeric: false,
      align: "left",
      disablePadding: true,
      label: "Phòng ban",
    },
    {
      id: "role",
      numeric: false,
      align: "left",
      disablePadding: true,
      label: "Chức vụ",
    },
    {
      id: "status",
      numeric: false,
      align: "left",
      disablePadding: true,
      label: "Trạng thái",
    },
    {
      id: "action",
      numeric: true,
      align: "right",
      disablePadding: true,
      label: "",
    },
  ];

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

  const [order, setOrder] = React.useState<OrderDirection>("asc");
  const [orderBy, setOrderBy] = React.useState<string>(headCells[0]?.id || "");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
    () => json.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [json, page, rowsPerPage]
  );

  const dataTable = visibleRows.map((row: Data) => {
    return [
      <TableCell key="name" component="th" scope="row" padding="none">
        {row.name}
      </TableCell>,
      <TableCell key="email" align="left">
        {row.email}
      </TableCell>,
      <TableCell key="department" align="left">
        {row.department}
      </TableCell>,
      <TableCell key="role" align="left">
        {row.role}
      </TableCell>,
      <TableCell key="status" align="left">
        <StatusBadge status={row.status as StatusType} label={row.status} />
      </TableCell>,
      <TableCell key="action" align="right">
        <TableActionButton menuItems={menuItems} />
      </TableCell>,
    ];
  });
  //#endregion

  // Tạo filterGroups từ roles và statuses
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

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            numSelected={selected.length}
            onCreate={handleOpenCreateModal}
            createLabel="Tạo tài khoản"
            filterButton={<FilterButton filterGroups={filterGroups} />}
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
            count={json.length}
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
      <CreateUserModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateUser}
        roles={roles}
        departments={departments}
      />
    </>
  );
};

export default AccountPage;
