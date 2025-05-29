import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Borrow from "@/models/Borrow"
import Book from "@/models/Book"
import { getCurrentUser } from "@/lib/session"
import mongoose from "mongoose"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Find the borrow record
      const borrow = await Borrow.findById(params.id).session(session)

      if (!borrow) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "Borrow record not found" }, { status: 404 })
      }

      // Check if the user is the one who borrowed the book or is an admin
      if (borrow.userId.toString() !== user.id && user.role !== "admin") {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "You can only return books that you borrowed" }, { status: 403 })
      }

      // Check if the book is already returned
      if (borrow.status === "returned") {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "This book has already been returned" }, { status: 400 })
      }

      // Update the borrow record
      borrow.status = "returned"
      borrow.returnDate = new Date()
      await borrow.save({ session })

      // Increase available copies
      const book = await Book.findById(borrow.bookId).session(session)

      if (book) {
        book.availableCopies += 1
        await book.save({ session })
      }

      await session.commitTransaction()
      session.endSession()

      // Populate book details for response
      const populatedBorrow = await Borrow.findById(borrow._id).populate("bookId")

      return NextResponse.json(populatedBorrow)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to return book" }, { status: 500 })
  }
}
