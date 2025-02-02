import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("User ID:", user.userId);

        const allTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.userId, user.userId))
            .orderBy(desc(tasks.id)); 

        return NextResponse.json(allTasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Error fetching tasks", details: error.message }, { status: 500 });
    }
}