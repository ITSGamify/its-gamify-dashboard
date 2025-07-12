import { StorageFile } from "@interfaces/api/file";

export type LessonType = "video" | "article" | "quiz";

export interface QuizQuestion {
  // index: number;
  content: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  content?: string;
  video_url?: string;
  quiz_id?: string | null;
  quiz?: Quizzes;
  questions?: QuizQuestion[];
  quizzes?: Quizzes[];
  index: number;
  module_id: string;
  image_files?: StorageFile[] | null;
}

export interface Quizzes {
  total_questions: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  course_id: string;
  ordered_number: number;
  lessons: Lesson[];
}

export interface DragEndResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    index: number;
    droppableId: string;
  };
}

export interface CourseDataProps {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  language: "vietnamese" | "english";
  thumbnail: File | null;
  previewVideo: File | null;
  tags: string[];
  hasCertificate?: boolean;
  isPublished?: boolean;
}
