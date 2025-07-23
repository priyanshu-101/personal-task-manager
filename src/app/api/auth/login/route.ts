import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { createCorsResponse, optionsResponse } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin || undefined);
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const { email, password } = await req.json();
    
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    
    if (!user.length) {
      return createCorsResponse(
        { error: "User not found" }, 
        404,
        origin || undefined
      );
    }
    
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return createCorsResponse(
        { error: "Invalid credentials" }, 
        401,
        origin || undefined
      );
    }
    
    const token = jwt.sign(
      { userId: user[0].id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" }
    );
    
    return createCorsResponse({ token, user: user[0] }, 200, origin || undefined);
  } catch (error) {
    console.error('Login error:', error);
    const origin = req.headers.get('origin');
    return createCorsResponse(
      { error: "Internal server error" }, 
      500,
      origin || undefined
    );
  }
}