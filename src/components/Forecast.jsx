function Forecast({ forecast }) {
  const getDayName = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  return (
    <section className="forecast-section">
      <h2>7-Day Forecast</h2>

      <div className="forecast">
        {forecast.map((day) => (
          <div className="forecast-card" key={day.date}>
            <h3>{getDayName(day.date)}</h3>

            <span className="forecast-icon">{day.icon}</span>

            <p>{day.condition}</p>

            <strong>{day.max}°C</strong>

            <small>{day.min}°C</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Forecast;