import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Context to set userId
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();
  const { setUser } = useUser(); // Context to set userId
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUserId(data.user.user_id);
        setUser(data.user); // Set user data in context
        
        // Role-based redirection
        const role = data.user.role?.toLowerCase();
        // After successful login

        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "customer") navigate("/customer-dashboard");
        else if (role === "seller") navigate("/seller-dashboard");
      } else {
        alert("Invalid username or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <Box>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(90deg,rgb(107, 156, 255),rgb(28, 43, 248),rgb(17, 0, 130), rgb(57, 7, 119), rgb(89, 47, 148))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        ShopNext
      </Typography>
      {/* <Paper elevation={3} sx={{ padding: 4, width: "100%" }}> */}
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Sign up
            </Link>
          </Typography>

        </Box>
      {/* </Paper> */}
      </Box>
    </Container>
  );
};

export default Login;
