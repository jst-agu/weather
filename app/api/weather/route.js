// app/api/weather/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "lagos";
  const units = searchParams.get("units") || "metric";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "API key missing" }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return Response.json({ error: data.message }, { status: data.cod });
    }

    return Response.json({
      city: data.name,
      country: data.sys.country,
      timezone: data.timezone,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon_url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    });
  } catch {
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
