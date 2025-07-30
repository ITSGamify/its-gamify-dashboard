import { RequestChallengeParams } from "@services/challenge";
import { Course } from "./course";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  num_of_room: number;
  thumbnail_image: string;
  course_id: string;
  category_id: string;
  thumbnail_image_id: string;
  course: Course;
}

export interface ChallengeStepFormProps {
  data: Challenge | null;
  handleNextState: <T>(formData?: T) => Promise<void>;
  activeStep?: number;
  handleBack?: () => void;
  handleConfirm?: () => void;
  isLoading?: boolean;
  isCreateMode?: boolean;
  formData: Partial<RequestChallengeParams> | null;
}
