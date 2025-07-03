import { OptionField } from "@hooks/shared/useGetOptions";
import { Category } from "@interfaces/api/category";

export const categoryOptionField: OptionField<Category> = {
  labelField: "name",
  valueField: "id",
};
