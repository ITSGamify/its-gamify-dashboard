import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import {
  COURSE_TABLE_HEAD,
  DEFAULT_TABLE_LIMIT,
  DEFAULT_TABLE_PAGE_NUMBER,
} from "@constants/table";
import { FilterGroup, FilterValues } from "@interfaces/dom/filter";
import { OrderDirection } from "@interfaces/dom/query";
import { HeadCell, TableColumns } from "@interfaces/dom/table";
import {
  useDeleteCourse,
  useDeleteRangeCourses,
  useGetCourses,
} from "@services/course";
import { getStepNumberFromName } from "@utils/course";
import { getRoute } from "@utils/route";
import {
  appendFirstSearchParams,
  createParamSetter,
  getInitialSorted,
} from "@utils/url";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useCoursePage = () => {
  const [activePage, setActivePage] = useState(DEFAULT_TABLE_PAGE_NUMBER);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_TABLE_LIMIT);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const activeSearchInput = searchParams.get("q");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const navigate = useNavigate();

  const [sortedColumns, setSortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const setParam = createParamSetter(searchParams);

  const handleCreateCouse = () => {
    navigate(PATH.COURSES_CREATE);
  };

  const handleColumnSort = (column: string, direction: OrderDirection) => {
    setSortedColumns((prev) => {
      // Check if the column already has a sort direction
      const withoutCurrentColumn = prev.filter((c) => c.column !== column);

      return [{ column, direction }, ...withoutCurrentColumn];
    });
    const newParams = appendFirstSearchParams(column, direction, searchParams);

    setSearchParams(newParams);
  };

  const handlePageChange = (event: unknown, page: number) => {
    setActivePage(page);
  };

  const handelLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const courseColumns = COURSE_TABLE_HEAD.map((col) => {
    const sortEntry = sortedColumns.find((s) => s.column === col.id);

    return {
      ...col,
      label: col.label,
      isSorted: !!sortEntry,
      sortDirection: sortEntry ? sortEntry.direction : null,
    } as HeadCell;
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setActivePage(DEFAULT_TABLE_PAGE_NUMBER);
    setSearchInput(value);
    if (value.length === 0) {
      resetSearch();
    }
  };

  const resetSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
  };

  const handleSearchResults = () => {
    setParam("q", searchInput);
    setSearchParams(searchParams);
  };

  const handleApplyFilters = (
    filterGroups: FilterGroup[],
    filters: FilterValues,
    onSuccess: () => void
  ) => {
    // Thêm params vào URL

    // Xử lý từng nhóm filter
    filterGroups.forEach((group) => {
      const selectedValues = filters[group.id] || [];
      if (selectedValues.length > 0) {
        setParam(group.id, selectedValues.join("."));
      } else {
        searchParams.delete(group.id);
      }
    });

    setSearchParams(searchParams);
    // Đóng popper
    onSuccess();
  };

  const getAccountsReq = {
    page: activePage,
    limit: rowsPerPage,
    q: activeSearchInput || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data, isLoading, refetch } = useGetCourses(getAccountsReq);

  const courses = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;
  const total_items_count = pagination?.total_items_count ?? 0;

  const handleClick = (event: React.MouseEvent<unknown>, index: number) => {
    setSelected((prev) => {
      const selectedIndex = prev.indexOf(courses[index].id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = [...prev, courses[index].id];
      } else {
        newSelected = prev.filter((id) => id !== courses[index].id);
      }

      return newSelected;
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = courses.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const { mutateAsync: deleteAccount } = useDeleteCourse();

  const handleDelete = async (id: string) => {
    await deleteAccount(id, {
      onSuccess: () => {
        setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
        toast.success(ToastContent, {
          data: {
            message: "Cập nhật thành công!",
          },
        });
        refetch();
      },
    });
  };

  const { mutateAsync: deleteRangeAccount } = useDeleteRangeCourses();

  const handleDeleteAll = async () => {
    await deleteRangeAccount(
      { ids: selected },
      {
        onSuccess: () => {
          setSelected([]);
          toast.success(ToastContent, {
            data: {
              message: "Cập nhật thành công!",
            },
          });
          refetch();
        },
      }
    );
  };

  const handleUpdateCourse = (id: string, step: string) => {
    const step_num = getStepNumberFromName(step);
    const route = getRoute(PATH.COURSES_EDIT, {
      courseId: id,
    });
    return step_num !== -1
      ? navigate(route + "?step=" + step_num)
      : navigate(route + "?step=0");
  };

  const onActionSuccess = useCallback(() => {
    // setDepartment(null);
    refetch();
  }, [refetch]);

  const handleViewDetail = (id: string) => {
    const route = getRoute(PATH.COURSES_DETAIL, {
      courseId: id,
    });
    navigate(route);
  };

  return {
    isLoading,
    courses,
    courseColumns,
    handleApplyFilters,
    activePage,
    rowsPerPage,
    handlePageChange,
    handelLimitChange,
    handleColumnSort,
    selected,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleCreateCouse,
    handleClick,
    handleSelectAllClick,
    handleDeleteAll,
    onActionSuccess,
    handleDelete,
    handleUpdateCourse,
    total_page_count,
    page_index,
    page_size,
    total_items_count,
    handleViewDetail,
  };
};
