import {
  DEFAULT_TABLE_LIMIT,
  DEFAULT_TABLE_PAGE_NUMBER,
} from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetChallengeQuestions } from "@services/question";
import { getInitialSorted } from "@utils/url";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  courseId: string;
}
const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];
export const usePreviewChallengeModal = ({ courseId }: Props) => {
  const [activePage, setActivePage] = useState(DEFAULT_TABLE_PAGE_NUMBER);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_TABLE_LIMIT);
  const [searchInput, setSearchInput] = useState("");
  const [searchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const getQuestionsReq = {
    page: activePage,
    limit: rowsPerPage,
    q: searchInput,
    courseId: courseId,
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data, isLoading } = useGetChallengeQuestions(getQuestionsReq);
  const { questions, pagination } = useMemo(() => {
    return {
      questions: data?.data || [],
      pagination: data?.pagination,
    };
  }, [data]);
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;
  const total_items_count = pagination?.total_items_count ?? 0;

  const handelLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handlePageChange = (event: unknown, page: number) => {
    setActivePage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  return {
    searchInput,
    questions,
    isLoading,
    activePage,
    rowsPerPage,
    total_page_count,
    page_index,
    page_size,
    total_items_count,
    handelLimitChange,
    handlePageChange,
    handleSearchChange,
  };
};
