import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    
    if (!user.length) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }
    
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" }, 
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
      { userId: user[0].id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" }
    );
    
    return NextResponse.json({ token, user: user[0] }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}