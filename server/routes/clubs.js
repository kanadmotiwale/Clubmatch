import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { name, category, description, weeklyTimeCommitment } = req.body;
    if (!name || !category || !description || !weeklyTimeCommitment) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const club = {
      name,
      category,
      description,
      weeklyTimeCommitment: Number(weeklyTimeCommitment),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("clubs").insertOne(club);
    res.status(201).json({ ...club, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create club" });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.maxTime)
      filter.weeklyTimeCommitment = { $lte: Number(req.query.maxTime) };
    const clubs = await db.collection("clubs").find(filter).toArray();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const club = await db
      .collection("clubs")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch club" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { name, category, description, weeklyTimeCommitment } = req.body;
    const updates = {
      $set: {
        name,
        category,
        description,
        weeklyTimeCommitment: Number(weeklyTimeCommitment),
        updatedAt: new Date(),
      },
    };
    const result = await db
      .collection("clubs")
      .findOneAndUpdate({ _id: new ObjectId(req.params.id) }, updates, {
        returnDocument: "after",
      });
    if (!result) return res.status(404).json({ error: "Club not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update club" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("clubs")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Club not found" });
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete club" });
  }
});

export default router;
