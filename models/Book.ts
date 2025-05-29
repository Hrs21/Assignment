import mongoose, { Schema, type Document } from "mongoose"

export interface IBook extends Document {
  title: string
  author: string
  genre: string
  totalCopies: number
  availableCopies: number
  createdAt: Date
  updatedAt: Date
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  totalCopies: { type: Number, required: true, min: 0 },
  availableCopies: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema)
