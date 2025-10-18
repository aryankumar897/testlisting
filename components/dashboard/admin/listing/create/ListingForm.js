// components/ListingForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Autocomplete,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  OpenInNew,
  AutoFixHigh,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { useDispatch, useSelector } from "react-redux";
import { createListing } from "@/slice/listingSlice";
import { fetchCategories } from "@/slice/categorySlice";
import { fetchLocations } from "@/slice/locationSlice";
import { fetchAmenities } from "@/slice/amenitySlice";
import DOMPurify from "dompurify";

import { runAi } from "@/ai/Ai";

import {
  formContainerStyles,
  formInnerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  uploadAreaStyles,
  attachmentAreaStyles,
  attachmentLabelStyles,
} from "./listingFormStyles";

export default function ListingForm() {
  const dispatch = useDispatch();

  // store lists
  const categories = useSelector((state) => state.categories.list || []);
  const locations = useSelector((state) => state.locations.list || []);
  const amenitiesOptions = useSelector((state) => state.amenities.list || []);
  const { loading, error } = useSelector((state) => state.listings || {});

  // form state
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    location_id: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook_link: "",
    x_link: "",
    linkedin_link: "",
    whatsapp_link: "",
    image: "",
    thumbnail_image: "",
    description: "",
    google_map_embed_code: "",
    file: "",
    is_featured: false,
    is_verified: false,
    status: true,
  });

  const [amenities, setAmenities] = useState([]);
  const [attachment, setAttachment] = useState(null); // { file, url }
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);

  // upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // AI states
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLocations());
    dispatch(fetchAmenities());
  }, [dispatch]);

  // ---------- helpers: cloudinary (same as before) ----------
  const uploadToCloudinaryImage = async (file) => {
    const uploadPreset = "ml_default";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!uploadPreset || !cloudName) throw new Error("Cloudinary configuration is missing");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: data });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url;
  };

  const uploadAttachmentToCloudinary = async (file) => {
    const uploadPreset = "ml_default";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!uploadPreset || !cloudName) throw new Error("Cloudinary configuration is missing");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const res = await fetch(endpoint, { method: "POST", body: data });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Upload failed: ${res.status} ${txt}`);
    }
    const json = await res.json();
    return json.secure_url;
  };

  // ---------- file/image handlers ----------
  const handleImageUpload = async (e, isThumbnail = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image size should be less than 5MB");
      return;
    }
    try {
      if (isThumbnail) setUploadingThumb(true);
      else setUploadingImage(true);
      setLocalError("");
      const url = await uploadToCloudinaryImage(file);
      setFormData((prev) => ({ ...prev, [isThumbnail ? "thumbnail_image" : "image"]: url }));
    } catch (err) {
      setLocalError(err.message || "Failed to upload image");
    } finally {
      if (isThumbnail) setUploadingThumb(false);
      else setUploadingImage(false);
    }
  };

  const handleFileAttachment = async (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setLocalError("");
    if (file.type !== "application/pdf") {
      setLocalError("Only PDF files are allowed for attachment.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setLocalError("Attachment should be less than 50MB.");
      return;
    }
    try {
      setUploadingAttachment(true);
      const url = await uploadAttachmentToCloudinary(file);
      setAttachment({ file, url });
    } catch (err) {
      setLocalError(err.message || "Attachment upload failed");
    } finally {
      setUploadingAttachment(false);
    }
  };

  const removeAttachment = (e) => {
    e?.preventDefault();
    setAttachment(null);
  };

  const openAttachmentInNewTab = () => {
    if (!attachment?.url) return;
    window.open(attachment.url, "_blank", "noopener,noreferrer");
  };

  const downloadAttachment = () => {
    if (!attachment?.url) return;
    const a = document.createElement("a");
    a.href = attachment.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = attachment.file?.name || "attachment.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---------- AI helpers ----------
  const getCategoryName = (id) => {
    const c = categories.find((x) => x._id === id);
    return c?.name || "";
  };
  const getLocationName = (id) => {
    const l = locations.find((x) => x._id === id);
    return l?.name || "";
  };

 

// async function to generate title suggestions via AI
// Assumes you have: formData, categories, locations, setFormData, setLocalError, setIsGeneratingTitle
async function generateTitle() {
  setLocalError("");
  setIsGeneratingTitle(true);

  try {
    const categoryName = (categories.find(c => c._id === formData.category_id)?.name) || "";
    const locationName = (locations.find(l => l._id === formData.location_id)?.name) || "";
    const address = (formData.address || "").trim();

    const prompt = `
You are a creative copywriter for a high-quality buy/sell/classifieds marketplace.
Provide exactly 8 unique, concise, SEO-friendly listing title options (3–8 words each).
Context:
- Category: ${categoryName || "unspecified"}
- Location: ${locationName || "unspecified"}
- Address (optional): ${address || "unspecified"}

Rules:
1) OUTPUT: A single comma-separated line of titles ONLY (no numbering, no explanation).
2) Use title-case or sentence-style capitalization.
3) Include the category or location when useful. Prefer clarity and search terms.
4) Avoid generic words like "item", "product", "listing" and avoid punctuation beyond commas and hyphens.
5) Each title must be ≤ 60 characters.

Return the comma-separated titles only.
`.trim();

    const aiResponse = await runAi(prompt);
    if (!aiResponse || typeof aiResponse !== "string") {
      throw new Error("AI returned an empty or invalid response");
    }

    // Parse suggestions
    const suggestions = aiResponse
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length <= 60);

    if (suggestions.length === 0) {
      throw new Error("No valid title suggestions returned by AI");
    }

    // Set the first suggestion into the title field (you can instead show a chooser UI)
    setFormData(prev => ({ ...prev, title: suggestions[0] }));

    // return the array so the caller can display options if desired
    return suggestions;
  } catch (err) {
    console.error("Title generation error:", err);
    setLocalError(err?.message || "Failed to generate title with AI.");
    return [];
  } finally {
    setIsGeneratingTitle(false);
  }
}




// async function to generate a rich HTML description via AI
// Assumes you have: formData, categories, locations, amenities, setFormData, setLocalError, setIsGeneratingDescription
async function generateDescription() {
  setLocalError("");

  // required fields
  const missing = [];
  if (!formData.category_id) missing.push("Category");
  if (!formData.location_id) missing.push("Location");
  if (!formData.address || !formData.address.trim()) missing.push("Address");
  if (missing.length > 0) {
    setLocalError(`Please fill: ${missing.join(", ")} before generating description.`);
    return null;
  }

  setIsGeneratingDescription(true);

  try {
    const categoryName = (categories.find(c => c._id === formData.category_id)?.name) || "";
    const locationName = (locations.find(l => l._id === formData.location_id)?.name) || "";
    const address = (formData.address || "").trim();
    const title = (formData.title || `${categoryName} in ${locationName}`).trim();
    const amenitiesList = Array.isArray(amenities) && amenities.length ? amenities.join(", ") : "";

    const prompt = `
You are an expert listing copywriter for a premium buy/sell marketplace.
Return HTML ONLY (no commentary) and use ONLY these tags: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <br>, <a>.

Context:
- Title: ${title}
- Category: ${categoryName}
- Location: ${locationName}
- Address: ${address}
- Amenities/features: ${amenitiesList}
- Website (if any): ${formData.website || ""}

Structure & Rules:
1) Start with an <h2> (5-8 words) that mentions the category and, if it fits naturally, the location.
2) Add a short <p> (1-2 sentences) as an attention-grabbing intro. Bold the most important phrase with <strong>.
3) Include a <ul> of 4–6 short bullet points (features/benefits). If amenities are provided, include them among the bullets.
4) Add a practical detail <p> referencing the address, nearby transport/landmarks or one key logistic fact.
5) Finish with a final <p> containing a clear call-to-action in bold (e.g., <strong>Contact now to schedule a viewing.</strong>).
6) Tone: professional, trustworthy, slightly promotional. Use short sentences and plain language.
7) Length: roughly 120–220 words total.
8) Do NOT invent availability, pricing, or unverifiable perks. If a perk is not provided, do not assert it.
9) If a website is provided, you may include 1 <a href="..."> link (absolute http(s) URL).

Return the HTML only.
`.trim();

    const aiResponse = await runAi(prompt);
    if (!aiResponse || typeof aiResponse !== "string") {
      throw new Error("AI returned an empty or invalid response");
    }

    // Sanitize with DOMPurify. Allow only the tags and safe link attributes.
    const allowedTags = ["h2","h3","p","strong","em","ul","ol","li","br","a"];
    const allowedAttrs = ["href","target","rel"];
    const dirty = aiResponse.trim();

    // DOMPurify (client-side) sanitize
    const clean = DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttrs
    });

    // Fallback: if cleaning removed everything, wrap AI plain text into paragraphs
    let finalHtml = clean && clean.trim() ? clean : null;
    if (!finalHtml) {
      // simple fallback: break AI text into paragraphs and wrap
      const paragraphs = dirty.split(/\n{2,}/).map(p => `<p>${p.trim()}</p>`).join("");
      finalHtml = paragraphs || `<p>${dirty}</p>`;
      // sanitize fallback as well
      finalHtml = DOMPurify.sanitize(finalHtml, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: allowedAttrs });
    }

    // Insert sanitized HTML into the Quill editor (ReactQuill accepts HTML as value)
    setFormData(prev => ({ ...prev, description: finalHtml }));

    // return the HTML in case the caller wants to preview it elsewhere
    return finalHtml;
  } catch (err) {
    console.error("Description generation error:", err);
    setLocalError(err?.message || "Failed to generate description with AI.");
    return null;
  } finally {
    setIsGeneratingDescription(false);
  }
}


  // ---------- form handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);
    if (!formData.title || !formData.category_id || !formData.location_id) {
      setLocalError("Title, category and location are required");
      return;
    }
    try {
      const payload = { ...formData, amenities, file: attachment?.url ?? null };
     
      console.log("payload", payload)
     
      await dispatch(createListing(payload)).unwrap();
      setLocalSuccess(true);
      // reset
      setFormData({
        title: "",
        category_id: "",
        location_id: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        facebook_link: "",
        x_link: "",
        linkedin_link: "",
        whatsapp_link: "",
        image: "",
        thumbnail_image: "",
        description: "",
        google_map_embed_code: "",
        file: "",
        is_featured: false,
        is_verified: false,
        status: true,
      });
      setAmenities([]);
      setAttachment(null);
    } catch (err) {
      setLocalError(err.message || "Failed to create listing");
    }
  };

  // ---------- small utils ----------
  const normalizedAmenitiesOptions = (amenitiesOptions || []).map((a) => (typeof a === "string" ? a : a?.name || ""));
  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <>
      <Box sx={formContainerStyles}>
        <Paper elevation={0} sx={formInnerStyles}>
          <Typography variant="h6" sx={titleStyles}>Create Listing</Typography>

          {(localError || error) && <Alert severity="error" sx={alertStyles}>{localError || error}</Alert>}
          {localSuccess && <Alert severity="success" sx={alertStyles}>Listing created successfully!</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>

              {/* Title with AI button inside input */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  size="small"
                  sx={textFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Generate title with AI">
                          <span>
                            <IconButton
                              onClick={generateTitle}
                              disabled={isGeneratingTitle}
                              edge="end"
                              aria-label="generate-title"
                              size="small"
                              sx={{ bgcolor: isGeneratingTitle ? "transparent" : "transparent" }}
                            >
                              {isGeneratingTitle ? <CircularProgress size={20} /> : <AutoFixHigh sx={{ color: "red" }} />}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-label">Category *</InputLabel>
                  <Select labelId="category-label" name="category_id" value={formData.category_id} onChange={handleChange} label="Category *">
                    <MenuItem value="">Select</MenuItem>
                    {categories.map((cat) => (<MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="location-label">Location *</InputLabel>
                  <Select labelId="location-label" name="location_id" value={formData.location_id} onChange={handleChange} label="Location *">
                    <MenuItem value="">Select</MenuItem>
                    {locations.map((loc) => (<MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} size="small" sx={textFieldStyles} />
              </Grid>

              {/* Phone / Email */}
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} size="small" sx={textFieldStyles} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} size="small" sx={textFieldStyles} /></Grid>

              {/* Website */}
              <Grid item xs={12}><TextField fullWidth label="Website" name="website" value={formData.website} onChange={handleChange} size="small" sx={textFieldStyles} /></Grid>

              {/* Social links */}
              {["facebook_link", "x_link", "linkedin_link", "whatsapp_link"].map((field) => (
                <Grid item xs={12} sm={6} md={3} key={field}>
                  <TextField fullWidth label={field.replace("_", " ").toUpperCase()} name={field} value={formData[field]} onChange={handleChange} size="small" sx={textFieldStyles} />
                </Grid>
              ))}

              {/* Attachment */}
              <Grid item xs={12}>
                <Box sx={attachmentAreaStyles}>
                  <input id="attachment" type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleFileAttachment} />
                  <label htmlFor="attachment" style={{ width: "100%", cursor: "pointer" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, py: 1 }}>
                      <CloudUpload />
                      <Typography variant="body2">Choose PDF Attachment (optional)</Typography>
                      {uploadingAttachment && <CircularProgress size={18} sx={{ ml: 1 }} />}
                    </Box>
                  </label>

                  <Box sx={{ mt: 1 }}>
                    {attachment ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "background.paper", px: 1, py: 0.5, borderRadius: 1, border: "1px solid rgba(0,0,0,0.06)", maxWidth: 720 }}>
                        <PictureAsPdf color="error" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" noWrap>{attachment.file.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatBytes(attachment.file.size)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <Button size="small" variant="outlined" startIcon={<OpenInNew />} onClick={openAttachmentInNewTab}>Open</Button>
                          <Button size="small" variant="outlined" onClick={downloadAttachment}>Download</Button>
                          <IconButton size="small" onClick={removeAttachment}><Delete fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    ) : (
                      <Typography sx={attachmentLabelStyles}>No attachment selected</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Amenities */}
              <Grid item xs={12}>
                <Autocomplete multiple freeSolo options={normalizedAmenitiesOptions} value={amenities} onChange={(e, v) => setAmenities(v)} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} label="Amenities" placeholder="Add amenities" size="small" sx={textFieldStyles} />} />
              </Grid>

              {/* Description with AI generate IconButton inside editor area */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Tooltip title="Generate description with AI (requires Category, Location & Address)">
                    <span>
                      <Button
                        size="small"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription || !formData.category_id || !formData.location_id || !formData.address}
                        startIcon={isGeneratingDescription ? <CircularProgress size={16} /> : <AutoFixHigh />}
                      >
                        {isGeneratingDescription ? "Generating..." : "Generate Description"}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>

                {/* Editor container — position: relative so IconButton can be pinned inside */}
                <Box sx={{ position: "relative" }}>
                  {/* pinned small IconButton inside editor (top-right) */}
                  <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 30 }}>
                    <Tooltip title="Generate description">
                      <span>
                        <IconButton
                          onClick={generateDescription}
                          disabled={isGeneratingDescription || !formData.category_id || !formData.location_id || !formData.address}
                          size="small"
                          sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                        >
                          {isGeneratingDescription ? <CircularProgress size={18} /> : <AutoFixHigh sx={{ color: "primary.main" }} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  <Box sx={{ "& .ql-container": { minHeight: 200 } }}>
                    <ReactQuill value={formData.description} onChange={(val) => setFormData((p) => ({ ...p, description: val }))} modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }} />
                  </Box>
                </Box>
              </Grid>

              {/* Map embed */}
              <Grid item xs={12}><TextField fullWidth label="Google Map Embed Code" name="google_map_embed_code" value={formData.google_map_embed_code} onChange={handleChange} size="small" sx={textFieldStyles} /></Grid>

              {/* Switches */}
              <Grid item xs={12} container spacing={2}>
                {["status", "is_featured", "is_verified"].map((field) => (
                  <Grid item key={field}><FormControlLabel control={<Switch name={field} checked={formData[field]} onChange={handleSwitchChange} sx={switchStyles} />} label={field.replace("_", " ")} /></Grid>
                ))}
              </Grid>

              {/* Image uploads */}
              <Grid item xs={12} sm={6}>
                <Box sx={uploadAreaStyles}>
                  <input type="file" id="image" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                  <label htmlFor="image" style={{ width: "100%", cursor: "pointer" }}>
                    {!formData.image ? (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <CloudUpload />
                        <Typography variant="body2">Upload Image *</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Card sx={{ maxWidth: 200 }}>
                          <CardMedia component="img" height="120" image={formData.image} alt="Listing image" />
                        </Card>
                        <IconButton onClick={(e) => { e.preventDefault(); setFormData((prev) => ({ ...prev, image: "" })); }} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "white" }} size="small"><Delete fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </label>
                  {uploadingImage && <CircularProgress size={20} />}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={uploadAreaStyles}>
                  <input type="file" id="thumbnail" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                  <label htmlFor="thumbnail" style={{ width: "100%", cursor: "pointer" }}>
                    {!formData.thumbnail_image ? (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <CloudUpload />
                        <Typography variant="body2">Upload Thumbnail *</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Card sx={{ maxWidth: 200 }}>
                          <CardMedia component="img" height="120" image={formData.thumbnail_image} alt="Listing thumbnail" />
                        </Card>
                        <IconButton onClick={(e) => { e.preventDefault(); setFormData((prev) => ({ ...prev, thumbnail_image: "" })); }} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "white" }} size="small"><Delete fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </label>
                  {uploadingThumb && <CircularProgress size={20} />}
                </Box>
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Button fullWidth type="submit" variant="contained" sx={submitButtonStyles} disabled={loading || uploadingAttachment} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
                  {loading ? "Creating..." : uploadingAttachment ? "Uploading attachment..." : "Create Listing"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

    
    </>
  );
}
