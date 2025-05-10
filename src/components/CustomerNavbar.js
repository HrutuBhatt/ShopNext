import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useUser } from "../context/UserContext"; // Context to set userId
import { useNavigate } from "react-router-dom";
const CustomerNavbar = () => {
  const { logout } = useUser();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/customer-dashboard"
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
         
            <Button color="inherit" component={Link} to="/customer-dashboard">
                Home
            </Button>
            <Button color="inherit" component={Link} to="/orders">
                My Orders
            </Button>
            <Button color="inherit" component={Link} to="/cart">
                Cart
            </Button>
            <Button color="inherit" component={Link} to="/profile">
                Profile
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

export default CustomerNavbar;
