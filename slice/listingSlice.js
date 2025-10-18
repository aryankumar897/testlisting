// slice/listingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single listing by ID
export const fetchListingById = createAsyncThunk(
  "listings/fetchListingById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/listings/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch listing: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading listing: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all listings (admin)
export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/listings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading listings: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all Pending listings (admin)
export const fetchPendingListings = createAsyncThunk(
  "listings/fetchPendingListings",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/listing-pending`);
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading listings: ${error.message}`);
      throw error;
    }
  }
);

// Fetch listings for home page
export const fetchHomeListings = createAsyncThunk(
  "listings/fetchHomeListings",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/listings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading listings: ${error.message}`);
      throw error;
    }
  }
);

// Create new listing
export const createListing = createAsyncThunk(
  "listings/createListing",
  async (listingData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create listing: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Listing created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating listing: ${error.message}`);
      throw error;
    }
  }
);

// Update existing listing
export const updateListing = createAsyncThunk(
  "listings/updateListing",
  async ({ id, listingData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update listing: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Listing updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating listing: ${error.message}`);
      throw error;
    }
  }
);

// Delete listing
export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/listings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete listing: ${response.status}`);
      }
      toast.success("Listing deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting listing: ${error.message}`);
      throw error;
    }
  }
);

export const fetchListingsBySlug = createAsyncThunk(
  "listings/fetchListingsBySlug",
  async (slug) => {
    try {
      const response = await fetch(`${process.env.API}/get-listings/${slug}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch listings for slug "${slug}": ${response.status}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(`Error loading listings for "${slug}": ${error.message}`);
      throw error;
    }
  }
);

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    list: [],
    homeListings: [],
    listingsBySlug: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Listing
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Listings
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch  Pending Listings
      .addCase(fetchPendingListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingListings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPendingListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Listings
      .addCase(fetchHomeListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeListings.fulfilled, (state, action) => {
        state.loading = false;
        state.homeListings = action.payload;
      })
      .addCase(fetchHomeListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Listing
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Listing
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((l) => l._id !== action.payload);
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Listing
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // In your slice - listingsBySlug for user
      .addCase(fetchListingsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.listingsBySlug = action.payload;
      })
      .addCase(fetchListingsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default listingSlice.reducer;
