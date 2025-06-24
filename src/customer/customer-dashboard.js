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
  Box,
  Paper,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategorySection from "./Category";
import Footer from "../components/CustomerFooter";
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

  //remove history
  const removeHistoryItem = async (searchId) => {
    await fetch(`/api/search-history/${searchId}`, { method: "DELETE" });
    fetchSearchHistory();
  };

  return (
     <Box>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(to right,rgb(85, 219, 101), #2196f3,rgb(216, 239, 110))",
          color: "white",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          ShopNext
        </Typography>
        <Typography variant="subtitle1">Find the best deals today!</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, display: "flex", gap: 2 }}>
          <SearchIcon sx={{ alignSelf: "center", color: "gray" }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const trimmed = searchQuery.trim();
                if (trimmed.length > 2) {
                  saveSearchHistory(trimmed);
                }
              }
            }}
          />
        </Paper>

        {/* Recent Search Chips */}
        {searchHistory.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Searches:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {searchHistory
                .slice(-5)
                .reverse()
                .map((item) => (
                  <Chip
                    key={item.search_id}
                    label={item.searchQuery}
                    variant="outlined"
                    onClick={() => setSearchQuery(item.searchQuery)}
                    onDelete={() => removeHistoryItem(item.search_id)}
                  />
                ))}
            </Box>
          </Box>
        )}

        {/* Category section */}
        <CategorySection />

        {/* Products Section */}
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                <Card
                  elevation={4}
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                      ₹{product.price}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 1 }}>
                      {product.description}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ShoppingCartIcon />}
                      onClick={() =>
                        (window.location.href = `/product/${product.product_id}`)
                      }
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer/>
    </Box>
  );
};

export default CustomerDashboard;
