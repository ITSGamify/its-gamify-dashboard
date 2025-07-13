import { yupResolver } from "@hookform/resolvers/yup";
import { LessonType, Module } from "@interfaces/dom/course";
import { useCreateLesson, useDeleteLesson } from "@services/lesson";
import { useDeleteModule, useUpdateModule } from "@services/module";
import { mapApiModulesToFormModules } from "@utils/course";
import { useCallback, useState, useEffect } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { moduleSchema } from "src/form-schema/course";

export interface ModuleFormProps {
  data: Module;
  handleDeleteModule: (moduleId: string) => void;
}

export const useModuleForm = ({
  data,
  handleDeleteModule,
}: ModuleFormProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, getValues, watch, reset } = useForm<Module>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: mapApiModulesToFormModules(data),
    resolver: yupResolver(moduleSchema) as Resolver<Module>,
  });

  useEffect(() => {
    const mappedModule = mapApiModulesToFormModules(data);
    reset(mappedModule);
  }, [data, reset]);

  const { mutateAsync: updateModule, isPending: isUpdatePending } =
    useUpdateModule();

  const handleUpdateModule = async (formData: Module) => {
    await updateModule(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const { mutateAsync: deleteModule, isPending: isDeletePending } =
    useDeleteModule();

  const handleRemoveModule = useCallback(
    async (moduleId: string) => {
      await deleteModule(moduleId, {
        onSuccess: () => {
          handleDeleteModule(moduleId);
        },
      });
    },
    [deleteModule, handleDeleteModule]
  );

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const isDisable = isDeletePending || isUpdatePending;

  const {
    fields: lessons,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `lessons`,
    keyName: "fieldId",
  });

  const { mutateAsync: createLesson, isPending: isCreateLessonPending } =
    useCreateLesson();

  const { mutateAsync: deleteLesson } = useDeleteLesson();

  const handleAddLesson = async () => {
    const param = {
      module_id: data.id,
      title: `Bài ${lessons.length + 1}: Tiêu đề bài học`,
      type: "article" as LessonType,
      duration: 15,
      content: `Nội dung bài học ${lessons.length + 1}`,
      index: lessons.length,
      image_files: null,
    };
    await createLesson(param, {
      onSuccess: (new_lesson) => {
        appendLesson({
          id: new_lesson.id,
          ...param,
        });
      },
    });
  };

  const handleRemoveLesson = async (lessonIndex: number, lessonId: string) => {
    await deleteLesson(lessonId, {
      onSuccess: () => {
        removeLesson(lessonIndex);
      },
    });
  };

  return {
    handleRemoveModule,
    isDeletePending,
    control,
    handleSubmit: handleSubmit(handleUpdateModule),
    getValues,
    watch,
    expanded,
    isEditing,
    handleToggleExpand,
    handleToggleEdit,
    isDisable,
    lessons,
    handleRemoveLesson,
    handleAddLesson,
    isCreateLessonPending,
  };
};
