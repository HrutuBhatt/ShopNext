import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCartItems(data.cartItems || []);
    } catch (err) {
      console.error(err);
      alert("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await fetch(`http://localhost:8080/api/cart/update-quantity`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      fetchCartItems();
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await fetch(`http://localhost:8080/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCartItems();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <Typography>Loading cart...</Typography>;
  if (!cartItems.length) return <Typography>Your cart is empty.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <List>
        {cartItems.map((item) => (
          <React.Fragment key={item.cart_item_id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={`http://localhost:8080/uploads/${item.product.images?.[0]?.imagePath || ""}`}
                  alt={item.product.name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.product.name}
                secondary={`Price: ₹${item.product.price} x ${item.quantity}`}
              />
              <IconButton onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}>
                <Remove />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}>
                <Add />
              </IconButton>
              <IconButton onClick={() => removeItem(item.cart_item_id)} color="error">
                <Delete />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Cart;
