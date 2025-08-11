import { OptionField } from "@hooks/shared/useGetOptions";
import { Quater } from "@interfaces/api/course";
import { formatUtcToLocal } from "@utils/date";
export const quaterOptionField: OptionField<Quater> = {
  labelField: "name", // Đây là fallback nếu customLabel không được dùng
  valueField: "id",
  customLabel: (quater: Quater) => {
    const formattedStart = formatUtcToLocal(quater.start_date);
    const formattedEnd = formatUtcToLocal(quater.end_date);
    return `${quater.name} (${formattedStart} - ${formattedEnd})`;
  },
};
