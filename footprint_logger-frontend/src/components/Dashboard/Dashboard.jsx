// components/Dashboard.js
import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  TrendingDown,
  EmojiTransportation,
  // Eco,
  CompareArrows,
} from "@mui/icons-material";
import WeeklyGoal from "../WeeklyGoalsPage/WeeklyGoal";
import SubmitLog from "../SubmitPage/SubmitLog";
import Notification from "../Notifications/Notification";

const Dashboard = ({ user, logs, setLogs }) => {
  const totalCo2Saved = logs.reduce((total, log) => total + log.co2Saved, 0);
  const communityAverage = 12.5; // kg CO2 saved

  const stats = [
    {
      title: "Total CO₂ Saved",
      value: `${totalCo2Saved.toFixed(1)} kg`,
      icon: <TrendingDown sx={{ fontSize: 40 }} />,
      color: "#2E7D32",
    },
    {
      title: "Activities Logged",
      value: logs.length,
      icon: <EmojiTransportation sx={{ fontSize: 40 }} />,
      color: "#1565C0",
    },
    {
      title: "Current Streak",
      value: "3 days",
      // icon: <Eco sx={{ fontSize: 40 }} />,
      color: "#FF8F00",
    },
    {
      title: "Vs. Community Avg",
      value: `${(totalCo2Saved - communityAverage).toFixed(1)} kg`,
      icon: <CompareArrows sx={{ fontSize: 40 }} />,
      color: totalCo2Saved >= communityAverage ? "#2E7D32" : "#D32F2F",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user.name}!
      </Typography>

      <Notification />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
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
            <WeeklyGoal user={user} />
          </Paper>
        </Grid>

        {/* Submit Log */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <SubmitLog logs={logs} setLogs={setLogs} />
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
                {logs.map((log) => (
                  <Box
                    key={log.id}
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
