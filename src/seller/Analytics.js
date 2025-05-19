import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SellerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/analytics/${user.user_id}`,{
            method:'GET',
            headers,
        });
        const data = await response.json();
        setStats(data);
        if (data.topSellingProducts && data.topSellingProducts.length > 0) {
          data.topSellingProducts.forEach((entry) => {
            fetch(`http://localhost:8080/api/products/${entry.productId}`,{
                method:'GET',
                headers,
            })
              .then((res) => res.json())
              .then((product) => {
                setProductDetails((prev) => ({
                  ...prev,
                  [entry.productId]: product.name,
                }));
              })
              .catch((err) => console.error("Error fetching product:", err));
          });
        }
        setLoading(false);

        
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1">Loading stats...</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">Failed to load analytics.</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4} px={2}>
      <Typography variant="h4" gutterBottom>Seller Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h5" color="primary">₹{stats.totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h5" color="secondary">{stats.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Items Sold</Typography>
              <Typography variant="h5" color="success.main">{stats.totalItemsSold}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Selling Products</Typography>
              <List>
                {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                  stats.topSellingProducts.map((product, index) => (
                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle1" >
                            Product ID: {product.productId}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" >
                            Name: {productDetails[product.productId] || 'Loading...'}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                Quantity Sold: {product.quantitySold}
                            </Typography>
                        </Box>
                        
                    </ListItem>
                  ))
                ) : (
                  <Typography>No top products yet.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerAnalytics;
