import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    const projectId = id;

    if (!id || typeof projectId !== 'string') {
        return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
    }

    try {
        const deletedProject = await db.delete(projects)
            .where(eq(projects.id, projectId))
            .returning({ id: projects.id, name: projects.name, description: projects.description });

        if (deletedProject.length === 0) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(deletedProject[0], { status: 200 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ 
            error: "Error deleting project", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}