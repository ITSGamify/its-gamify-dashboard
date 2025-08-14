import { RoleEnum } from "@interfaces/api/user";

export function getRoleInVietnamese(role: RoleEnum): string {
  switch (role) {
    case RoleEnum.ADMIN:
      return "Quản trị viên";
    case RoleEnum.EMPLOYEE:
      return "Nhân viên";
    case RoleEnum.LEADER:
      return "Trưởng nhóm";
    case RoleEnum.TRAINER:
      return "Nhân viên đào tạo";
    case RoleEnum.MANAGER:
      return "Quản lý";
    default:
      return "Không xác định";
  }
}
