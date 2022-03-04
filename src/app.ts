import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use("/", (req, res) => res.send("<h1>nodejs oracledb</h1>"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
