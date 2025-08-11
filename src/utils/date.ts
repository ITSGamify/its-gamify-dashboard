import { format, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export function formatUTCToLocalTime(utcTimeString: string): Date {
  // Tạo đối tượng Date từ chuỗi UTC
  const date = new Date(utcTimeString);

  // Kiểm tra xem chuỗi đầu vào có hợp lệ không
  if (isNaN(date.getTime())) {
    throw new Error("Chuỗi thời gian không hợp lệ");
  }

  return date;
}

/**
 * Hàm định dạng thời gian thành chuỗi theo định dạng mong muốn
 * @param date - Đối tượng Date cần định dạng
 * @param format - Định dạng mong muốn (mặc định: DD/MM/YYYY HH:mm:ss)
 * @returns string - Chuỗi thời gian đã được định dạng
 */
export function formatDate(
  date: Date,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  let formattedDate = format;
  formattedDate = formattedDate.replace("DD", day);
  formattedDate = formattedDate.replace("MM", month);
  formattedDate = formattedDate.replace("YYYY", year.toString());
  formattedDate = formattedDate.replace("HH", hours);
  formattedDate = formattedDate.replace("mm", minutes);
  formattedDate = formattedDate.replace("ss", seconds);

  return formattedDate;
}

/**
 * Hàm chuyển đổi chuỗi thời gian UTC thành chuỗi thời gian địa phương theo định dạng
 * @param utcTimeString - Chuỗi thời gian định dạng UTC
 * @param format - Định dạng mong muốn (mặc định: DD/MM/YYYY HH:mm:ss)
 * @returns string - Chuỗi thời gian địa phương đã được định dạng
 */
export function convertUTCToFormattedLocalTime(
  utcTimeString: string,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string {
  const date = formatUTCToLocalTime(utcTimeString);
  return formatDate(date, format);
}

/**
 * Hàm utility để chuyển đổi chuỗi ngày tháng UTC (ISO) sang múi giờ địa phương và định dạng.
 * @param utcDateString - Chuỗi ngày tháng UTC (ví dụ: "2023-01-01T00:00:00Z").
 * @param timeZone - Múi giờ đích (mặc định: 'Asia/Ho_Chi_Minh' cho Việt Nam).
 * @param formatPattern - Định dạng đầu ra (mặc định: 'dd/MM/yyyy').
 * @returns Chuỗi ngày tháng đã định dạng, hoặc 'N/A' nếu input không hợp lệ.
 */
export const formatUtcToLocal = (
  utcDateString: string | null | undefined,
  timeZone: string = "Asia/Ho_Chi_Minh",
  formatPattern: string = "dd/MM/yyyy"
): string => {
  if (!utcDateString) {
    return "N/A"; // Hoặc giá trị fallback khác nếu cần
  }

  try {
    // Parse chuỗi UTC thành Date
    const utcDate = parseISO(utcDateString);

    // Chuyển đổi sang múi giờ địa phương
    const localDate = toZonedTime(utcDate, timeZone);

    // Format theo pattern
    return format(localDate, formatPattern, { timeZone });
  } catch (error) {
    console.error("Lỗi khi format ngày tháng:", error);
    return "N/A"; // Xử lý lỗi
  }
};
