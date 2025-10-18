"use client";
import ListingGallery from "@/components/dashboard/agent/listing/gallery/ListingGallery";

// In your page component
import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

export default function ListingGallerys() {
  return (
    <VerticalTabs>
      <ListingGallery />
    </VerticalTabs>
  );
}
