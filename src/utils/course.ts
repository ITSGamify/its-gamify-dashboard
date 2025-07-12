import {
  ALL,
  CONFIRMING_DETAILS_STEP,
  CONTENT_STEP,
  DEPARTMENT_ONLY,
  INITIAL_CREATE_STEP,
  LEADER_ONLY,
  MATERIAL_STEP,
} from "@constants/course";
import { BasicForm } from "@hooks/data/useBasicForm";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";
import { LearningMaterialsForm } from "@hooks/data/useLearningMaterialsForm";
import { Course } from "@interfaces/api/course";
import { Lesson, Module } from "@interfaces/dom/course";
import { CourseRequestParams } from "@services/course";

export const transformBasicCourseFormToCourse = (
  form: BasicForm,
  data?: Course
): CourseRequestParams => {
  return {
    title: form.title,
    description: form.description,
    category_id: form.category_id,
    thumbnail_image_id: form.thumbnail_image_id,
    introduction_video_id: form.introduction_video_id,
    short_description: form.short_description,
    classify: form.classify,
    department_id: form.department_id || null,
    tags: form.tags,
    is_update_module: false,
    drafted: data?.drafted || false,
    ...(data && { id: data.id }),
  };
};

export const transformCourseContentFormToCourse = (
  form: CourseContentForm,
  data?: Course
): CourseRequestParams => {
  const processedModules = form.modules.map((module) => {
    const moduleData = { ...module };

    moduleData.lessons = module.lessons.map((lesson) => {
      const lessonData = { ...lesson };

      return lessonData;
    });

    return moduleData;
  });
  return {
    ...(data && { id: data.id }),
    is_update_module: true,
    drafted: data?.drafted || false,
    modules: processedModules,
  };
};
export const transformLearningMaterialsFormToCourse = (
  form: LearningMaterialsForm,
  data?: Course
): CourseRequestParams => {
  return {
    ...(data && { id: data.id }),
    targets: form.targets,
    is_update_module: false,
    drafted: data?.drafted || false,
    requirement: form.requirement,
  };
};

export const transformConfirmFormToCourse = (
  data?: Course
): CourseRequestParams => {
  return {
    ...(data && { id: data.id }),
    ...data,
    drafted: data?.drafted || false,
    is_update_module: false,
  };
};

export const getCourseRequestTransformations = (currentStep: number) => {
  const transformations: Record<
    number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (form: any, data?: Course) => CourseRequestParams
  > = {
    [INITIAL_CREATE_STEP]: transformBasicCourseFormToCourse,
    [CONTENT_STEP]: transformCourseContentFormToCourse,
    [MATERIAL_STEP]: transformLearningMaterialsFormToCourse,
    [CONFIRMING_DETAILS_STEP]: transformConfirmFormToCourse,
  };

  return transformations[currentStep];
};

export const getStepNumberFromName = (stepName: string): number => {
  switch (stepName.toUpperCase()) {
    case "INITIAL":
      return INITIAL_CREATE_STEP;
    case "CONTENT":
      return CONTENT_STEP;
    case "MATERIAL":
      return MATERIAL_STEP;
    case "CONFIRM":
      return 3;
    default:
      return -1;
  }
};

export const getClassifyNumberFromName = (stepName: string): string => {
  switch (stepName.toUpperCase()) {
    case "LEADERONLY":
      return LEADER_ONLY;
    case "DEPARTMENTONLY":
      return DEPARTMENT_ONLY;
    case "ALL":
      return ALL;
    default:
      return "-1";
  }
};

export const getStateTransition = (stepName: string): string => {
  switch (stepName.toUpperCase()) {
    case "INITIAL":
      return "CONTENT";
    case "CONTENT":
      return "MATERIAL";
    case "MATERIAL":
      return "CONFIRM";
    case "CONFIRM":
      return "PUBLISHED";
    default:
      return stepName;
  }
};

export const mapApiModulesToFormModules = (apiModules: Module[]): Module[] => {
  const sortedModules = [...apiModules].sort(
    (a, b) => (a.ordered_number || 0) - (b.ordered_number || 0)
  );
  return sortedModules.map((apiModule) => ({
    id: apiModule.id,
    title: apiModule.title || "",
    description: apiModule.description || "",
    course_id: apiModule.course_id,
    ordered_number: apiModule.ordered_number,
    lessons: apiModule.lessons
      ? [...apiModule.lessons]
          .sort((a: Lesson, b: Lesson) => (a.index || 0) - (b.index || 0))
          .map((lesson: Lesson) => ({
            id: lesson.id,
            title: lesson.title || "",
            type: lesson.type || "article",
            duration: lesson.duration || 0,
            content: lesson.content || "",
            video_url: lesson.video_url || "",
            index: lesson.index,
            module_id: lesson.module_id,
            quiz_id: lesson.quiz_id || null,
            image_files: lesson.image_files,
            questions: (lesson.quiz && lesson.quiz.questions) || [],
          }))
      : [],
  }));
};

export const validateCourseContent = (
  formData: CourseContentForm
): { isValid: boolean; errorMessage?: string } => {
  // Kiểm tra số lượng module
  if (!formData.modules || formData.modules.length < 3) {
    return {
      isValid: false,
      errorMessage: "Khóa học phải có tối thiểu 3 chương.",
    };
  }

  // Kiểm tra mỗi module có ít nhất 1 bài học
  const emptyModules = formData.modules.filter(
    (module) => !module.lessons || module.lessons.length === 0
  );

  if (emptyModules.length > 0) {
    const moduleNames = emptyModules
      .map((module) => `"${module.title}"`)
      .join(", ");
    return {
      isValid: false,
      errorMessage: `Các chương sau chưa có bài học: ${moduleNames}. Mỗi chương phải có ít nhất 1 bài học.`,
    };
  }

  return { isValid: true };
};
