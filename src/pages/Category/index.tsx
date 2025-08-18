import { DataTable } from "@components/ui/molecules/DataTable";
import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";
import userSession from "@utils/user-session";
import { RoleEnum } from "@interfaces/api/user";
import { useCategoryPage } from "@hooks/data/useCategorypage";
import { Category } from "@interfaces/api/category";
import CategoryModalForm from "@components/ui/molecules/CategoryModalForm";
import { truncateText } from "@utils/string";
import { FilterGroup } from "@interfaces/dom/filter";
import FilterButton from "@components/ui/molecules/FilterButton";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import StatusBadge from "@components/ui/atoms/TableBadge";
import ConfirmDialog from "@components/ui/atoms/ConfirmDialog";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

const CategoryPage: React.FC = () => {
  const {
    categories,
    activePage,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleColumnSort,
    categoriesColumns,
    selected,
    handleClick,
    handleSelectAllClick,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleDelete,
    handleDeleteAll,
    category,
    handleUpdate,
    onActionSuccess,
    isLoading,
    page_size,
    handlePageChange,
    handelLimitChange,
    total_items_count,
    handleApplyFilters,
    handleReActiveCategory,
  } = useCategoryPage();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const profile = userSession.getUserProfile();

  const filterGroups: FilterGroup[] = [
    {
      id: "isActive",
      title: "Trạng thái",
      options: [
        { id: "true", name: "Hoạt động" },
        { id: "false", name: "Đã ngừng" },
      ],
      type: "radio",
    },
  ];

  const menuItems = (category: Category) => {
    if (profile?.user.role !== RoleEnum.TRAINER) return [];
    return [
      {
        icon: <EditIcon color="action" />,
        label: "Chỉnh sửa",
        onClick: () => {
          handleUpdate(category);
        },
      },
      {
        icon: category.is_deleted ? (
          <PowerSettingsNewOutlinedIcon color="success" />
        ) : (
          <DeleteOutlineIcon color="error" />
        ),
        label: category.is_deleted ? "  Kích hoạt" : "Tạm ngưng",
        onClick: () => {
          if (category.is_deleted) {
            handleReActiveCategory(category.id);
          } else {
            if (category.courses.length > 0) {
              toast.warning(ToastContent, {
                data: {
                  message:
                    "Danh mục này đang được áp dụng cho khóa học hoặc giải đấu khác, không thể xóa!",
                },
              });
              return;
            }

            setCategoryIdToDelete(category.id);
            setOpenConfirm(true);
          }
        },
        sx: { color: category.is_deleted ? "green" : "red" },
      },
    ];
  };

  const dataTable =
    categories.length > 0
      ? categories.map((row: Category, index) => {
          return [
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selected.indexOf(row.id) !== -1}
                inputProps={{
                  "aria-labelledby": `enhanced-table-checkbox-${index}`,
                }}
              />
            </TableCell>,
            <TableCell key="name" component="th" scope="row" padding="none">
              {row.name && row.name.length > 40 ? (
                <Tooltip title={row.name} placement="top" arrow>
                  <span>{truncateText(row.name, 40)}</span>
                </Tooltip>
              ) : (
                truncateText(row.name, 40)
              )}
            </TableCell>,
            <TableCell
              key="description"
              component="th"
              scope="row"
              padding="none"
            >
              {row.description && row.description.length > 40 ? (
                <Tooltip title={row.description} placement="top" arrow>
                  <span>{truncateText(row.description, 40)}</span>
                </Tooltip>
              ) : (
                truncateText(row.description, 40)
              )}
            </TableCell>,
            <TableCell key="courseCount" align="center">
              {row.courses.length || 0}
            </TableCell>,
            <TableCell key="challengeCount" align="center">
              {row.challenges.length || 0}
            </TableCell>,
            <TableCell key="status" align="center">
              <StatusBadge
                status={row.is_deleted ? "CANCELLED" : "ACTIVE"}
                label={row.is_deleted ? "Đã ngừng" : "Hoạt động"}
              />
            </TableCell>,
            <TableCell key="action" align="right">
              <TableActionButton menuItems={menuItems(row)} />
            </TableCell>,
          ];
        })
      : [];
  //#endregion
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            filterTitle="Tìm kiếm:"
            numSelected={selected.length}
            onCreate={handleOpenModal}
            createLabel="Tạo mới"
            searchValue={searchInput}
            onInputChange={handleSearch}
            onEnter={handleSearchResults}
            onDelete={handleDeleteAll}
            isHiddenCreateButton={profile?.user.role !== RoleEnum.ADMIN}
            filterButton={
              <FilterButton
                filterGroups={filterGroups}
                handleApplyFilters={handleApplyFilters}
              />
            }
          />
          <DataTable
            headCells={categoriesColumns}
            data={dataTable}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleColumnSort}
            handleClick={handleClick}
            isLoading={isLoading}
          />

          {categories.length !== 0 && !isLoading && (
            <TablePagination
              labelRowsPerPage="Số dòng mỗi trang:"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total_items_count}
              rowsPerPage={page_size}
              page={activePage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handelLimitChange}
            />
          )}
        </Paper>
      </Box>
      <CategoryModalForm
        data={category}
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={onActionSuccess}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setCategoryIdToDelete(null);
        }}
        onConfirm={() => {
          if (categoryIdToDelete) {
            handleDelete(categoryIdToDelete);
          }
        }}
      />
    </>
  );
};

export default CategoryPage;
