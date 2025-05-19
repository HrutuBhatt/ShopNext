import React, { useEffect, useState } from "react";
import {
  List,ListItem,ListItemAvatar,ListItemText,IconButton,Typography,Avatar,
  Divider,Box,Button,CircularProgress,Dialog,DialogTitle,DialogContent,DialogActions,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [step, setStep] = useState("address");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipcode: "" , phone:""});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/cart/items/${user.user_id}`, { headers });
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
    setLoading(false);
  };

  const increaseQuantity = async (cartItemId) => {
    await fetch(`http://localhost:8080/api/cart-item/${cartItemId}/increase`, { method: "PUT", headers });
    fetchCartItems();
  };

  const decreaseQuantity = async (cartItemId) => {
    await fetch(`http://localhost:8080/api/cart-item/${cartItemId}/decrease`, { method: "PUT", headers });
    fetchCartItems();
  };

  const removeItem = async (cartItemId) => {
    await fetch(`http://localhost:8080/api/cart-item/${cartItemId}`, { method: "DELETE", headers });
    fetchCartItems();
  };

  const getTotalAmount = () =>
    cartItems.reduce((total, item) => total + item.product?.price * item.quantity, 0);

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/payments/process/${user.user_id}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(address), // send address to backend
        }
      );
      if (res.ok) {
        alert("Order placed successfully!");
        setDialogOpen(false);
        fetchCartItems();
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Something went wrong!");
    }
    setPlacingOrder(false);
  };

  useEffect(() => {
    if (user.user_id && token) {
      fetchCartItems();
    }
  }, [user.user_id, token]);

  if (loading) return <CircularProgress />;
  if (!cartItems.length)
    return <Typography variant="h6">Your cart is empty.</Typography>;

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <List>
        {cartItems.map((item) => (
          <React.Fragment key={item.cart_item_id}>
            <ListItem
              secondaryAction={
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => decreaseQuantity(item.cart_item_id)}><Remove /></IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton onClick={() => increaseQuantity(item.cart_item_id)}><Add /></IconButton>
                  <IconButton onClick={() => removeItem(item.cart_item_id)}><Delete /></IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar src={item.product?.images?.[0]?.image_url} variant="square" />
              </ListItemAvatar>
              <ListItemText
                primary={item.product?.name}
                secondary={`Price: ₹${item.product?.price}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Total: ₹{getTotalAmount()}</Typography>
        <Button variant="contained" color="primary" onClick={() => { setStep("address"); setDialogOpen(true); }}>
          Place Order
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{step === "address" ? "Enter Shipping Address" : "Confirm Your Order"}</DialogTitle>
        <DialogContent>
          {step === "address" ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <input
                placeholder="Street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <input
                placeholder="Zipcode"
                value={address.zipcode}
                onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </Box>
          ) : (
            <>
              <Typography>Total Amount: ₹{getTotalAmount()}</Typography>
              <Typography>Items: {cartItems.length}</Typography>
              <Typography>Address:</Typography>
              <Typography>{address.street}, {address.city}, {address.state} - {address.zipcode}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          {step === "address" ? (
            <Button
              onClick={() => setStep("confirm")}
              color="primary"
              variant="contained"
              disabled={!address.street || !address.city || !address.state || !address.zipcode}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={placeOrder}
              color="primary"
              variant="contained"
              disabled={placingOrder}
            >
              {placingOrder ? "Placing..." : "Confirm"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cart;