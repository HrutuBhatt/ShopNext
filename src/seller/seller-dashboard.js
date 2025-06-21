import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Box,
} from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const SellerDashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Add New Product",
      description: "List your new products to reach more customers.",
      icon: <AddBoxIcon sx={{ fontSize: 60, color: "#1976d2" }} />,
      route: "/add-product",
    },
    {
      title: "My Products",
      description: "View, update, or remove products you’ve added.",
      icon: <StorefrontIcon sx={{ fontSize: 60, color: "#388e3c" }} />,
      route: "/products",
    },
    {
      title: "Customer Orders",
      description: "Track orders and manage deliveries efficiently.",
      icon: <ShoppingBasketIcon sx={{ fontSize: 60, color: "#f57c00" }} />,
      route: "/seller-orders",
    },
    {
      title: "Analytics",
      description: "Analyze your sales and gain powerful insights.",
      icon: <ShoppingBasketIcon sx={{ fontSize: 60, color: "#f57c00" }} />,
      route: "/analytics",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(to right, #1976d2, #00c853)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Grow Your Business with ShopNext 🚀
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Manage your products, orders, and sales in one place.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                textAlign: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ mt: 2 }}>{feature.icon}</Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(feature.route)}
                >
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SellerDashboard;
