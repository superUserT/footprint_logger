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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  TrendingDown,
  EmojiTransportation,
  CompareArrows,
  EmojiEvents,
  Lightbulb,
  TrendingUp,
} from "@mui/icons-material";
import WeeklyGoal from "../WeeklyGoalsPage/WeeklyGoal";
import SubmitLog from "../SubmitPage/SubmitLog";
import Notification from "../Notifications/Notification";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EmissionSentimentAnalyzer from "../../../../insight_engine/insight_engine.js";

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
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserLogs();
      fetchUserStats();
    }
  }, [token]);

  useEffect(() => {
    if (stats.activityCount > 0 && logs.length > 0) {
      generateInsights();
    }
  }, [stats, logs]);

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
      const response = await axios.get(`${API_BASE_URL}/api/logs/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error(
        "Error fetching stats:",
        error.response?.data || error.message
      );
    }
  };

  const generateInsights = () => {
    setInsightsLoading(true);
    try {
      const analyzer = new EmissionSentimentAnalyzer();
      const analysis = analyzer.analyzeUserPerformance(stats, logs);
      const personalizedMessage =
        analyzer.generatePersonalizedMessage(analysis);
      setInsights(personalizedMessage);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(null);
    } finally {
      setInsightsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#2E7D32";
    if (score >= 60) return "#FF8F00";
    if (score >= 40) return "#1976D2";
    return "#D32F2F";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "excellent":
        return <EmojiEvents sx={{ color: "#2E7D32" }} />;
      case "good":
        return <TrendingUp sx={{ color: "#FF8F00" }} />;
      case "average":
        return <Lightbulb sx={{ color: "#1976D2" }} />;
      default:
        return <Lightbulb sx={{ color: "#D32F2F" }} />;
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
      title: "Avg per Activity",
      value: `${stats.averageCo2PerActivity?.toFixed(1) || 0} kg`,
      icon: <CompareArrows sx={{ fontSize: 40 }} />,
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

        {/* Sustainability Insights */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              📊 Sustainability Insights
              {insightsLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Typography>

            {insights ? (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: getScoreColor(insights.score),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      mr: 2,
                    }}
                  >
                    {insights.score}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {insights.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {insights.category.charAt(0).toUpperCase() +
                        insights.category.slice(1)}{" "}
                      performance
                    </Typography>
                  </Box>
                </Box>

                {insights.suggestions && insights.suggestions.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Lightbulb sx={{ mr: 1, fontSize: 20 }} />
                      Suggestions for improvement:
                    </Typography>
                    <List dense>
                      {insights.suggestions.map((suggestion, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Typography color="primary">•</Typography>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {suggestion}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {stats.activityCount === 0
                  ? "Start logging activities to get personalized insights!"
                  : "Generating insights..."}
              </Typography>
            )}
          </Paper>
        </Grid>

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
        <Grid item xs={12} md={6}>
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
