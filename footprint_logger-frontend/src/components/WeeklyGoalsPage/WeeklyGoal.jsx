// components/WeeklyGoal.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    Slider,
    Button,
    Alert,
    LinearProgress,
} from "@mui/material";
import { Edit, Check } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext"; // ✅ Added import

const WeeklyGoal = () => {
    const { user } = useAuth(); // ✅ Get user from AuthContext
    const [editing, setEditing] = useState(false);
    const [goal, setGoal] = useState(user?.weeklyGoal || 50);
    const [success, setSuccess] = useState(false);

    // Mock data - in a real app, this would come from the user's actual logs
    const currentWeekSavings = 18.7; // kg CO2 saved this week

    const handleSaveGoal = () => {
        setEditing(false);
        setSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
    };

    const progress = Math.min((currentWeekSavings / goal) * 100, 100);

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
                    >
                        Save
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

            {editing ? (
                <Box>
                    <Typography gutterBottom>
                        Set your weekly CO₂ reduction goal (kg):
                    </Typography>
                    <Slider
                        value={goal}
                        onChange={(e, newValue) => setGoal(newValue)}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
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
                            Congratulations! You've reached your weekly goal.
                        </Alert>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default WeeklyGoal;