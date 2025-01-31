import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("User ID:", user.userId);

        const allProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, user.userId))
            .orderBy(desc(projects.id)); // Fixed orderBy

        return NextResponse.json(allProjects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Error fetching projects", details: error.message }, { status: 500 });
    }
}
