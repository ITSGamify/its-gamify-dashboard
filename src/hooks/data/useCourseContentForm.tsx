import { StepFormProps } from "@interfaces/api/course";
import { Module } from "@interfaces/dom/course";
import { useCreateModule } from "@services/module";
import { validateCourseContent } from "@utils/course";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
import { useGetCourseModules } from "@services/course";

export interface CourseContentForm {
  modules: Module[];
}

export const useCourseContentForm = ({
  data,
  handleNextState,
}: StepFormProps) => {
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const { data: moduleData, isPending: isLoadingModules } = useGetCourseModules(
    data?.id || ""
  );

  useEffect(() => {
    setLocalModules(moduleData?.data || []);
  }, [moduleData?.data]);

  const { mutateAsync: createModule, isPending: isCreatePending } =
    useCreateModule();

  const handleAddModule = useCallback(async () => {
    await createModule(
      {
        course_id: data?.id,
        title: `Chương ${localModules.length + 1}`,
        description: `Chương ${localModules.length + 1}`,
        ordered_number: localModules.length,
      },
      {
        onSuccess: (new_module: Module) => {
          setLocalModules((prevModules) => [...prevModules, new_module]);
        },
      }
    );
  }, [createModule, data?.id, localModules.length]);

  const handleRemoveModule = useCallback((moduleId: string) => {
    setLocalModules((prevModules) =>
      prevModules.filter((module) => module.id !== moduleId)
    );
  }, []);

  const handleNext = () => {
    const validation = validateCourseContent(localModules);

    if (!validation.isValid) {
      toast.error(ToastContent, {
        data: {
          message:
            validation.errorMessage ||
            "Nội dung khóa học chưa đáp ứng yêu cầu!",
        },
      });
      return;
    }

    handleNextState({
      modules: localModules,
    });
  };

  const updateModulesAfterDrag = (updatedModules: Module[]) => {
    setLocalModules([...updatedModules]);
  };

  return {
    handleNext,
    handleAddModule,
    handleRemoveModule,
    isCreatePending,
    modules: localModules,
    updateModulesAfterDrag,
    isLoadingModules,
  };
};
