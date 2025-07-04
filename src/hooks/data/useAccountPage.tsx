import ToastContent from "@components/ui/atoms/Toast";
import {
  ACCOUNT_TABLE_HEAD,
  DEFAULT_TABLE_LIMIT,
  DEFAULT_TABLE_PAGE_NUMBER,
} from "@constants/table";
import { RoleEnum, User } from "@interfaces/api/user";
import { FilterGroup, FilterValues } from "@interfaces/dom/filter";
import { OrderDirection } from "@interfaces/dom/query";
import { HeadCell, TableColumns } from "@interfaces/dom/table";
import {
  useDeleteAccount,
  useDeleteRangeAccounts,
  useGetAccounts,
} from "@services/account";
import { useGetRoles } from "@services/role";
import {
  appendFirstSearchParams,
  createParamSetter,
  getInitialSorted,
} from "@utils/url";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const defaultSort = [
  {
    column: "name",
    direction: "ASC" as OrderDirection,
  },
];

export const useAccountPage = () => {
  const [activePage, setActivePage] = useState(DEFAULT_TABLE_PAGE_NUMBER);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_TABLE_LIMIT);
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const activeSearchInput = searchParams.get("q");
  const activeRoleFiler = searchParams.get("role");
  const activeStatusFilter = searchParams.get("status");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [account, setAccount] = useState<User | null>(null);
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
    setAccount(null);
    setOpenModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setAccount(null);
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
    role: activeRoleFiler || "",
    status: activeStatusFilter || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data, isLoading, refetch } = useGetAccounts(getAccountsReq);
  const accounts = data?.data || [];

  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;
  const total_items_count = pagination?.total_items_count ?? 0;

  const accountColumns = ACCOUNT_TABLE_HEAD.map((col) => {
    const sortEntry = sortedColumns.find((s) => s.column === col.id);

    return {
      ...col,
      label: col.label,
      isSorted: !!sortEntry,
      sortDirection: sortEntry ? sortEntry.direction : null,
    } as HeadCell;
  });

  const { mutateAsync: deleteAccount } = useDeleteAccount();

  const handleClick = (event: React.MouseEvent<unknown>, index: number) => {
    setSelected((prev) => {
      const selectedIndex = prev.indexOf(accounts[index].id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = [...prev, accounts[index].id];
      } else {
        newSelected = prev.filter((id) => id !== accounts[index].id);
      }

      return newSelected;
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = accounts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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

  const { mutateAsync: deleteRangeAccount } = useDeleteRangeAccounts();

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

  const onActionSuccess = useCallback(() => {
    // setDepartment(null);
    refetch();
    handleCloseModal();
  }, [handleCloseModal, refetch]);

  const handleEdit = (user: User) => {
    setAccount(user);
    setOpenModal(true);
  };

  const { data: roles, isLoading: isRoleLoading } = useGetRoles();

  return {
    accounts,
    refetchAccounts: refetch,
    isLoading,
    handleApplyFilters,
    activePage,
    rowsPerPage,
    handlePageChange,
    handelLimitChange,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleColumnSort,
    selected,
    handleClick,
    handleSelectAllClick,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleDelete,
    handleDeleteAll,
    onActionSuccess,
    handleEdit,
    account,
    accountColumns,
    roles: (roles?.data || []).filter(
      (role) => role.name === RoleEnum.EMPLOYEE || role.name === RoleEnum.LEADER
    ),
    isRoleLoading,
    total_page_count,
    page_index,
    page_size,
    total_items_count,
  };
};
