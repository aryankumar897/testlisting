"use client";
import VideoGallery from "@/components/dashboard/agent/listing/video/VideoGallery";

// In your page component
import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

export default function VideoGallerys() {
  return (
    <VerticalTabs>
      <VideoGallery />
    </VerticalTabs>
  );
}
