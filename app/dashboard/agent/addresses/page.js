
"use client"

import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";


import  Address from "@/components/dashboard/agent/address/AddressList"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Address/>
    </VerticalTabs>
  );
}