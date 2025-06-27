// src/hooks/useCourseForm.tsx
import { JSX, useEffect, useState } from "react";

// Type definitions
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PATH } from "@constants/path";
import { getRoute } from "@utils/route";
import {
  CourseRequestParams,
  useCreateCourse,
  useGetCourseDetail,
} from "@services/course";
import { getCourseRequestTransformations } from "@utils/course";
import { StepFormProps } from "@interfaces/api/course";
import {
  CONFIRMING_DETAILS_STEP,
  CONTENT_STEP,
  INITIAL_CREATE_STEP,
  MATERIAL_STEP,
} from "@constants/course";
import BasicInfoForm from "@components/ui/molecules/BasicInfoForm";
import CourseContentForm from "@components/ui/molecules/CourseContentForm";
import LearningMaterialsForm from "@components/ui/molecules/LearningMaterialsForm";
import PreviewPublishForm from "@components/ui/molecules/PreviewPublishForm";

export const useCourseForm = () => {
  const navigation = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const paramsCurrentStep = searchParams.get("step") || 0;
  const { courseId } = useParams();
  const [activeStep, setActiveStep] = useState(+paramsCurrentStep);

  useEffect(() => {
    setActiveStep(+paramsCurrentStep);
  }, [paramsCurrentStep]);

  const handleBackToList = () => {
    navigation(PATH.COURSES);
  };

  const { data: courseDetail, isLoading } = useGetCourseDetail(courseId || "");

  const { mutateAsync: createCourse } = useCreateCourse();

  const handleBack = () => {
    if (activeStep === INITIAL_CREATE_STEP) {
      return handleBackToList();
    }

    return handleStepChange(activeStep - 1);
  };

  const handleStepChange = (step: number) => {
    const route = getRoute(PATH.COURSES_CREATE, {
      courseId: courseDetail ? courseDetail.id : "1",
    });
    return navigation(route + "?step=" + step);
  };

  const createRequestBody = <T,>(formData: T) => {
    const cleanedFormData = {
      ...courseDetail,
      ...getCourseRequestTransformations(activeStep)(formData, courseDetail),
    };

    const res = {
      ...(courseDetail?.id && { id: courseDetail.id }),
      ...cleanedFormData,
    };

    return res;
  };

  const handleNextStep = async <T,>(formData: T) => {
    const requestBody = createRequestBody(formData);
    console.log("Debug__________________formData", formData);
    console.log("Debug__________________request body", requestBody);
    handleStepChange(activeStep + 1);

    // await createCourse(
    //   {
    //     ...(requestBody as CourseRequestParams),
    //   },
    //   {
    //     onSuccess: (newCourse) => {
    //       const route = getRoute(PATH.COURSES_EDIT, {
    //         courseId: !courseDetail ? newCourse.id : courseDetail.id,
    //       });
    //       navigation(route + "step=" + (activeStep + 1));
    //     },
    //     onError: (error) => {
    //       console.error("Error creating course:", error);
    //     },
    //   }
    // );
  };

  const stepForms: Record<number, (props: StepFormProps) => JSX.Element> = {
    [INITIAL_CREATE_STEP]: BasicInfoForm,
    [CONTENT_STEP]: CourseContentForm,
    [MATERIAL_STEP]: LearningMaterialsForm,
    [CONFIRMING_DETAILS_STEP]: PreviewPublishForm,
  };

  const ActiveStepForm = stepForms[activeStep];

  return {
    courseDetail: courseDetail || null,
    ActiveStepForm,
    handleNextStep,
    handleBackToList,
    activeStep,
    handleBack,
  };
};
