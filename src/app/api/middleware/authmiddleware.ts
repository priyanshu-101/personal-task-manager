import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
  }
}
