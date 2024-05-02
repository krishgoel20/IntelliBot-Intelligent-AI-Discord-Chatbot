// weather.js
const axios = require('axios');

async function getWeather(cityName, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const description = weatherData.weather[0].description;

        return `Current weather in ${cityName}: ${description}, Temperature: ${temperature}°C`;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw new Error(`Oops! Something went wrong while fetching the weather for ${cityName}.`);
    }
}

module.exports = { getWeather };
