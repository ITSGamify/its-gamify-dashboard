import { OptionField } from "@hooks/shared/useGetOptions";
import { Quarter } from "@interfaces/api/course";
import { formatUtcToLocal } from "@utils/date";
export const quaterOptionField: OptionField<Quarter> = {
  labelField: "name", // Đây là fallback nếu customLabel không được dùng
  valueField: "id",
  customLabel: (quater: Quarter) => {
    const formattedStart = formatUtcToLocal(quater.start_date);
    const formattedEnd = formatUtcToLocal(quater.end_date);
    return `${quater.name} (${formattedStart} - ${formattedEnd})`;
  },
};
