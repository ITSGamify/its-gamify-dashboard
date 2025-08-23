import { PATH } from "@constants/path";

export const getHeaderTitle = (path: string): string => {
  if (path.includes(PATH.ACCOUNTS)) return "Quản lý tài khoản";

  if (path.includes(PATH.COURSES)) return "Quản lý khóa học";

  if (path.includes(PATH.DEPARTMENTS)) return "Quản lý phòng ban";

  if (path.includes(PATH.TOURNAMENT)) return "Quản lý thử thách";

  if (path.includes(PATH.CATEGORIES)) return "Quản lý danh mục";

  return "Thống kê";
};
