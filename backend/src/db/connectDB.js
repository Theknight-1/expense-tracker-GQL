import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    return;
  } catch (error) {
    console.log("Error connecting with Database", error);
  }
};
