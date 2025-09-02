import {
  AppBar,
  Box,
  IconButton,
  Typography,
  Toolbar,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItem,
  Divider,
  Button,
  ListItemIcon,
  ListItemText,
  Stack,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import { useAppTheme } from "../contexts/theme.jsx";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  EmojiEvents,
  HomeFilled,
  MovieFilter,
  Whatshot,
  Theaters,
} from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.text.primary, 0.05),
  transition: "all 0.3s ease-in-out",
  border: "1px solid transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
  },
  "&:focus-within": {
    backgroundColor: alpha(theme.palette.background.default, 0.2),
    borderColor: theme.palette.primary.main,
  },
  marginRight: theme.spacing(1), // Diberi sedikit jarak dari tombol tema
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));

const navItems = [
  { text: "Home", path: "/", icon: <HomeFilled /> },
  { text: "Now Playing", path: "/now-playing", icon: <Theaters /> },
  { text: "Popular", path: "/popular", icon: <Whatshot /> },
  { text: "Top Rated", path: "/top-rated", icon: <EmojiEvents /> },
  { text: "Upcoming", path: "/upcoming", icon: <MovieFilter /> },
];

function Navbar() {
  const { mode, toggleTheme } = useAppTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navBackground, setNavBackground] = useState("transparent");
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setNavBackground("glass");
      } else {
        setNavBackground("transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Toolbar>
        <Stack direction="row" spacing={1} alignItems="center">
          <MovieFilter />
          <Typography variant="h6" noWrap>
            MovieDB
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={(theme) => ({
          transition:
            "background-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease",
          boxShadow:
            navBackground === "transparent" ? "none" : theme.shadows[2],
          color: "text.primary",
          ...(navBackground === "transparent" && {
            backgroundColor: "transparent",
            backgroundImage: "none",
          }),
          ...(navBackground === "glass" && {
            backgroundColor: alpha(theme.palette.background.default, 0.75),
            backdropFilter: "blur(10px)",
          }),
        })}
      >
        <Toolbar sx={{ position: "relative" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            component={Link}
            to="/"
            sx={{
              display: { xs: "none", md: "flex" },
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <MovieFilter sx={{ fontSize: 30 }} />
            <Typography variant="h6" noWrap>
              MovieDB
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            {navItems.find((item) => item.path === location.pathname)?.text ||
              "MovieDB"}
          </Typography>

          {/* DIUBAH: Menggunakan positioning absolut untuk memastikan menu di tengah */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              gap: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  color: "text.primary",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                  position: "relative",
                  transition: "transform 0.2s ease-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    backgroundColor: "action.hover",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    transform:
                      location.pathname === item.path
                        ? "scaleX(1)"
                        : "scaleX(0)",
                    height: "2px",
                    bottom: 0,
                    left: 0,
                    backgroundColor: "primary.main",
                    transformOrigin: "bottom center",
                    transition: "transform 0.25s ease-out",
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Spacer untuk mendorong elemen ke kanan */}
          <Box sx={{ flexGrow: 1 }} />

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onKeyDown={(e) => {
                const query = e.target.value.trim();
                if (e.key === "Enter" && query) {
                  navigate(`search/${query}`);
                }
              }}
            />
          </Search>

          <IconButton
            sx={{
              ml: 1,
              transition: "transform 0.4s ease-in-out",
              "&:hover": { transform: "rotate(90deg)" },
            }}
            onClick={toggleTheme}
            color="inherit"
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          }}
        >
          {DrawerList}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Navbar;
