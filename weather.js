#!/usr/bin/env node
// Simple weather script using Open-Meteo API.
// Usage: node weather.js <city>

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('Node.js 18 or higher is required for this script.');
  process.exit(1);
}

const city = process.argv[2];
if (!city) {
  console.error('Usage: node weather.js <city>');
  process.exit(1);
}

async function main() {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoResp = await fetch(geoUrl);
  if (!geoResp.ok) {
    throw new Error(`Failed to fetch geocoding data: ${geoResp.status}`);
  }
  const geoData = await geoResp.json();
  if (!geoData.results || geoData.results.length === 0) {
    console.error('City not found');
    process.exit(1);
  }
  const { latitude, longitude, name, country } = geoData.results[0];
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const weatherResp = await fetch(weatherUrl);
  if (!weatherResp.ok) {
    throw new Error(`Failed to fetch weather data: ${weatherResp.status}`);
  }
  const weatherData = await weatherResp.json();
  const weather = weatherData.current_weather;
  console.log(`${name}, ${country}: ${weather.temperature}°C, wind ${weather.windspeed} km/h`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
