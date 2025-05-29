export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: "admin" | "user"
          created_at: string
        }
        Insert: {
          id: string
          name: string
          role?: "admin" | "user"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: "admin" | "user"
          created_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          genre: string
          total_copies: number
          available_copies: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          genre: string
          total_copies: number
          available_copies: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          genre?: string
          total_copies?: number
          available_copies?: number
          created_at?: string
          updated_at?: string
        }
      }
      borrows: {
        Row: {
          id: string
          user_id: string
          book_id: string
          borrow_date: string
          return_date: string | null
          status: "borrowed" | "returned"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          borrow_date?: string
          return_date?: string | null
          status?: "borrowed" | "returned"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          borrow_date?: string
          return_date?: string | null
          status?: "borrowed" | "returned"
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Book = Database["public"]["Tables"]["books"]["Row"]
export type Borrow = Database["public"]["Tables"]["borrows"]["Row"]
