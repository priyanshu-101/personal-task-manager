import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../../middleware/authmiddleware";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const taskId = Number(id);

    if (!id || isNaN(taskId)) {
        return NextResponse.json({ error: "Invalid Task ID" }, { status: 400 });
    }

    const { title, description, status, priority, dueDate, projectId } = await req.json();

    if (!title || !projectId) {
        return NextResponse.json({ error: "Title and Project ID are required" }, { status: 400 });
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : null;
    if (dueDate && isNaN(parsedDueDate.getTime())) {
        return NextResponse.json({ error: "Invalid due date format" }, { status: 400 });
    }

    try {
        const updatedTask = await db.update(tasks)
            .set({
                title,
                description,
                status,
                priority,
                dueDate: parsedDueDate,
                projectId,
            })
            .where(eq(tasks.id, taskId))
            .returning({
                id: tasks.id,
                title: tasks.title,
                description: tasks.description,
                status: tasks.status,
                priority: tasks.priority,
                dueDate: tasks.dueDate,
                projectId: tasks.projectId,
                userId: tasks.userId,
            });

        if (updatedTask.length === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask[0], { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Error updating task", details: error.message }, { status: 500 });
    }
}
