import { blue } from "@mui/material/colors";

export const customizations = (mode) => ({
  palette: {
    mode: mode,
    ...(mode === "light"
      ? {
          primary: blue,
          background: {
            default: "#fff",
            paper: "#fff",
          },
        }
      : {
          primary: blue,
          background: {
            default: "#001e3c",
            paper: "0a1929",
          },
        }),
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
