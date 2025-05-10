import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Input,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const UploadImage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:8080/api/product-images/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Image uploaded successfully!");
        navigate("/seller-dashboard"); // Redirect after upload
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" mb={3}>
          Upload Product Image
        </Typography>
        <Box>
          <Input type="file" onChange={handleFileChange} fullWidth />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadImage;
