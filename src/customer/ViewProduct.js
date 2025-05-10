import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ViewProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage

  useEffect(() => {
    const fetchProductAndImages = async () => {
      try {
        const [productRes, imageRes] = await Promise.all([
          fetch(`http://localhost:8080/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8080/api/product-images/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!productRes.ok || !imageRes.ok) {
          throw new Error("Failed to fetch product or images");
        }

        const productData = await productRes.json();
        const imageData = await imageRes.json();

        setProduct(productData);
        setImages(imageData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProductAndImages();
  }, [productId, token]);

  const handleAddToCart = async () => {
    if (!user) return alert("Please log in to add to cart");
    setAdding(true);

    try {
      const res = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: user.user_id,
          productId,
          quantity: 1,
        }),
      });

      const message = await res.text();
      alert(message);
      window.location.href = `/cart`;
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (!product) return <Typography color="error">Product not found.</Typography>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card>
        {images.length > 0 && (
          <CardMedia
            component="img"
            height="300"
            image={`${images[0].image_url}`}
            alt={product.name}
          />
        )}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1">Price: ₹{product.price}</Typography>
          <Typography variant="body2" color="textSecondary">
            {product.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewProduct;
