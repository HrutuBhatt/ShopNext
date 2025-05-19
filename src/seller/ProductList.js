import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/categories`, {
//         headers,
//       });
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error("Failed to fetch categories", err);
//     }
//   };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/user/${user.user_id}`,
        {
          method: "GET",
          headers,
        }
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      alert("Failed to fetch products");
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.status === 204) {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting product");
    }
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct({ ...product }); // clone to avoid direct state mutation
    setOpenDialog(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/${selectedProduct.product_id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(selectedProduct),
        }
      );

      if (res.ok) {
        alert("Product updated");
        setOpenDialog(false);
        fetchProducts();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!user || !token) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        // fetch products
        const prodRes = await fetch(
          `http://localhost:8080/api/products/user/${user.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(await prodRes.json());

        // fetch categories
        const catRes = await fetch("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(await catRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <CircularProgress />;
  if (!products.length)
    return <Typography>No products found. Try adding one.</Typography>;

  return (
    <Box maxWidth="1000px" mx="auto">
      <Typography variant="h4" gutterBottom>
      </Typography>

      <Box mb={2} >
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.product_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="subtitle1">₹{product.price}</Typography>
                <Typography variant="caption">
                  Category: {product.category?.name}
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(product)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteProduct(product.product_id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Update Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              value={selectedProduct?.description || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={selectedProduct?.price || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
            />
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={selectedProduct?.category?.category_id || ""}
              onChange={(e) => {
                const category_id = e.target.value;
                const selectedCategory = categories.find(
                  (c) => c.category_id === category_id
                );
                setSelectedProduct({
                  ...selectedProduct,
                  category: selectedCategory,
                });
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProduct}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
