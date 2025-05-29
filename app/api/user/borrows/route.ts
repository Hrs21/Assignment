import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Borrow from "@/models/Borrow"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const borrows = await Borrow.find({
      userId: user.id,
      status: "borrowed",
    })
      .populate("bookId")
      .sort({ borrowDate: -1 })

    return NextResponse.json(borrows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch borrows" }, { status: 500 })
  }
}
