import mongoose, { type Document, Schema } from "mongoose"

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId
  date: Date
  description: string
  amount: number
  category: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [100, "Description cannot be more than 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Income",
        "Housing",
        "Food",
        "Transportation",
        "Utilities",
        "Entertainment",
        "Shopping",
        "Healthcare",
        "Other",
      ],
    },
  },
  { timestamps: true },
)

export default mongoose.model<ITransaction>("Transaction", TransactionSchema)

