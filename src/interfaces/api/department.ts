import { User } from "./user";

export interface Department {
  id: string;
  name: string;
  description: string;
  location: string;
  leader: User;
  employee_count: number;
}
