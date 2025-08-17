import React, { useEffect, useState } from "react";
import { Badge, ButtonProps, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterPopper from "../../atoms/TableFilterPopper"; // Giữ nguyên đường dẫn nhưng sử dụng component mới
import { FilterValues, FilterGroup } from "@interfaces/dom/filter";

interface FilterButtonProps extends Omit<ButtonProps, "onClick"> {
  filterGroups: FilterGroup[];
  title?: string;
  handleApplyFilters: (
    filterGroups: FilterGroup[],
    filters: FilterValues,
    onSuccess: () => void
  ) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  filterGroups,
  title = "Lọc người dùng",
  handleApplyFilters,
  ...buttonProps
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Khởi tạo filters từ initialFilters hoặc tạo một đối tượng trống
  const [filters, setFilters] = useState<FilterValues>(
    filterGroups.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {} as FilterValues)
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters: FilterValues = {};

    filterGroups.forEach((group) => {
      const groupType = group.type || "checkbox"; // Default là checkbox
      const paramValue = urlParams.get(group.id);

      if (paramValue) {
        if (groupType === "radio") {
          // Với radio: Mong đợi giá trị đơn (string), set thành array với 1 item
          try {
            const parsed = JSON.parse(paramValue);
            // Nếu là array, lấy item đầu tiên (hoặc empty nếu không phải string)
            initialFilters[group.id] = [parsed];
          } catch {
            // Nếu không parse JSON, dùng trực tiếp string (không split)
            initialFilters[group.id] = paramValue ? [paramValue] : [];
          }
        } else {
          // Với checkbox: Parse array (giữ nguyên logic cũ)
          try {
            initialFilters[group.id] = JSON.parse(paramValue);
          } catch {
            if (paramValue.includes(".")) {
              initialFilters[group.id] = paramValue.split(".");
            } else {
              initialFilters[group.id] = [paramValue];
            }
          }
        }
      } else {
        // Không có param: Mảng rỗng
        initialFilters[group.id] = [];
      }
    });

    setFilters(initialFilters);
  }, [filterGroups]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Đếm tổng số nhóm filter đang áp dụng
  const getActiveFilterCount = () => {
    return Object.keys(filters).filter((key) => (filters[key] || []).length > 0)
      .length;
  };

  const handleResetFilters = () => {
    // Reset tất cả các nhóm filter về mảng rỗng
    const resetFilters = filterGroups.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {} as FilterValues);

    setFilters(resetFilters);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Badge
        badgeContent={getActiveFilterCount()}
        color="primary"
        invisible={getActiveFilterCount() === 0}
      >
        <IconButton onClick={handleClick} {...buttonProps}>
          <FilterListIcon />
        </IconButton>
      </Badge>

      <FilterPopper
        handleApplyFilters={handleApplyFilters}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        filterGroups={filterGroups}
        filters={filters}
        setFilters={setFilters}
        handleResetFilters={handleResetFilters}
        title={title}
      />
    </>
  );
};

export default FilterButton;
