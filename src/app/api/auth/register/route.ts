import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { createCorsResponse, optionsResponse } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin || undefined);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const { email, password, name } = await req.json();
  
  if (!email || !password) {
    return createCorsResponse({ error: "Email and password are required" }, 400, origin || undefined);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    }).returning();

    return createCorsResponse(newUser[0], 201, origin || undefined);
  } catch (error) {
    console.error("Error inserting user:", error);
    return createCorsResponse({ error: "User already exists" }, 400, origin || undefined);
  }
}

