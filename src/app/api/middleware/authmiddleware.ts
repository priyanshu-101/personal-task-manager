import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { createCorsResponse } from "@/lib/cors";

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) return createCorsResponse({ error: "Unauthorized" }, 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return createCorsResponse({ error: "Invalid Token" }, 403);
  }
}
