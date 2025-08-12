import { Department } from "./department";
import { Metric } from "./metric";

// src/types/user.ts
export enum RoleEnum {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  LEADER = "LEADER",
  TRAINER = "TRAININGSTAFF",
  MANAGER = "MANAGER",
}

export interface User {
  id: string;
  dept_name: string;
  email: string;
  full_name: string;
  avatar?: string;
  role: RoleEnum;
  role_id?: string;
  password?: string;
  department_id?: string;
  status: string;
  department: Department;
  avatar_url?: string;
  user_metrics: Metric[];
}
