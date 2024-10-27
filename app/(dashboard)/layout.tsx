import Navbar from "@/components/ui/navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full flex-col">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}
