import TablePagination from "@mui/material/TablePagination";

interface CustomTablePaginationrProps {
  rowsPerPageOptions: number[];
  title: string;
  count: number;
  rowsPerPage: number;
  page: number;
  handleChangePage: () => void;
  handleChangeRowsPerPage: () => void;
}

function CustomTablePagination(props: CustomTablePaginationrProps) {
  const {
    rowsPerPageOptions,
    title,
    count,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  return (
    <TablePagination
      labelRowsPerPage={title}
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
export default CustomTablePagination;
