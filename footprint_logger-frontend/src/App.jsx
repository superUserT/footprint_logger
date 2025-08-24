// App.js
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components//Dashboard/Dashboard";
import Login from "./components/LoginPage/Login";
import Homepage from "./components/MainPage/MainPage";
import Profile from "./components/Profile/Profile";
import Register from "./components/Register/Register";
import SubmitLog from "./components/SubmitPage/SubmitLog";
import Navigation from "./components/Navigation/Navigation";

// Custom theme for the application
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Green theme for environmental app
    },
    secondary: {
      main: "#FF8F00", // Orange accent
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [user] = useState({
    id: 1,
    name: "Demo User",
    email: "demo@footprintlogger.com",
    weeklyGoal: 50, // kg CO2 reduction goal
  });

  const [logs, setLogs] = useState([
    { id: 1, date: "2023-06-01", activity: "Biked to work", co2Saved: 5.2 },
    { id: 2, date: "2023-06-02", activity: "Vegetarian meals", co2Saved: 3.7 },
    { id: 3, date: "2023-06-03", activity: "Reduced heating", co2Saved: 2.1 },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<Dashboard user={user} logs={logs} setLogs={setLogs} />}
            />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route
              path="/submit-log"
              element={<SubmitLog logs={logs} setLogs={setLogs} />}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
