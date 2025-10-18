// ListingScheduleManager.jsx
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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ScheduleForm from "./ScheduleForm";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { normalizeTo24 } from "./timeHelpers";

const ListingScheduleManager = () => {
  const { id } = useParams();
  const router = useRouter();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form/dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${process.env.API}/admin/listing-schedules?listing_id=${id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to fetch schedules");
      setSchedules(data);
    } catch (err) {
      setError(err.message || "Failed to load schedules");
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdd = () => {
    setFormInitial(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormInitial({
      ...item,
      start_time: normalizeTo24(item.start_time || ""),
      end_time: normalizeTo24(item.end_time || ""),
    });
    setFormOpen(true);
  };

  const handleSaved = () => {
    fetchSchedules();
  };

  const openDeleteConfirm = (_id) => {
    setToDeleteId(_id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return setDeleteOpen(false);
    try {
      const res = await fetch(
        `${process.env.API}/admin/listing-schedules/${toDeleteId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Failed to delete");
      toast.success("Schedule deleted");
      fetchSchedules();
    } catch (err) {
      toast.error("Failed to delete schedule");
      setError(err.message || "Failed to delete schedule");
    } finally {
      setDeleteOpen(false);
      setToDeleteId(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ color: "yellow" }}>
          Listing Schedules
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "#ff9a00", mr: 2 }}
            onClick={handleAdd}
            startIcon={<Add />}
          >
            Add Schedule
          </Button>
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "#6c757d" }}
            onClick={() => router.push(`/dashboard/admin/listing/edit/${id}`)}
          >
            Back to Listing
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={80} sx={{ color: "yellow" }} />
          </Box>
        </>
      ) : schedules.length === 0 ? (
        <Typography   sx={{ color: "yellow" }}    >No schedules created yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {schedules.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  boxShadow: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.day}
                  </Typography>
                  <Typography>
                    {item.start_time} — {item.end_time}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "gray", mt: 1 }}>
                    Created:{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "—"}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}
                >
                  <FormControlLabel
                    control={<Switch checked={!!item.status} />}
                    label={item.status ? "Active" : "Inactive"}
                  />

                  <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      size="small"
                      title="Edit"
                    color="secondary"

                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteConfirm(item._id)}
                      size="small"
                      title="Delete"
                        sx={{  color: "error.main" }}
                                     
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <ScheduleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={formInitial}
        listingId={id}
        onSaved={handleSaved}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule?"
      />
    </Box>
  );
};

export default ListingScheduleManager;
