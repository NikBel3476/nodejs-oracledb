import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { db } from "./db";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use("/api", router);
app.use("/", (req, res) => res.status(404).send("<h1>Page not found</h1>"));
app.use(errorMiddleware);

const start = async () => {
  try {
    await db.initialize();

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
