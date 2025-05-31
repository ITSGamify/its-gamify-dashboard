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
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// Định nghĩa các kiểu dữ liệu
interface UserRole {
  id: string;
  name: string;
}

interface UserStatus {
  id: string;
  name: string;
}

interface UserFilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  roles: UserRole[];
  statuses: UserStatus[];
  onApplyFilter: (filters: UserFilterValues) => void;
  initialFilters?: UserFilterValues;
}

interface UserFilterValues {
  roles: string[];
  statuses: string[];
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
const UserFilterPopper: React.FC<UserFilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  roles,
  statuses,
  onApplyFilter,
  initialFilters,
}) => {
  // State cho các giá trị filter
  const [filters, setFilters] = useState<UserFilterValues>(
    initialFilters || {
      roles: [],
      statuses: [],
    }
  );

  // Xử lý thay đổi các giá trị filter
  const handleRoleChange = (roleId: string) => {
    setFilters((prev) => {
      const newRoles = prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId];
      return { ...prev, roles: newRoles };
    });
  };

  const handleStatusChange = (statusId: string) => {
    setFilters((prev) => {
      const newStatuses = prev.statuses.includes(statusId)
        ? prev.statuses.filter((id) => id !== statusId)
        : [...prev.statuses, statusId];
      return { ...prev, statuses: newStatuses };
    });
  };

  // Xử lý reset filter
  const handleResetFilters = () => {
    setFilters({
      roles: [],
      statuses: [],
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
    if (filters.roles.length > 0) count += 1;
    if (filters.statuses.length > 0) count += 1;
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
              <FilterListIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Lọc người dùng
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
              Vai trò
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    control={
                      <Checkbox
                        checked={filters.roles.includes(role.id)}
                        onChange={() => handleRoleChange(role.id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{role.name}</Typography>}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Trạng thái
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {statuses.map((status) => (
                  <FormControlLabel
                    key={status.id}
                    control={
                      <Checkbox
                        checked={filters.statuses.includes(status.id)}
                        onChange={() => handleStatusChange(status.id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">{status.name}</Typography>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </FilterSection>

          {/* <FilterSection>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Ngày đăng ký
            </Typography>
            <Grid container spacing={2}>
              <Grid container>
                <TextField
                  fullWidth
                  label="Từ ngày"
                  type="date"
                  size="small"
                  value={filters.dateRange?.from || ""}
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid container>
                <TextField
                  fullWidth
                  label="Đến ngày"
                  type="date"
                  size="small"
                  value={filters.dateRange?.to || ""}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </FilterSection> */}

          {getActiveFilterCount() > 0 && (
            <FilterSection>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Bộ lọc đang áp dụng
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {filters.roles.length > 0 && (
                  <StyledChip
                    label={`Vai trò: ${filters.roles.length}`}
                    onDelete={() => setFilters({ ...filters, roles: [] })}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
                {filters.statuses.length > 0 && (
                  <StyledChip
                    label={`Trạng thái: ${filters.statuses.length}`}
                    onDelete={() => setFilters({ ...filters, statuses: [] })}
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

export default UserFilterPopper;
