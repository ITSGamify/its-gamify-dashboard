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

// Định nghĩa interface cho HeadCell để linh hoạt hơn
export interface HeadCell {
  id: string;
  numeric: boolean;
  align: "right" | "left" | "center";
  disablePadding: boolean;
  label: string;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: OrderDirection;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

function CustomTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

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
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export interface DataTableProps {
  headCells: HeadCell[];
  data: React.ReactNode[][];
  dense: boolean;
  page: number;
  rowsPerPage: number;
  order: OrderDirection;
  orderBy: string;
  selected: string[];
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: string
  ) => void;
  handleClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  dense = false,
  headCells,
  data,
  page,
  rowsPerPage = 5,
  selected = [],
  order = "asc",
  orderBy = headCells[0]?.id || "",
  handleSelectAllClick,
  handleRequestSort,
  handleClick,
}) => {
  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <CustomTableHead
            headCells={headCells}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {data.map((row, index) => {
              const actualIndex = page * rowsPerPage + index + "";
              const isItemSelected = isSelected(actualIndex);
              const labelId = `enhanced-table-checkbox-${actualIndex}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, "actualIndex")}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={actualIndex}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <React.Fragment key={cellIndex}>{cell}</React.Fragment>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export { DataTable };
