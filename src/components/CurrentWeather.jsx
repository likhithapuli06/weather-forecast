function CurrentWeather({ weather }) {
  return (
    <section className="current-weather">
      <div className="location">
        <h2>{weather.city}</h2>
        <p>{weather.condition}</p>
      </div>

      <div className="temperature">
        <span className="weather-icon">{weather.icon}</span>
        <span>{weather.temperature}°C</span>
      </div>

      <p className="feels">
        Feels like {weather.feelsLike}°C
      </p>

      <div className="weather-details">
        <div>
          <span>💧</span>
          <p>Humidity</p>
          <strong>{weather.humidity}%</strong>
        </div>

        <div>
          <span>💨</span>
          <p>Wind Speed</p>
          <strong>{weather.wind} km/h</strong>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;