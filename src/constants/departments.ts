import { OptionField } from "@hooks/shared/useGetOptions";
import { Department } from "@interfaces/api/department";

export const deparmentOptionField: OptionField<Department> = {
  labelField: "name",
  valueField: "id",
};
