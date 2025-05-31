import React, { useState } from "react";
import { Badge, ButtonProps, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserFilterPopper from "../UserFilter";
interface UserFilterValues {
  roles: string[];
  statuses: string[];
}
interface UserFilterButtonProps extends Omit<ButtonProps, "onClick"> {
  onFilterChange: (filters: UserFilterValues) => void;
  initialFilters?: UserFilterValues;
  roles: Array<{ id: string; name: string }>;
  statuses: Array<{ id: string; name: string }>;
}

const UserFilterButton: React.FC<UserFilterButtonProps> = ({
  onFilterChange,
  initialFilters,
  roles,
  statuses,
  ...buttonProps
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<UserFilterValues>(
    initialFilters || {
      roles: [],
      statuses: [],
    }
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (newFilters: UserFilterValues) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Đếm số lượng filter đang áp dụng
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.roles.length > 0) count += 1;
    if (filters.statuses.length > 0) count += 1;
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

      <UserFilterPopper
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        roles={roles}
        statuses={statuses}
        onApplyFilter={handleApplyFilter}
        initialFilters={filters}
      />
    </>
  );
};

export default UserFilterButton;
