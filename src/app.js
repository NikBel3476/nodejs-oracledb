require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getCityCoordinates = require('./api/geocoding');
const getDataFromDB = require('./db/index');
const getWeatherHistory = require("./api/weatherHistory");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req, res) => res.json('working'));

getCityCoordinates('Izhevsk')
    .then(coordinates => {
        console.log(coordinates);
        const { lat, lon } = coordinates[0];
        console.log(lat, lon);
        return getWeatherHistory(lat, lon, 1369728000, 1369789200);
    }).then(data => {
        console.log(data);
    });

getDataFromDB().then(data => {
        console.log(data);
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
