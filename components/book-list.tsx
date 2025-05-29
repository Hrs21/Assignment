"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Book {
  _id: string
  title: string
  author: string
  genre: string
  totalCopies: number
  availableCopies: number
}

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [borrowingId, setBorrowingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }
        const data = await response.json()
        setBooks(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [toast])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBorrow = async (bookId: string) => {
    try {
      setBorrowingId(bookId)

      const response = await fetch("/api/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to borrow book")
      }

      toast({
        title: "Success",
        description: "Book borrowed successfully",
      })

      // Update the book in the local state
      setBooks(
        books.map((book) => (book._id === bookId ? { ...book, availableCopies: book.availableCopies - 1 } : book)),
      )

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book",
        variant: "destructive",
      })
    } finally {
      setBorrowingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book._id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{book.author}</span>
                  <Badge>{book.genre}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total copies:</span>
                    <span>{book.totalCopies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span>{book.availableCopies}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBorrow(book._id)}
                  disabled={book.availableCopies <= 0 || borrowingId === book._id}
                  className="w-full"
                >
                  {borrowingId === book._id ? "Borrowing..." : book.availableCopies > 0 ? "Borrow" : "Not Available"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
