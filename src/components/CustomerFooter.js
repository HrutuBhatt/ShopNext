import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        py: 4,
        mt: 6,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              ShopNext
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover top products at unbeatable prices. Your trusted e-commerce destination.
            </Typography>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#" underline="hover" color="text.primary" display="block">
              About Us
            </Link>
            <Link href="#" underline="hover" color="text.primary" display="block">
              Contact
            </Link>
            <Link href="#" underline="hover" color="text.primary" display="block">
              Help Center
            </Link>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconButton color="primary" href="https://facebook.com">
              <FacebookIcon />
            </IconButton>
            <IconButton color="primary" href="https://twitter.com">
              <TwitterIcon />
            </IconButton>
            <IconButton color="primary" href="https://instagram.com">
              <InstagramIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ShopNext. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
