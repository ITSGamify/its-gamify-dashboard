import { OptionField } from "@hooks/shared/useGetOptions";
import { Quater } from "@interfaces/api/course";

export const quaterOptionField: OptionField<Quater> = {
  labelField: "name",
  valueField: "id",
};
