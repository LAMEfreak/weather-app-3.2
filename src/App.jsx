import logo from "/logo.png";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [cityInputValue, setCityInputValue] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCityInputValue(e.target.value);
  };

  async function handleSubmit(e) {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputValue}&limit=1&appid=${API_KEY}`;
    console.log(getCityUrl);

    setIsLoading(true);
    setWeatherData(null);
    setError("");

    e.preventDefault();
    try {
      await axios
        .get(getCityUrl)
        .then((res) => res.data[0])
        .then((cityGeoData) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${API_KEY}&units=metric`
          )
        )
        .then((res) => {
          console.log("Response:", res);
          const { data: weatherData } = res;
          console.log("Weather Data:", weatherData);
          setWeatherData(weatherData);
        });
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div>
        <img src={logo} className="logo react" alt="Rocket logo" />
      </div>
      <h1>Weather App</h1>
      <div className="card">
        <form action="">
          City: {""}
          <input
            type="text"
            value={cityInputValue}
            placeholder="Enter a country"
            onChange={handleChange}
          />
          <button
            type="submit"
            style={{ marginLeft: "1rem" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
        {isLoading && (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {error && <p>{error}</p>}
        {weatherData && (
          <div style={{ marginTop: "2rem" }}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Image"
            />
            <p>Current City: {weatherData.name}</p>
            <p>Current Temperature: {weatherData.main.temp}°C</p>
            <p>Current Weather: {weatherData.weather[0].description}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
