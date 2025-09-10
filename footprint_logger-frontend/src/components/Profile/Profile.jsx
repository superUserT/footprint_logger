import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { Person, Edit, Check } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h4">
              Your Profile
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Member Since"
                value="June 2023"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total CO₂ Saved"
                value="47.3 kg"
                disabled
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {editing ? (
              <Button
                variant="contained"
                startIcon={<Check />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
