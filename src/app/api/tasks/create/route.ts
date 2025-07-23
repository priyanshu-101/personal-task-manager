import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";
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

function parseFormattedDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const cleanDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const parsedDate = new Date(cleanDateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
}
function formatDate(date: Date | null): string | null {
    if (!date) return null;

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 < 4 && Math.floor(day / 10) !== 1) ? day % 10 : 0];

    return formattedDate.replace(/\d+/, `${day}${suffix}`);
}

export async function POST(req: NextRequest) {
    const user = await authMiddleware(req);
    if (!user) {
        return createCorsResponse({ error: "Unauthorized" }, 401);
    }

    // Check if user is a NextResponse (error response) - now it's a Response with CORS
    if (user instanceof Response) {
        return user;
    }

    const { title, description, status, priority, dueDate, projectId } = await req.json();
    if (!title || !projectId) {
        return createCorsResponse({ error: "Title and Project ID are required" }, 400);
    }

    const parsedDueDate = parseFormattedDate(dueDate);
    if (dueDate && !parsedDueDate) {
        return createCorsResponse({ error: "Invalid due date format" }, 400);
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
                userId: (user as JwtPayload).userId
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

        const taskWithFormattedDate = {
            ...newTask[0],
            dueDate: newTask[0].dueDate ? formatDate(new Date(newTask[0].dueDate)) : null
        };

        return createCorsResponse(taskWithFormattedDate, 201);
    } catch (error) {
        console.error("Error creating task:", error);
        return createCorsResponse({ 
            error: "Error creating task", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, 500);
    }
}
