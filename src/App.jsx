import { useState, useEffect } from "react";
import "./index.css";
import { Preloader } from "./Preloader.jsx";

function App() {
  const KEY = "4d6d93fb95664647959123531253010";
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const query = city.trim() ? city : `${coords.latitude} ${coords.longitude}`;
    async function getData() {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`,
      );
      const data = await response.json();
      setWeatherData(data);
    }
    getData();
  }, [city, coords]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      () => setCity("Moscow"),
    );
  }, []);
  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter city name"
              className="search-input"
              value={userInput}
              onKeyDown={(e) => e.key === "Enter" && setCity(userInput)}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
        </div>
        <div className="weather-card">
          <h2>
            {weatherData?.location ? (
              `${weatherData.location.name}, ${weatherData.location.country}`
            ) : (
              <Preloader />
            )}
          </h2>
          <img
            src={`https://${weatherData?.current?.condition?.icon}`}
            alt="icon"
            className="weather-icon"
          />
          <p className="temperature">
            {Math.round(weatherData?.current?.temp_c)}°C
          </p>
          <p className="condition">{weatherData?.current?.condition?.text}</p>
          <div className="weather-details">
            <p>Humidity: {weatherData?.current?.humidity}%</p>
            <p>Wind: {weatherData?.current?.wind_kph} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
