import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json(); 

    const cookieStore = await cookies();
    cookieStore.delete('token');

    console.log(`User ${email} logged out successfully`);

    return NextResponse.json(
      { message: `User ${email} logged out successfully` }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
