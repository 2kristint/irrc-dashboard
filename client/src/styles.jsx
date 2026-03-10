export const getDesignTokens = (mode) => {
  return {
    components: {},
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#FFCD00",
            },
            secondary: {
              main: "#000000",
            },
            tertiary: {
              main: "#BBBCBC",
            },
            background: {
              default: "#FFFFFF",
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
        fontSize: "4rem",
        fontWeight: 900,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: "2.25rem",
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Zilla Slab", "serif"].join(","),
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h4: {
        fontFamily: ["Roboto", "san-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      subtitle: {
        fontSize: "12px",
        fontWeight: 400,
      },
      normaltext: {
        fontSize: "12px",
        fontWeight: 400,
      },
      button: {
        fontStyle: "normal",
        fontWeight: 700,
      },
      links: {
        fontFamily: "Roboto",
        fontSize: 20,
      },
    },
  };
};

// export const getDesignTokens = () => {
//   return {
//     cssVariables: true,
//     colorSchemes: {
//       light: {
//         palette: {
//           primary: {
//             main: "#FFCD00",
//           },
//           secondary: {
//             main: "#000000",
//           },
//           tertiary: {
//             main: "#BBBCBC",
//           },
//           background: {
//             default: "#FFFFFF",
//             paper: "#F5F5F5",
//           },
//         },
//       },
//       dark: {
//         palette: {
//           primary: {
//             main: "#FFCD00",
//           },
//           secondary: {
//             main: "#FFFFFF",
//           },
//           tertiary: {
//             main: "#BBBCBC",
//           },
//           background: {
//             default: "#000000",
//             paper: "#121212",
//           },
//         },
//       },
//     },
//   };
// };
