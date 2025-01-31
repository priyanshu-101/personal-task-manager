import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description } = await req.json();
    const projectId = Number(id);

    if (!id || isNaN(projectId)) {
        return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
    }

    try {
        const updatedProject = await db.update(projects)
            .set({ name, description })
            .where(eq(projects.id, projectId))
            .returning({ id: projects.id, name: projects.name, description: projects.description });

        if (updatedProject.length === 0) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProject[0], { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Error updating project", details: error.message }, { status: 500 });
    }
}
