import { Router } from "express";
import bcrypt from "bcrypt";
import { getDB } from "../db.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, major, year, bio, interests } = req.body;
    if (!name || !email || !password || !major || !year) {
      return res
        .status(400)
        .json({ error: "Name, email, password, major and year are required" });
    }
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ error: "An account with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      major,
      year,
      bio: bio || "",
      interests: interests || [],
      joinedClubs: [],
      createdAt: new Date(),
    };
    const result = await db.collection("users").insertOne(user);
    const { password: _, ...safeUser } = user;
    res.status(201).json({ ...safeUser, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "No account found with this email" });
    }
    if (!user.password) {
      return res.status(401).json({
        error:
          "This account was created without a password. Please register again.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
