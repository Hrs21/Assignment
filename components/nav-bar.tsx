"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, User, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function NavBar() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6" />
          <span className="text-lg font-bold">Book Library</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Browse Books</Button>
              </Link>
              <Link href="/dashboard/borrowed">
                <Button variant="ghost">My Borrowed Books</Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost">Admin Dashboard</Button>
                </Link>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Browse Books</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/borrowed">My Borrowed Books</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="w-5 h-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user.name || "User"}
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
