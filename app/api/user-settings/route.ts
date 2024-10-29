import Prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await Prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await Prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "IDR",
      },
    });
  }

  //revalidate the home page that uses the user currency
  revalidatePath("/");
  return Response.json(userSettings);
}
