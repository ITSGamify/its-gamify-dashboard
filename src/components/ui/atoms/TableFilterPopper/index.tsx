import React from "react";
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
import { FilterValues, FilterGroup } from "@interfaces/dom/filter";

interface FilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[]; // Mảng các nhóm filter
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  handleResetFilters: () => void;
  title?: string;
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
const FilterPopper: React.FC<FilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  filterGroups,
  filters,
  setFilters,
  handleResetFilters,
  title = "Bộ lọc",
}) => {
  // Xử lý thay đổi các giá trị filter
  const handleFilterChange = (groupId: string, optionId: string) => {
    setFilters((prev) => {
      const currentValues = prev[groupId] || [];
      const newValues = currentValues.includes(optionId)
        ? currentValues.filter((id) => id !== optionId)
        : [...currentValues, optionId];

      return {
        ...prev,
        [groupId]: newValues,
      };
    });
  };

  // Xử lý áp dụng filter
  const handleApplyFilters = () => {
    // Thêm params vào URL
    const url = new URL(window.location.href);

    // Xử lý từng nhóm filter
    filterGroups.forEach((group) => {
      const selectedValues = filters[group.id] || [];
      if (selectedValues.length > 0) {
        url.searchParams.set(group.id, selectedValues.join("."));
      } else {
        url.searchParams.delete(group.id);
      }
    });

    // Cập nhật URL mà không làm tải lại trang
    window.history.pushState({}, "", url.toString());

    // Đóng popper
    onClose();
  };

  // Xóa một nhóm filter
  const handleClearFilterGroup = (groupId: string) => {
    setFilters((prev) => ({
      ...prev,
      [groupId]: [],
    }));
  };

  // Đếm số lượng nhóm filter đang áp dụng
  const getActiveFilterCount = () => {
    return Object.keys(filters).filter((key) => (filters[key] || []).length > 0)
      .length;
  };

  // Lấy số lượng lựa chọn trong một nhóm filter
  const getFilterGroupSelectionCount = (groupId: string) => {
    return (filters[groupId] || []).length;
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
                {title}
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

          {/* Render các nhóm filter */}
          {filterGroups.map((group) => (
            <FilterSection key={group.id}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {group.title}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      control={
                        <Checkbox
                          checked={(filters[group.id] || []).includes(
                            option.id
                          )}
                          onChange={() =>
                            handleFilterChange(group.id, option.id)
                          }
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2">{option.name}</Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </FilterSection>
          ))}

          {/* Hiển thị các bộ lọc đang áp dụng */}
          {getActiveFilterCount() > 0 && (
            <FilterSection>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Bộ lọc đang áp dụng
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {filterGroups.map((group) => {
                  const count = getFilterGroupSelectionCount(group.id);
                  if (count > 0) {
                    return (
                      <StyledChip
                        key={group.id}
                        label={`${group.title}: ${count}`}
                        onDelete={() => handleClearFilterGroup(group.id)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  }
                  return null;
                })}
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

export default FilterPopper;
