"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const isAdmin = session?.user?.role === "admin"

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return result
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
}
