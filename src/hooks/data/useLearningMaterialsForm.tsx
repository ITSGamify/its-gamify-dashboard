import { yupResolver } from "@hookform/resolvers/yup";
import { StepFormProps } from "@interfaces/api/course";
import { useCallback } from "react";
import { Resolver, useForm } from "react-hook-form";
import { learningMaterialsFormSchema } from "src/form-schema/course";

export interface LearningMaterialsForm {
  file_ids: string[];
  requirement: string;
  targets: string[];
}

export const useLearningMaterialsForm = ({
  data,
  handleNextState,
}: StepFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LearningMaterialsForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      file_ids: data?.file_ids || [],
      requirement: data?.requirement || "",
      targets: data?.targets || [],
    },
    resolver: yupResolver(
      learningMaterialsFormSchema
    ) as Resolver<LearningMaterialsForm>,
  });

  console.log(errors);
  const targets = watch("targets");
  const file_ids = watch("file_ids");

  const handleAddTaget = useCallback(
    (newTaget: string) => {
      if (newTaget && !targets.includes(newTaget)) {
        const updatedTags = [...targets, newTaget];
        setValue("targets", updatedTags);
      }
    },
    [targets, setValue]
  );

  const handleRemoveTaget = useCallback(
    (tagToRemove: string) => {
      const updatedTagets = targets.filter((taget) => taget !== tagToRemove);
      setValue("targets", updatedTagets);
    },
    [targets, setValue]
  );

  const handleAddFile = useCallback(
    (id: string) => {
      if (id && !file_ids.includes(id)) {
        const updateFileIds = [...file_ids, id];
        setValue("file_ids", updateFileIds);
      }
    },
    [file_ids, setValue]
  );

  const handleRemoveFile = useCallback(
    (idToRemove: string) => {
      const updateFileIds = file_ids.filter((id) => id !== idToRemove);
      setValue("file_ids", updateFileIds);
    },
    [file_ids, setValue]
  );

  return {
    handleSubmit: handleSubmit(handleNextState),
    file_ids,
    targets,
    handleAddTaget,
    handleRemoveTaget,
    handleAddFile,
    handleRemoveFile,
    control,
  };
};
