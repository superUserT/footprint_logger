import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Leaderboard as LeaderboardIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from "@mui/icons-material";
import Notification from "../Notifications/Notification";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", path: "/homepage", icon: <HomeIcon /> },
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Submit Log", path: "/submit-log", icon: <AddIcon /> },
    { text: "Profile", path: "/profile", icon: <PersonIcon /> },
    { text: "Leaderboard", path: "/leaderboard", icon: <LeaderboardIcon /> },
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

        {/* Mobile Logout Option */}
        {isAuthenticated && (
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: "inherit",
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            <Box sx={{ mr: 2 }}>
              <LogoutIcon />
            </Box>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
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
          to={isAuthenticated ? "/dashboard" : "/"}
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

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Notification />

          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {user?.name ? (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "secondary.main",
                      fontSize: "0.875rem",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {user?.name || "User"}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={{ ml: 1 }}>
              Login
            </Button>
          )}
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
