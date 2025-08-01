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

import FilterButton from "@components/ui/molecules/FilterButton";
import { FilterGroup } from "@interfaces/dom/filter";
import defaultCourseImage from "@assets/images/its_gamify_course_default.png";
import { useChallengePage } from "@hooks/data/useChallengePage";
import { Challenge } from "@interfaces/api/challenge";
import { truncateText } from "@utils/string";

const departments = [
  { id: "it", name: "Công nghệ thông tin" },
  { id: "marketing", name: "Marketing" },
  { id: "hr", name: "Nhân sự" },
  { id: "finance", name: "Tài chính" },
  { id: "operations", name: "Vận hành" },
];
const filterGroups: FilterGroup[] = [
  {
    id: "department",
    title: "Phòng ban",
    options: departments,
  },
];

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
  } = useChallengePage();

  const menuItems = (challenge: Challenge) => [
    {
      icon: <EditIcon color="action" />,
      label: "Chỉnh sửa",
      onClick: () => {
        handleUpdateChallange(challenge.id);
      },
    },
    {
      icon: <DeleteOutlineIcon color="error" />,
      label: "Tạm ngưng",
      onClick: () => {
        handleDelete(challenge.id);
      },
      sx: { color: "red" },
    },
  ];

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
          {row.title}
        </Box>
      </TableCell>,
      <TableCell key="description" align="left">
        {truncateText(row.description, 60)}
      </TableCell>,
      <TableCell key="course" align="left">
        {row.course?.title || ""}
      </TableCell>,
      <TableCell key="num_of_room" align="left">
        {row.num_of_room || ""}
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
