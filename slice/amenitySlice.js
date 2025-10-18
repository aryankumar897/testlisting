// slice/amenitiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single amenity by ID
export const fetchAmenityById = createAsyncThunk(
  "amenities/fetchAmenityById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/amenities/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch amenity: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading amenity: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all amenities (admin)
export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/amenities`);
      if (!response.ok) {
        throw new Error(`Failed to fetch amenities: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading amenities: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all amenities (agent)
export const fetchAgentAmenities = createAsyncThunk(
  "amenities/fetchAgentAmenities",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/agent/amenities`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agent amenities: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading agent amenities: ${error.message}`);
      throw error;
    }
  }
);

// Fetch amenities for home page
export const fetchHomeAmenities = createAsyncThunk(
  "amenities/fetchHomeAmenities",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/amenities`);
      if (!response.ok) {
        throw new Error(`Failed to fetch amenities: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading amenities: ${error.message}`);
      throw error;
    }
  }
);

// Create new amenity
export const createAmenity = createAsyncThunk(
  "amenities/createAmenity",
  async (amenityData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/amenities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(amenityData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create amenity: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Amenity created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating amenity: ${error.message}`);
      throw error;
    }
  }
);

// Update existing amenity
export const updateAmenity = createAsyncThunk(
  "amenities/updateAmenity",
  async ({ id, amenityData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/amenities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(amenityData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update amenity: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Amenity updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating amenity: ${error.message}`);
      throw error;
    }
  }
);

// Delete amenity
export const deleteAmenity = createAsyncThunk(
  "amenities/deleteAmenity",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/amenities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete amenity: ${response.status}`);
      }
      toast.success("Amenity deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting amenity: ${error.message}`);
      throw error;
    }
  }
);

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeAmenities: [], // Separate list for home page amenities
    agentAmenities: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Amenity
      .addCase(createAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Amenities
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Amenities
      .addCase(fetchHomeAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.homeAmenities = action.payload;
      })
      .addCase(fetchHomeAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Amenity
      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAmenity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Amenity
      .addCase(deleteAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Amenity
      .addCase(fetchAmenityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenityById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the amenity in the list
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchAmenityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAgentAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.agentAmenities = action.payload;
      })
      .addCase(fetchAgentAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default amenitiesSlice.reducer;
