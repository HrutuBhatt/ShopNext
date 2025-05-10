import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ name: "", description: "" });

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.category_id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.category_id);
    setEditedCategory({ name: category.name, description: category.description });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedCategory),
      });

      if (response.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCategory({ name: "", description: "" });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom mt={4}>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <React.Fragment key={category.category_id}>
            <ListItem>
              {editingId === category.category_id ? (
                <Box width="100%">
                  <TextField
                    fullWidth
                    label="Name"
                    value={editedCategory.name}
                    onChange={(e) =>
                      setEditedCategory({ ...editedCategory, name: e.target.value })
                    }
                    margin="dense"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={editedCategory.description}
                    onChange={(e) =>
                      setEditedCategory({ ...editedCategory, description: e.target.value })
                    }
                    margin="dense"
                  />
                </Box>
              ) : (
                <ListItemText
                  primary={category.name}
                  secondary={category.description}
                />
              )}
              <ListItemSecondaryAction>
                {editingId === category.category_id ? (
                  <>
                    <IconButton onClick={() => handleSave(category.category_id)}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.category_id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default CategoryList;
