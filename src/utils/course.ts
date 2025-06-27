import {
  CONTENT_STEP,
  INITIAL_CREATE_STEP,
  MATERIAL_STEP,
} from "@constants/course";
import { BasicForm } from "@hooks/data/useBasicForm";
import { CourseContentForm } from "@hooks/data/useCourseContentForm";
import { LearningMaterialsForm } from "@hooks/data/useLearningMaterialsForm";
import { Course } from "@interfaces/api/course";
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
    department_id: form.department_id,
    tags: form.tags,
    ...(data && { id: data.id }),
  };
};

export const transformCourseContentFormToCourse = (
  form: CourseContentForm,
  data?: Course
): CourseRequestParams => {
  return {
    ...(data && { id: data.id }),
    modules: form.modules,
  };
};

export const transformLearningMaterialsFormToCourse = (
  form: LearningMaterialsForm,
  data?: Course
): CourseRequestParams => {
  return {
    ...(data && { id: data.id }),
    file_ids: form.file_ids,
    targets: form.targets,
    requirement: form.requirement,
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
  };

  return transformations[currentStep];
};
