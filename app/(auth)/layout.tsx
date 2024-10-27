import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center">
      <div className="mt-12">{children}</div>
    </div>
  );
}
