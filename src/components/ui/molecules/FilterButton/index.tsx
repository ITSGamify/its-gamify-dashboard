import React, { useEffect, useState } from "react";
import { Badge, ButtonProps, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterPopper from "../../atoms/TableFilterPopper"; // Giữ nguyên đường dẫn nhưng sử dụng component mới
import { FilterValues, FilterGroup } from "@interfaces/dom/filter";

interface FilterButtonProps extends Omit<ButtonProps, "onClick"> {
  filterGroups: FilterGroup[];
  title?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  filterGroups,
  title = "Lọc người dùng",
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
      const paramValue = urlParams.get(group.id);
      if (paramValue) {
        // console.log("Giá trị từ URL cho", group.id, ":", paramValue);

        // Nếu có giá trị trong URL, kiểm tra xem có phải JSON không
        try {
          // Thử parse JSON
          initialFilters[group.id] = JSON.parse(paramValue);
        } catch (e) {
          // Nếu không phải JSON, xử lý như một giá trị đơn lẻ hoặc danh sách phân tách bằng dấu phẩy
          if (paramValue.includes(".")) {
            // Nếu có dấu phẩy, xem như danh sách các giá trị
            initialFilters[group.id] = paramValue.split(".");
          } else {
            // Nếu không có dấu phẩy, xem như một giá trị đơn lẻ
            initialFilters[group.id] = [paramValue];
          }
        }
      } else {
        // Nếu không có trong URL, khởi tạo mảng rỗng
        initialFilters[group.id] = [];
      }
    });
    // console.log("initialFilters sau khi parse:", initialFilters);
    setFilters(initialFilters);
  }, [filterGroups]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (newFilters: FilterValues) => {
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
