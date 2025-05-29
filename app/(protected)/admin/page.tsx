import { AdminBookList } from "@/components/admin-book-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </Link>
        </Button>
      </div>
      <AdminBookList />
    </div>
  )
}
