// src/hooks/useCourseForm.tsx
import { JSX, useEffect, useState } from "react";

// Type definitions
import { useNavigate, useSearchParams } from "react-router-dom";
import { PATH } from "@constants/path";
import { getRoute } from "@utils/route";
import {
  CourseRequestParams,
  RequestUpdateCourseParams,
  useCreateCourse,
  useGetCourseDetail,
  useUpdateCourse,
} from "@services/course";
import {
  getCourseRequestTransformations,
  getStateTransition,
} from "@utils/course";
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
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

export const useCourseForm = (courseId?: string, editMode?: boolean) => {
  const navigation = useNavigate();

  const [searchParams] = useSearchParams();
  const paramsCurrentStep = searchParams.get("step") || 0;
  const [activeStep, setActiveStep] = useState(+paramsCurrentStep);

  useEffect(() => {
    setActiveStep(+paramsCurrentStep);
  }, [paramsCurrentStep]);

  const handleBackToList = () => {
    navigation(PATH.COURSES);
  };

  const {
    data: courseDetail,
    refetch,
    isFetching,
  } = useGetCourseDetail(courseId || "");

  useEffect(() => {
    if (courseId) {
      refetch();
    }
  }, [activeStep, courseId, refetch]);

  const { mutateAsync: createCourse, isPending: isCreating } =
    useCreateCourse();

  const { mutateAsync: updateCourse, isPending: isUpdating } =
    useUpdateCourse();

  const isLoading = isCreating || isUpdating;

  const handleBack = () => {
    if (activeStep === INITIAL_CREATE_STEP) {
      return handleBackToList();
    }

    if (courseDetail) {
      const route = getRoute(PATH.COURSES_EDIT, {
        courseId: courseDetail.id,
      });
      navigation(route + "?step=" + (activeStep - 1), { replace: true });
    }
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
    if (!editMode) {
      await createCourse(
        {
          ...(requestBody as CourseRequestParams),
        },
        {
          onSuccess: (newCourse) => {
            toast.success(ToastContent, {
              data: {
                message: "Tạo thành công!",
              },
            });
            const route = getRoute(PATH.COURSES_EDIT, {
              courseId: !courseDetail ? newCourse.id : courseDetail.id,
            });
            navigation(route + "?step=" + activeStep);
          },
        }
      );
    }
    // f182d5cd-7c4d-469a-890a-212e93749abe
    const next_state = getStateTransition(courseDetail?.status || "");
    const isLastStep = activeStep === 3;
    await updateCourse(
      {
        ...(requestBody as RequestUpdateCourseParams),
        ...(courseId ? { id: courseId } : {}),
        ...(courseId ? { current_step: next_state } : {}),
        ...(isLastStep ? { drafted: false } : { drafted: true }),
      },
      {
        onSuccess: (newCourse) => {
          toast.success(ToastContent, {
            data: {
              message: "Cập nhật thành công!",
            },
          });

          if (isLastStep) {
            return handleBackToList();
          }

          const route = getRoute(PATH.COURSES_EDIT, {
            courseId: !courseDetail ? newCourse.id : courseDetail.id,
          });
          navigation(route + "?step=" + (activeStep + 1));
        },
      }
    );
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
    isLoadingForm: isFetching,
    isLoading,
  };
};
