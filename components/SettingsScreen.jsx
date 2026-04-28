function SettingsScreen({ location, setLocation, weather }) {
  const [localLocation, setLocalLocation] = React.useState(location);

  const save = () => {
    setLocation(localLocation);
    refreshWeather(localLocation);
  };

  return (
    <div className="card">
      <h2>Settings</h2>

      <div className="field">
        <label>Location</label>
        <input
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
        />
      </div>

      <button className="button-primary" onClick={save}>
        Save & Refresh Weather
      </button>

      {weather && (
        <p style={{ marginTop: 8, fontSize: "0.9rem" }}>
          Current: {weather.summary} · {weather.temp}°F
        </p>
      )}
    </div>
  );
}
