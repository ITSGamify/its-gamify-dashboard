import { Module } from "@interfaces/dom/course";
import { Category } from "./category";
import { Department } from "./department";

export interface Course {
  id: string;
  title: string;
  sessions: number;
  department_id: string;
  deparment?: Department;
  drafted: boolean;
  reviews: number;
  category_id?: string;
  category?: Category;
  level?: string;
  thumbnail_image_id?: string;
  thumbnail_image?: string;
  introduction_video_id?: string;
  short_description?: string;
  description?: string;
  tags?: string[];
  modules?: Module[];
  file_ids: string[];
  requirement: string;
  targets: string[];
  duration_in_hours: number;
  classify: string;
  status: string;
  is_optional:boolean;
  quarter_id:string;
  introduction_video?: string;
  learning_materials?: Material[];
}

export interface Material {
  id: string;
  url: string;
  name: string;
  file_id: string;
  type: string;
  size: number;
  course_id: string;
}

export interface Quater {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
}

export interface StepFormProps {
  data: Course | null;
  handleNextState: <T>(formData?: T) => Promise<void>;
  activeStep?: number;
  handleBack?: () => void;
  isLoading?: boolean;
  isCreateMode?: boolean;
}
