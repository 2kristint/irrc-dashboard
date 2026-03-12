export const getDesignTokens = (mode) => {
  return {
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: "#000000",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#63666A", // Darker shade on hover
              color: "#ffffff",
            },
          },
        },
      },
    },
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#FFCD00",
              on: "#000000",
            },
            secondary: {
              main: "#000000",
              on: "#FFFFFF",
            },
            tertiary: {
              main: "#BBBCBC",
              on: "#000000",
            },
            background: {
              default: "#FFFFFF",
              dim: "#e0e0e0",
            },
          }
        : {
            primary: {
              main: "#FFCD00",
            },
            secondary: {
              main: "#FFFFFF",
            },
            tertiary: {
              main: "#BBBCBC",
            },
            background: {
              default: "#000000",
            },
          }),
    },
    typography: {
      fontSize: 14,
      h1: {
        fontFamily: ["Antonio", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 800,
      },
      h2: {
        fontFamily: ["Zilla Slab", "sans-serif"].join(","),
        fontSize: "2.25rem",
      },
      h3: {
        fontFamily: ["Roboto", "san-serif"].join(","),
        fontSize: 18,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Roboto", "san-serif"].join(","),
        fontSize: 14,
        fontWeight: 600,
      },
      subtitle: {
        fontSize: "14px",
        fontWeight: 400,
      },
      normaltext: {
        fontSize: "14px",
        fontWeight: 400,
      },
      button: {
        fontStyle: "normal",
        fontWeight: 400,
      },
      links: {
        fontFamily: "Roboto",
        fontSize: 14,
      },
      tableHeader: {
        fontFamily: "Roboto",
        fontSize: 14,
      },
    },
  };
};
