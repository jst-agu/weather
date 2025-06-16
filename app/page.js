"use client";
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}


  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setWeather(null);
    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();
    setWeather(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 p-6">
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">🌤 Weather Snapshot</h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Search city e.g. London"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 
            focus:ring-blue-500 shadow-inner placeholder:text-gray-500 text-gray-700"
          />
          <button
            onClick={fetchWeather}
            disabled={!city || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition duration-150 disabled:opacity-50
            w-1/2 ml-16 sm:ml-0"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {weather && !weather.error && (
          <>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center transition-all">
            <h2 className="text-2xl font-semibold text-gray-800">{weather.city}</h2>
            <img
              src={weather.icon_url}
              alt={weather.description}
              className="mx-auto my-3 w-20 h-20"
            />
            <p className="capitalize text-lg text-gray-700">{weather.description}</p>
            <p className="text-gray-800 mt-2 text-base">
              🌡 <strong>{weather.temperature}°C</strong> (Feels like {weather.feels_like}°C)
            </p>
            <p className="text-gray-600 text-sm">💧 Humidity: {weather.humidity}%</p>
          </div>
          {/* City Info Outside Weather Box */}
    <div className="mt-6 text-center text-sm text-gray-700">
      📍 <strong>{weather.city}</strong> is located in country code <strong>{getFlagEmoji(weather.country)} {weather.country}</strong>, timezone offset <strong>{weather.timezone >= 0 ? `UTC+${weather.timezone / 3600}` : `UTC${weather.timezone / 3600}`}</strong>.
    </div>
    </>
        )}

        {weather?.error && (
          <p className="mt-4 text-red-500 text-center">{weather.error}</p>
        )}
      </div>
    </main>
  );
}
