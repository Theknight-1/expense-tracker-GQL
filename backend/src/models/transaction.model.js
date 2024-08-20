import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    desciption: {
      type: String,
      required: true,
    },
    paymentTypes: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    category: {
      type: String,
      enum: ["saving", "expense", "invesment"],
    },
    ammount: {
      type: Number,
      required: true,
    },
    locaton: {
      type: String,
      default: "Unknown",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
