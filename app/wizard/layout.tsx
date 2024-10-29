import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full max-w-full flex-col justify-center px-4">
      {children}
    </div>
  );
}
