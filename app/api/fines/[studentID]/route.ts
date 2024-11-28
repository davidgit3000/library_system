import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAllFinesByStudentID } from "@prisma/client/sql";

export async function GET(
  request: Request,
  { params }: { params: { studentID: string } }
) {
  const { studentID } = params;

  try {
    const fines = await db.$queryRawTyped(getAllFinesByStudentID(studentID));
    console.log(fines);

    if (!fines) {
      return NextResponse.json({ message: "No fines found" }, { status: 401 });
    }

    const response = NextResponse.json(
      {
        message: "Fetching fines successfully",
        fines,
      },
      { status: 200 }
    );

    // Add Cache-Control header to the response
    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("[ROUTE_FINE_GET] Error fetching fine data:", error);
    return NextResponse.json(
      { error: "Failed to fetch fine data" },
      { status: 500 }
    );
  }
}