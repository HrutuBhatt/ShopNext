import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Box
} from "@mui/material";

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchHistory, setSearchHistory] = useState([]);


  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchAllProducts();
    fetchSearchHistory();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productList = await res.json();

      // Fetch each product's details and images
      const productDetails = await Promise.all(
        productList.map(async (product) => {
          const [productRes, imagesRes] = await Promise.all([
            fetch(`/api/products/${product.product_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`/api/product-images/${product.product_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const productData = await productRes.json();
          const imageList = await imagesRes.json();

          return {
            ...productData,
            image_url: imageList?.[0]?.image_url || "/placeholder.png", // Use first image or fallback
          };
        })
      );

      setProducts(productDetails);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

   // Fetch user search history
  const fetchSearchHistory = async () => {
    try {
      const res = await fetch(`/api/search-history/user/${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const history = await res.json();
      setSearchHistory(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  // Save search query to history
  const saveSearchHistory = async (query) => {
    try {
      await fetch(`/api/search-history/add?userId=${user.user_id}&searchQuery=${query}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      fetchSearchHistory(); // Refresh history
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Browse Products
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const trimmedQuery = searchQuery.trim();
            if (trimmedQuery.length > 2) {
              saveSearchHistory(trimmedQuery);
            }
          }
        }}
        sx={{ mb: 2 }}
      />

      {/* Displaying Search History */}
      {searchHistory.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Recent Searches:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {searchHistory
              .slice(-5) // Show last 5
              .reverse()
              .map((item) => (
                <Chip
                  key={item.search_id}
                  label={item.searchQuery}
                  variant="outlined"
                  onClick={() => setSearchQuery(item.searchQuery)}
                />
              ))}
          </Box>
        </Box>
      )}


      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image_url}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() =>
                      window.location.href = `/product/${product.product_id}`
                    }
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CustomerDashboard;
