"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { Delete, AddPhotoAlternate } from "@mui/icons-material";
import VideoUpload from "./VideoUpload"; // adjust path if needed
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const ProductGallery = () => {
  const { id } = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.API}/agent/listing-video?listing_id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setGallery(data);
      } else {
        throw new Error(data.err || "Failed to fetch gallery");
      }
    } catch (err) {
      setError(err.message || "Unknown error");
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVideoUpload = async () => {
    if (!videoFile) {
      setError("Please select a video");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError("");

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", "ml_default"); // ensure preset allows video & unsigned if used

      // axios upload to Cloudinary with progress
      const cloudUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`;

      const cloudResp = await axios.post(cloudUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
        // optional: increase timeout for big files
        timeout: 0,
      });

      const secure_url = cloudResp?.data?.secure_url;
      if (!secure_url) throw new Error("Cloud upload succeeded but no secure_url returned");

      // Save to DB - use the same key your backend expects (image/video)
      const saveRes = await fetch(`${process.env.API}/agent/listing-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          video: secure_url,
        //  media_type: "video",
        }),
      });

      if (!saveRes.ok) {
        const errBody = await saveRes.json().catch(() => ({}));
        throw new Error(errBody.err || "Failed to save video to database");
      }

      toast.success("Video added to gallery");
      setVideoFile(null);
      setUploadProgress(0);
      fetchGallery();
    } catch (err) {
      setError(err?.message || "Upload failed");
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setVideoFile(null);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.API}/agent/listing-video/${itemToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.err || "Failed to delete");
      }

      toast.success("Removed from gallery");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchGallery();
    } catch (err) {
      setError(err.message || "Delete failed");
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Product Gallery</Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": { backgroundColor: "#ff9a00" },
          }}
          onClick={() => router.push(`/dashboard/agent/listing/edit/${id}`)}
        >
          Back to Listing
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Add New Video
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <VideoUpload onFileSelect={setVideoFile} accept="video/*" disabled={uploading} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "#ff9a00",
                "&:hover": { backgroundColor: "#ff9a00" },
              }}
              onClick={handleVideoUpload}
              disabled={!videoFile || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>

            {uploading && (
              <Box sx={{ width: 250 }}>
                <LinearProgress variant="determinate" value={uploadProgress}    sx={{  color:"yellow"  }}/>
                <Typography variant="caption" sx={{ display: "block", textAlign: "center", color:"yellow" }}>
                  {uploadProgress}% 
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, color: "yellow" }}>
          <CircularProgress />
        </Box>
      ) : gallery.length === 0 ? (
        <Typography sx={{ color: "white" }}>No media in gallery yet</Typography>
      ) : (
        <Grid container spacing={2}>
          {gallery.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Box sx={{ position: "relative", borderRadius: 1, overflow: "hidden" }}>
              
              
               
                 <video
                    src={item.video}
                    controls
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />



                <IconButton
                  onClick={() => {
                    setItemToDelete(item._id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "red",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductGallery;
