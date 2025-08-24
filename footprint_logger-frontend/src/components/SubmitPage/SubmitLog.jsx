// components/SubmitLog.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const SubmitLog = ({ logs, setLogs }) => {
  const [activity, setActivity] = useState("");
  const [co2Saved, setCo2Saved] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);

  const activityTypes = [
    { value: "Biked to work", co2: 3.5 },
    { value: "Vegetarian meal", co2: 1.2 },
    { value: "Public transportation", co2: 2.1 },
    { value: "Reduced heating", co2: 1.8 },
    { value: "Local produce", co2: 0.9 },
    { value: "Other", co2: 0 },
  ];

  const handleActivityChange = (e) => {
    const selectedActivity = activityTypes.find(
      (a) => a.value === e.target.value
    );
    setActivity(e.target.value);
    if (selectedActivity && selectedActivity.co2 > 0) {
      setCo2Saved(selectedActivity.co2);
    } else {
      setCo2Saved("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activity && co2Saved && date) {
      const newLog = {
        id: logs.length + 1,
        date,
        activity,
        co2Saved: parseFloat(co2Saved),
      };

      setLogs([newLog, ...logs]);
      setActivity("");
      setCo2Saved("");
      setDate(new Date().toISOString().split("T")[0]);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
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

      <Box component="form" onSubmit={handleSubmit}>
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
              {option.value}{" "}
              {option.co2 > 0 ? `(~${option.co2} kg CO₂ saved)` : ""}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="CO₂ Saved (kg)"
          type="number"
          value={co2Saved}
          onChange={(e) => setCo2Saved(e.target.value)}
          margin="normal"
          required
          inputProps={{ step: "0.1", min: "0" }}
        />

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
        >
          Add Activity
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitLog;
