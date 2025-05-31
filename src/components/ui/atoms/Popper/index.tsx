import {
  Paper,
  ClickAwayListener,
  MenuList,
  Grow,
  Popper,
} from "@mui/material";

interface PopperProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  anchorEl?: HTMLElement | null;
}

function CustomPopper({
  isOpen = false,
  children,
  onClose,
  placement = "bottom",
  anchorEl,
}: PopperProps) {
  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement={placement}
      transition
      disablePortal
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
          <Paper
            elevation={3}
            sx={{
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1,
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1,
              },
            }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <MenuList autoFocusItem={isOpen}>{children}</MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

export default CustomPopper;
