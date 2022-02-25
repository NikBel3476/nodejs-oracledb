const {$weatherHistory} = require('./index');

async function getWeatherHistory(lat, lon, start, end) {
    const result = await $weatherHistory.get('/city', {
        params: {
            lat,
            lon,
            type: 'hour',
            start,
            end
        }
    });
    return result;
}

module.exports = getWeatherHistory;
