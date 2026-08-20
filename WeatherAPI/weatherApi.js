const http = require("http");
const url = require("url");

const PORT = 3000;

const cache = {};
const CACHE_TIME = 60 * 1000;

const server = http.createServer(async (req, res) => {

    const parsedUrl = url.parse(req.url, true);

    res.setHeader("Content-Type", "application/json");

    if (parsedUrl.pathname !== "/weather") {
        res.writeHead(404);
        res.end(JSON.stringify({
            error: "Endpoint not found"
        }));
        return;
    }

    const city = parsedUrl.query.city;

    if (!city) {
        res.writeHead(400);
        res.end(JSON.stringify({
            error: "Please provide a city"
        }));
        return;
    }

    const cacheKey = city.toLowerCase();

    if (cache[cacheKey]) {

        const timePassed = Date.now() - cache[cacheKey].time;

        if (timePassed < CACHE_TIME) {

            console.log(`${city} -> CACHE HIT`);

            res.writeHead(200);

            res.end(JSON.stringify({
                source: "cache",
                ...cache[cacheKey].data
            }, null, 2));

            return;
        }
    }

    try {

        console.log(`${city} -> CACHE MISS`);

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "City not found"
            }));

            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
        );

        const weatherData = await weatherResponse.json();

        const result = {
            city: location.name,
            country: location.country,
            temperature: weatherData.current.temperature_2m,
            temperatureUnit: weatherData.current_units.temperature_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            windSpeedUnit: weatherData.current_units.wind_speed_10m
        };

        cache[cacheKey] = {
            data: result,
            time: Date.now()
        };

        res.writeHead(200);

        res.end(JSON.stringify({
            source: "weather API",
            ...result
        }, null, 2));

    } catch (error) {

        res.writeHead(500);

        res.end(JSON.stringify({
            error: "Unable to get weather data"
        }));
    }
});

server.listen(PORT, () => {
    console.log(`Weather API is running on http://localhost:${PORT}`);
});