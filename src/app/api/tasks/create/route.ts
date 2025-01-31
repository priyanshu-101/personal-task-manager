import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";

export async function POST(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        const newTask = await db.insert(tasks)
            .values({
                title,
                description,
                status,
                priority,
                dueDate: parsedDueDate, 
                projectId,
                userId: user.userId
            })
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

        return NextResponse.json(newTask[0], { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Error creating task", details: error.message }, { status: 500 });
    }
}
