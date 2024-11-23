import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_common/create-transaction-dialog";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/wizard");
  }
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">
            Hello {user.firstName} {user.lastName}! 👋🏻
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700"
                >
                  New income🤑
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
                >
                  New expense🤬
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
