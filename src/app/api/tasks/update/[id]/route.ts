import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../../middleware/authmiddleware";
import { eq, and } from "drizzle-orm";
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authMiddleware(req);
  if (!user) {
    return createCorsResponse({ error: "Unauthorized" }, 401);
  }

  // Check if user is a Response (error response) - now with CORS
  if (user instanceof Response) {
    return user;
  }

  const { id } = await params;
  const taskId = id;
  console.log("Update request for task ID:", taskId);
  console.log("User ID:", (user as JwtPayload).userId);

  if (!id || typeof taskId !== 'string') {
    return createCorsResponse({ error: "Invalid Task ID" }, 400);
  }

  const { title, description, status, priority, dueDate, projectId } = await req.json();
  if (typeof title === 'undefined' || typeof projectId === 'undefined') {
    return createCorsResponse({ error: "Title and Project ID are required" }, 400);
  }

  let parsedDueDate = null;
  if (dueDate) {
    parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return createCorsResponse({ error: "Invalid due date format" }, 400);
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
      return createCorsResponse(
        { error: "Task not found or does not belong to the user" }, 
        404
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
      return createCorsResponse(
        { error: "Failed to update task" }, 
        500
      );
    }

    return createCorsResponse(updatedTask[0], 200);

  } catch (error) {
    console.error("Error updating task:", error);
    return createCorsResponse(
      { 
        error: "Error updating task", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined 
      }, 
      500
    );
  }
}
