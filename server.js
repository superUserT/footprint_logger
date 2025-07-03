const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data", "activities.json");

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

app.post("/api/activities", (req, res) => {
  try {
    const activities = JSON.parse(fs.readFileSync(DATA_FILE));
    const newActivity = {
      ...req.body,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    activities.push(newActivity);
    fs.writeFileSync(DATA_FILE, JSON.stringify(activities, null, 2));
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/activities", (_req, res) => {
  try {
    const activities = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/home", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/dashboard", (_req, res) => {
  res.sendFile(path.join(__dirname, "src", "dashboard.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/home`);
});

module.exports = { app };
