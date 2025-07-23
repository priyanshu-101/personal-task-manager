import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../../middleware/authmiddleware"; 
import { eq } from "drizzle-orm";
import { createCorsResponse, optionsResponse } from "@/lib/cors";

export async function OPTIONS() {
    return optionsResponse();
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return createCorsResponse({ error: "Unauthorized" }, 401);
        }
        const { id } = await params;
        const taskId = id;

        if (!id || typeof taskId !== 'string') {
            return createCorsResponse({ error: "Invalid Task ID" }, 400);
        }

        const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

        if (task.length === 0) {
            return createCorsResponse({ error: "Task not found" }, 404);
        }

        await db.delete(tasks).where(eq(tasks.id, taskId));

        return createCorsResponse({ message: "Task deleted successfully" }, 200);

    } catch (error) {
        console.error("Error deleting category:", error);

        return createCorsResponse({ 
            error: "Internal Server Error", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, 500);
    }
}
