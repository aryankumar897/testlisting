"use client";

import VerticalTabs from "@/components/dashboard/agent/VerticalTabs";

import   Message  from "@/components/dashboard/agent/message/Message";
export default function Home() {
  return (
    <VerticalTabs>
      <Message/>
    </VerticalTabs>
  );
}
