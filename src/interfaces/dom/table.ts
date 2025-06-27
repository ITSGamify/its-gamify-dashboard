import { OrderDirection } from "./query";

export interface HeadCell {
  id: string;
  numeric: boolean;
  align: "right" | "left" | "center";
  disablePadding: boolean;
  label: string;
  isSorted: boolean;
  disableSort: boolean;
  sortDirection: OrderDirection | null;
}

export interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (column: string, direction: OrderDirection) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  headCells: HeadCell[];
}

export type TableColumns = Array<{
  column: string | null;
  direction: OrderDirection | null;
}>;
