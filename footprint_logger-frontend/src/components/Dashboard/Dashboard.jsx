import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  TrendingDown,
  EmojiTransportation,
  CompareArrows,
} from "@mui/icons-material";
import WeeklyGoal from "../WeeklyGoalsPage/WeeklyGoal";
import SubmitLog from "../SubmitPage/SubmitLog";
import Notification from "../Notifications/Notification";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCo2Saved: 0,
    activityCount: 0,
    averageCo2PerActivity: 0,
  });

  useEffect(() => {
    if (token) {
      fetchUserLogs();
      fetchUserStats();
    }
  }, [token]);

  const fetchUserLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
      setError(null);
    } catch (error) {
      console.error(
        "Error fetching logs:",
        error.response?.data || error.message
      );
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      console.log("Fetching stats with token:", token);
      const response = await axios.get(`${API_BASE_URL}/api/logs/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Stats response:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error(
        "Error fetching stats:",
        error.response?.data || error.message
      );
    }
  };

  const totalCo2Saved = stats.totalCo2Saved || 0;
  const communityAverage = 12.5;

  const statCards = [
    {
      title: "Total CO₂ Saved",
      value: `${totalCo2Saved.toFixed(1)} kg`,
      icon: <TrendingDown sx={{ fontSize: 40 }} />,
      color: "#2E7D32",
    },
    {
      title: "Activities Logged",
      value: stats.activityCount || 0,
      icon: <EmojiTransportation sx={{ fontSize: 40 }} />,
      color: "#1565C0",
    },
    {
      title: "Current Streak",
      value: "3 days",
      color: "#FF8F00",
    },
    {
      title: "Vs. Community Avg",
      value: `${(totalCo2Saved - communityAverage).toFixed(1)} kg`,
      icon: <CompareArrows sx={{ fontSize: 40 }} />,
      color: totalCo2Saved >= communityAverage ? "#2E7D32" : "#D32F2F",
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Notification />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ color: stat.color, mr: 2 }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Weekly Goal */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <WeeklyGoal />
          </Paper>
        </Grid>

        {/* Submit Log */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <SubmitLog
              onLogAdded={() => {
                fetchUserLogs();
                fetchUserStats();
              }}
            />
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {logs.length > 0 ? (
              <Box>
                {logs.slice(0, 5).map((log) => (
                  <Box
                    key={log._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{log.activity}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(log.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="primary.main">
                      +{log.co2Saved} kg CO₂ saved
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No activities logged yet. Start by submitting your first
                activity!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
