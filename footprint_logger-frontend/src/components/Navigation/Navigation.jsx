import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Notification from "../Notifications/Notification";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/homepage", icon: <HomeIcon /> },
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Submit Log", path: "/submit-log", icon: <AddIcon /> },
    { text: "Profile", path: "/profile", icon: <PersonIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", width: 250 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Footprint Logger
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              color: "inherit",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <Box sx={{ mr: 2 }}>{item.icon}</Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            mr: 2,
            flexGrow: { xs: 1, md: 0 },
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
            display: { xs: "none", md: "flex" },
          }}
        >
          Footprint Logger
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                my: 2,
                color: "white",
                backgroundColor:
                  location.pathname === item.path
                    ? "primary.dark"
                    : "transparent",
                mx: 0.5,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex" }}>
          <Notification />
          <Button color="inherit" component={Link} to="/login" sx={{ ml: 1 }}>
            Login
          </Button>
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
