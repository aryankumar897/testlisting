"use client";
import Schedule from "@/components/dashboard/agent/listing/schedule/Schedule";

// In your page component
import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

export default function CreateSchedule() {
  return (
    <VerticalTabs>
      <Schedule />
    </VerticalTabs>
  );
}
