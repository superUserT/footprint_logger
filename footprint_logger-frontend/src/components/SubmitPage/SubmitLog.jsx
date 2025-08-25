// components/SubmitLog.js
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

const SubmitLog = ({ logs, setLogs }) => {
  const [activity, setActivity] = useState("");
  const [co2Saved, setCo2Saved] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);

  // activity-specific details
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activity && date) {
      const newLog = {
        id: logs.length + 1,
        date,
        activity,
        details,
        co2Saved: co2Saved ? parseFloat(co2Saved) : null,
      };

      setLogs([newLog, ...logs]);
      setActivity("");
      setDetails({});
      setCo2Saved("");
      setDate(new Date().toISOString().split("T")[0]);
      setSuccess(true);

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

        {/* Dynamic Fields per Activity */}
        {activity === "carTravel" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={details.vehicleType || ""}
                onChange={(e) =>
                  handleDetailChange("vehicleType", e.target.value)
                }
              >
                <MenuItem value="smallCar">Small Car</MenuItem>
                <MenuItem value="mediumCar">Medium Car</MenuItem>
                <MenuItem value="largeCar">Large Car</MenuItem>
                <MenuItem value="suv">SUV</MenuItem>
                <MenuItem value="pickupTruck">Pickup Truck</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={details.fuelType || ""}
                onChange={(e) => handleDetailChange("fuelType", e.target.value)}
              >
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Distance (km)"
              type="number"
              value={details.distance || ""}
              onChange={(e) => handleDetailChange("distance", e.target.value)}
              margin="normal"
              inputProps={{ step: "0.1", min: "0" }}
            />
          </>
        )}

        {activity === "meatConsumption" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Meat Type</InputLabel>
              <Select
                value={details.meatType || ""}
                onChange={(e) => handleDetailChange("meatType", e.target.value)}
              >
                <MenuItem value="beef">Beef</MenuItem>
                <MenuItem value="pork">Pork</MenuItem>
                <MenuItem value="chicken">Chicken</MenuItem>
                <MenuItem value="fish">Fish</MenuItem>
                <MenuItem value="lamb">Lamb</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity (grams)"
              type="number"
              value={details.meatQuantity || ""}
              onChange={(e) =>
                handleDetailChange("meatQuantity", e.target.value)
              }
              margin="normal"
              inputProps={{ min: "0" }}
            />
          </>
        )}

        {activity === "electricityUse" && (
          <TextField
            fullWidth
            label="Electricity Usage (kWh)"
            type="number"
            value={details.electricityUsage || ""}
            onChange={(e) =>
              handleDetailChange("electricityUsage", e.target.value)
            }
            margin="normal"
            inputProps={{ step: "0.1", min: "0" }}
          />
        )}

        {activity === "hotShower" && (
          <>
            <TextField
              fullWidth
              label="Shower Duration (minutes)"
              type="number"
              value={details.showerDuration || ""}
              onChange={(e) =>
                handleDetailChange("showerDuration", e.target.value)
              }
              margin="normal"
              inputProps={{ min: "0" }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Water Flow Rate</InputLabel>
              <Select
                value={details.waterFlowRate || ""}
                onChange={(e) =>
                  handleDetailChange("waterFlowRate", e.target.value)
                }
              >
                <MenuItem value="low">Low (5-7 L/min)</MenuItem>
                <MenuItem value="medium">Medium (8-10 L/min)</MenuItem>
                <MenuItem value="high">High (11+ L/min)</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {activity === "watchTV" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>TV Type</InputLabel>
              <Select
                value={details.tvType || ""}
                onChange={(e) => handleDetailChange("tvType", e.target.value)}
              >
                <MenuItem value="led">LED</MenuItem>
                <MenuItem value="lcd">LCD</MenuItem>
                <MenuItem value="plasma">Plasma</MenuItem>
                <MenuItem value="oled">OLED</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Duration (hours)"
              type="number"
              value={details.tvDuration || ""}
              onChange={(e) => handleDetailChange("tvDuration", e.target.value)}
              margin="normal"
              inputProps={{ step: "0.1", min: "0" }}
            />
          </>
        )}

        {activity === "orderedIn" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Food Type</InputLabel>
              <Select
                value={details.foodType || ""}
                onChange={(e) => handleDetailChange("foodType", e.target.value)}
              >
                <MenuItem value="fastFood">Fast Food</MenuItem>
                <MenuItem value="restaurant">Restaurant Meal</MenuItem>
                <MenuItem value="healthy">Healthy Meal</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Packaging Type</InputLabel>
              <Select
                value={details.packagingType || ""}
                onChange={(e) =>
                  handleDetailChange("packagingType", e.target.value)
                }
              >
                <MenuItem value="plastic">Plastic</MenuItem>
                <MenuItem value="paper">Paper</MenuItem>
                <MenuItem value="mixed">Mixed Materials</MenuItem>
                <MenuItem value="reusable">Reusable</MenuItem>
              </Select>
            </FormControl>
          </>
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
        >
          Add Activity
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitLog;
