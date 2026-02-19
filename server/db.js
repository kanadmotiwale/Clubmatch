import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("clubmatch");
  console.log("Connected to MongoDB");
}

function getDB() {
  return db;
}

export { connectDB, getDB };
