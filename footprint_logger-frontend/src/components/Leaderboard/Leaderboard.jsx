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

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/logs/leaderboard`
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>
      <Leaderboard />
    </div>
  );
};

export default Leaderboard;
