import mongoose, { type Document, Schema } from "mongoose"

export interface ISavingsGoal extends Document {
  user: mongoose.Types.ObjectId
  name: string
  target: number
  current: number
  deadline: Date
  createdAt: Date
  updatedAt: Date
}

const SavingsGoalSchema = new Schema<ISavingsGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    target: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [0, "Target amount cannot be negative"],
    },
    current: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
  },
  { timestamps: true },
)

export default mongoose.model<ISavingsGoal>("SavingsGoal", SavingsGoalSchema)

