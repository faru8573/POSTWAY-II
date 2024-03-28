import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Mongodb is connected using Mongoose");
  } catch (error) {
    console.log("Error while connecting to db");
    console.log(error);
  }
};
