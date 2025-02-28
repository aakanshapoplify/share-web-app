import { createTheme } from "@mui/material/styles";
import "@fontsource/inter"; // Import Inter font (or use Roboto)

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial, sans-serif", // Set Inter as default font
    h1: { fontSize: "2rem", fontWeight: 700 }, // Customize heading sizes
    h2: { fontSize: "1.75rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
  },
});

export default theme;
