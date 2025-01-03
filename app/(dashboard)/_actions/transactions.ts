"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);
  const user = await currentUser();

  if (!user) redirect("sign-in");

  const { amount, category, date, type, description } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) throw new Error("category not found");

  // NOTE: dont make confustion between $transaction (prsima) and prisma.transction (table)

  await prisma.$transaction([
    // Create user transction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
    // update aggregate monthy income/expense
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          userId: user.id,
        },
      },
      create: {
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: categoryRow.type === "expense" ? amount : 0,
        income: categoryRow.type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: categoryRow.type === "expense" ? amount : 0,
        },

        income: {
          increment: categoryRow.type === "income" ? amount : 0,
        },
      },
    }),
    // update aggregate yearly income/expense
    prisma.yearHistory.upsert({
      where: {
        userId_year_month: {
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          userId: user.id,
        },
      },
      create: {
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: categoryRow.type === "expense" ? amount : 0,
        income: categoryRow.type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: categoryRow.type === "expense" ? amount : 0,
        },

        income: {
          increment: categoryRow.type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
