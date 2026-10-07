javascript
async function getWeather() {

    const city = document.getElementById("cityInput").value;

    const error = document.getElementById("error");

    if (city === "") {
        error.innerText = "Please enter a city name.";
        return;
    }

    try {

        error.innerText = "";

        // Get city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            error.innerText = "City not found.";
            return;
        }

        const latitude = locationData.results[0].latitude;
        const longitude = locationData.results[0].longitude;
        const cityName = locationData.results[0].name;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display data
        document.getElementById("cityName").innerText = cityName;

        document.getElementById("temperature").innerText =
            current.temperature_2m + "°C";

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            current.wind_speed_10m + " km/h";

        const weatherInfo = getWeatherCondition(current.weather_code);

        document.getElementById("condition").innerText =
            weatherInfo.condition;

        document.getElementById("weatherIcon").innerText =
            weatherInfo.icon;

    } catch (error) {

        document.getElementById("error").innerText =
            "Something went wrong. Please try again.";

        console.log(error);
    }
}


// Convert weather code into condition
function getWeatherCondition(code) {

    if (code === 0) {
        return {
            condition: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code >= 1 && code <= 3) {
        return {
            condition: "Partly Cloudy",
            icon: "⛅"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            condition: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            condition: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            condition: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            condition: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        condition: "Unknown",
        icon: "🌍"
    };
}
