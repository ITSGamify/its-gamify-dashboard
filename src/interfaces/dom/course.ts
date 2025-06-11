/**
 * Interface định nghĩa cấu trúc của một bài học trong khóa học
 */
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: number;
  content: string;
  videoUrl?: string;
}

/**
 * Interface định nghĩa cấu trúc của một module trong khóa học
 */
export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

/**
 * Interface định nghĩa kết quả từ thao tác kéo thả (drag and drop)
 */
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