export interface FilterValues {
  [key: string]: string[]; // key là id của filter group, value là mảng các id đã chọn
}

// Định nghĩa kiểu dữ liệu cho option
export interface FilterOption {
  id: string;
  name: string;
}

// Định nghĩa kiểu dữ liệu cho nhóm filter
export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}
