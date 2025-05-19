import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

const SellerOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [pendingRes, completedRes] = await Promise.all([
        fetch(`http://localhost:8080/api/orders/orderitems/pending/${user.user_id}`,{
            method: "GET",
            headers,
        }),
        fetch(`http://localhost:8080/api/orders/orderitems/completed/${user.user_id}`,{
            method: "GET",
            headers,
        }),
      ]);

      const pendingData = await pendingRes.json();
      const completedData = await completedRes.json();

      setPendingOrders(pendingData);
      setCompletedOrders(completedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (orderItemId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/markascomplete/${orderItemId}`, {
        method: "GET",
        headers,
      });
      
      console.log(user)
      alert(res.text() | res);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Failed to mark order item as completed:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        New Orders (Pending)
      </Typography>
      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        {pendingOrders.length === 0 ? (
          <Typography>No new orders.</Typography>
        ) : (
          <List>
            {pendingOrders.map((item) => (
              <React.Fragment key={item.item_id}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => markAsComplete(item.item_id)}
                    >
                      Mark as Completed
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`Product: ${item.product?.name || "Unknown"}`}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>
        Past Orders (Completed)
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        {completedOrders.length === 0 ? (
          <Typography>No completed orders.</Typography>
        ) : (
          <List>
            {completedOrders.map((item) => (
              <React.Fragment key={item.item_id}>
                <ListItem>
                  <ListItemText
                    primary={`Product: ${item.product?.name || "Unknown"}`}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default SellerOrders;
