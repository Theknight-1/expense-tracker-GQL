import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    passowrd: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
