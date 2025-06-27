import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { OrderDirection } from "@interfaces/dom/query";
import { HeadCell, EnhancedTableProps } from "@interfaces/dom/table";
import { CircularProgress, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

function CustomTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount, onRequestSort, headCells } =
    props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all items",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={headCell.sortDirection || false}
          >
            <TableSortLabel
              active={!headCell.disableSort}
              direction={headCell.sortDirection || undefined}
              onClick={() =>
                onRequestSort(
                  headCell.id,
                  headCell.sortDirection == "asc" ? "desc" : "asc"
                )
              }
            >
              {headCell.label}
              {headCell.isSorted ? (
                <Box component="span" sx={visuallyHidden}>
                  {headCell.sortDirection === "desc"
                    ? "sorted descending"
                    : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const TableLoadingOverlay = () => {
  return (
    <Box
      sx={{
        py: 10,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 1,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export interface DataTableProps {
  headCells: HeadCell[];
  data: React.ReactNode[][];
  dense?: boolean;
  isLoading: boolean;
  selected: string[];
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (ecolumn: string, direction: OrderDirection) => void;
  handleClick: (event: React.MouseEvent<unknown>, id: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  dense = true,
  headCells,
  data,
  selected = [],
  handleSelectAllClick,
  handleRequestSort,
  handleClick,
  isLoading,
}) => {
  return (
    <>
      <Box sx={{ position: "relative" }}>
        {isLoading && <TableLoadingOverlay />}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            {data.length !== 0 && !isLoading && (
              <CustomTableHead
                headCells={headCells}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />
            )}
            <TableBody>
              {data.map((row, index) => {
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, index)}
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    {row.map((cell, cellIndex) => (
                      <React.Fragment key={cellIndex}>{cell}</React.Fragment>
                    ))}
                  </TableRow>
                );
              })}
              {data.length === 0 && !isLoading && (
                <TableRow sx={{ height: 200 }}>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 3,
                      }}
                    >
                      <InboxIcon
                        sx={{
                          fontSize: 64,
                          color: "text.secondary",
                          mb: 1,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export { DataTable };
