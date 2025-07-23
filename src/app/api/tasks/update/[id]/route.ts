import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../../middleware/authmiddleware";
import { eq, and } from "drizzle-orm";

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authMiddleware(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a NextResponse (error response)
  if (user instanceof NextResponse) {
    return user;
  }

  const { id } = await params;
  const taskId = id;
  console.log("Update request for task ID:", taskId);
  console.log("User ID:", (user as JwtPayload).userId);

  if (!id || typeof taskId !== 'string') {
    return NextResponse.json({ error: "Invalid Task ID" }, { status: 400 });
  }

  const { title, description, status, priority, dueDate, projectId } = await req.json();
  if (typeof title === 'undefined' || typeof projectId === 'undefined') {
    return NextResponse.json({ error: "Title and Project ID are required" }, { status: 400 });
  }

  let parsedDueDate = null;
  if (dueDate) {
    parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json({ error: "Invalid due date format" }, { status: 400 });
    }
  }

  try {
    const existingTask = await db.select()
      .from(tasks)
      .where(
        and(
          eq(tasks.id, taskId),
        )
      );

    console.log("Existing task:", existingTask);

    if (!existingTask || existingTask.length === 0) {
      return NextResponse.json(
        { error: "Task not found or does not belong to the user" }, 
        { status: 404 }
      );
    }
    const updatedTask = await db.update(tasks)
      .set({
        title,
        description,
        status,
        priority,
        dueDate: parsedDueDate,
        projectId,

      })
      .where(
        and(
          eq(tasks.id, taskId)
        )
      )
      .returning({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        projectId: tasks.projectId,
      });

    console.log("Updated task:", updatedTask);

    if (!updatedTask || updatedTask.length === 0) {
      return NextResponse.json(
        { error: "Failed to update task" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTask[0], { status: 200 });

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { 
        error: "Error updating task", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined 
      }, 
      { status: 500 }
    );
  }
}
