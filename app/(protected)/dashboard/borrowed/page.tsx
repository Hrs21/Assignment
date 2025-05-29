import { BorrowedBooks } from "@/components/borrowed-books"

export default async function BorrowedBooksPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Borrowed Books</h1>
      <BorrowedBooks />
    </div>
  )
}
