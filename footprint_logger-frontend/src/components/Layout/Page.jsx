import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Box, Grid } from "@mui/material";

function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Header />
      <Grid
        component="main"
        container
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          margin: "0 auto",
          maxWidth: "xl",
          px: 2,
        }}
      >
        <Grid xs={12}>
          <Outlet />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default Page;
