import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const { clubName, memberName, weeklyHours, benefits, challenges } = req.body;
        if (!clubName || !weeklyHours || !benefits || !challenges) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const log = {
            clubName,
            memberName: memberName || "",
            weeklyHours: Number(weeklyHours),
            benefits,
            challenges,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection("membership_logs").insertOne(log);
        res.status(201).json({ ...log, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to create log" });
    }
});

router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const filter = {};
        if (req.query.clubName) filter.clubName = req.query.clubName;
        const logs = await db.collection("membership_logs").find(filter).toArray();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

router.get("/stats/:clubName", async (req, res) => {
    try {
        const db = getDB();
        const result = await db
            .collection("membership_logs")
            .aggregate([
                { $match: { clubName: req.params.clubName } },
                { $group: { _id: "$clubName", avgHours: { $avg: "$weeklyHours" } } },
            ])
            .toArray();
        if (result.length === 0)
            return res.status(404).json({ error: "No logs found for this club" });
        res.json({
            clubName: req.params.clubName,
            avgHours: result[0].avgHours.toFixed(1),
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const log = await db
            .collection("membership_logs")
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!log) return res.status(404).json({ error: "Log not found" });
        res.json(log);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch log" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const db = getDB();
        const { clubName, memberName, weeklyHours, benefits, challenges } = req.body;
        const updates = {
            $set: {
                clubName,
                memberName: memberName || "",
                weeklyHours: Number(weeklyHours),
                benefits,
                challenges,
                updatedAt: new Date(),
            },
        };
        const result = await db
            .collection("membership_logs")
            .findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                updates,
                { returnDocument: "after" }
            );
        if (!result) return res.status(404).json({ error: "Log not found" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to update log" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const result = await db
            .collection("membership_logs")
            .deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Log not found" });
        res.json({ message: "Log deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete log" });
    }
});

export default router;