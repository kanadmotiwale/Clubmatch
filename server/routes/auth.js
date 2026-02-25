import { Router } from "express";
import bcrypt from "bcrypt";
import { getDB } from "../db.js";

const router = Router();

// Shuold saperate controllers for each routes in separate files for better maintainability and readability.And also the db calls should be in a service layer and not directly in the route handlers for better separation of concerns and resuability.

//For instance, you could place the DB call to check whether the user exists or not in a service file and then call that service in the route handler. This way, you can reuse that service in both the routes for register as well as login.
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

// Could have used JWT tokens for authentication it provides better security and does not expose user data in the response
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
