import mongoose, { Schema, type Document } from "mongoose"

export interface IBorrow extends Document {
  userId: mongoose.Types.ObjectId
  bookId: mongoose.Types.ObjectId
  borrowDate: Date
  returnDate: Date | null
  status: "borrowed" | "returned"
  createdAt: Date
}

const BorrowSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
  createdAt: { type: Date, default: Date.now },
})

// Create a compound index to prevent duplicate borrows
BorrowSchema.index({ userId: 1, bookId: 1, status: 1 }, { unique: true })

export default mongoose.models.Borrow || mongoose.model<IBorrow>("Borrow", BorrowSchema)
