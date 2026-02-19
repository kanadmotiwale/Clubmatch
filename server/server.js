import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import clubsRouter from "./routes/clubs.js";
import logsRouter from "./routes/membership-logs.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/clubs", clubsRouter);
app.use("/api/membership-logs", logsRouter);
app.use("/api/users", usersRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
