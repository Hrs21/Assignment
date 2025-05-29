import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Book Library Management System</h1>
        <p className="text-lg text-muted-foreground">
          A complete system for managing books, users, and borrowing records.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
