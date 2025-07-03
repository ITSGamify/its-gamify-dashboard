import React from "react";
import { styled } from "@mui/material/styles";
import { Chip, ChipProps } from "@mui/material";
import { StatusType } from "@pages/Account";

interface StatusBadgeProps extends Omit<ChipProps, "color"> {
  status: StatusType;
}

const StyledChip = styled(Chip)<{ status: StatusType }>(({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "#23AC00",
          bgcolor: "#E9F7E6",
        };
      case "PENDING":
        return {
          color: "#686D76",
          bgcolor: "#F0F0F1",
        };
      case "COMPLETED":
        return {
          color: "#23AC00",
          bgcolor: "#E9F7E6",
        };
      case "CANCELLED":
        return {
          color: "#EB5757",
          bgcolor: "#FFF0F0",
        };
      case "ERROR":
        return {
          color: "#EB5757",
          bgcolor: "#FFF0F0",
        };
      case "BANNED":
        return {
          color: "#EB5757",
          bgcolor: "#FFF0F0",
        };
      case "DISABLE":
        return {
          color: "#686D76",
          bgcolor: "#F0F0F1",
        };
      default:
        return {
          color: "#686D76",
          bgcolor: "#F0F0F1",
        };
    }
  };

  const { color, bgcolor } = getStatusColor();

  return {
    height: 24,
    borderRadius: 10,
    padding: "15px 5px",
    fontWeight: 500,
    fontSize: "0.9rem",
    color,
    backgroundColor: bgcolor,
    "& .MuiChip-label": {
      padding: "0 10px",
    },
  };
});

export const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const { status, label, ...otherProps } = props;

  return <StyledChip status={status} label={label} {...otherProps} />;
};

export default StatusBadge;
