import { Button, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CustomPopper from "../Popper";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";

interface MenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  sx?: object;
}

interface TableActionButtonProp {
  menuItems: MenuItemProps[];
}

const TableActionButton = ({ menuItems }: TableActionButtonProp) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Button size="small" sx={{ color: "GrayText" }} onClick={handleClick}>
        <MoreHorizIcon />
      </Button>
      <CustomPopper isOpen={open} onClose={handleClose} anchorEl={anchorEl}>
        <Fragment>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={item.onClick}
              sx={{ fontSize: "14px", ...item.sx }}
            >
              {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
              {item.label}
            </MenuItem>
          ))}
        </Fragment>
      </CustomPopper>
    </>
  );
};

export default TableActionButton;
