import { Challenge } from "./challenge";
import { Course } from "./course";

export interface Category {
  name: string;
  description: string;
  id: string;
  is_deleted: boolean;
  courses: Course[];
  challenges: Challenge[];
}
