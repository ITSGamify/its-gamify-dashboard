import { yupResolver } from "@hookform/resolvers/yup";
import { Module } from "@interfaces/dom/course";
import { useUpdateModule } from "@services/module";
import { Resolver, useForm } from "react-hook-form";
import { moduleSchema2 } from "src/form-schema/course";

export interface ModuleFormProps {
  data: Module;
}

export const useModuleForm = ({ data }: ModuleFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { control, handleSubmit, setValue, getValues, watch, trigger, reset } =
    useForm<Module>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        id: data.id,
        title: data.title,
        ordered_number: data.ordered_number,
        description: data.description,
        course_id: data.course_id,
        lessons: data.lessons,
      },
      resolver: yupResolver(moduleSchema2) as Resolver<Module>,
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync: updateModule, isPending: isUpdating } =
    useUpdateModule();
};
