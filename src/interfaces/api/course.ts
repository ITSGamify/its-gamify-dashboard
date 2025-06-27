import { Module } from "@interfaces/dom/course";
import { Category } from "./category";

export interface Course {
  id: string;
  title: string;
  sessions: number;
  department_id: string;
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
  classify: number;
}

export interface StepFormProps {
  data: Course | null;
  handleNextState: <T>(formData?: T) => Promise<void>;
  activeStep?: number;
  handleBack?: () => void;
}
