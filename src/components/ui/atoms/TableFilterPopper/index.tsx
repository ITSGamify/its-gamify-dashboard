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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
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
  handleApplyFilters: (
    filterGroups: FilterGroup[],
    filters: FilterValues,
    onSuccess: () => void
  ) => void;
}

//#region  Styled components
const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "auto",
  maxWidth: 800, // Tăng để mở rộng ngang, điều chỉnh nếu cần
  maxHeight: "calc(100vh - 100px)",
  overflow: "auto",
  borderRadius: 12,
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column", // Container chính vẫn column để header/actions ở trên/dưới
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const FilterSectionsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column", // Luôn column để groups xếp dọc
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const FilterSection = styled(Box)(() => ({
  flex: 1,
  minWidth: 200, // Đảm bảo mỗi group có width tối thiểu để ngang
  display: "flex",
  flexDirection: "column",
}));

const OptionsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  maxHeight: 80, // Giới hạn height cho khoảng 2 rows (giả sử mỗi row ~40px, điều chỉnh nếu cần)
  overflow: "auto", // Scroll nếu vượt 2 rows
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
//#endregion

// Component chính
const FilterPopper: React.FC<FilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  filterGroups,
  filters,
  setFilters,
  handleResetFilters,
  handleApplyFilters,
}) => {
  // Xử lý thay đổi các giá trị filter (hỗ trợ cả checkbox và radio)
  const handleFilterChange = (
    groupId: string,
    optionId: string,
    groupType: "checkbox" | "radio"
  ) => {
    setFilters((prev) => {
      const currentValues = prev[groupId] || [];

      if (groupType === "radio") {
        // Với radio: Single select, chỉ set giá trị mới (thay thế nếu có)
        return {
          ...prev,
          [groupId]: [optionId], // Luôn là mảng với 1 item
        };
      } else {
        // Với checkbox: Multi-select, add/remove
        const newValues = currentValues.includes(optionId)
          ? currentValues.filter((id) => id !== optionId)
          : [...currentValues, optionId];
        return {
          ...prev,
          [groupId]: newValues,
        };
      }
    });
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
                Áp dụng bộ lọc
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

          {/* Render các nhóm filter theo chiều dọc */}
          <FilterSectionsWrapper>
            {filterGroups.map((group) => {
              const groupType = group.type || "checkbox"; // Default là checkbox nếu không chỉ định
              return (
                <FilterSection key={group.id}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {group.title}
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <OptionsWrapper>
                      {groupType === "checkbox" ? (
                        <FormGroup row>
                          {group.options.map((option) => (
                            <FormControlLabel
                              key={option.id}
                              control={
                                <Checkbox
                                  checked={(filters[group.id] || []).includes(
                                    option.id
                                  )}
                                  onChange={() =>
                                    handleFilterChange(
                                      group.id,
                                      option.id,
                                      groupType
                                    )
                                  }
                                  color="primary"
                                  size="small"
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {option.name}
                                </Typography>
                              }
                              sx={{ margin: 0, flexBasis: "auto" }} // Đảm bảo ngang và wrap
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        <RadioGroup
                          row
                          value={filters[group.id][0]}
                          onChange={(e) =>
                            handleFilterChange(
                              group.id,
                              e.target.value,
                              groupType
                            )
                          }
                        >
                          {group.options.map((option) => (
                            <FormControlLabel
                              key={option.id}
                              value={option.id}
                              control={<Radio color="primary" size="small" />}
                              label={
                                <Typography variant="body2">
                                  {option.name}
                                </Typography>
                              }
                              sx={{ margin: 0, flexBasis: "auto" }} // Đảm bảo ngang và wrap
                            />
                          ))}
                        </RadioGroup>
                      )}
                    </OptionsWrapper>
                  </FormControl>
                </FilterSection>
              );
            })}
          </FilterSectionsWrapper>

          {/* Hiển thị các bộ lọc đang áp dụng */}
          {getActiveFilterCount() > 0 && (
            <Box>
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
            </Box>
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
              onClick={() => handleApplyFilters(filterGroups, filters, onClose)}
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
