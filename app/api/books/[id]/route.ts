import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Book from "@/models/Book"
import { getCurrentUser } from "@/lib/session"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const book = await Book.findById(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, author, genre, totalCopies } = await request.json()

    if (!title || !author || !genre || totalCopies === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const book = await Book.findById(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Calculate the difference in total copies
    const copiesDifference = totalCopies - book.totalCopies

    // Calculate new available copies
    const newAvailableCopies = Math.max(0, book.availableCopies + copiesDifference)

    const updatedBook = await Book.findByIdAndUpdate(
      params.id,
      {
        title,
        author,
        genre,
        totalCopies,
        availableCopies: newAvailableCopies,
        updatedAt: new Date(),
      },
      { new: true },
    )

    return NextResponse.json(updatedBook)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const book = await Book.findByIdAndDelete(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete book" }, { status: 500 })
  }
}
