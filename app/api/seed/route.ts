import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Book from "@/models/Book"

export async function GET() {
  try {
    await dbConnect()

    // Create admin user
    const adminUser = await User.findOne({ email: "admin@example.com" })

    if (!adminUser) {
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      })
    }

    // Create sample books
    const books = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        totalCopies: 5,
        availableCopies: 5,
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        totalCopies: 3,
        availableCopies: 3,
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        totalCopies: 4,
        availableCopies: 4,
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        totalCopies: 2,
        availableCopies: 2,
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        totalCopies: 6,
        availableCopies: 6,
      },
    ]

    // Only add books if they don't exist
    for (const bookData of books) {
      const existingBook = await Book.findOne({ title: bookData.title })
      if (!existingBook) {
        await Book.create(bookData)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Seed data created successfully",
      adminEmail: "admin@example.com",
      adminPassword: "admin123",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to seed data" }, { status: 500 })
  }
}
