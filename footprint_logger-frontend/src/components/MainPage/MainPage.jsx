// components/Homepage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { ShowChart, Group, BarChart } from "@mui/icons-material";

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      // icon: <Eco sx={{ fontSize: 40 }} />,
      title: "Track Your Carbon Footprint",
      description:
        "Log your daily activities and calculate your environmental impact.",
    },
    {
      icon: <ShowChart sx={{ fontSize: 40 }} />,
      title: "Monitor Progress",
      description:
        "Set weekly goals and track your reduction in carbon emissions over time.",
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: "Community Comparison",
      description: "See how your footprint compares to the community average.",
    },
    {
      icon: <BarChart sx={{ fontSize: 40 }} />,
      title: "Detailed Analytics",
      description:
        "Get insights into which activities contribute most to your footprint.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Footprint Logger
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Track, reduce, and compare your carbon footprint
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate("/submit-log")}
            >
              Log Activity
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Paper sx={{ py: 6, textAlign: "center", bgcolor: "grey.100" }}>
        <Container maxWidth="md">
          <Typography variant="h5" gutterBottom>
            Ready to reduce your carbon footprint?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/dashboard")}
            sx={{ mt: 2 }}
          >
            View Your Dashboard
          </Button>
        </Container>
      </Paper>
    </Box>
  );
};

export default Homepage;
