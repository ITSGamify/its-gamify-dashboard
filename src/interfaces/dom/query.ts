export type DefaultQueryKey<T> = [string, string, string, T];

export type OrderDirection = "asc" | "desc";

export type PaginationParams = {
  page?: number;
  limit?: number;
  q?: string;
  order_by?: {
    order_dir?: OrderDirection;
    order_column?: string;
  }[];
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total_pages: number;
    total_records: number;
    records_per_page: number;
    current_page: number;
  };
};
