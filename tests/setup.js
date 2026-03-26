import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../src/config/db.js";

let mongo;

beforeAll(async () => {
  dotenv.config({ path: ".env.test" });

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test_secret";
  }

  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri("taskmanager_test");

  await connectDB();
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } finally {
    if (mongo) {
      await mongo.stop();
    }
  }
});