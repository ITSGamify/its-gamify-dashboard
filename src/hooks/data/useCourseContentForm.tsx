import { StepFormProps } from "@interfaces/api/course";
import { Module } from "@interfaces/dom/course";
import { useCreateModule } from "@services/module";
import { useCallback, useEffect, useState } from "react";
import { useGetCourseModules } from "@services/course";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
import { validateCourseContent } from "@utils/course";

export interface CourseContentForm {
  modules: Module[];
}

export const useCourseContentForm = ({
  data,
  handleNextState,
}: StepFormProps) => {
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const {
    data: moduleData,
    isPending: isLoadingModules,
    refetch,
  } = useGetCourseModules(data?.id || "");

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

  const updateModulesAfterDrag = (updatedModules: Module[]) => {
    setLocalModules([...updatedModules]);
  };

  const [editingModules, setEditingModules] = useState<string[]>([]);

  const handleSetEditing = (id: string) => {
    setEditingModules((prev) => {
      if (prev.includes(id)) {
        return prev.filter((moduleId) => moduleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleNext = async () => {
    const { data: refreshedData } = await refetch();

    if (editingModules.length > 0) {
      toast.warning(ToastContent, {
        data: { message: "Vui lòng xác nhận chỉnh sửa!" },
      });
      return;
    }
    const { isValid, errorMessage } = validateCourseContent(
      refreshedData?.data.sort((a, b) => a.ordered_number - b.ordered_number) ||
        []
    );
    if (!isValid) {
      toast.warning(ToastContent, {
        data: { message: errorMessage || "Nội dung không hợp lệ!" },
      });
      return;
    }
    handleNextState({
      modules: localModules,
    });
  };
  return {
    handleNext,
    handleAddModule,
    handleRemoveModule,
    isCreatePending,
    modules: localModules.sort((a, b) => a.ordered_number - b.ordered_number),
    updateModulesAfterDrag,
    isLoadingModules,
    handleSetEditing,
  };
};
