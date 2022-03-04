import "dotenv/config";
import express from "express";
import { getDataFromDB } from "./db";
import { getData } from "./http/weatherApi";
import { router } from "../routes";

const PORT = process.env.PORT || 5000;

const app = express();

app.use("/api", router);
app.get("/", (req, res) => res.send("<h1>nodejs oracledb</h1>"));

/*getDataFromDB().then((data: any) => {
  console.log(data);
});*/

getData(new Date("2020-8-4"), new Date("2020-8-5"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
