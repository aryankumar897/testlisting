
"use client"

import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";
import  Reservation from "@/components/dashboard/agent/reservation/Reservation"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Reservation/>
    </VerticalTabs>
  );
}