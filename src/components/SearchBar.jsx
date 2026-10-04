function SearchBar({ city, setCity, onSearch, onLocation }) {
  return (
    <div className="search-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />

        <button onClick={onSearch}>Search</button>
      </div>

      <button className="location-button" onClick={onLocation}>
        📍 Use My Location
      </button>
    </div>
  );
}

export default SearchBar;
