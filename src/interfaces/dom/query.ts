export type DefaultQueryKey<T> = [string, string, string, T];

export type OrderDirection = "asc" | "desc";

export type PaginationParams = {
  page?: number;
  limit?: number;
  q?: string; // Search query parameter used for filtering results
  order_by?: {
    order_dir?: OrderDirection;
    order_column?: string;
  }[];
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export interface Pagination {
  total_pages: number;
  total_items_count: number;
  total_pages_count: number;
  page_size: number;
  page_index: number;
}
