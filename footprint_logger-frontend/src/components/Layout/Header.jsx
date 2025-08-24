import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: "grey.800", width: "100%" }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "xl",
          margin: "0 auto",
          width: "100%",
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              color: "primary.light",
            },
          }}
        >
          Recipe Search
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
