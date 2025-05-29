import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Create a single supabase client for server components
const createServerClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}

// Browser client singleton
let browserClient: ReturnType<typeof createBrowserClient> | null = null

// Get the browser client (singleton pattern)
export const getBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Get the server client (always fresh)
export const getServerClient = () => {
  return createServerClient()
}
