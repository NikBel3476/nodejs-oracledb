const axios = require('axios');

const $weatherHistory = axios.create({
    baseURL: 'http://history.openweathermap.org/data/2.5/history',
    timeout: 5000,
    params: {
        appid: process.env.API_APP_ID
    }
});

const $geocoding = axios.create({
    baseURL: "http://api.openweathermap.org/geo/1.0",
    timeout: 5000,
    params: {
        appid: process.env.API_APP_ID
    }
});

module.exports = {
    $weatherHistory,
    $geocoding
}
