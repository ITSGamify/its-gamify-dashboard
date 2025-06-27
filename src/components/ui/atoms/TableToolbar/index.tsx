import {
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  InputBase,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { ReactElement } from "react";
import { simulateEnterKeyDown } from "@utils/common";
import { FilterGroup, FilterValues } from "@interfaces/dom/filter";

interface TableToolbarProps {
  filterTitle?: string;
  numSelected: number;
  onCreate: () => void;
  createLabel: string;
  filterButton?: ReactElement;
  handleAppyFilter?: (
    filterGroups: FilterGroup[],
    filters: FilterValues,
    onSuccess: () => void
  ) => void;
  searchValue: string | "";
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  onDelete?: () => void;
}

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.black, 0.4),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

function TableToolbar(props: TableToolbarProps) {
  const {
    numSelected,
    onCreate,
    createLabel,
    filterButton,
    filterTitle = "Bộ lọc:",
    searchValue = "",
    onInputChange,
    onEnter,
    onDelete,
  } = props;

  return (
    <>
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} đã chọn
          </Typography>
        ) : (
          <Box
            component={"div"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: "1 1 100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ flex: "100%" }}
                fontSize={"16px"}
                id="tableTitle"
                component="div"
              >
                {filterTitle}
              </Typography>
              {filterButton && (
                <Tooltip title="Lọc danh sách">{filterButton}</Tooltip>
              )}
              <SearchWrapper>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onKeyDown={simulateEnterKeyDown(onEnter)}
                  value={searchValue}
                  onChange={onInputChange}
                  placeholder="Tìm kiếm..."
                  inputProps={{ "aria-label": "search" }}
                />
              </SearchWrapper>
            </Box>
            <Button variant="contained" onClick={onCreate}>
              <AddIcon /> {createLabel}
            </Button>
          </Box>
        )}
        {numSelected > 0 && (
          <>
            <Tooltip title="Xóa">
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </>
  );
}

export default TableToolbar;
