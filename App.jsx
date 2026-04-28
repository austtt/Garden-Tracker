const { useState, useEffect } = React;

function App() {
  const [screen, setScreen] = useState("onboarding");
  const [plants, setPlants] = useState([]); // starts empty
  const [location, setLocation] = useState("Fort Myers, FL");
  const [weather, setWeather] = useState(null);

  // Weather auto-update on "login" / app load
  useEffect(() => {
    refreshWeather(location, setWeather);
  }, [location]);

  const addPlant = (plant) => {
    setPlants((prev) => [...prev, { id: Date.now(), ...plant }]);
  };

  const updatePlant = (id, updates) => {
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  const screens = {
    onboarding: (
      <OnboardingScreen
        location={location}
        setLocation={setLocation}
        weather={weather}
        onDone={() => setScreen("myPlants")}
      />
    ),
    myPlants: (
      <MyPlantsScreen
        plants={plants}
        addPlant={addPlant}
        updatePlant={updatePlant}
        deletePlant={deletePlant}
      />
    ),
    identify: <IdentifyScreen addPlant={addPlant} />,
    dr: <DrScreen plants={plants} updatePlant={updatePlant} />,
    settings: (
      <SettingsScreen
        location={location}
        setLocation={setLocation}
        weather={weather}
      />
    ),
  };

  return (
    <div className="app-shell">
      <nav className="nav-bar">
        <button
          className={`nav-button ${screen === "onboarding" ? "active" : ""}`}
          onClick={() => setScreen("onboarding")}
        >
          Onboarding
        </button>
        <button
          className={`nav-button ${screen === "myPlants" ? "active" : ""}`}
          onClick={() => setScreen("myPlants")}
        >
          My Plants
        </button>
        <button
          className={`nav-button ${screen === "identify" ? "active" : ""}`}
          onClick={() => setScreen("identify")}
        >
          Identify
        </button>
        <button
          className={`nav-button ${screen === "dr" ? "active" : ""}`}
          onClick={() => setScreen("dr")}
        >
          Dr. Plant
        </button>
        <button
          className={`nav-button ${screen === "settings" ? "active" : ""}`}
          onClick={() => setScreen("settings")}
        >
          Settings
        </button>
      </nav>

      {weather && (
        <div className="card">
          <strong>Weather for {location}:</strong>{" "}
          {weather.summary} · {weather.temp}°F
        </div>
      )}

      {screens[screen]}
    </div>
  );
}
