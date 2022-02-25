const {$geocoding} = require('./index');

async function getCityCoordinates(cityName) {
    const response = await $geocoding.get('/direct', {
        params: {
            q: cityName
        }
    });
    return response.data.map(data => { return { lat: data.lat, lon: data.lon }});
}

module.exports = getCityCoordinates;
