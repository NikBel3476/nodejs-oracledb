require("dotenv").config();
const express = require("express");
const cors = require("cors");
const getDataFromDB = require("./db/index");
const getInfoFromPage = require("./parsing/dns");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("<h1>nodejs oracledb</h1>"));

getDataFromDB().then((data) => {
  console.log(data);
});

getInfoFromPage();

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
