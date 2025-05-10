import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const categoryData = {
      name,
      description,
    };

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      setSuccessMessage('Category added successfully!');
      setName('');
      setDescription('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Add New Category
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Category
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddCategory;
