import axios from 'axios';

const $weather = axios.create({

});

const $geocoding = axios.create({
    baseURL: "http://api.openweathermap.org/geo/1.0",
    timeout: 2000,
    params: {
        appid: process.env.API_APP_ID
    }
});

export {
    $weather,
    $geocoding
}
