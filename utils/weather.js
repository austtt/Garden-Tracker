async function refreshWeather(location, setWeather) {
  try {
    // 1. Convert location text → coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        location
      )}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      setWeather({
        summary: "Unknown location",
        temp: "--",
      });
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Fetch actual weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;

    // 3. Map weather code → human text
    const summary = weatherCodeToText(current.weathercode);

    setWeather({
      summary,
      temp: current.temperature,
    });
  } catch (err) {
    console.error("Weather error:", err);
    setWeather({
      summary: "Error fetching weather",
      temp: "--",
    });
  }
}

function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm with hail",
  };
  return map[code] || "Unknown";
}

