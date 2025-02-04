import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../../middleware/authmiddleware"; 
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = params;
        const taskId = Number(id);

        if (!id || isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid Task ID" }, { status: 400 });
        }

        const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

        if (task.length === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const deletedTaskCount = await db.delete(tasks).where(eq(tasks.id, taskId));

        if (deletedTaskCount === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting category:", error);

        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}
