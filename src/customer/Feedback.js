// src/components/Feedback.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Feedback = ({ productId, user }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFeedbacks();
  }, [productId]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/feedback/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/api/feedback/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: user.user_id,
          productId,
          message,
        }),
      });

      const newFeedback = await res.json();
      setFeedbacks((prev) => [...prev, newFeedback]);
      setMessage("");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };


//   const handleDelete = async (feedbackId) => {
//     try {
//       await fetch(`http://localhost:8080/api/feedback/${feedbackId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setFeedbacks((prev) => prev.filter((fb) => fb.feedbackId !== feedbackId));
//     } catch (err) {
//       console.error("Failed to delete feedback:", err);
//     }
//   };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Feedback
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Feedback
      </Button>

    <br/><br/>
    <Typography variant="h6" >
        User Reviews
    </Typography>
      <List sx={{ mt: 3 }}>
        {feedbacks.map((fb) => (
          <React.Fragment key={fb.feedback_id}>
            <ListItem
            //   secondaryAction={
            //     fb.user?.user_id === user?.user_id && (
            //       <Button color="error" size="small" onClick={() => handleDelete(fb.feedbackId)}>
            //         Delete
            //       </Button>
            //     )
            //   }
            >
              <ListItemText
                primary={fb.message}
                secondary={
                  fb.user?.username
                    ? `By ${fb.user.username} on ${new Date(fb.submittedAt).toLocaleString()}`
                    : `Anonymous`
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Feedback;
