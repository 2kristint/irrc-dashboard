import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => {
  return {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            "& ::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "& ::-webkit-scrollbar-track": {
              background: mode === "light" ? grey[200] : grey[800],
              borderRadius: "8px",
            },
            "& ::-webkit-scrollbar-thumb": {
              background: mode === "light" ? grey[400] : grey[500],
              borderRadius: "8px",
            },
            "& ::-webkit-scrollbar-thumb:hover": {
              background: mode === "light" ? grey[600] : grey[400],
            },
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
      },
    },
    palette: {
      mode,
      ...(mode === "light"
        ? {
          primary: {
            main: "#000000",
          },
          secondary: {
            main: "#FFCD00",
          },
        }
        : {
          primary: {
            main: "#fbbf24",
          },
          secondary: {
            main: "#9900ff",
          },
          background: {
            default: "#303030",
            paper: "#303030",
            dialog: "#303030",
          },
          contrastText: "#000",
        }),
    },
    typography: {
      subtitle1: {
        fontSize: 12,
      },
      button: {
        fontStyle: 'normal',
      },
      h1: {
        fontFamily: [
          'Zilla Slab',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
      h2: {
        fontFamily: [
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        fontWeight: 600
      },
      h3: {
        fontFamily: [
          'Zilla Slab',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
      h4: {
        fontFamily: [
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
    },
  };
};