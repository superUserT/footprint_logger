import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "You reached your weekly goal!",
      read: false,
      icon: <CheckCircleIcon color="success" />,
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "Community average increased by 5% this week",
      read: false,
      icon: <TrendingUpIcon color="info" />,
      time: "1 day ago",
    },
    {
      id: 3,
      message: "New activity suggestions available",
      read: true,

      time: "3 days ago",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxWidth: "100%" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={markAllAsRead}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                sx={{ opacity: notification.read ? 0.6 : 1 }}
              >
                <ListItemIcon>{notification.icon}</ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                />
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      ml: 1,
                    }}
                  />
                )}
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <ListItemText>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </ListItemText>
            </MenuItem>
          )}
        </List>
      </Menu>
    </>
  );
};

export default Notification;
