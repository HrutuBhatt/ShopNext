import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useUser } from "../context/UserContext";

const SellerNavbar = () => {
  const {logout} = useUser();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/seller-dashboard"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          ShopNext
        </Typography>
        <Box>
          
          <Button color="inherit" component={Link} to="/products">
            My Products
          </Button>
          <Button color="inherit" component={Link} to="/add-product">
            Add Product
          </Button>
          <Button color="inherit" component={Link} to="/analytics">
            Analytics
          </Button>
          <Button color="inherit" component={Link} to="/login" onClick={() => {
              logout();
            }}>
              Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SellerNavbar;
