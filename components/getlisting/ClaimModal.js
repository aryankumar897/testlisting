// components/ClaimModal.js
"use client";
import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styles } from "./styles";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ClaimModal = ({ open, onClose, listing_id }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    claim: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${process.env.API}/user/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          listing_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Claim submitted successfully!" });
        setFormData({ name: "", email: "", claim: "" });
        setTimeout(() => {
          onClose();
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to submit claim. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", claim: "" });
    setMessage({ type: "", text: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Claim This Business
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Your Claim"
            name="claim"
            value={formData.claim}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            placeholder="Please explain why you're claiming this business..."
          />

          <Box
            sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              sx={styles.button}
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ClaimModal;
