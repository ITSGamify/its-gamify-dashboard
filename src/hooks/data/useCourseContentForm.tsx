import { yupResolver } from "@hookform/resolvers/yup";
import { StepFormProps } from "@interfaces/api/course";
import { Module } from "@interfaces/dom/course";
import { useCreateModule, useDeleteModule } from "@services/module";
import {
  mapApiModulesToFormModules,
  validateCourseContent,
} from "@utils/course";
import { useCallback, useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { courseContentSchema } from "src/form-schema/course";
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
  // Sử dụng state để theo dõi và cập nhật modules
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const { control, handleSubmit, setValue, getValues, watch, trigger, reset } =
    useForm<CourseContentForm>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        modules: [],
      },
      resolver: yupResolver(courseContentSchema) as Resolver<CourseContentForm>,
    });

  const {
    fields: fieldModule,
    append: appendModule,
    remove: removeModule,
    replace,
  } = useFieldArray({
    control,
    name: "modules",
    keyName: "fieldId",
  });

  useEffect(() => {
    setLocalModules(fieldModule);
  }, [fieldModule]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: moduleData, refetch: reFetchModule } = useGetCourseModules(
    data?.id || ""
  );

  useEffect(() => {
    if (data?.modules) {
      const mappedModules = mapApiModulesToFormModules(data.modules);
      reset({
        modules: mappedModules,
      });
      setLocalModules(mappedModules);
    }
  }, [reset, data]);

  const { mutateAsync: createModule, isPending: isCreatePending } =
    useCreateModule();

  const handleAddModule = useCallback(async () => {
    await createModule(
      {
        course_id: data?.id,
        title: `Chương ${fieldModule.length + 1}`,
        description: `Chương ${fieldModule.length + 1}`,
        ordered_number: fieldModule.length,
      },
      {
        onSuccess: (new_module) => {
          appendModule({
            id: new_module.id,
            title: new_module.title,
            description: new_module.description,
            ordered_number: new_module.ordered_number,
            course_id: new_module.course_id,
            lessons: [],
          });
        },
      }
    );
  }, [createModule, data?.id, fieldModule.length, appendModule]);

  const { mutateAsync: deleteModule, isPending: isDeletePending } =
    useDeleteModule();

  const handleRemoveModule = useCallback(
    async (index: number, moduleId: string) => {
      await deleteModule(moduleId, {
        onSuccess: () => {
          removeModule(index);
        },
      });
    },
    [deleteModule, removeModule]
  );

  const updateModulesAfterDrag = (updatedModules: Module[]) => {
    setValue("modules", updatedModules, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setLocalModules([...updatedModules]);

    replace(updatedModules);
  };

  // Cập nhật lại hàm submit
  const onSubmit = (formData: CourseContentForm) => {
    const validation = validateCourseContent(formData);

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

    // Nếu dữ liệu hợp lệ, chuyển sang bước tiếp theo
    handleNextState(formData);
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    handleAddModule,
    handleRemoveModule,
    modules: localModules,
    setValue,
    getValues,
    watch,
    trigger,
    updateModulesAfterDrag,
    isCreatePending,
    isDeletePending,
  };
};
