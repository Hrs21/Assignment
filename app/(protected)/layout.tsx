import type React from "react"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
