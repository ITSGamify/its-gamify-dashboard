import { RoleEnum } from "@interfaces/api/user";

type RoleObject = {
  [key in RoleEnum]: string;
};

export const USER_ROLES: RoleObject = {
  [RoleEnum.ADMIN]: "admin",
  [RoleEnum.EMPLOYEE]: "employee",
  [RoleEnum.LEADER]: "leader",
  [RoleEnum.TRAINER]: "trainer",
};
