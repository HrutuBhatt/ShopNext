import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");
  // Fetch categories from backend
  useEffect(() => {
      fetch("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [token]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct request payload
    const payload = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      category: { category_id: parseInt(product.categoryId) },
      user: {user_id: parseInt(user.user_id)}
    };

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        alert("Product created! Now upload image.");
        setProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
        });
        window.location.href = `/upload-image/${data.product_id}`;
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" mb={3}>
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Category"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            margin="normal"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Add Product
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;
