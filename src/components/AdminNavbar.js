import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useUser } from "../context/UserContext"; // Context to set userId
const AdminNavbar = () => {
  const {logout} = useUser();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
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
      
          <Button color="inherit" component={Link} to="/add-category">
            Add Category
          </Button>
          <Button color="inherit" component={Link} to="/categories">
            Categories
          </Button>
          {/* <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button> */}
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

export default AdminNavbar;
