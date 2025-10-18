// slice/locationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single location by ID
export const fetchLocationById = createAsyncThunk(
  'locations/fetchLocationById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/locations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch location: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading location: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all locations (admin)
export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/locations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading locations: ${error.message}`);
      throw error;
    }
  }
);






// --- NEW: Fetch all locations (agent) ---
export const fetchAgentLocations = createAsyncThunk(
  "locations/fetchAgentLocations",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/agent/locations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agent locations: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading agent locations: ${error.message}`);
      throw error;
    }
  }
);



// Fetch locations for home page
export const fetchHomeLocations = createAsyncThunk(
  "locations/fetchHomeLocations",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/locations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading locations: ${error.message}`);
      throw error;
    }
  }
);

// Create new location
export const createLocation = createAsyncThunk(
  "locations/createLocation",
  async (locationData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create location: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Location created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating location: ${error.message}`);
      throw error;
    }
  }
);

// Update existing location
export const updateLocation = createAsyncThunk(
  "locations/updateLocation",
  async ({ id, locationData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/locations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update location: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Location updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating location: ${error.message}`);
      throw error;
    }
  }
);

// Delete location
export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/locations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete location: ${response.status}`);
      }
      toast.success("Location deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting location: ${error.message}`);
      throw error;
    }
  }
);

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeLocations: [], // Separate list for home page locations

    agentLocations: [], // NEW: locations visible to agents
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Location
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Locations
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Locations
      .addCase(fetchHomeLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.homeLocations = action.payload;
      })
      .addCase(fetchHomeLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Location
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Location
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((l) => l._id !== action.payload);
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Location
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the location in the list
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


        // --- NEW: Fetch Agent Locations reducers ---
      .addCase(fetchAgentLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.agentLocations = action.payload;
      })
      .addCase(fetchAgentLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default locationSlice.reducer;