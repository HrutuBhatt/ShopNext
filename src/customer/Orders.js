import React, { useEffect, useState } from "react";
import {
  Box, Typography, List, ListItem, ListItemText,
  Divider, Button, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/orders/user/${user.user_id}`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setLoading(false);
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        alert("Order cancelled successfully.");
        fetchOrders(); // Refresh orders
      } else {
        alert("Failed to cancel order.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Something went wrong.");
    }
  };

  const viewOrder = (orderItems) => {
    setSelectedOrderItems(orderItems || []);
    setViewDialogOpen(true);
  };

  useEffect(() => {
    if (user.user_id && token) {
      fetchOrders();
    }
  }, []);

  if (loading) return <CircularProgress />;
  if (!orders || orders.length === 0) return <Typography>No orders found.</Typography>;

  return (
    <Box maxWidth="800px" mx="auto">
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      <List>
        {orders.map((order) => (
          <React.Fragment key={order.order_id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Order #{order.order_id}</Typography>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "CANCELLED" ? "error" :
                        order.status === "DELIVERED" ? "success" : "warning"
                      }
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box mt={1}>
                    <Typography>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                    <Typography>Total Amount: ₹{order.totalAmount}</Typography>
                    <Typography>Items: {order.orderItems?.length || 0}</Typography>
                    <Typography>
                      Address: {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
                    </Typography>
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => cancelOrder(order.order_id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => viewOrder(order.orderItems)}
                    >
                      View Order
                    </Button>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent dividers>
          {selectedOrderItems.length === 0 ? (
            <Typography>No items found in this order.</Typography>
          ) : (
            <List>
              {selectedOrderItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.product?.name || "Unnamed Product"}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyOrders;
