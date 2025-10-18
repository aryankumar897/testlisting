"use client";

import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from "@/slice/categorySlice";
import locationReducer from "@/slice/locationSlice";
import amenitiesReducer from "@/slice/amenitySlice";
import listingReducer from "@/slice/listingSlice"; // ✅ import your new slice
import agentlistingReducer from "@/slice/agentlistingSlice";

import packageReducer from "@/slice/packageSlice"; // ✅ Import your new slice

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    locations: locationReducer,
    amenities: amenitiesReducer,
    listings: listingReducer,
    agentlistings: agentlistingReducer,
    packages: packageReducer, // ✅ Add it here
  },
});
