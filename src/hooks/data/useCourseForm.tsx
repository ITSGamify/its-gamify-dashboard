// src/hooks/useCourseForm.tsx
import { useState } from "react";
import { DropResult } from "react-beautiful-dnd";

// Type definitions
import { Module, Lesson, CourseDataProps } from "@interfaces/dom/course";

export const useCourseForm = () => {
  const [courseData, setCourseData] = useState<CourseDataProps>({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    language: "vietnamese",
    thumbnail: null,
    previewVideo: null,
    tags: [] as string[],
    hasCertificate: true,
    isPublished: false,
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: "module-1",
      title: "Module 1: Giới thiệu",
      description: "Giới thiệu tổng quan về khóa học",
      lessons: [
        {
          id: "lession-1",
          title: "Bài 1: Giới thiệu khóa học",
          type: "video",
          duration: 10,
          content: "Nội dung giới thiệu khóa học",
          videoUrl: "",
        },
        {
          id: "lession-2",
          title: "Bài 2: Cài đặt môi trường",
          type: "article",
          duration: 15,
          content: "Hướng dẫn cài đặt môi trường làm việc",
        },
      ],
    },
  ]);

  const [currentTag, setCurrentTag] = useState("");

  // Handle course data changes
  const handleCourseDataChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCourseData({
        ...courseData,
        [field]: event.target.value,
      });
    };

  const handleSwitchChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCourseData({
        ...courseData,
        [field]: event.target.checked,
      });
    };

  // Handle file uploads
  const handleFileUpload =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setCourseData({
          ...courseData,
          [field]: event.target.files[0],
        });
      }
    };

  // Handle tags
  const handleAddTag = () => {
    if (
      currentTag.trim() !== "" &&
      !courseData.tags.includes(currentTag.trim())
    ) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  // Handle modules and lessons
  const handleAddModule = () => {
    const newModule: Module = {
      id: `module-${modules.length + 1}`,
      title: `Module ${modules.length + 1}: Tiêu đề mới`,
      description: "Mô tả module",
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const handleModuleChange = (
    moduleId: string,
    field: string,
    value: string
  ) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    );
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  const handleAddLesson = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (module) {
      const newLesson: Lesson = {
        id: `lesson-${moduleId}-${module.lessons.length + 1}`,
        title: `Bài ${module.lessons.length + 1}: Tiêu đề mới`,
        type: "video",
        duration: 10,
        content: "",
      };
      setModules(
        modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
        )
      );
    }
  };

  const handleLessonChange = (
    moduleId: string,
    lessonId: string,
    field: string,
    value: unknown
  ) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter(
                (lesson) => lesson.id !== lessonId
              ),
            }
          : module
      )
    );
  };

  // Handle drag and drop for lessons
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    console.log("Drag end:", { source, destination, draggableId, type });

    try {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;

      // Tìm module ID thực từ droppableId (loại bỏ khoảng trắng nếu có)
      const sourceModule = modules.find(
        (m) => m.id.replace(/\s+/g, "") === sourceModuleId
      );
      const destModule = modules.find(
        (m) => m.id.replace(/\s+/g, "") === destModuleId
      );

      if (!sourceModule || !destModule) {
        console.error("Module not found:", { sourceModuleId, destModuleId });
        return;
      }

      // If the lesson is moved within the same module
      if (sourceModule.id === destModule.id) {
        const moduleIndex = modules.findIndex((m) => m.id === sourceModule.id);
        const newLessons = Array.from(modules[moduleIndex].lessons);
        const [removed] = newLessons.splice(source.index, 1);
        newLessons.splice(destination.index, 0, removed);

        const newModules = [...modules];
        newModules[moduleIndex] = {
          ...modules[moduleIndex],
          lessons: newLessons,
        };
        console.log("New modules after drag:", newModules);

        setModules(newModules);
      } else {
        // If the lesson is moved to a different module
        const sourceModuleIndex = modules.findIndex(
          (m) => m.id === sourceModule.id
        );
        const destModuleIndex = modules.findIndex(
          (m) => m.id === destModule.id
        );

        const sourceLessons = Array.from(modules[sourceModuleIndex].lessons);
        const destLessons = Array.from(modules[destModuleIndex].lessons);

        const [removed] = sourceLessons.splice(source.index, 1);
        destLessons.splice(destination.index, 0, removed);

        const newModules = [...modules];
        newModules[sourceModuleIndex] = {
          ...modules[sourceModuleIndex],
          lessons: sourceLessons,
        };
        newModules[destModuleIndex] = {
          ...modules[destModuleIndex],
          lessons: destLessons,
        };
        console.log("New modules after drag:", newModules);
        setModules(newModules);
      }
    } catch (error) {
      console.error("Error in onDragEnd:", error);
    }
  };

  return {
    courseData,
    modules,
    currentTag,
    setCurrentTag,
    handleCourseDataChange,
    handleSwitchChange,
    handleFileUpload,
    handleAddTag,
    handleDeleteTag,
    handleAddModule,
    handleModuleChange,
    handleDeleteModule,
    handleAddLesson,
    handleLessonChange,
    handleDeleteLesson,
    onDragEnd,
  };
};
