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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubmitLog = () => {
  const [activity, setActivity] = useState("");
  const [co2Saved, setCo2Saved] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customActivityDialogOpen, setCustomActivityDialogOpen] =
    useState(false);
  const [customActivity, setCustomActivity] = useState("");

  const { user } = useAuth();
  const [details, setDetails] = useState({});

  const activityTypes = [
    { value: "carTravel", label: "Car Travel" },
    { value: "meatConsumption", label: "Meat Consumption" },
    { value: "electricityUse", label: "Electricity Use" },
    { value: "hotShower", label: "Hot Shower" },
    { value: "watchTV", label: "Watched TV" },
    { value: "orderedIn", label: "Ordered In" },
    { value: "custom", label: "+ Add Custom Activity" },
  ];

  const handleActivityChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "custom") {
      setCustomActivityDialogOpen(true);
      setActivity("");
    } else {
      setActivity(selectedValue);
      setDetails({});
      setCo2Saved("");
    }
  };

  const handleAddCustomActivity = () => {
    if (customActivity.trim()) {
      setActivity(customActivity.trim());
      setCustomActivity("");
      setCustomActivityDialogOpen(false);
    }
  };

  const handleCloseCustomDialog = () => {
    setCustomActivityDialogOpen(false);
    setCustomActivity("");
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity}
            onChange={handleActivityChange}
            label="Activity Type"
          >
            {activityTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Display custom activity if selected */}
        {activity && !activityTypes.some((opt) => opt.value === activity) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Custom Activity: <strong>{activity}</strong>
          </Alert>
        )}

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

      {/* Custom Activity Dialog */}
      <Dialog
        open={customActivityDialogOpen}
        onClose={handleCloseCustomDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Custom Activity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Custom Activity Name"
            type="text"
            fullWidth
            variant="outlined"
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomActivity();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomDialog}>Cancel</Button>
          <Button
            onClick={handleAddCustomActivity}
            variant="contained"
            disabled={!customActivity.trim()}
          >
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmitLog;
