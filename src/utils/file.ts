/**
 * Format bytes to megabytes with 2 decimal places
 * @param bytes - The number of bytes to format
 * @returns Formatted string in MB
 */
export const formatToMB = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};