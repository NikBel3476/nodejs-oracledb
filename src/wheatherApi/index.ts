import axios from 'axios';

const $weather = axios.create({

});

const $geocoding = axios.create({
    baseURL: "http://api.openweathermap.org/geo/1.0",
    timeout: 2000,
    params: {
        appid: "2d70458a675762814eabff13e15fb4ae"
    }
});

export {
    $weather,
    $geocoding
}
