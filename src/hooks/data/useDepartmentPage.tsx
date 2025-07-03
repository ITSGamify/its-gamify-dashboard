import { Department } from "@interfaces/api/department";
import {
  useDeleteDepartment,
  useDeleteRangeDepartments,
  useGetDeparments,
} from "@services/department";
import { useCallback, useState } from "react";
import {
  DEFAULT_TABLE_PAGE_NUMBER,
  DEFAULT_TABLE_LIMIT,
  DEPARTMENT_TABLE_HEAD,
} from "@constants/table";
import { useSearchParams } from "react-router-dom";
import {
  appendFirstSearchParams,
  createParamSetter,
  getInitialSorted,
} from "@utils/url";
import { OrderDirection } from "@interfaces/dom/query";
import { HeadCell, TableColumns } from "@interfaces/dom/table";
import ToastContent from "@components/ui/atoms/Toast";
import { toast } from "react-toastify";

const defaultSort = [
  {
    column: "name",
    direction: "ASC" as OrderDirection,
  },
  {
    column: "leader",
    direction: "DESC" as OrderDirection,
  },
];

export const useDepartmentPage = () => {
  const [activePage, setActivePage] = useState(DEFAULT_TABLE_PAGE_NUMBER);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_TABLE_LIMIT);
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const activeSearchInput = searchParams.get("q");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [department, setDepartment] = useState<Department | null>(null);

  const [sortedColumns, setSortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const setParam = createParamSetter(searchParams);

  const handleColumnSort = (column: string, direction: OrderDirection) => {
    setSortedColumns((prev) => {
      // Check if the column already has a sort direction
      const withoutCurrentColumn = prev.filter((c) => c.column !== column);

      return [{ column, direction }, ...withoutCurrentColumn];
    });
    const newParams = appendFirstSearchParams(column, direction, searchParams);

    setSearchParams(newParams);
  };

  const handleOpenModal = () => {
    setDepartment(null);
    setOpenModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handlePageChange = (event: unknown, page: number) => {
    setActivePage(page);
  };

  const handelLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

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

  const getDepatmentsReq = {
    page: activePage,
    limit: rowsPerPage,
    q: activeSearchInput || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data, isLoading, refetch } = useGetDeparments(getDepatmentsReq);
  const departments = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;
  const total_items_count = pagination?.total_items_count ?? 0;

  const departmentColumns = DEPARTMENT_TABLE_HEAD.map((col) => {
    const sortEntry = sortedColumns.find((s) => s.column === col.id);

    return {
      ...col,
      label: col.label,
      isSorted: !!sortEntry,
      sortDirection: sortEntry ? sortEntry.direction : null,
    } as HeadCell;
  });

  const handleClick = (event: React.MouseEvent<unknown>, index: number) => {
    setSelected((prev) => {
      const selectedIndex = prev.indexOf(departments[index].id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = [...prev, departments[index].id];
      } else {
        newSelected = prev.filter((id) => id !== departments[index].id);
      }

      return newSelected;
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = departments.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleUpdate = (data: Department) => {
    setDepartment(data);
    setOpenModal(true);
  };

  const { mutateAsync: deleteDepartment } = useDeleteDepartment();

  const handleDelete = async (id: string) => {
    await deleteDepartment(id, {
      onSuccess: () => {
        refetch();
        setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
        toast.success(ToastContent, {
          data: {
            message: "Cập nhật thành công!",
          },
        });
      },
    });
  };

  const { mutateAsync: deleteRangeDepartment } = useDeleteRangeDepartments();

  const handleDeleteAll = async () => {
    await deleteRangeDepartment(
      { ids: selected },
      {
        onSuccess: () => {
          refetch();
          setSelected([]);
          toast.success(ToastContent, {
            data: {
              message: "Cập nhật thành công!",
            },
          });
        },
      }
    );
  };

  const onActionSuccess = useCallback(() => {
    setDepartment(null);
    refetch();
    handleCloseModal();
  }, [handleCloseModal, refetch]);

  return {
    departments,
    isLoading,
    refetchDepartments: refetch,
    onActionSuccess,
    activePage,
    rowsPerPage,
    handlePageChange,
    handelLimitChange,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleColumnSort,
    departmentColumns,
    selected,
    handleClick,
    handleSelectAllClick,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleDelete,
    handleDeleteAll,
    department,
    handleUpdate,
    total_page_count,
    page_index,
    page_size,
    total_items_count,
  };
};
