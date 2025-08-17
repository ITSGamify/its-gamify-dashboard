import { DataTable } from "@components/ui/molecules/DataTable";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Checkbox,
  Paper,
  TableCell,
  TablePagination,
} from "@mui/material";
import TableActionButton from "@components/ui/atoms/TableActionButton";
import TableToolbar from "@components/ui/atoms/TableToolbar";
// import VisibilityIcon from "@mui/icons-material/Visibility";

import FilterButton from "@components/ui/molecules/FilterButton";
import { FilterGroup } from "@interfaces/dom/filter";
import defaultCourseImage from "@assets/images/its_gamify_course_default.png";
import { useChallengePage } from "@hooks/data/useChallengePage";
import { Challenge } from "@interfaces/api/challenge";
import { truncateText } from "@utils/string";
import { TOURNAMENT_KEY } from "@constants/challenge";
import { RoleEnum } from "@interfaces/api/user";
import StatusBadge from "@components/ui/atoms/TableBadge";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";

const TournamentPage: React.FC = () => {
  const {
    isLoading,
    challengeColumns,
    challenges,
    handleApplyFilters,
    activePage,
    handlePageChange,
    handelLimitChange,
    handleColumnSort,
    selected,
    searchInput,
    handleSearch,
    handleSearchResults,
    handleCreateChallenge,
    handleClick,
    handleSelectAllClick,
    handleDeleteAll,
    handleDelete,
    handleUpdateChallange,
    page_size,
    total_items_count,
    profile,
    handleReActiveChallenge,
    categories,
  } = useChallengePage();

  const filterGroups: FilterGroup[] = [
    {
      id: "category",
      title: "Phòng ban",
      options: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    },
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

  const menuItems = (challenge: Challenge) => {
    if (profile?.user.role !== RoleEnum.TRAINER) return [];
    return [
      {
        icon: <EditIcon color="action" />,
        label: "Chỉnh sửa",
        onClick: () => {
          handleUpdateChallange(challenge.id);
          sessionStorage.removeItem(TOURNAMENT_KEY);
        },
      },
      {
        icon: challenge.is_deleted ? (
          <PowerSettingsNewOutlinedIcon color="success" />
        ) : (
          <DeleteOutlineIcon color="error" />
        ),
        label: challenge.is_deleted ? "  Kích hoạt" : "Tạm ngưng",
        onClick: () => {
          if (challenge.is_deleted) {
            handleReActiveChallenge(challenge.id);
          } else {
            handleDelete(challenge.id);
          }
        },
        sx: { color: challenge.is_deleted ? "green" : "red" },
      },
    ];
  };

  const dataTable = challenges.map((row: Challenge, index) => {
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
      <TableCell key="title" component="th" scope="row" padding="none">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>
            <img
              src={row.thumbnail_image}
              alt={row.title}
              style={{
                width: 40,
                height: 40,
                borderRadius: "4px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src = defaultCourseImage;
              }}
            />
          </Box>
          {truncateText(row.title, 40)}
        </Box>
      </TableCell>,
      <TableCell key="description" align="left">
        {truncateText(row.description, 30)}
      </TableCell>,
      <TableCell key="course" align="left">
        {truncateText(row.course?.title || "", 30)}
      </TableCell>,
      <TableCell key="course" align="left">
        {truncateText(row.category?.name || "", 20)}
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
  });

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            numSelected={selected.length}
            onCreate={handleCreateChallenge}
            createLabel="Tạo thử thách"
            searchValue={searchInput}
            onInputChange={handleSearch}
            onEnter={handleSearchResults}
            onDelete={handleDeleteAll}
            isHiddenCreateButton={profile?.user.role !== RoleEnum.TRAINER}
            filterButton={
              <FilterButton
                filterGroups={filterGroups}
                handleApplyFilters={handleApplyFilters}
              />
            }
          />
          <DataTable
            headCells={challengeColumns}
            data={dataTable}
            selected={selected}
            handleClick={handleClick}
            handleSelectAllClick={handleSelectAllClick}
            handleRequestSort={handleColumnSort}
            isLoading={isLoading}
          />

          {challenges.length !== 0 && !isLoading && (
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
    </>
  );
};

export default TournamentPage;
