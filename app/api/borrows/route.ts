import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Borrow from "@/models/Borrow"
import Book from "@/models/Book"
import { getCurrentUser } from "@/lib/session"
import mongoose from "mongoose"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    let query = {}

    // If not admin, only show user's borrows
    if (user.role !== "admin") {
      query = { userId: user.id }
    }

    const borrows = await Borrow.find(query).populate("bookId").sort({ borrowDate: -1 })

    return NextResponse.json(borrows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch borrows" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookId } = await request.json()

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    await dbConnect()

    // Start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Check if user already has this book borrowed
      const existingBorrow = await Borrow.findOne({
        userId: user.id,
        bookId,
        status: "borrowed",
      }).session(session)

      if (existingBorrow) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "You have already borrowed this book" }, { status: 400 })
      }

      // Check if book has available copies
      const book = await Book.findById(bookId).session(session)

      if (!book) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
      }

      if (book.availableCopies <= 0) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: "No copies of this book are currently available" }, { status: 400 })
      }

      // Decrease available copies
      book.availableCopies -= 1
      await book.save({ session })

      // Create borrow record
      const borrow = new Borrow({
        userId: user.id,
        bookId,
        status: "borrowed",
      })

      await borrow.save({ session })

      await session.commitTransaction()
      session.endSession()

      // Populate book details for response
      const populatedBorrow = await Borrow.findById(borrow._id).populate("bookId")

      return NextResponse.json(populatedBorrow, { status: 201 })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to borrow book" }, { status: 500 })
  }
}
