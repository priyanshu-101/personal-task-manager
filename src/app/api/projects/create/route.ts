import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { authMiddleware } from "../../middleware/authmiddleware";

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: NextRequest){
    const user = await authMiddleware(req);
    console.log(user);
    if(!user){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Check if user is a NextResponse (error response)
    if (user instanceof NextResponse) {
        return user;
    }

    const {name, description} = await req.json();
    if(!name){
        return NextResponse.json({error: "Name is required"}, {status: 400});
    }

    try{
        const newProject = await db.insert(projects).values({
            name,
            description,
            userId: (user as JwtPayload).userId,
        }).returning();

        return NextResponse.json(newProject[0], {status: 201});
    } catch (error){
        console.error("Error creating project:", error);
        return NextResponse.json({error: "Error creating project"}, {status: 500});
    }
}