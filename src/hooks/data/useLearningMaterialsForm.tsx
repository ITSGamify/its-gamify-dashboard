import { yupResolver } from "@hookform/resolvers/yup";
import { Material, StepFormProps } from "@interfaces/api/course";
import { useCreateMaterial, useDeleteMaterial } from "@services/material";
import { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { learningMaterialsFormSchema } from "src/form-schema/course";

export interface LearningMaterialsForm {
  requirement: string;
  targets: string[];
}

export const useLearningMaterialsForm = ({
  data,
  handleNextState,
}: StepFormProps) => {
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<LearningMaterialsForm>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        requirement: data?.requirement || "",
        targets: data?.targets || [],
      },
      resolver: yupResolver(
        learningMaterialsFormSchema
      ) as Resolver<LearningMaterialsForm>,
    });

  const targets = watch("targets");

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

  const [attachments, setAttachments] = useState<Material[]>(
    data?.learning_materials || []
  );

  const { mutateAsync: createMaterial } = useCreateMaterial();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;

      try {
        await createMaterial(
          {
            file: files[0],
            CourseId: data?.id as string,
          },
          {
            onSuccess: (new_material) => {
              setAttachments([...attachments, new_material]);
            },
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const { mutateAsync: deleteMaterial } = useDeleteMaterial();
  const handleDeleteFile = async (id: string) => {
    await deleteMaterial(id, {
      onSuccess: () => {
        setAttachments(attachments.filter((file) => file.id !== id));
      },
    });
  };

  useEffect(() => {
    setAttachments(data?.learning_materials || []);
  }, [data, reset]);

  return {
    handleSubmit: handleSubmit(handleNextState),
    targets,
    handleAddTaget,
    handleRemoveTaget,
    control,
    handleDeleteFile,
    handleFileUpload,
    attachments,
  };
};
