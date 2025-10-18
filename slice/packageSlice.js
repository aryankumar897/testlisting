// slice/packageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single package by ID
export const fetchPackageById = createAsyncThunk(
  "packages/fetchPackageById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/packages/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch package: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading package: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all packages (admin)
export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/packages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading packages: ${error.message}`);
      throw error;
    }
  }
);

// // Fetch all packages (agent)
// export const fetchAgentPackages = createAsyncThunk(
//   "packages/fetchAgentPackages",
//   async () => {
//     try {
//       const response = await fetch(`${process.env.API}/agent/packages`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch agent packages: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       toast.error(`Error loading agent packages: ${error.message}`);
//       throw error;
//     }
//   }
// );

// Fetch packages for home / public listing
export const fetchHomePackages = createAsyncThunk(
  "packages/fetchHomePackages",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/packages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch home packages: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading packages: ${error.message}`);
      throw error;
    }
  }
);

// Create new package
export const createPackage = createAsyncThunk(
  "packages/createPackage",
  async (packageData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create package: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Package created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating package: ${error.message}`);
      throw error;
    }
  }
);

// Update existing package
export const updatePackage = createAsyncThunk(
  "packages/updatePackage",
  async ({ id, packageData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update package: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Package updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating package: ${error.message}`);
      throw error;
    }
  }
);

// Delete package
export const deletePackage = createAsyncThunk(
  "packages/deletePackage",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/packages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete package: ${response.status}`);
      }
      toast.success("Package deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting package: ${error.message}`);
      throw error;
    }
  }
);

// Fetch   checkout  package by ID
export const fetchCheckOutPackageById = createAsyncThunk(
  "packages/fetchCheckOutPackageById",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/agent/get-package/${id}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch package: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading package: ${error.message}`);
      throw error;
    }
  }
);

const packageSlice = createSlice({
  name: "packages",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homePackages: [], // packages for public/home display
    //agentPackages: [], // packages visible to agents

    checkOutlist: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Package
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Packages (admin)
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Packages (public)
      .addCase(fetchHomePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.homePackages = action.payload;
      })
      .addCase(fetchHomePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Package
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch    single checkout  Package (agent)
      .addCase(fetchCheckOutPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckOutPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.checkOutlist = action.payload;
      })
      .addCase(fetchCheckOutPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Fetch Agent

    // .addCase(fetchAgentPackages.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchAgentPackages.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.agentPackages = action.payload;
    // })
    // .addCase(fetchAgentPackages.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });
  },
});

export default packageSlice.reducer;
