import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.800",
        color: "white",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Thabiso Rantsho. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
