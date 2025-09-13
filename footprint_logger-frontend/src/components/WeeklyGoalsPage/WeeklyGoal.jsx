import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  Button,
  Alert,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Edit, Check } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const WeeklyGoal = () => {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState(50);
  const [currentWeekSavings, setCurrentWeekSavings] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchWeeklyGoal();
      calculateCurrentWeekSavings();
    }
  }, [user, token]);

  const fetchWeeklyGoal = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/goals/weeklygoal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setGoal(response.data.goal);
      }
    } catch (error) {
      console.error("Error fetching weekly goal:", error);
      // If no goal exists, use default of 50
      setGoal(50);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentWeekSavings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const logs = response.data;
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const weeklyLogs = logs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      });

      const weeklySavings = weeklyLogs.reduce(
        (total, log) => total + log.co2Saved,
        0
      );
      setCurrentWeekSavings(weeklySavings);
    } catch (error) {
      console.error("Error calculating weekly savings:", error);
    }
  };

  const saveWeeklyGoal = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/goals/weeklygoal`,
        {
          userId: user.id,
          goal: goal,
          startDate: new Date(), // Current date as start of week
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving weekly goal:", error);
      setError("Failed to save goal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGoal = () => {
    saveWeeklyGoal();
  };

  const progress = Math.min((currentWeekSavings / goal) * 100, 100);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Weekly Goal</Typography>
        {editing ? (
          <Button
            startIcon={<Check />}
            onClick={handleSaveGoal}
            variant="contained"
            size="small"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        )}
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Goal updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {editing ? (
        <Box>
          <Typography gutterBottom>
            Set your weekly CO₂ reduction goal (kg):
          </Typography>
          <Slider
            value={goal}
            onChange={(e, newValue) => setGoal(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} kg`}
            step={5}
            marks={[
              { value: 10, label: "10kg" },
              { value: 50, label: "50kg" },
              { value: 100, label: "100kg" },
            ]}
            min={10}
            max={100}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Current goal: {goal} kg CO₂
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Goal: {goal} kg CO₂ reduction per week
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 1,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  progress >= 100 ? "success.main" : "primary.main",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Progress: {currentWeekSavings.toFixed(1)} / {goal} kg (
            {Math.round(progress)}%)
          </Typography>
          {progress >= 100 && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Congratulations! You've reached your weekly goal. 🎉
            </Alert>
          )}
          {progress < 50 && progress > 0 && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Keep going! You're making progress toward your goal.
            </Alert>
          )}
          {progress === 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Start logging activities to track your progress!
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WeeklyGoal;
