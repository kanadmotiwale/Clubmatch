import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, major, year, bio, interests, joinedClubs } = req.body;
    if (!name || !email || !major || !year) {
      return res.status(400).json({ error: "Name, email, major and year are required" });
    }
    const existing = await db.collection("users").findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const user = {
      name,
      email,
      major,
      year,
      bio: bio || "",
      interests: interests || [],
      joinedClubs: joinedClubs || [],
      createdAt: new Date(),
    };
    const result = await db.collection("users").insertOne(user);
    res.status(201).json({ ...user, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const filter = {};
    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };
    if (req.query.interest) filter.interests = req.query.interest;
    const users = await db.collection("users").find(filter).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, major, year, bio, interests, joinedClubs } = req.body;
    const updates = {
      $set: {
        name,
        email,
        major,
        year,
        bio: bio || "",
        interests: interests || [],
        joinedClubs: joinedClubs || [],
        updatedAt: new Date(),
      },
    };
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      updates,
      { returnDocument: "after" }
    );
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
