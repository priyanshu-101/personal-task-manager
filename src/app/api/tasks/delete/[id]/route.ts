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
        const deletedTask = await db.delete(tasks)
            .where(eq(tasks.id, taskId))

        if (deletedTask.length === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully", task: deletedTask[0] }, { status: 200 });

    } catch (error: any) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
