"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Book {
  _id: string
  title: string
  author: string
  genre: string
}

interface Borrow {
  _id: string
  userId: string
  bookId: Book
  borrowDate: string
  returnDate: string | null
  status: "borrowed" | "returned"
}

export function BorrowedBooks() {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [returningId, setReturningId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await fetch("/api/user/borrows")
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books")
        }
        const data = await response.json()
        setBorrows(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch borrowed books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrows()
  }, [toast])

  const handleReturn = async (borrowId: string) => {
    try {
      setReturningId(borrowId)

      const response = await fetch(`/api/borrows/${borrowId}`, {
        method: "PUT",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to return book")
      }

      toast({
        title: "Success",
        description: "Book returned successfully",
      })

      // Remove the returned book from the list
      setBorrows(borrows.filter((borrow) => borrow._id !== borrowId))

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setReturningId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading borrowed books...</p>
      </div>
    )
  }

  if (borrows.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">You haven&apos;t borrowed any books yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {borrows.map((borrow) => (
        <Card key={borrow._id}>
          <CardHeader>
            <CardTitle>{borrow.bookId.title}</CardTitle>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{borrow.bookId.author}</span>
              <Badge>{borrow.bookId.genre}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Borrowed on:</span>
                <span>{format(new Date(borrow.borrowDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleReturn(borrow._id)} disabled={returningId === borrow._id} className="w-full">
              {returningId === borrow._id ? "Returning..." : "Return Book"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
