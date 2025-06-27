export const DEFAULT_TABLE_PAGE_NUMBER = 0;
export const DEFAULT_TABLE_LIMIT = 5;
export const DEFAULT_TABLE_SORT = 5;

//#region  data table
export const DEPARTMENT_TABLE_HEAD = [
  {
    id: "name",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Phòng ban",
  },
  {
    id: "location",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Địa điểm",
  },
  {
    id: "leader",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Trưởng phòng",
  },
  {
    id: "employees",
    numeric: false,
    align: "center",
    disablePadding: true,
    disableSort: false,
    label: "Nhân viên",
  },

  {
    id: "action",
    numeric: true,
    align: "right",
    disablePadding: true,
    disableSort: true,
    label: "",
  },
];

export const ACCOUNT_TABLE_HEAD = [
  {
    id: "name",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Họ và tên",
  },
  {
    id: "email",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Địa chỉ email",
  },
  {
    id: "department",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Phòng ban",
  },
  {
    id: "role",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Chức vụ",
  },
  {
    id: "status",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: false,
    label: "Trạng thái",
  },
  {
    id: "action",
    numeric: true,
    align: "right",
    disablePadding: true,
    disableSort: true,
    label: "",
  },
];

export const COURSE_TABLE_HEAD = [
  {
    id: "title",
    numeric: false,
    align: "left",
    disablePadding: true,
    label: "Tên khóa học",
  },
  {
    id: "category",
    numeric: true,
    align: "left",
    disablePadding: true,
    label: "Danh mục",
  },
  {
    id: "classify",
    numeric: true,
    align: "left",
    disablePadding: true,
    label: "Phân loại",
  },
  {
    id: "department",
    numeric: false,
    align: "center",
    disablePadding: true,
    label: "Phòng ban",
  },
  {
    id: "sessions",
    numeric: true,
    align: "center",
    disablePadding: true,
    label: "Số chương",
  },
  {
    id: "action",
    numeric: false,
    align: "right",
    disablePadding: true,
    disableSort: true,
    label: "",
  },
];
