// File: components/dashboard/admin/listing/edit/ListingEditForm.jsx
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
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/slice/categorySlice";
import { fetchLocations } from "@/slice/locationSlice";
import { fetchAmenities } from "@/slice/amenitySlice";
import { runAi } from "@/ai/Ai";

import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
  uploadAreaStyles,
  imagePreviewStyles,
  deleteButtonStyles,
} from "./listingFormStyles";


const ListingEditForm = ({ initialValues = null, onSubmit, onCancel, loading = false }) => {
  const dispatch = useDispatch();

  const categories = useSelector((s) => s.categories.list || []);
  const locations = useSelector((s) => s.locations.list || []);
  const amenitiesOptions = useSelector((s) => s.amenities.list || []);

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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLocations());
    dispatch(fetchAmenities());
  }, [dispatch]);

  // Normalize helper (category/location in initialValues might be populated objects)
  const normalizeId = (maybeIdOrObj) => {
    if (!maybeIdOrObj) return "";
    if (typeof maybeIdOrObj === "string") return maybeIdOrObj;
    if (typeof maybeIdOrObj === "object") {
      // If Mongoose populated doc -> may have _id field (object or string)
      if (maybeIdOrObj._id) return typeof maybeIdOrObj._id === "string" ? maybeIdOrObj._id : String(maybeIdOrObj._id);
      // If the value itself is in .id or ._id.$oid etc, try best effort:
      if (maybeIdOrObj.id) return maybeIdOrObj.id;
    }
    return "";
  };

  // populate with initial values when editing
  useEffect(() => {
    if (initialValues) {
      const {
        title,
        category_id,
        location_id,
        address,
        phone,
        email,
        website,
        facebook_link,
        x_link,
        linkedin_link,
        whatsapp_link,
        image,
        thumbnail_image,
        description,
        google_map_embed_code,
        file,
        is_featured,
        is_verified,
        status,
        amenities: initialAmenities,
      } = initialValues;

      setFormData({
        title: title ?? "",
        category_id: normalizeId(category_id),
        location_id: normalizeId(location_id),
        address: address ?? "",
        phone: phone ?? "",
        email: email ?? "",
        website: website ?? "",
        facebook_link: facebook_link ?? "",
        x_link: x_link ?? "",
        linkedin_link: linkedin_link ?? "",
        whatsapp_link: whatsapp_link ?? "",
        image: image ?? "",
        thumbnail_image: thumbnail_image ?? "",
        description: description ?? "",
        google_map_embed_code: google_map_embed_code ?? "",
        file: file ?? "",
        is_featured: !!is_featured,
        is_verified: !!is_verified,
        status: status ?? true,
      });

      setAmenities(Array.isArray(initialAmenities) ? initialAmenities : []);
      if (file) setAttachment({ file: { name: file.split("/").pop() }, url: file });
    }
  }, [initialValues]);

  // ---------- Cloudinary helpers ----------
  const uploadToCloudinary = async (file, pathType = "image") => {
    const uploadPreset = "ml_default";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    if (!uploadPreset || !cloudName) throw new Error("Cloudinary configuration is missing");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const endpoint =
      pathType === "auto"
        ? `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await fetch(endpoint, { method: "POST", body: fd });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Upload failed: ${res.status} ${txt}`);
    }
    const json = await res.json();
    return json.secure_url;
  };

  // ---------- image handlers ----------
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
      const url = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({ ...prev, [isThumbnail ? "thumbnail_image" : "image"]: url }));
    } catch (err) {
      setLocalError(err.message || "Failed to upload image");
    } finally {
      if (isThumbnail) setUploadingThumb(false);
      else setUploadingImage(false);
    }
  };

  const removeImage = (isThumbnail = false) => {
    setFormData((prev) => ({ ...prev, [isThumbnail ? "thumbnail_image" : "image"]: "" }));
  };

  // ---------- attachment (pdf) handlers ----------
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
      const url = await uploadToCloudinary(file, "auto");
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

  // ---------- utilities ----------
  const normalizedAmenitiesOptions = (amenitiesOptions || []).map((a) => (typeof a === "string" ? a : a?.name || ""));
  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // ---------- AI: title & description ----------
  const getCategoryName = (id) => categories.find((c) => c._id === id)?.name || "";
  const getLocationName = (id) => locations.find((l) => l._id === id)?.name || "";

  const generateTitle = async () => {
    setLocalError("");
    setIsGeneratingTitle(true);
    try {
      const categoryName = getCategoryName(formData.category_id) || "General";
      const locationName = getLocationName(formData.location_id) || "";
      const address = (formData.address || "").trim();

      const prompt = `
You are a professional copywriter for a classifieds/listings marketplace.
Produce exactly 8 unique, concise, SEO-friendly listing title options (3–9 words each), as a single comma-separated line.
Context:
- Category: ${categoryName}
- Location: ${locationName || "N/A"}
- Address (optional): ${address || "N/A"}

Rules:
1) Output titles only, comma-separated (no numbering, no explanation).
2) Use title-case or sentence capitalization.
3) Include category or location when it improves clarity/search.
4) Avoid words "item", "listing", "product".
5) Each title <= 70 characters.

Return only the comma-separated titles.
`.trim();

      const aiResponse = await runAi(prompt);
      const suggestions = (aiResponse || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length <= 70);

      if (suggestions.length) {
        setFormData((prev) => ({ ...prev, title: suggestions[0] }));
        return suggestions;
      } else {
        throw new Error("No suggestions returned");
      }
    } catch (err) {
      console.error("Title generation error", err);
      setLocalError(err?.message || "Failed to generate title");
      return [];
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const generateDescription = async () => {
    setLocalError("");
    const missing = [];
    if (!formData.category_id) missing.push("Category");
    if (!formData.location_id) missing.push("Location");
    if (!formData.address || !formData.address.trim()) missing.push("Address");
    if (missing.length) {
      setLocalError(`Please fill: ${missing.join(", ")} before generating description.`);
      return null;
    }

    setIsGeneratingDescription(true);
    try {
      const categoryName = getCategoryName(formData.category_id);
      const locationName = getLocationName(formData.location_id);
      const address = formData.address || "";
      const title = formData.title || `${categoryName} in ${locationName}`;
      const amenitiesList = Array.isArray(amenities) && amenities.length ? amenities.join(", ") : "";

      const prompt = `
You are an expert listing copywriter for an online marketplace.
Produce HTML only (no commentary) using ONLY these tags: <h2>, <p>, <strong>, <ul>, <li>, <br>, <a>.
Context:
- Title: ${title}
- Category: ${categoryName}
- Location: ${locationName}
- Address: ${address}
- Amenities: ${amenitiesList}
Rules:
1) Start with <h2> (5-8 words) mentioning category/location if natural.
2) One short <p> intro (1-2 sentences) with one <strong> phrase.
3) A <ul> with 4-6 concise bullet points (mix features + benefits) — include amenities if provided.
4) One <p> with practical detail referencing the address or nearby landmark.
5) Final <p> with strong call-to-action in <strong>.
6) Tone: professional, clear, slightly promotional.
7) Length: ~120-220 words.
8) If website provided, you may include a single <a href="..."> link with the full URL.
Return HTML only.
`.trim();

      const aiResponse = await runAi(prompt);
      if (!aiResponse || typeof aiResponse !== "string") throw new Error("AI returned invalid response");

      const clean = DOMPurify.sanitize(aiResponse, {
        ALLOWED_TAGS: ["h2", "p", "strong", "ul", "li", "br", "a"],
        ALLOWED_ATTR: ["href", "target", "rel"],
      });

      const finalHtml = clean && clean.trim() ? clean : `<p>${aiResponse}</p>`;
      setFormData((prev) => ({ ...prev, description: finalHtml }));
      return finalHtml;
    } catch (err) {
      console.error("Description generation error", err);
      setLocalError(err?.message || "Failed to generate description");
      return null;
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // ---------- form handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: checked }));
  };

  const handleQuillChange = (val) => {
    setFormData((p) => ({ ...p, description: val }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.title || !formData.category_id || !formData.location_id) {
      setLocalError("Title, category and location are required");
      return;
    }

    try {
      const payload = { ...formData, amenities, file: attachment?.url ?? formData.file ?? null };
      await onSubmit(payload);
      setLocalSuccess(true);
    } catch (err) {
      console.error("Save error", err);
      setLocalError(err?.message || "Failed to save listing");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Paper elevation={0} sx={formInnerStyles}>
        <Typography variant="h5" sx={titleStyles}>
          {initialValues ? "Edit Listing" : "Create Listing"}
        </Typography>

        {(localError) && <Alert severity="error" sx={alertStyles}>{localError}</Alert>}
        {localSuccess && <Alert severity="success" sx={alertStyles}>Saved successfully</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Title with AI button */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                size="small"
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Generate title with AI">
                        <span>
                          <IconButton onClick={generateTitle} disabled={isGeneratingTitle} size="small">
                            {isGeneratingTitle ? <CircularProgress size={20} /> : <AutoFixHigh color="error" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category / Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-label">Category *</InputLabel>
                <Select
                  labelId="category-label"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  label="Category *"
                >
                  <MenuItem value="">Select</MenuItem>
                  {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="location-label">Location *</InputLabel>
                <Select
                  labelId="location-label"
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleInputChange}
                  label="Location *"
                >
                  <MenuItem value="">Select</MenuItem>
                  {locations.map((l) => <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleInputChange} size="small" sx={textFieldStyles} />
            </Grid>

            {/* Phone / Email */}
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} size="small" sx={textFieldStyles} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} size="small" sx={textFieldStyles} /></Grid>

            {/* Website */}
            <Grid item xs={12}><TextField fullWidth label="Website" name="website" value={formData.website} onChange={handleInputChange} size="small" sx={textFieldStyles} /></Grid>

            {/* Social links */}
            {["facebook_link", "x_link", "linkedin_link", "whatsapp_link"].map((field) => (
              <Grid item xs={12} sm={6} md={3} key={field}>
                <TextField fullWidth label={field.replace("_", " ").toUpperCase()} name={field} value={formData[field]} onChange={handleInputChange} size="small" sx={textFieldStyles} />
              </Grid>
            ))}

            {/* Attachment */}
            <Grid item xs={12}>
              <Box sx={uploadAreaStyles}>
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
                    <Typography sx={textFieldStyles}>No attachment selected</Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={normalizedAmenitiesOptions}
                value={amenities}
                onChange={(e, v) => setAmenities(v)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip key={option + index} variant="outlined" label={option} {...getTagProps({ index })} />)
                }
                renderInput={(params) => <TextField {...params} label="Amenities" placeholder="Add amenities" size="small" sx={textFieldStyles} />}
              />
            </Grid>

            {/* Description with AI */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2">Description</Typography>
                <Tooltip title="Generate description with AI (requires Category, Location & Address)">
                  <span>
                    <Button
                      size="small"
                      onClick={generateDescription}
                      disabled={isGeneratingDescription || !formData.category_id || !formData.location_id || !formData.address}
                      startIcon={isGeneratingDescription ? <CircularProgress size={14} /> : <AutoFixHigh />}
                    >
                      {isGeneratingDescription ? "Generating..." : "Generate Description"}
                    </Button>
                  </span>
                </Tooltip>
              </Box>

              <Box sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 30 }}>
                  <Tooltip title="Generate description">
                    <span>
                      <IconButton onClick={generateDescription} disabled={isGeneratingDescription || !formData.category_id || !formData.location_id || !formData.address} size="small" sx={{ bgcolor: "rgba(255,255,255,0.9)" }}>
                        {isGeneratingDescription ? <CircularProgress size={18} /> : <AutoFixHigh color="primary" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                <Box sx={{ "& .ql-container": { minHeight: 200 } }}>
                  <ReactQuill value={formData.description} onChange={handleQuillChange} modules={{
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
            <Grid item xs={12}>
              <TextField fullWidth label="Google Map Embed Code" name="google_map_embed_code" value={formData.google_map_embed_code} onChange={handleInputChange} size="small" sx={textFieldStyles} />
            </Grid>

            {/* Switches */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControlLabel control={<Switch name="status" checked={!!formData.status} onChange={handleSwitchChange} sx={switchStyles} />} label="Status" />
                <FormControlLabel control={<Switch name="is_featured" checked={!!formData.is_featured} onChange={handleSwitchChange} sx={switchStyles} />} label="Is Featured" />
                <FormControlLabel control={<Switch name="is_verified" checked={!!formData.is_verified} onChange={handleSwitchChange} sx={switchStyles} />} label="Is Verified" />
              </Box>
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
                      <Card sx={imagePreviewStyles}>
                        <CardMedia component="img" height="120" image={formData.image} alt="Listing image" />
                      </Card>
                      <IconButton onClick={(e) => { e.preventDefault(); removeImage(false); }} sx={deleteButtonStyles} size="small"><Delete fontSize="small" /></IconButton>
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
                      <Card sx={imagePreviewStyles}>
                        <CardMedia component="img" height="120" image={formData.thumbnail_image} alt="Listing thumbnail" />
                      </Card>
                      <IconButton onClick={(e) => { e.preventDefault(); removeImage(true); }} sx={deleteButtonStyles} size="small"><Delete fontSize="small" /></IconButton>
                    </Box>
                  )}
                </label>
                {uploadingThumb && <CircularProgress size={20} />}
              </Box>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" sx={submitButtonStyles} disabled={loading || uploadingAttachment} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
                {loading ? "Saving..." : uploadingAttachment ? "Uploading attachment..." : "Save Listing"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ListingEditForm;
