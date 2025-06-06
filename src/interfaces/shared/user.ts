// src/types/user.ts
export enum RoleEnum {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  LEADER = "leader",
  TRAINER = "trainer",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: RoleEnum;
  status: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}
