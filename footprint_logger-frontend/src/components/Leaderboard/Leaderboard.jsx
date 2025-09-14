import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/logs/leaderboard`
        );
        setLeaderboard(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Global Leaderboard
      </Typography>

      {leaderboard.length === 0 ? (
        <Typography>No leaderboard data available</Typography>
      ) : (
        leaderboard.map((user, index) => (
          <Card key={user._id || index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                #{index + 1} - {user.username}
              </Typography>
              <Typography>
                CO2 Saved: {user.totalCo2Saved?.toFixed(2)} kg
              </Typography>
              <Typography>Activities: {user.logCount}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Leaderboard;
