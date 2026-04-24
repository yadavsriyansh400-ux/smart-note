import express from "express";
import cors from "cors";
import noteRoutes from "./routes/noteRoutes.js";

const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;