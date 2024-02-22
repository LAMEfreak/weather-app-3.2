import logo from "/logo.png";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import StickyHeadTable from "./Table";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [cityInputValue, setCityInputValue] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  const handleChange = (e) => {
    setCityInputValue(e.target.value);
  };

  async function handleSubmit(e) {
    const getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputValue}&limit=1&appid=${API_KEY}`;
    console.log(getCityUrl);

    setIsLoading(true);
    setWeatherData(null);
    setError("");
    setForecastData(null);

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
        // Handle response to show current weather
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

  async function showForecast() {
    const getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputValue}&limit=1&appid=${API_KEY}`;

    setIsLoading(true);
    setError("");
    
    try {
      await axios
        .get(getCityUrl)
        .then((res) => res.data[0])
        .then((cityGeoData) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&cnt=11&appid=${API_KEY}&units=metric`
          )
        )
        // Handle response to show forecast
        .then((res) => {
          console.log("Forecast Response:", res);
          const filteredForecastData = res.data.list.slice(2);
          setForecastData(filteredForecastData);
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
            autoFocus
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
        {weatherData && (
          <div style={{ marginTop: "2rem" }}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Image"
            />
            <p>
              Current City:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "lightskyblue",
                }}
              >
                {weatherData.name}
              </span>
            </p>
            <p>Current Temperature: {weatherData.main.temp}°C</p>
            <p>Current Weather: {weatherData.weather[0].description}</p>
            <button
              onClick={
                forecastData ? () => setForecastData(null) : showForecast
              }
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              Toggle Forecast
            </button>
          </div>
        )}
        {forecastData && (
          <div>
            <h3 style={{ marginBottom: "2rem" }}>Daily Weather Forecast</h3>
            <StickyHeadTable forecastData={forecastData} />
          </div>
        )}
      </div>
      {error && <p>{error}</p>}
    </>
  );
}

export default App;
