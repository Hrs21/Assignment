import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Book from "@/models/Book"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  try {
    await dbConnect()
    const books = await Book.find().sort({ title: 1 })
    return NextResponse.json(books)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const book = new Book({
      title,
      author,
      genre,
      totalCopies,
      availableCopies: totalCopies,
    })

    await book.save()

    return NextResponse.json(book, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create book" }, { status: 500 })
  }
}
