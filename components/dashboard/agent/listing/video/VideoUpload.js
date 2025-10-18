"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";

const VideoUpload = ({ onFileSelect, accept = "video/*", disabled = false }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: "none" }}
        id="video-upload-input"
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <label htmlFor="video-upload-input">
        <Box
          sx={{
            width: 240,
            height: 150,
            border: "2px dashed #ccc",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
          }}
        >
          {previewUrl ? (
            <video
              src={previewUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              loop
              playsInline
            />
          ) : (
            <>
              <AddPhotoAlternate sx={{ fontSize: 40, color: "#999" }} />
              <Typography variant="caption" sx={{ mt: 1, color: "#999" }}>
                Select Video
              </Typography>
            </>
          )}
        </Box>
      </label>
    </Box>
  );
};

export default VideoUpload;
