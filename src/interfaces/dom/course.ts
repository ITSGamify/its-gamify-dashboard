export interface QuizQuestion {
  index: number;
  question: string;
  answer_A: string;
  answer_B: string;
  answer_C: string;
  answer_D: string;
  correct_answer: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz";
  duration: number;
  content?: string;
  video_url?: string;
  quiz?: QuizQuestion[];
}

export interface Module {
  id?: string;
  title: string;
  description: string;
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
