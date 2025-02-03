import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(), 
      })
      .where(eq(users.email, email))
      .returning();

    const userResponse = {
      ...updatedUser[0],
      password: undefined
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    );
  }
}