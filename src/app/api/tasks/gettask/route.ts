import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq, desc } from "drizzle-orm";
import { createCorsResponse, optionsResponse } from "@/lib/cors";

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function OPTIONS() {
    return optionsResponse();
}

export async function GET(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return createCorsResponse({ error: "Unauthorized" }, 401);
    }

    // Check if user is a Response (error response) - now with CORS
    if (user instanceof Response) {
        return user;
    }

    try {
        console.log("User ID:", (user as JwtPayload).userId);

        const allTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.userId, (user as JwtPayload).userId))
            .orderBy(desc(tasks.id)); 

        return createCorsResponse(allTasks, 200);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return createCorsResponse({ 
            error: "Error fetching tasks", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, 500);
    }
}