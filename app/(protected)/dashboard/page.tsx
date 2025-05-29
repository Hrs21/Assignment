import { BookList } from "@/components/book-list"

export default async function DashboardPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Available Books</h1>
      <BookList />
    </div>
  )
}
