import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};

export default connectDB;