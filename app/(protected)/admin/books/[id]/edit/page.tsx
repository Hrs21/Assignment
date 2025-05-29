"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Book {
  _id: string
  title: string
  author: string
  genre: string
  totalCopies: number
  availableCopies: number
}

export default function EditBookPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [totalCopies, setTotalCopies] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch book")
        }

        const data = await response.json()
        setBook(data)
        setTitle(data.title)
        setAuthor(data.author)
        setGenre(data.genre)
        setTotalCopies(data.totalCopies)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch book",
          variant: "destructive",
        })
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!book) return

      const response = await fetch(`/api/books/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          totalCopies,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update book")
      }

      toast({
        title: "Success",
        description: "Book updated successfully",
      })

      router.push("/admin")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update book",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Book</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number.parseInt(e.target.value))}
                required
              />
            </div>
            {book && (
              <div className="pt-2 text-sm text-muted-foreground">
                <p>Current available copies: {book.availableCopies}</p>
                <p>
                  {totalCopies > book.totalCopies
                    ? `Adding ${totalCopies - book.totalCopies} copies will increase available copies.`
                    : totalCopies < book.totalCopies
                      ? `Removing ${book.totalCopies - totalCopies} copies may decrease available copies if they exist.`
                      : ""}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
