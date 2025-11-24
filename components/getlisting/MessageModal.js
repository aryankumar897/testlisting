// components/MessageModal.js
"use client";
import { useState, useEffect } from "react";
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
  width: 600,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const MessageModal = ({ open, onClose, data }) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_CHARACTERS = 1000;
   let  listingData=data
  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setMessageText("");
      setCharacterCount(0);
      setAlert({ type: "", text: "" });
    }
  }, [open]);

  const handleChange = (e) => {
    const value = e.target.value;
    setCharacterCount(value.length);
    if (value.length <= MAX_CHARACTERS) {
      setMessageText(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      setAlert({
        type: "error",
        text: "Please enter a message before sending.",
      });
      return;
    }

    if (messageText.trim().length < 5) {
      setAlert({
        type: "error",
        text: "Please enter a longer message (minimum 5 characters).",
      });
      return;
    }

    setLoading(true);
    setAlert({ type: "", text: "" });

    try {
      const response = await fetch(`${process.env.API}/user/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          listing_id: listingData?._id,
          receiver_id:listingData?.user_id?._id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          text: data?.msg ||  "Message sent successfully!",
        });

        // Auto-close after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setAlert({
          type: "error",
          text: data.err || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Message submission error:", error);
      setAlert({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessageText("");
    setAlert({ type: "", text: "" });
    setCharacterCount(0);
    onClose();
  };

  return (
    <Modal open={open} onClose={!loading ? handleClose : undefined}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Message { "Business Owner"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Send a message to the business owner.
        </Typography>

        {alert.text && (
          <Alert
            severity={alert.type}
            sx={{ mb: 2 }}
            onClose={() => setAlert({ type: "", text: "" })}
          >
            {alert.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Message"
            value={messageText}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            placeholder="Type your message here..."
            helperText={`${characterCount}/${MAX_CHARACTERS} characters`}
            error={characterCount > MAX_CHARACTERS}
          />

          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose} disabled={loading} variant="outlined">
              Cancel
            </Button>
            <Button
              sx={styles.button}
              type="submit"
              variant="contained"
              disabled={
                loading || !messageText.trim() || messageText.trim().length < 5
              }
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default MessageModal;
