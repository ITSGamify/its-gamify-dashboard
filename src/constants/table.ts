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
  // {
  //   id: "status",
  //   numeric: false,
  //   align: "left",
  //   disablePadding: true,
  //   disableSort: false,
  //   label: "Trạng thái",
  // },
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
    disableSort: true,
    label: "Tên khóa học",
  },
  {
    id: "classify",
    numeric: true,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Phân loại",
  },
  {
    id: "department",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Phòng ban",
  },
  {
    id: "status",
    numeric: true,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Trạng thái",
  },
  {
    id: "sessions",
    numeric: true,
    align: "center",
    disablePadding: true,
    disableSort: true,
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

export const CHALLENGE_TABLE_HEAD = [
  {
    id: "title",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Tên thử thách",
  },
  {
    id: "description",
    numeric: true,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Mô tả",
  },
  {
    id: "course",
    numeric: true,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Khóa học",
  },
  {
    id: "num_of_room",
    numeric: false,
    align: "left",
    disablePadding: true,
    disableSort: true,
    label: "Số phòng tối da",
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
