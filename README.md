# Book Library Management System

A complete book library management system built with Next.js, MongoDB, and JWT authentication.

## Features

- **User Authentication**: JWT-based authentication with NextAuth.js
- **Role-based Access Control**: Admin and User roles with different permissions
- **Book Management**: CRUD operations for books (Admin only)
- **Borrowing System**: Users can borrow and return books
- **Inventory Tracking**: Automatic tracking of available copies
- **Search Functionality**: Search books by title, author, or genre
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React

## Database Schema

### User Model
\`\`\`javascript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  role: String (enum: ["admin", "user"], default: "user")
  createdAt: Date
}
\`\`\`

### Book Model
\`\`\`javascript
{
  title: String (required)
  author: String (required)
  genre: String (required)
  totalCopies: Number (required, min: 0)
  availableCopies: Number (required, min: 0)
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Borrow Model
\`\`\`javascript
{
  userId: ObjectId (ref: User, required)
  bookId: ObjectId (ref: Book, required)
  borrowDate: Date (default: now)
  returnDate: Date (nullable)
  status: String (enum: ["borrowed", "returned"], default: "borrowed")
  createdAt: Date
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/register` - User registration

### Books
- `GET /api/books` - Get all books
- `GET /api/books/[id]` - Get specific book
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/[id]` - Update book (Admin only)
- `DELETE /api/books/[id]` - Delete book (Admin only)

### Borrows
- `GET /api/borrows` - Get all borrows (Admin) or user's borrows
- `POST /api/borrows` - Borrow a book
- `PUT /api/borrows/[id]` - Return a book
- `GET /api/user/borrows` - Get current user's borrowed books

### Utilities
- `GET /api/seed` - Seed database with sample data

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd book-library-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

4. **Seed the database**
   Visit `http://localhost:3000/api/seed` to create an admin user and sample books.

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Credentials

After running the seed script:
- **Email**: admin@example.com
- **Password**: admin123

## User Roles

### Admin
- Add, edit, and delete books
- View all books and their availability
- Access admin dashboard
- All user permissions

### User
- Browse available books
- Borrow available books
- Return borrowed books
- View personal borrowed books list
- Search books by title, author, or genre

## Business Rules

1. **Book Borrowing**:
   - Users cannot borrow the same book twice without returning it first
   - Books can only be borrowed if copies are available
   - Available copies are automatically decremented when borrowed

2. **Book Returning**:
   - Only the user who borrowed a book can return it
   - Available copies are automatically incremented when returned
   - Return date is automatically recorded

3. **Inventory Management**:
   - Total copies and available copies are tracked separately
   - Available copies cannot exceed total copies
   - When total copies are reduced, available copies are adjusted accordingly

## Deployment

The application can be deployed on Vercel, Netlify, or any platform that supports Next.js.

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set environment variables** on your deployment platform

3. **Deploy** using your preferred method

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`

Let's also create a proper TypeScript configuration:
