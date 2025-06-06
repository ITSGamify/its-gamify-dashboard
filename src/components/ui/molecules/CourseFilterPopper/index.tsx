import React, { useState } from "react";
import {
  Popper,
  Paper,
  ClickAwayListener,
  Box,
  Typography,
  Divider,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Badge, ButtonProps, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

// Định nghĩa các kiểu dữ liệu
interface Department {
  id: string;
  label: string;
}

interface CourseFilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  departments: Department[];
  onApplyFilter: (filters: CourseFilterValues) => void;
  initialFilters?: CourseFilterValues;
}

interface CourseFilterValues {
  departments: string[];
}

// Styled components
const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 320,
  maxHeight: "calc(100vh - 100px)",
  overflow: "auto",
  borderRadius: 12,
  boxShadow: theme.shadows[3],
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FilterActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 16,
  height: 28,
  "& .MuiChip-label": {
    paddingLeft: 10,
    paddingRight: 10,
  },
}));

// Component chính
export const CourseFilterPopper: React.FC<CourseFilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  departments,
  onApplyFilter,
  initialFilters,
}) => {
  // State cho các giá trị filter
  const [filters, setFilters] = useState<CourseFilterValues>(
    initialFilters || {
      departments: [],
    }
  );

  // Xử lý thay đổi các giá trị filter
  const handleDepartmentChange = (id: string) => {
    setFilters((prev) => {
      const newDepartments = prev.departments.includes(id)
        ? prev.departments.filter((id) => id !== id)
        : [...prev.departments, id];
      return { ...prev, departments: newDepartments };
    });
  };

  // Xử lý reset filter
  const handleResetFilters = () => {
    setFilters({
      departments: [],
    });
  };

  // Xử lý áp dụng filter
  const handleApplyFilters = () => {
    onApplyFilter(filters);
    onClose();
  };

  // Đếm số lượng filter đang áp dụng
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.departments.length > 0) count += 1;
    return count;
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom"
      style={{ zIndex: 1300 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <FilterContainer>
          <FilterHeader>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                Lọc khóa học
              </Typography>
              {getActiveFilterCount() > 0 && (
                <Chip
                  label={getActiveFilterCount()}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Button
              startIcon={<CloseIcon />}
              color="inherit"
              size="small"
              onClick={onClose}
              sx={{ minWidth: "auto", p: 0.5 }}
            />
          </FilterHeader>

          <Divider sx={{ mb: 2 }} />

          <FilterSection>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Phòng ban
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {departments.map((department) => (
                  <FormControlLabel
                    key={department.id}
                    control={
                      <Checkbox
                        checked={filters.departments.includes(department.id)}
                        onChange={() => handleDepartmentChange(department.id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {department.label}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </FilterSection>

          {getActiveFilterCount() > 0 && (
            <FilterSection>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Bộ lọc đang áp dụng
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {filters.departments.length > 0 && (
                  <StyledChip
                    label={`Vai trò: ${filters.departments.length}`}
                    onDelete={() => setFilters({ ...filters, departments: [] })}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </FilterSection>
          )}

          <Divider sx={{ my: 2 }} />

          <FilterActions>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleResetFilters}
              disabled={getActiveFilterCount() === 0}
            >
              Xóa bộ lọc
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              startIcon={<CheckIcon />}
            >
              Áp dụng
            </Button>
          </FilterActions>
        </FilterContainer>
      </ClickAwayListener>
    </Popper>
  );
};

interface CourseFilterButtonProps extends Omit<ButtonProps, "onClick"> {
  onFilterChange: (filters: CourseFilterValues) => void;
  initialFilters?: CourseFilterValues;
  departments: Array<Department>;
}

const CourseFilterButton: React.FC<CourseFilterButtonProps> = ({
  onFilterChange,
  initialFilters,
  departments,
  ...buttonProps
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<CourseFilterValues>(
    initialFilters || {
      departments: [],
    }
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (newFilters: CourseFilterValues) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Đếm số lượng filter đang áp dụng
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.departments.length > 0) count += 1;
    return count;
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Badge
        badgeContent={getActiveFilterCount()}
        color="primary"
        invisible={getActiveFilterCount() === 0}
      >
        <IconButton onClick={handleClick}>
          <FilterListIcon />
        </IconButton>
      </Badge>

      <CourseFilterPopper
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        departments={departments}
        onApplyFilter={handleApplyFilter}
        initialFilters={filters}
      />
    </>
  );
};

export default CourseFilterButton;
