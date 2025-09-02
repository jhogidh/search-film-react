import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, useMemo, useState, useContext } from "react"; // DIUBAH: Menambahkan 'useContext'

// DIUBAH: Context diubah untuk bisa menampung 'mode' dan 'toggleTheme'
export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#1976d2",
                },
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
              }
            : {
                primary: {
                  main: "#90caf9",
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
              }),
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // DIUBAH: 'mode' ditambahkan ke dalam value provider
  const value = { mode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// DITAMBAHKAN: Custom hook 'useAppTheme' dibuat dan diekspor
export const useAppTheme = () => {
  return useContext(ThemeContext);
};
