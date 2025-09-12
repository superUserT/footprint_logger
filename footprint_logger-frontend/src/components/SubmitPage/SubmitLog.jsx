import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const SubmitLog = () => {
  const [activity, setActivity] = useState("");
  const [co2Saved, setCo2Saved] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const [details, setDetails] = useState({});

  const activityTypes = [
    { value: "carTravel", label: "Car Travel" },
    { value: "meatConsumption", label: "Meat Consumption" },
    { value: "electricityUse", label: "Electricity Use" },
    { value: "hotShower", label: "Hot Shower" },
    { value: "watchTV", label: "Watched TV" },
    { value: "orderedIn", label: "Ordered In" },
  ];

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
    setDetails({});
    setCo2Saved("");
  };

  const handleDetailChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!activity || !date || !co2Saved) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${API_BASE_URL}/api/logs`,
        {
          date,
          activity,
          co2Saved,
          details,
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
        setActivity("");
        setDetails({});
        setCo2Saved("");
        setDate(new Date().toISOString().split("T")[0]);

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting log:", error);
      if (error.response) {
        setError(error.response.data.error || "Failed to submit activity");
      } else if (error.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Log New Activity
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Activity logged successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Activity Type */}
        <TextField
          select
          fullWidth
          label="Activity Type"
          value={activity}
          onChange={handleActivityChange}
          margin="normal"
          required
        >
          {activityTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* CO₂ Saved */}
        <TextField
          fullWidth
          label="CO₂ Saved (kg)"
          type="number"
          value={co2Saved}
          onChange={(e) => setCo2Saved(e.target.value)}
          margin="normal"
          inputProps={{ step: "0.1", min: "0" }}
          required
        />

        {/* Date */}
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<Add />}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Activity"}
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitLog;
