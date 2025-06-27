import { ThemeOptions, alpha } from "@mui/material/styles";

// Khai báo các biến màu sắc chính
const PRIMARY = {
  lighter: "#E8F5F1",
  light: "#90D26D", // Xanh lá - màu sáng hơn
  main: "#2C7865", // Xanh đậm - màu chính
  dark: "#1B5A4A", // Xanh đậm hơn
  darker: "#0F3D31",
  contrastText: "#FFFFFF",
};

const SECONDARY = {
  lighter: "#FFF3E0",
  light: "#FFB74D",
  main: "#FF9800", // Cam
  dark: "#F57C00",
  darker: "#E65100",
  contrastText: "#FFFFFF",
};

const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#2C7865", // Xanh đậm
  dark: "#1B5A4A",
  darker: "#0F3D31",
};

const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FF9800", // Cam
  dark: "#F57C00",
  darker: "#E65100",
};

const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#F44336",
  dark: "#C62828",
  darker: "#8E0000",
};

const INFO = {
  lighter: "#E8F5E9",
  light: "#AED581",
  main: "#90D26D", // Xanh lá
  dark: "#7CB342",
  darker: "#558B2F",
};

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

// Định nghĩa shadows
const shadows = [
  "none",
  "0px 2px 4px rgba(0, 0, 0, 0.05)",
  "0px 4px 8px rgba(0, 0, 0, 0.08)",
  "0px 8px 16px rgba(0, 0, 0, 0.08)",
  "0px 12px 24px rgba(0, 0, 0, 0.08)",
  "0px 16px 32px rgba(0, 0, 0, 0.12)",
  "0px 20px 40px rgba(0, 0, 0, 0.12)",
  "0px 24px 48px rgba(0, 0, 0, 0.16)",
  "0px 28px 56px rgba(0, 0, 0, 0.16)",
  "0px 32px 64px rgba(0, 0, 0, 0.16)",
  "0px 36px 72px rgba(0, 0, 0, 0.16)",
  "0px 40px 80px rgba(0, 0, 0, 0.16)",
  "0px 44px 88px rgba(0, 0, 0, 0.16)",
  "0px 48px 96px rgba(0, 0, 0, 0.16)",
  "0px 52px 104px rgba(0, 0, 0, 0.16)",
  "0px 56px 112px rgba(0, 0, 0, 0.16)",
  "0px 60px 120px rgba(0, 0, 0, 0.16)",
  "0px 64px 128px rgba(0, 0, 0, 0.16)",
  "0px 68px 136px rgba(0, 0, 0, 0.16)",
  "0px 72px 144px rgba(0, 0, 0, 0.16)",
  "0px 76px 152px rgba(0, 0, 0, 0.16)",
  "0px 80px 160px rgba(0, 0, 0, 0.16)",
  "0px 84px 168px rgba(0, 0, 0, 0.16)",
  "0px 88px 176px rgba(0, 0, 0, 0.16)",
  "0px 92px 184px rgba(0, 0, 0, 0.16)",
];

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    common: { black: "#000", white: "#fff" },
    primary: { ...PRIMARY },
    secondary: { ...SECONDARY },
    info: { ...INFO },
    success: { ...SUCCESS },
    warning: { ...WARNING },
    error: { ...ERROR },
    grey: GREY,
    divider: GREY[300],
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: "#fff",
      default: "#FFFFFF",
    },
    action: {
      active: GREY[600],
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      lineHeight: 1.3,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.4,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "1.25rem",
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "1.125rem",
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.6,
      fontSize: "1rem",
    },
    subtitle1: {
      fontWeight: 500,
      lineHeight: 1.6,
      fontSize: "1rem",
    },
    subtitle2: {
      fontWeight: 500,
      lineHeight: 1.6,
      fontSize: "0.875rem",
    },
    body1: {
      lineHeight: 1.6,
      fontSize: "1rem",
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.875rem",
    },
    caption: {
      lineHeight: 1.5,
      fontSize: "0.75rem",
    },
    overline: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "0.75rem",
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shadows: shadows as any,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
        "#root": {
          width: "100%",
          height: "100%",
        },
        input: {
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
        },
        img: {
          display: "block",
          maxWidth: "100%",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(GREY[900], 0.6),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "10px 16px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          height: 48,
          padding: "12px 20px",
        },
        sizeMedium: {
          height: 40,
          padding: "10px 16px",
        },
        sizeSmall: {
          height: 32,
          padding: "6px 12px",
        },
        containedPrimary: {
          backgroundColor: PRIMARY.main,
          "&:hover": {
            backgroundColor: PRIMARY.dark,
          },
        },
        outlinedPrimary: {
          borderColor: PRIMARY.main,
          "&:hover": {
            backgroundColor: alpha(PRIMARY.main, 0.08),
          },
        },
        textPrimary: {
          "&:hover": {
            backgroundColor: alpha(PRIMARY.main, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: shadows[2],
          borderRadius: 12,
          position: "relative",
          zIndex: 0,
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: { variant: "body2", marginTop: "4px" },
      },
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: "0.75rem",
        },
        colorPrimary: {
          backgroundColor: alpha(PRIMARY.main, 0.16),
          color: PRIMARY.dark,
        },
        colorSecondary: {
          backgroundColor: alpha(SECONDARY.main, 0.16),
          color: SECONDARY.dark,
        },
        colorSuccess: {
          backgroundColor: alpha(SUCCESS.main, 0.16),
          color: SUCCESS.dark,
        },
        colorError: {
          backgroundColor: alpha(ERROR.main, 0.16),
          color: ERROR.dark,
        },
        colorWarning: {
          backgroundColor: alpha(WARNING.main, 0.16),
          color: WARNING.dark,
        },
        colorInfo: {
          backgroundColor: alpha(INFO.main, 0.16),
          color: INFO.dark,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: `1px solid ${GREY[300]}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
          padding: "8px 12px",
          "&.Mui-selected": {
            backgroundColor: alpha(PRIMARY.main, 0.16),
            color: PRIMARY.main,
            "&:hover": {
              backgroundColor: alpha(PRIMARY.main, 0.16),
            },
            "& .MuiListItemIcon-root": {
              color: PRIMARY.main,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY.light,
          color: "#fff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: GREY[200],
          color: GREY[700],
          fontWeight: 600,
        },
        root: {
          padding: "16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: GREY[100],
          },
          "&:hover": {
            backgroundColor: GREY[200],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: GREY[300],
            },
            "&:hover fieldset": {
              borderColor: PRIMARY.light,
            },
            "&.Mui-focused fieldset": {
              borderColor: PRIMARY.main,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: PRIMARY.main,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 48,
          padding: "0 16px",
          "&.Mui-selected": {
            color: PRIMARY.main,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 16px",
        },
        standardSuccess: {
          backgroundColor: SUCCESS.lighter,
          color: SUCCESS.darker,
          "& .MuiAlert-icon": {
            color: SUCCESS.main,
          },
        },
        standardInfo: {
          backgroundColor: INFO.lighter,
          color: INFO.darker,
          "& .MuiAlert-icon": {
            color: INFO.main,
          },
        },
        standardWarning: {
          backgroundColor: WARNING.lighter,
          color: WARNING.darker,
          "& .MuiAlert-icon": {
            color: WARNING.main,
          },
        },
        standardError: {
          backgroundColor: ERROR.lighter,
          color: ERROR.darker,
          "& .MuiAlert-icon": {
            color: ERROR.main,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: GREY[800],
          borderRadius: 6,
          fontSize: "0.75rem",
          padding: "8px 12px",
        },
        arrow: {
          color: GREY[800],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: shadows[3],
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: alpha(PRIMARY.main, 0.16),
            "&:hover": {
              backgroundColor: alpha(PRIMARY.main, 0.24),
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: GREY[800],
          boxShadow: shadows[1],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: shadows[5],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "24px 24px 16px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          "& .MuiPaginationItem-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        dot: {
          minWidth: 8,
          height: 8,
          borderRadius: 4,
        },
      },
    },
  },
};
