
"use client"

import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";
import  Orders from "@/components/dashboard/agent/orders/Orders"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Orders/>
    </VerticalTabs>
  );
}