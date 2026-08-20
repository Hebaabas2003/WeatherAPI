# Weather API

A simple Weather API built using JavaScript and Node.js.

## Features

* Accepts a city name through the API.
* Retrieves real weather data from an external weather service.
* Returns current temperature and wind speed.
* Uses caching to avoid repeated requests for the same city.
* Displays whether the data came from the external API or from cache.
* Handles invalid cities and invalid endpoints.

## How to Run

Start the server:

```bash
node weatherApi.js
```

Example request:

```text
http://localhost:3000/weather?city=Amman
```

Example response:

```json
{
  "source": "weather API",
  "city": "Amman",
  "country": "Jordan",
  "temperature": 30,
  "temperatureUnit": "°C",
  "windSpeed": 10,
  "windSpeedUnit": "km/h"
}
```

## Project URL

https://roadmap.sh/projects/weather-api-wrapper-service
