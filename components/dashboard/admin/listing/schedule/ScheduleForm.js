// ScheduleForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { DAYS } from "./constants";
import { to12Hour, normalizeTo24 } from "./timeHelpers";

export default function ScheduleForm({
  open,
  onClose,
  initial = null, // null => create, otherwise schedule object
  listingId,
  onSaved, // callback to refetch parent / update UI
}) {
  const [form, setForm] = useState({
    _id: null,
    listing_id: listingId || "",
    day: "",
    start_time: "",
    end_time: "",
    status: true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        _id: initial._id || null,
        listing_id: initial.listing_id || listingId || "",
        day: initial.day || "",
        start_time: normalizeTo24(initial.start_time || ""),
        end_time: normalizeTo24(initial.end_time || ""),
        status: initial.status === undefined ? true : !!initial.status,
      });
    } else {
      setForm({
        _id: null,
        listing_id: listingId || "",
        day: "",
        start_time: "",
        end_time: "",
        status: true,
      });
    }
    setError("");
  }, [initial, listingId, open]);

  const validate = () => {
    if (!form.day) return "Please select a day";
    if (!form.start_time) return "Please select start time";
    if (!form.end_time) return "Please select end time";
    if (form.start_time >= form.end_time)
      return "Start time must be earlier than end time";
    return "";
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        listing_id: form.listing_id,
        day: form.day,
        start_time: to12Hour(form.start_time),
        end_time: to12Hour(form.end_time),
        status: form.status,
      };

      let res;
      if (form._id) {
        res = await fetch(
          `${process.env.API}/admin/listing-schedules/${form._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(`${process.env.API}/admin/listing-schedules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to save");
      if (onSaved) onSaved(data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form._id ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          select
          label="Day"
          fullWidth
          value={form.day}
          onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
          sx={{ mb: 2 }}
        >
          {DAYS.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start time"
          type="time"
          fullWidth
          value={form.start_time}
          onChange={(e) =>
            setForm((f) => ({ ...f, start_time: e.target.value }))
          }
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="End time"
          type="time"
          fullWidth
          value={form.end_time}
          onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!!form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.checked }))
              }
            />
          }
          label={form.status ? "Active" : "Inactive"}
        />
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
          sx={{
            color: "white",
            backgroundColor: "#ff9a00",
            "&:hover": { backgroundColor: "#ff9a00" },
          }}
        >
          {saving
            ? form._id
              ? "Saving..."
              : "Creating..."
            : form._id
            ? "Save"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
