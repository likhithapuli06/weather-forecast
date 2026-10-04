import { useState } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert weather codes into readable conditions
  const getWeatherCondition = (code) => {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55].includes(code)) return "Drizzle";
    if ([61, 63, 65].includes(code)) return "Rainy";
    if ([71, 73, 75].includes(code)) return "Snowy";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown";
  };

  // Convert weather codes into icons
  const getWeatherIcon = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "🌤️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55].includes(code)) return "🌦️";
    if ([61, 63, 65].includes(code)) return "🌧️";
    if ([71, 73, 75].includes(code)) return "❄️";
    if ([80, 81, 82].includes(code)) return "🌦️";
    if ([95, 96, 99].includes(code)) return "⛈️";

    return "🌤️";
  };

  // Fetch weather using latitude and longitude
  const getWeather = async (latitude, longitude, cityName) => {
    try {
      setLoading(true);
      setError("");

      const url =
  `https://api.open-meteo.com/v1/forecast?` +
  `latitude=${latitude}&longitude=${longitude}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
  `&forecast_days=8` +
  `&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      const data = await response.json();

      // Current weather
      setWeather({
        city: cityName,
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
      });

      // Upcoming forecast
      const forecastData = data.daily.time.map((date, index) => ({
        date: date,
        max: Math.round(data.daily.temperature_2m_max[index]),
        min: Math.round(data.daily.temperature_2m_min[index]),
        condition: getWeatherCondition(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index]),
      }));

      // Skip today and display next 5 days
      setForecast(forecastData.slice(1, 8));
    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search city
  const searchCity = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setError("City not found. Please enter a valid city.");
        setLoading(false);
        return;
      }

      const location = data.results[0];

      await getWeather(
        location.latitude,
        location.longitude,
        `${location.name}, ${location.country}`
      );
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Detect user's current location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeather(
          position.coords.latitude,
          position.coords.longitude,
          "Your Location"
        );
      },
      () => {
        setLoading(false);
        setError("Location permission was denied.");
      }
    );
  };

  return (
    <div className="app">
      <div className="weather-container">

        <header>
          <h1>☁️ Weather Forecast</h1>
          <p>Check current weather and upcoming forecasts</p>
        </header>

        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={searchCity}
          onLocation={detectLocation}
        />

        {loading && (
          <div className="message">
            Loading weather...
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {weather && !loading && (
          <>
            <CurrentWeather weather={weather} />

            <Forecast forecast={forecast} />
          </>
        )}

        {!weather && !loading && !error && (
          <div className="welcome">
            <div>🌤️</div>

            <h2>Search for a city</h2>

            <p>
              Enter a city name or use your current location
              to check the weather.
            </p>
          </div>
        )}

        <footer>
          <p>Weather data provided by Open-Meteo</p>
        </footer>

      </div>
    </div>
  );
}

export default App;