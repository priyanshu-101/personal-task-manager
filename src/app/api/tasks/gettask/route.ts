import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq, desc } from "drizzle-orm";

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a NextResponse (error response)
    if (user instanceof NextResponse) {
        return user;
    }

    try {
        console.log("User ID:", (user as JwtPayload).userId);

        const allTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.userId, (user as JwtPayload).userId))
            .orderBy(desc(tasks.id)); 

        return NextResponse.json(allTasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ 
            error: "Error fetching tasks", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}