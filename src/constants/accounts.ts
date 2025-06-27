import { OptionField } from "@hooks/shared/useGetOptions";
import { User } from "@interfaces/api/user";

export const accountOptionField: OptionField<User> = {
  labelField: "full_name",
  valueField: "id",
};
